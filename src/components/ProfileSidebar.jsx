import { useState } from "react";
import { Card, Button, Badge } from "react-bootstrap";
import EditProfileModal from "./EditProfileModal";
import "../styles/ProfileSidebar.css";

export default function ProfileSidebar({ profile, totalProjects }) {
  const [showModal, setShowModal] = useState(false);

  const avatarUrl = profile.github_url
    ? `https://avatars.githubusercontent.com/${profile.github_url.split("/").pop()}`
    : `https://ui-avatars.com/api/?name=${profile.username?.[0]?.toUpperCase() || "U"}&background=random`;

  const joinedDate = new Date(profile.created_at).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <Card className="profile-card shadow">
        <Card.Body className="text-center">
          <img src={avatarUrl} alt="Avatar" className="profile-avatar mb-3" />
          <Card.Title className="fw-bold fs-4">{profile.username}</Card.Title>

          {profile.github_url && (
            <Card.Text>
              <a href={profile.github_url} target="_blank" rel="noreferrer">
                {profile.github_url}
              </a>
            </Card.Text>
          )}

          <div className="mb-2">
            <strong>Joined:</strong> {joinedDate}
          </div>

          <div className="mb-2">
            <strong>Total Projects:</strong> {totalProjects}
          </div>

          <div className="mt-2">
            {profile.tech_stack?.map((tech, i) => (
              <Badge key={i} bg="primary" className="me-1 mb-1">
                {tech}
              </Badge>
            ))}
          </div>

          <Button variant="outline-primary" className="mt-3 w-100" onClick={() => setShowModal(true)}>
            Edit Profile
          </Button>
        </Card.Body>
      </Card>

      <EditProfileModal show={showModal} onHide={() => setShowModal(false)} profile={profile} />
    </>
  );
}
