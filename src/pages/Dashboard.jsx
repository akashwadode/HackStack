import { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import HackathonCard from '../components/HackathonCard';

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProjects = async () => {
    const user = await supabase.auth.getUser();
    const userId = user.data.user?.id;

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) console.error(error.message);
    else setProjects(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <Container className="my-4">
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
            <Col key={project.id} md={6}>
              <HackathonCard project={project} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}
