import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { supabase } from "../supabaseClient";

export default function EditProfileModal({ show, onHide, profile }) {
  const [formData, setFormData] = useState({
    username: profile.username || "",
    github_url: profile.github_url || "",
    tech_stack: profile.tech_stack?.join(", ") || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const { error } = await supabase
      .from("profiles")
      .update({
        username: formData.username,
        github_url: formData.github_url,
        tech_stack: formData.tech_stack.split(",").map((t) => t.trim()),
      })
      .eq("id", profile.id);

    if (!error) onHide();
    else alert("Failed to update profile: " + error.message);
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Edit Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control name="username" value={formData.username} onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>GitHub URL</Form.Label>
            <Form.Control name="github_url" value={formData.github_url} onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Tech Stack (comma-separated)</Form.Label>
            <Form.Control name="tech_stack" value={formData.tech_stack} onChange={handleChange} />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
