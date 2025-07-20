import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import HackathonCard from "../components/HackathonCard";
import { Container, Row, Col, Spinner, Alert, Image, Badge } from "react-bootstrap";
import "../styles/PublicPortfolio.css";

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
      <div className="loading-spinner">
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

  const avatarUrl = profile.github_url
    ? `https://avatars.githubusercontent.com/${profile.github_url.split("/").pop()}`
    : `https://ui-avatars.com/api/?name=${profile.username?.[0]?.toUpperCase() || "U"}&background=random`;

  return (
    <Container className="portfolio-container my-4">
      <div className="profile-section">
        <div className="text-center">
          <img src={avatarUrl} alt="Profile photo of ${profile.username}" className="profile-avatar" />
          <h1 className="profile-name">u/{profile.username || "Unnamed User"}</h1>
          <p className="profile-title">{profile.title || "Developer"}</p>
          <p className="text-muted">Joined on {new Date(profile.created_at).toLocaleDateString()}</p>
          {profile.github_url && (
            <p>
              <a href={profile.github_url} target="_blank" rel="noreferrer" className="github-link text-decoration-none">
                GitHub Profile
              </a>
            </p>
          )}
          {profile.bio && <p className="fst-italic small text-muted">{profile.bio}</p>}
          {profile.tech_stack?.length > 0 && (
            <div className="tech-stack mt-2">
              {profile.tech_stack.map((tech, index) => (
                <Badge key={index} bg="dark" className="me-1">
                  {tech}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="projects-section mt-5">
        <h2 className="section-title">Projects</h2>
        {projects.length === 0 ? (
          <p className="text-center text-muted">No public projects yet.</p>
        ) : (
          <Row className="g-4">
            {projects.map((project) => (
              <Col key={project.id} md={6}>
                <HackathonCard project={project} />
              </Col>
            ))}
          </Row>
        )}
      </div>
    </Container>
  );
}
