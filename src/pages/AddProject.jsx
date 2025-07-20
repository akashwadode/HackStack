import { ArrowLeft } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Container, Form, Button, Card } from "react-bootstrap";
import { supabase } from "../supabaseClient";
import "../styles/AddProject.css";

export default function AddProject() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    hackathon: "",
    hackathon_start_date: "",
    hackathon_end_date: "",
    technologies: "",
    repo_url: "",
    preview_url: "",
    thumbnail_url: "",
    is_public: true,
  });

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = await supabase.auth.getUser();
    if (!user.data.user) return alert("User not found");

    const { data, error } = await supabase.from("projects").insert([
      {
        user_id: user.data.user.id,
        title: formData.title,
        description: formData.description,
        hackathon: formData.hackathon,
        hackathon_start_date: formData.hackathon_start_date,
        hackathon_end_date: formData.hackathon_end_date,
        technologies: formData.technologies.split(",").map((t) => t.trim()),
        repo_url: formData.repo_url,
        preview_url: formData.preview_url,
        thumbnail_url: formData.thumbnail_url,
        certificate_url: formData.certificate_url,

        is_public: formData.is_public,
      },
    ]);

    if (error) alert(error.message);
    else {
      alert("🎉 Project added successfully!");
      setFormData({
        title: "",
        description: "",
        hackathon: "",
        hackathon_start_date: "",
        hackathon_end_date: "",
        technologies: "",
        repo_url: "",
        preview_url: "",
        thumbnail_url: "",
        certificate_url: '',
        is_public: true,
      });
    }
  };

  return (
    <Container className="add-project-container">
      <Card className="p-4 shadow-sm">
        <div
          className="d-flex align-items-center mb-3"
          style={{ cursor: "pointer", color: "#007bff" }}
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft size={20} className="me-2" />
          <span>Back to Dashboard</span>
        </div>
        <h2 className="mb-4">Submit Hackathon Project</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Project Title</Form.Label>
            <Form.Control
              id="title"
              placeholder="Enter project title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              Hackathon Name <span style={{ color: "red" }}>*</span>
            </Form.Label>
            <Form.Control
              id="hackathon"
              placeholder="e.g. Hack the Mountains, ETHIndia"
              value={formData.hackathon}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              Hackathon Start Date <span style={{ color: "red" }}>*</span>
            </Form.Label>
            <Form.Control
              type="date"
              id="hackathon_start_date"
              value={formData.hackathon_start_date}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              Hackathon End Date <span style={{ color: "red" }}>*</span>
            </Form.Label>
            <Form.Control
              type="date"
              id="hackathon_end_date"
              value={formData.hackathon_end_date}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Project Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              id="description"
              placeholder="Briefly describe what your project does"
              value={formData.description}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              Technologies Used <small>(comma separated)</small>
            </Form.Label>
            <Form.Control
              id="technologies"
              placeholder="e.g. React, Supabase, Tailwind"
              value={formData.technologies}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>GitHub Repository URL</Form.Label>
            <Form.Control
              id="repo_url"
              placeholder="https://github.com/username/project"
              value={formData.repo_url}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Live Demo / Preview URL</Form.Label>
            <Form.Control
              id="preview_url"
              placeholder="Link to hosted app or video demo"
              value={formData.preview_url}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Project Thumbnail URL</Form.Label>
            <Form.Control
              id="thumbnail_url"
              placeholder="Optional image to show in project card"
              value={formData.thumbnail_url}
              onChange={handleChange}
            />
          </Form.Group>
<Form.Group className="mb-3">
  <Form.Label>Certificate URL</Form.Label>
  <Form.Control
    id="certificate_url"
    placeholder="Link to certificate (e.g. Google Drive, hosted file)"
    value={formData.certificate_url}
    onChange={handleChange}
  />
</Form.Group>
          <Form.Check
            type="checkbox"
            id="is_public"
            label="Make project visible on public portfolio"
            checked={formData.is_public}
            onChange={handleChange}
            className="mb-4"
          />

          <Button type="submit" variant="primary" className="w-100">
            🚀 Submit Project
          </Button>
        </Form>
      </Card>
    </Container>
  );
}
