import { useState } from "react";
import { Button, Form, Container, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../../services/api";
import "./SignUp.css";

function SignUp() {
    const [userName, setUserName] = useState("");
    const [mailId, setMailId] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [age, setAge] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleUserName = (event) => {
        setUserName(event.target.value);
    }

    const handleEmailId = (event) => {
        setMailId(event.target.value);
    }

    const handleContactNumber = (event) => {
        setContactNumber(event.target.value);
    }

    const handlePassword = (event) => {
        setPassword(event.target.value); 
    }

    const handleConfirmPassword = (event) => {
        setConfirmPassword(event.target.value);
    }

    const handleAge = (event) => {
        setAge(event.target.value);    
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        // Validation
        if (!userName || !mailId || !contactNumber || !password || !confirmPassword || !age) {
            setError("All fields are required");
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters long");
            setLoading(false);
            return;
        }

        if (age < 18) {
            setError("You must be at least 18 years old");
            setLoading(false);
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mailId)) {
            setError("Please enter a valid email address");
            setLoading(false);
            return;
        }

        try {
            await authAPI.signup({
                name: userName,
                email: mailId,
                phone: contactNumber,
                password,
                age: Number(age)
            });

            setSuccess("Sign up successful! Redirecting to login...");
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (error) {
            setError(error.message || "Sign up failed. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Container className="signup-container">
            <div className="signup-box">
                <h2 className="signup-title">Create Account</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}
                
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formUserName">
                        <Form.Label>Username</Form.Label>
                        <Form.Control 
                            type="text" 
                            placeholder="Enter username"
                            value={userName}
                            onChange={handleUserName}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formEmailId">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control 
                            type="email" 
                            placeholder="Enter email"
                            value={mailId}
                            onChange={handleEmailId}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formContactNumber">
                        <Form.Label>Contact Number</Form.Label>
                        <Form.Control 
                            type="tel" 
                            placeholder="Enter contact number"
                            value={contactNumber}
                            onChange={handleContactNumber}
                            pattern="[0-9]{10}"
                            title="Please enter a 10-digit phone number"
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formAge">
                        <Form.Label>Age</Form.Label>
                        <Form.Control 
                            type="number" 
                            placeholder="Enter age"
                            value={age}
                            onChange={handleAge}
                            min="18"
                            max="120"
                            required
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
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formConfirmPassword">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control 
                            type="password" 
                            placeholder="Confirm password"
                            value={confirmPassword}
                            onChange={handleConfirmPassword}
                            required
                        />
                    </Form.Group>

                    <Button type="submit" variant="primary" className="w-100 signup-btn" disabled={loading}>
                        {loading ? 'Creating account...' : 'Create Account'}
                    </Button>
                </Form>

                <div className="signup-footer">
                    <p>Already have an account? <a href="/login">Login</a></p>
                </div>
            </div>
        </Container>
    )
}

export default SignUp;