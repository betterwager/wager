import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  FloatingLabel,
  Button,
  Form
} from "react-bootstrap";
import { Auth, Hub } from 'aws-amplify';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

//Functions
const Signup = () => {
  const navigate = useNavigate();
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [birthdate, setBirthdate] = useState(null);
  const [phonenumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signup = async () => {
    /*
    setIsLoading(true);
    setError(null);
    try {
      let user = "";
      
      const { user } = await Auth.signUp({
        username: email,
        password: password,
        attributes: {
            email
        },
      });
      
      console.log(user);
      setIsLoading(false);
      setError(false);
      setSuccess(true);
  } catch (error) {
      alert('error signing up:', error);
      setIsLoading(false);
  }
  */
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    signup();
    success && navigate("/Dashboard");
  };
  return (
    <Container style={{ maxWidth: 800 }} className="mt-5">
      <h2 className="text-center display-4 fw-bold pb-3">Sign Up</h2>
      <Form onSubmit={handleSubmit}>
        <Row className="mt-3">
          <Col>
            <FloatingLabel
              controlId="floatingInput"
              label="First Name"
              className="text-secondary"
            >
              <Form.Control
                type="text"
                onChange={(e) => setFirstName(e.target.value)}
              />
            </FloatingLabel>
          </Col>
          <Col>
            <FloatingLabel
              controlId="floatingInput"
              label="Last Name"
              className="text-secondary"
            >
              <Form.Control
                type="text"
                onChange={(e) => setLastName(e.target.value)}
              />
            </FloatingLabel>
          </Col>
        </Row>
        <br/>
        <Row>
          <Col>
          <Form.Label className="text-secondary">Phone Number</Form.Label>
            <PhoneInput
            placeholder="Enter phone number"
            value = {phonenumber}
            onChange={setPhoneNumber}/>
          </Col>
          <Col>
          <FloatingLabel
          controlId="floatingInput"
          label="Date of Birth"
          className="mt-4 text-secondary"
        >
          
          <Form.Control type="date" name="dob" onChange={(e) => setBirthdate(e.target.value)}/>
          </FloatingLabel>
          </Col>
        </Row>

        <FloatingLabel
          controlId="floatingInput"
          label="Email Address"
          className="mt-4 text-secondary"
        >
          <Form.Control
            type="email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </FloatingLabel>
        <FloatingLabel
          controlId="floatingInput"
          label="Password"
          className="mt-4 text-secondary"
        >
          <Form.Control
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </FloatingLabel>
        <Button
          disabled={isLoading}
          size="lg"
          className="mt-4 w-100 btn-success"
          type="submit"
        >
          Sign Up
        </Button>
      </Form>
      <p className="text-center text-muted pt-3">
        Already have an account?{" "}
        <Link to="/login" className="text-decoration-none text-success">
          Sign In
        </Link>
      </p>
      {error && <div className="text-center text-danger ">{error}</div>}
    </Container>
  );
};

export default Signup;
