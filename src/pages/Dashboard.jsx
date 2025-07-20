import { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Spinner, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import HackathonCard from '../components/HackathonCard';
import ProfileSidebar from '../components/ProfileSidebar';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState('desc');

  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthAndFetch = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const currentUser = userData?.user;

      if (!currentUser) {
        navigate('/login');
        return;
      }

      setUser(currentUser);

      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single();

      if (!profileError) {
        setProfile(profileData);
      } else {
        console.error('Failed to fetch profile:', profileError.message);
      }

      // Fetch projects
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('hackathon_start_date', { ascending: sortOrder === 'asc' });

      if (!projectError) {
        setProjects(projectData);
      } else {
        console.error(projectError.message);
      }

      setLoading(false);
    };

    checkAuthAndFetch();
  }, [sortOrder]);

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  return (
    <Container fluid className="dashboard-container p-4">
      <Row>
        <Col md={3}>
          {profile && <ProfileSidebar profile={profile} />}
        </Col>

        <Col md={9}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="fw-semibold mb-0">My Hackathon Projects</h2>

            <Button variant="dark" onClick={() => navigate('/add')}>
              <i className="bi bi-plus-lg me-1" /> New Project
            </Button>
          </div>

          <div className="d-flex justify-content-start mb-4">
            <Form.Select
              className="sort-dropdown"
              size="sm"
              value={sortOrder}
              onChange={handleSortChange}
            >
              <option value="desc">Sort by Start Date (Newest)</option>
              <option value="asc">Sort by Start Date (Oldest)</option>
            </Form.Select>
          </div>

          {loading ? (
            <div className="text-center my-5">
              <Spinner animation="border" />
            </div>
          ) : projects.length === 0 ? (
            <p>No projects found. Start by adding one!</p>
          ) : (
            <Row className="g-4">
              {projects.map((project) => (
                <Col key={project.id} md={6}>
                  <HackathonCard project={project} />
                </Col>
              ))}
            </Row>
          )}
        </Col>
      </Row>
    </Container>
  );
}
