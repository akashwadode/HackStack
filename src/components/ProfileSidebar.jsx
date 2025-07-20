import { useEffect, useState } from "react";
import { Card, Button } from "react-bootstrap";
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
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (user && !error) {
        setEmail(user.email);
      }
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
      <Card className="profile-card shadow-lg">
        <Card.Body>
          <img src={avatarUrl} alt="Avatar" className="profile-avatar" />
          <Card.Title className="fw-bold fs-4 mt-2">{profile.username}</Card.Title>

          {email && (
            <div className="text-muted mb-1" style={{ fontSize: "0.9rem" }}>
              {email}
            </div>
          )}

          {profile.bio && (
            <div className="my-2">
              <em>{profile.bio}</em>
            </div>
          )}

          {profile.github_url && (
            <div className="my-2">
              <Button
                variant="dark"
                size="sm"
                href={profile.github_url}
                target="_blank"
                rel="noreferrer"
              >
                GitHub Profile
              </Button>
            </div>
          )}

          <div className="my-2">
            <strong>Joined:</strong> {joinedDate}
          </div>

          <div className="my-1">
            <strong>Total Projects:</strong> {totalProjects}
          </div>

          {profile.tech_stack?.length > 0 && (
            <div className="mt-3">
              <strong>Tech Stack:</strong>
              <div className="mt-1">
                {profile.tech_stack.map((tech, i) => (
                  <span key={i} className="tech-badge">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="profile-buttons mt-4">
            <Button
              variant="outline-primary"
              onClick={() => setShowModal(true)}
            >
              Edit Profile
            </Button>

            <Button
              variant="outline-success"
              className="mt-2"
              onClick={() => navigate(`/u/${profile.username}`)}
              disabled={!profile.username}
            >
              Public Portfolio
            </Button>

            <Button
              variant="outline-danger"
              className="mt-2"
              onClick={handleLogout}
            >
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
