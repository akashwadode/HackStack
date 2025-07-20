import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import HackathonCard from "../components/HackathonCard";
import { Container, Row, Col, Spinner, Alert } from "react-bootstrap";

export default function PublicPortfolio() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const { data: userProfile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("username", username)
      .single();

    if (profileError || !userProfile) {
      setProfile(null);
      setLoading(false);
      return;
    }

    setProfile(userProfile);

    const { data: publicProjects } = await supabase
      .from("projects")
      .select("*")
      .eq("user_id", userProfile.id)
      .eq("is_public", true)
      .order("created_at", { ascending: false });

    setProjects(publicProjects || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [username]);

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" />
      </div>
    );
  }

  if (!profile) {
    return (
      <Container className="text-center my-5">
        <Alert variant="danger">Public portfolio not found.</Alert>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <div className="text-center mb-4">
        <h2>{profile.username}'s Hackathon Portfolio</h2>
        <p className="text-muted">Joined on {new Date(profile.created_at).toLocaleDateString()}</p>
      </div>

      {projects.length === 0 ? (
        <p className="text-center">No public projects yet.</p>
      ) : (
        <Row className="g-4">
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
