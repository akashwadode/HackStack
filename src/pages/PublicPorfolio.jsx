import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import HackathonCard from "../components/HackathonCard";
import { Container, Row, Col, Spinner, Alert, Image, Badge } from "react-bootstrap";

export default function PublicPortfolio() {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);

    const { data: userProfile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
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
      .eq("user_id", userId)
      .eq("is_public", true)
      .order("created_at", { ascending: false });

    setProjects(publicProjects || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [userId]);

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
        {profile.avatar_url && (
          <Image
            src={profile.avatar_url}
            roundedCircle
            width={100}
            height={100}
            alt="Avatar"
            className="mb-3"
          />
        )}
        <h2>{profile.username || "Unnamed User"}</h2>
        <p className="text-muted mb-1">
          Joined on {new Date(profile.created_at).toLocaleDateString()}
        </p>
        {profile.github_url && (
          <p>
            <a href={profile.github_url} target="_blank" rel="noreferrer">
              GitHub Profile
            </a>
          </p>
        )}
        {profile.tech_stack?.length > 0 && (
          <div className="mb-2">
            {profile.tech_stack.map((tech, index) => (
              <Badge key={index} bg="dark" className="me-1">
                {tech}
              </Badge>
            ))}
          </div>
        )}
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
