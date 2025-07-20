  import { useState } from 'react';
  import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
  import { supabase } from '../supabaseClient';
  import '../styles/Auth.css';

  export default function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    const [data, setData] = useState({
      name: '',
      email: '',
      pwd: '',
    });
    const [err, setErr] = useState(null);

    const handleChange = (e) => {
      const { id, value } = e.target;
      setData({ ...data, [id]: value });
    };

    const handleAuth = async (e) => {
      e.preventDefault();
      setErr(null);

      if (isLogin) {
        const { data: session, error } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.pwd,
        });

        if (error) {
          setErr(error.message);
        } else {
          window.location.href = '/dashboard';
        }
      } else {
        const { error } = await supabase.auth.signUp({
          email: data.email,
          password: data.pwd,
          options: {
            data: {
              name: data.name,
            },
          },
        });

        if (error) {
          setErr(error.message);
        } else {
          alert('Check your email to confirm your account.');
          window.location.reload(); 
        }
      }
    };

    const toggleMode = () => {
      setIsLogin(!isLogin);
      setErr(null);
      setData({ name: '', email: '', pwd: '' });
    };

    return (
      <section className="background-radial-gradient overflow-hidden">
        <Container className="px-4 py-5 px-md-5 text-center text-lg-start my-5">
          <Row className="gx-lg-5 align-items-center mb-5">
            <Col lg={6} className="mb-5 mb-lg-0" style={{ zIndex: 10 }}>
              <h1 className="my-5 display-5 fw-bold ls-tight" style={{ color: 'hsl(218, 81%, 95%)' }}>
                {isLogin ? 'Welcome Back' : 'Join Us'} <br />
                <span style={{ color: 'hsl(218, 81%, 75%)' }}>
                  {isLogin ? 'Sign in to continue' : 'Create your account'}
                </span>
              </h1>
            </Col>

            <Col lg={6} className="mb-5 mb-lg-0 position-relative">
              <Card className="bg-glass">
                <Card.Body className="px-4 py-5 px-md-5">
                  <Form onSubmit={handleAuth}>
                    {!isLogin && (
                      <Row className="mb-4">
                        <Col className="d-flex align-items-center">
                          <Form.Label htmlFor="name" className="col-4 mb-0">Name</Form.Label>
                          <Form.Control
                            type="text"
                            id="name"
                            value={data.name}
                            onChange={handleChange}
                            required
                          />
                        </Col>
                      </Row>
                    )}

                    <Row className="mb-4">
                      <Col className="d-flex align-items-center">
                        <Form.Label htmlFor="email" className="col-4 mb-0">Email</Form.Label>
                        <Form.Control
                          type="email"
                          id="email"
                          value={data.email}
                          onChange={handleChange}
                          required
                        />
                      </Col>
                    </Row>

                    <Row className="mb-4">
                      <Col className="d-flex align-items-center">
                        <Form.Label htmlFor="pwd" className="col-4 mb-0">Password</Form.Label>
                        <Form.Control
                          type="password"
                          id="pwd"
                          value={data.pwd}
                          onChange={handleChange}
                          required
                        />
                      </Col>
                    </Row>

                    {err && <p className="text-danger text-center mb-4">{err}</p>}

                    <Button type="submit" className="btn-primary btn-block mb-4">
                      {isLogin ? 'Sign In' : 'Sign Up'}
                    </Button>

                    <div className="text-center mt-4">
                      <p>
                        {isLogin ? 'Need an account?' : 'Have an account?'}{' '}
                        <Button variant="link" className="text-primary p-0" onClick={toggleMode}>
                          {isLogin ? 'Sign Up' : 'Sign In'}
                        </Button>
                      </p>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    );
  }
