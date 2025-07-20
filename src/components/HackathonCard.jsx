import { useState } from "react";
import { Card, Button, Badge } from "react-bootstrap";
import {
  Github,
  BoxArrowUpRight,
  Award,
} from "react-bootstrap-icons";
import "../styles/HackathonCard.css";
import ProjectModal from "./ProjectModal"; // ✅ Import your modal component

export default function HackathonCard({ project, refresh }) {
  const [showModal, setShowModal] = useState(false);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <>
      <Card
        className="hackathon-card shadow-sm"
        onClick={() => setShowModal(true)}
        style={{ cursor: "pointer" }}
      >
        <div className="thumbnail-wrapper">
          <Card.Img
            variant="top"
            src={
              project.thumbnail_url ||
              "https://via.placeholder.com/600x300?text=No+Image"
            }
            alt="Project thumbnail"
            className="thumbnail-img"
          />
        </div>

        <Card.Body className="d-flex flex-column">
          <Card.Title className="fw-semibold">{project.title}</Card.Title>

          {project.hackathon && (
            <div className="mb-2 d-flex flex-wrap align-items-center gap-2 small">
              <span className="text-secondary fw-semibold">Hackathon –</span>
              <Badge bg="info">{project.hackathon}</Badge>
              {project.hackathon_start_date && project.hackathon_end_date && (
                <span className="fw-semibold">
                  {formatDate(project.hackathon_start_date)} –{" "}
                  {formatDate(project.hackathon_end_date)}
                </span>
              )}
            </div>
          )}

          {project.technologies?.length > 0 && (
            <div className="mb-2 d-flex flex-wrap align-items-center gap-2 small">
              <span className="text-secondary fw-semibold">Tech Stack –</span>
              {project.technologies.map((tech, index) => (
                <Badge bg="dark" className="mb-1" key={index}>
                  {tech}
                </Badge>
              ))}
            </div>
          )}

          <div className="mt-auto d-flex justify-content-between pt-2 border-top">
            <div className="d-flex gap-2 flex-wrap">
              {project.repo_url && (
                <Button
                  variant="outline-primary"
                  size="sm"
                  href={project.repo_url}
                  target="_blank"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Github className="me-1" size={16} />
                  GitHub
                </Button>
              )}

              {project.preview_url && (
                <Button
                  variant="outline-success"
                  size="sm"
                  href={project.preview_url}
                  target="_blank"
                  onClick={(e) => e.stopPropagation()}
                >
                  <BoxArrowUpRight className="me-1" size={16} />
                  Live Demo
                </Button>
              )}

              {project.certificate_url && (
                <Button
                  variant="outline-secondary"
                  size="sm"
                  href={project.certificate_url}
                  target="_blank"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Award className="me-1" size={16} />
                  Certificate
                </Button>
              )}
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* ✅ Show the clean modal view on click */}
      <ProjectModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        project={project}
        refresh={refresh}
      />
    </>
  );
}
