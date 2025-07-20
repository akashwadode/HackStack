import { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import HackathonCard from '../components/HackathonCard';
import ProfileSidebar from '../components/ProfileSidebar';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProjects = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const currentUser = userData?.user;

    if (!currentUser) {
      navigate('/login'); // 🔁 Redirect to login if no user
      return;
    }

    setUser(currentUser);

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', currentUser.id)
      .order('created_at', { ascending: false });

    if (error) console.error(error.message);
    else setProjects(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  if (!user && loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <Container fluid className="dashboard-container p-4">
      <Row>
        <Col md={3}>
          {user && <ProfileSidebar user={user} />}
        </Col>
        <Col md={9}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>My Hackathon Projects</h2>
            <Button onClick={() => navigate('/add')}>Add New Project</Button>
          </div>

          {loading ? (
            <div className="text-center my-5">
              <Spinner animation="border" />
            </div>
          ) : projects.length === 0 ? (
            <p>No projects found. Start by adding one!</p>
          ) : (
            <Row>
              {projects.map((project) => (
                <Col key={project.id} md={6} className="mb-4">
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
