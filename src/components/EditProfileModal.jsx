import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { supabase } from "../supabaseClient";

export default function EditProfileModal({ show, onHide, profile }) {
  const [formData, setFormData] = useState({
    username: profile.username || "",
    github_url: profile.github_url || "",
    tech_stack: profile.tech_stack?.join(", ") || "",
    bio: profile.bio || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const updates = {
      username: formData.username,
      github_url: formData.github_url,
      tech_stack: formData.tech_stack.split(",").map((t) => t.trim()),
      bio: formData.bio,
    };

    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", profile.id);

    if (error) {
      alert("Failed to update profile: " + error.message);
    } else {
      onHide();
    }
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
            <Form.Control
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter username"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>GitHub URL</Form.Label>
            <Form.Control
              name="github_url"
              value={formData.github_url}
              onChange={handleChange}
              placeholder="https://github.com/your-profile"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Tech Stack (comma-separated)</Form.Label>
            <Form.Control
              name="tech_stack"
              value={formData.tech_stack}
              onChange={handleChange}
              placeholder="e.g. React, Node.js, PostgreSQL"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Bio</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us something about yourself..."
            />
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
