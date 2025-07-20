import { useEffect, useState } from "react";
import { Card, Button, Modal, Form, Badge, Spinner } from "react-bootstrap";
import { supabase } from "../supabaseClient";
import "../styles/ProfileSidebar.css";

export default function ProfileSidebar({ user }) {
  const [showModal, setShowModal] = useState(false);
  const [profile, setProfile] = useState(null);
  const [projectCount, setProjectCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchProfileData = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    const { count } = await supabase
      .from("projects")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    if (!error) setProfile(data);
    if (count !== null) setProjectCount(count);
    setLoading(false);
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const joinedDate = new Date(user.created_at).toLocaleDateString();

  const avatarUrl =
    profile?.github_url
      ? `https://avatars.githubusercontent.com/${profile.github_url.split("/").pop()}`
      : `https://ui-avatars.com/api/?name=${user.email?.[0].toUpperCase()}&background=random`;

  return (
    <>
      <Card className="profile-card text-center shadow-sm mb-4">
        <Card.Body>
          {loading ? (
            <Spinner animation="border" />
          ) : (
            <>
              <img src={avatarUrl} alt="Avatar" className="profile-avatar mb-3" />

              <Card.Title>{profile?.username || "Anonymous"}</Card.Title>
              <Card.Text className="text-muted">{user.email}</Card.Text>

              <div className="mb-2">
                <small className="text-muted">Joined: {joinedDate}</small>
              </div>
              <div className="mb-2">
                <strong>Projects: </strong> {projectCount}
              </div>

              {profile?.tech_stack && profile.tech_stack.length > 0 && (
                <div className="mb-3">
                  {profile.tech_stack.map((tech, idx) => (
                    <Badge key={idx} bg="info" className="me-1">{tech}</Badge>
                  ))}
                </div>
              )}

              <Button variant="outline-primary" size="sm" className="me-2" onClick={() => setShowModal(true)}>
                Edit Profile
              </Button>
              <Button variant="outline-secondary" size="sm" href={`/u/${profile?.username || user.id}`}>
                View Public Portfolio
              </Button>
              <hr />
              <Button size="sm" variant="outline-danger" onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}
        </Card.Body>
      </Card>

      {/* Edit Profile Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                defaultValue={profile?.username}
                onChange={(e) => setProfile({ ...profile, username: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>GitHub URL</Form.Label>
              <Form.Control
                defaultValue={profile?.github_url}
                onChange={(e) => setProfile({ ...profile, github_url: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tech Stack (comma separated)</Form.Label>
              <Form.Control
                defaultValue={profile?.tech_stack?.join(", ")}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    tech_stack: e.target.value.split(",").map((s) => s.trim()),
                  })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={async () => {
              const { error } = await supabase
                .from("profiles")
                .update({
                  username: profile.username,
                  github_url: profile.github_url,
                  tech_stack: profile.tech_stack,
                })
                .eq("id", user.id);

              if (!error) {
                setShowModal(false);
                fetchProfileData();
              } else {
                alert("Failed to update profile.");
              }
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
