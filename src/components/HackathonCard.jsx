import { Card, Button, Badge } from 'react-bootstrap';

export default function HackathonCard({ project }) {
  return (
    <Card className="h-100 shadow-sm">
      <Card.Img
        variant="top"
        src={project.thumbnail_url || 'https://via.placeholder.com/600x300'}
        alt="Project thumbnail"
      />
      <Card.Body>
        <Card.Title>{project.title}</Card.Title>
        <Card.Text>{project.description}</Card.Text>

        {project.technologies && project.technologies.length > 0 && (
          <div className="mb-2">
            {project.technologies.map((tech, index) => (
              <Badge bg="secondary" className="me-1" key={index}>
                {tech}
              </Badge>
            ))}
          </div>
        )}

        <div className="d-flex justify-content-between mt-3">
          <Button variant="outline-primary" size="sm" href={project.repo_url} target="_blank">
            GitHub
          </Button>
          <Button variant="outline-success" size="sm" href={project.preview_url} target="_blank">
            Demo
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}
