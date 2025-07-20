import { useState } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { supabase } from "../supabaseClient";
import "../styles/Auth.css";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [data, setData] = useState({ username: "", email: "", pwd: "" });
  const [err, setErr] = useState(null);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setData({ ...data, [id]: value });
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setErr(null);

    if (!isLogin) {
      const usernameRegex = /^\S+$/;
      if (!usernameRegex.test(data.username))
        return setErr("Username cannot contain spaces.");
    }

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.pwd,
      });
      if (error) setErr(error.message);
      else window.location.href = "/dashboard";
    } else {
      const { data: signUpData, error: signUpError } =
        await supabase.auth.signUp({
          email: data.email,
          password: data.pwd,
        });
      if (signUpError) return setErr(signUpError.message);

      const user = signUpData.user;
      if (user) {
        const { error: profileError } = await supabase
          .from("profiles")
          .insert([{ id: user.id, username: data.username }]);
        if (profileError)
          return setErr("Sign up successful but failed to create profile.");
      }

      alert("Check your email to confirm your account.");
      window.location.reload();
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setErr(null);
    setData({ username: "", email: "", pwd: "" });
  };

  return (
    <section className="background-radial-gradient overflow-hidden">
      <Container className="px-4 py-5 px-md-5 text-center text-lg-start my-5">
        <Row className="gx-lg-5 align-items-center mb-5">
          <Col lg={6} className="mb-5 mb-lg-0" style={{ zIndex: 10 }}>
            <h1 className="my-5 fw-bold text-center text-lg-start">
              <span className="brand-name">HackStack</span>
              <br />
              <span className="quote">Build. Share. Inspire.</span>
            </h1>

            <p className="text-white-50 fs-5">
              {isLogin
                ? "Login to manage and showcase your hackathon journey."
                : "Join HackStack and create your portfolio of amazing projects."}
            </p>
          </Col>

          <Col lg={6} className="mb-5 mb-lg-0 position-relative">
            <Card className="bg-glass">
              <Card.Body className="px-4 py-5 px-md-5">
                <Form onSubmit={handleAuth}>
                  {!isLogin && (
                    <Form.Group className="mb-4">
                      <Form.Label>Username</Form.Label>
                      <Form.Control
                        type="text"
                        id="username"
                        value={data.username}
                        onChange={handleChange}
                        required
                        pattern="^\S+$"
                        placeholder="e.g., johndoe"
                      />
                    </Form.Group>
                  )}

                  <Form.Group className="mb-4">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      id="email"
                      value={data.email}
                      onChange={handleChange}
                      required
                      placeholder="you@example.com"
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      id="pwd"
                      value={data.pwd}
                      onChange={handleChange}
                      required
                      placeholder="Enter password"
                    />
                  </Form.Group>

                  {err && <p className="text-danger text-center">{err}</p>}

                  <Button type="submit" className="btn btn-primary w-100 mb-3">
                    {isLogin ? "Sign In" : "Sign Up"}
                  </Button>

                  <div className="text-center mt-3">
                    <p>
                      {isLogin
                        ? "Need an account?"
                        : "Already have an account?"}{" "}
                      <Button
                        variant="link"
                        className="p-0"
                        onClick={toggleMode}
                      >
                        {isLogin ? "Sign Up" : "Sign In"}
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
