import { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { supabase } from '../supabaseClient';

export default function AddProject() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: '',
    repo_url: '',
    preview_url: '',
    thumbnail_url: '',
    is_public: false,
  });

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [id]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = await supabase.auth.getUser();
    if (!user.data.user) return alert('User not found');

    const { data, error } = await supabase.from('projects').insert([
      {
        user_id: user.data.user.id,
        title: formData.title,
        description: formData.description,
        technologies: formData.technologies.split(',').map((t) => t.trim()),
        repo_url: formData.repo_url,
        preview_url: formData.preview_url,
        thumbnail_url: formData.thumbnail_url,
        is_public: formData.is_public,
      },
    ]);

    if (error) alert(error.message);
    else {
      alert('Project added!');
      setFormData({
        title: '',
        description: '',
        technologies: '',
        repo_url: '',
        preview_url: '',
        thumbnail_url: '',
        is_public: false,
      });
    }
  };

  return (
    <Container className="my-4">
      <h2>Add New Hackathon Project</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control id="title" value={formData.title} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control as="textarea" rows={3} id="description" value={formData.description} onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Technologies (comma separated)</Form.Label>
          <Form.Control id="technologies" value={formData.technologies} onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>GitHub Repository URL</Form.Label>
          <Form.Control id="repo_url" value={formData.repo_url} onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Preview/Demo URL</Form.Label>
          <Form.Control id="preview_url" value={formData.preview_url} onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Thumbnail Image URL</Form.Label>
          <Form.Control id="thumbnail_url" value={formData.thumbnail_url} onChange={handleChange} />
        </Form.Group>

        <Form.Check
          type="checkbox"
          id="is_public"
          label="Make project public"
          checked={formData.is_public}
          onChange={handleChange}
          className="mb-3"
        />

        <Button type="submit" variant="primary">Submit Project</Button>
      </Form>
    </Container>
  );
}
