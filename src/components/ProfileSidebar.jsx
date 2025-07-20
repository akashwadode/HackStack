import { Card, Button } from "react-bootstrap";
import { supabase } from "../supabaseClient";
import "../styles/ProfileSidebar.css";

export default function ProfileSidebar({ user }) {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login"; // 🔁 Redirect to login page
  };

  return (
    <Card className="profile-card text-center shadow-sm mb-4">
      <Card.Body>
        <img
          src={`https://ui-avatars.com/api/?name=${user?.email?.[0].toUpperCase()}&background=random`}
          alt="Profile"
          className="profile-avatar mb-3"
        />
        <Card.Title>{user?.email}</Card.Title>
        <Card.Text className="text-muted">Hackathon Enthusiast</Card.Text>
        <Button size="sm" variant="outline-danger" onClick={handleLogout}>
          Logout
        </Button>
      </Card.Body>
    </Card>
  );
}
