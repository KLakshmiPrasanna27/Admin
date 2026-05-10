import { useState, useContext } from "react";
import { Button, Form, Container, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../App";
import { authAPI } from "../../services/api";
import "./Login.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const handleEmail = (event) => {
        setEmail(event.target.value);
    }

    const handlePassword = (event) => {
        setPassword(event.target.value); 
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setLoading(true);
        
        try {
            // Validation
            if (!email || !password) {
                setError("Email and password are required");
                setLoading(false);
                return;
            }

            const response = await authAPI.login(email, password);
            const { token, user } = response.data;
            
            login(user, token);
            navigate("/dashboard");
        } catch (err) {
            console.error("Login error:", err);
            
            // Demo login for development
            if (email === "admin@demo.com" && password === "admin123") {
                const demoUser = {
                    _id: "demo-admin",
                    name: "Demo Admin",
                    email: "admin@demo.com",
                    role: "admin"
                };
                login(demoUser, "demo-token");
                navigate("/dashboard");
                setLoading(false);
                return;
            } else if (email === "member@demo.com" && password === "member123") {
                const demoUser = {
                    _id: "demo-member",
                    name: "Demo Member",
                    email: "member@demo.com",
                    role: "member"
                };
                login(demoUser, "demo-token");
                navigate("/dashboard");
                setLoading(false);
                return;
            }
            
            setError(err.message || "Login failed. Try demo credentials: admin@demo.com / admin123");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Container className="login-container">
            <div className="login-box">
                <h2 className="login-title">Login</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control 
                            type="email" 
                            placeholder="Enter email"
                            value={email}
                            onChange={handleEmail}
                            required
                            disabled={loading}
                        />
                    </Form.Group>
                    
                    <Form.Group className="mb-3" controlId="formPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control 
                            type="password" 
                            placeholder="Enter password"
                            value={password}
                            onChange={handlePassword}
                            required
                            disabled={loading}
                        />
                    </Form.Group>

                    <Button type="submit" variant="primary" className="w-100" disabled={loading}>
                        {loading ? <Spinner size="sm" /> : "Login"}
                    </Button>
                </Form>

                <div className="login-footer">
                    <p>Don't have an account? <a href="/signUp">Sign Up</a></p>
                    <div className="demo-credentials">
                        <p><strong>Demo Credentials:</strong></p>
                        <p>Admin: admin@demo.com / admin123</p>
                        <p>Member: member@demo.com / member123</p>
                    </div>
                </div>
            </div>
        </Container>
    )
}

export default Login;