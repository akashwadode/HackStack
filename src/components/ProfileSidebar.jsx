import { useEffect, useState } from "react";
import { Card, Button, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import EditProfileModal from "./EditProfileModal";
import "../styles/ProfileSidebar.css";

export default function ProfileSidebar({ profile, totalProjects }) {
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const avatarUrl = profile.github_url
    ? `https://avatars.githubusercontent.com/${profile.github_url.split("/").pop()}`
    : `https://ui-avatars.com/api/?name=${profile.username?.[0]?.toUpperCase() || "U"}&background=random`;

  const joinedDate = new Date(profile.created_at).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    const fetchEmail = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (user && !error) setEmail(user.email);
    };
    fetchEmail();
  }, []);

  const handleLogout = async () => {
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (confirmed) {
      await supabase.auth.signOut();
      navigate("/");
    }
  };

  return (
    <>
      <Card className="profile-card shadow-lg p-3">
        <Card.Body className="d-flex flex-column align-items-center">
          <img src={avatarUrl} alt="Avatar" className="profile-avatar mb-3" />
          <h4 className="fw-bold">u/{profile.username}</h4>
          {email && <div className="text-muted small mb-2">{email}</div>}

          {profile.bio && (
            <p className="text-center fst-italic small border rounded p-2 bg-light w-100">{profile.bio}</p>
          )}

          <div className="w-100 mt-3">
            <h6 className="text-uppercase text-muted fw-bold mb-2">Profile Info</h6>
            <div className="mb-2">
              <strong>Joined:</strong> {joinedDate}
            </div>
            <div className="mb-2">
              <strong>Total Projects:</strong> {totalProjects}
            </div>

            {profile.github_url && (
              <div className="mb-2">
                <Button
                  variant="dark"
                  size="sm"
                  href={profile.github_url}
                  target="_blank"
                  rel="noreferrer"
                >
                  View GitHub
                </Button>
              </div>
            )}
          </div>

          {profile.tech_stack?.length > 0 && (
            <div className="w-100 mt-3">
              <h6 className="text-uppercase text-muted fw-bold mb-2">Tech Stack</h6>
              <div className="d-flex flex-wrap gap-2">
                {profile.tech_stack.map((tech, i) => (
                  <Badge key={i} bg="primary" className="text-uppercase">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="w-100 mt-4 d-grid gap-2">
            <Button variant="outline-primary" size="sm" onClick={() => setShowModal(true)}>
              Edit Profile
            </Button>
            <Button
              variant="outline-success"
              size="sm"
              onClick={() => navigate(`/u/${profile.username}`)}
              disabled={!profile.username}
            >
              Public Portfolio
            </Button>
            <Button variant="outline-danger" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </Card.Body>
      </Card>

      <EditProfileModal
        show={showModal}
        onHide={() => setShowModal(false)}
        profile={profile}
      />
    </>
  );
}
