import { useState, useEffect } from "react";
import { Modal, Button, Badge, Form, Row, Col, Image } from "react-bootstrap";
import { Github, BoxArrowUpRight } from "react-bootstrap-icons";
import { supabase } from "../supabaseClient";

export default function ProjectModal({ show, handleClose, project, refresh }) {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ ...project });

  useEffect(() => {
    if (project) {
      setFormData({ ...project });
      setEditMode(false); // Ensure edit mode resets on open
    }
  }, [project, show]);

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleUpdate = async () => {
    const confirm = window.confirm("Are you sure you want to save changes?");
    if (!confirm) return;

    const { error } = await supabase
      .from("projects")
      .update({
        ...formData,
        technologies: Array.isArray(formData.technologies)
          ? formData.technologies
          : formData.technologies?.split(",").map((t) => t.trim()),
      })
      .eq("id", project.id);

    if (error) {
      alert("Update failed: " + error.message);
    } else {
      alert("Project updated!");
      setEditMode(false);
      handleClose();
      window.location.reload();
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{editMode ? "Edit Project" : project.title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Image
          src={
            formData.thumbnail_url ||
            "https://via.placeholder.com/600x300?text=No+Image"
          }
          fluid
          rounded
          className="mb-3"
          style={{ objectFit: "cover", width: "100%", maxHeight: "300px" }}
        />

        {!editMode ? (
          <>
            {project.description && (
              <p className="text-muted">{project.description}</p>
            )}

            {project.hackathon && (
              <p>
                <strong>Hackathon –</strong>{" "}
                <Badge bg="info">{project.hackathon}</Badge>{" "}
                {project.hackathon_start_date && project.hackathon_end_date && (
                  <strong className="ms-2">
                    {formatDate(project.hackathon_start_date)} –{" "}
                    {formatDate(project.hackathon_end_date)}
                  </strong>
                )}
              </p>
            )}

            {project.technologies?.length > 0 && (
              <p>
                <strong>Tech Stack –</strong>{" "}
                {project.technologies.map((tech, index) => (
                  <Badge bg="dark" className="me-1" key={index}>
                    {tech}
                  </Badge>
                ))}
              </p>
            )}

            {project.certificate_url && (
              <Button
                variant="outline-secondary"
                size="sm"
                className="mb-2"
                href={project.certificate_url}
                target="_blank"
              >
                🎓 View Certificate
              </Button>
            )}

            <div className="d-flex justify-content-between mt-3">
              <Button
                variant="outline-primary"
                href={project.repo_url}
                target="_blank"
                disabled={!project.repo_url}
              >
                <Github className="me-1" />
                GitHub
              </Button>
              <Button
                variant="outline-success"
                href={project.preview_url}
                target="_blank"
                disabled={!project.preview_url}
              >
                <BoxArrowUpRight className="me-1" />
                Live Demo
              </Button>
            </div>
<hr className="mt-4 mb-3" />
            <div className="d-flex justify-content-between mt-4">
              <Button variant="warning" onClick={() => setEditMode(true)}>
                ✏️ Edit
              </Button>
              <Button
                variant="danger"
                onClick={async () => {
                  if (
                    confirm("Are you sure you want to delete this project?")
                  ) {
                    const { error } = await supabase
                      .from("projects")
                      .delete()
                      .eq("id", project.id);
                    if (error) alert("Failed to delete: " + error.message);
                    else {
                      alert("Project deleted!");
                      handleClose(); // close modal
                      refresh(); // refresh list
                    }
                  }
                }}
              >
                🗑️ Delete
              </Button>
            </div>
          </>
        ) : (
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Title</Form.Label>
              <Form.Control
                id="title"
                value={formData.title}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                id="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Hackathon Name</Form.Label>
              <Form.Control
                id="hackathon"
                value={formData.hackathon}
                onChange={handleChange}
              />
            </Form.Group>

            <Row>
              <Col>
                <Form.Group className="mb-2">
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    id="hackathon_start_date"
                    value={formData.hackathon_start_date?.split("T")[0] || ""}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-2">
                  <Form.Label>End Date</Form.Label>
                  <Form.Control
                    type="date"
                    id="hackathon_end_date"
                    value={formData.hackathon_end_date?.split("T")[0] || ""}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-2">
              <Form.Label>Technologies (comma separated)</Form.Label>
              <Form.Control
                id="technologies"
                value={
                  Array.isArray(formData.technologies)
                    ? formData.technologies.join(", ")
                    : formData.technologies
                }
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>GitHub URL</Form.Label>
              <Form.Control
                id="repo_url"
                value={formData.repo_url}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Live Demo URL</Form.Label>
              <Form.Control
                id="preview_url"
                value={formData.preview_url}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Certificate URL</Form.Label>
              <Form.Control
                id="certificate_url"
                value={formData.certificate_url}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Thumbnail Image URL</Form.Label>
              <Form.Control
                id="thumbnail_url"
                value={formData.thumbnail_url}
                onChange={handleChange}
              />
            </Form.Group>

            <div className="d-flex justify-content-between">
              <Button variant="secondary" onClick={() => setEditMode(false)}>
                Cancel
              </Button>
              <Button variant="success" onClick={handleUpdate}>
                Save Changes
              </Button>
            </div>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
}
