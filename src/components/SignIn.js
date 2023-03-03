import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Auth, API, a } from "aws-amplify";
import { Spinner } from '@chakra-ui/react'
import { Container, FloatingLabel, Button, Form } from "react-bootstrap";
import { isPossiblePhoneNumber, isValidPhoneNumber } from 'react-phone-number-input'

const SignIn = (props) => {
    const navigate = useNavigate();
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(null);
    const [email, setEmail] = useState("");
    const [error, setError] = useState(false);
    const [password, setPassword] = useState("");
  
    const handleEmailChange = (e) => {
      setEmail(e.target.value);
    }
  
    const handleSubmit = async (e) => {
        setIsLoading(true);
      e.preventDefault();
  
      try {
        // const promise = await Auth.signIn(email)

        const promise = await Auth.signUp({
            username: email,
            password: Date.now().toString()
          })
        .then((res) =>{
            props.setAuth(true);
            props.setUser(res);
            
        })
      } catch(e) {
        console.log(e);
        try{
            const trust = await Auth.signIn(email)
            .then((res) =>{
                props.setAuth(true);
                props.setUser(res);
            })
        }catch(e){
            console.log(e)
        }
      }

    };
  
    return (
      <Container style={{ maxWidth: 800, alignItems:"center" }} className="mt-5">
        <h2 className="text-center display-4 fw-bold pb-2">Sign In</h2>
        <Form>
          <FloatingLabel
            controlId="floatingInput"
            label="Enter Email Address"
            className="text-secondary"
            style = {{marginTop:"10px", marginBottom:"10px", marginLeft:"25%", width:"50%"}}
          >
            <Form.Control
              placeholder="Enter Email Address"
              onChange={handleEmailChange}
            />
          </FloatingLabel>
  
          <Button
            disabled={isLoading}
            size="lg"
            style = {{marginTop:"10px", marginBottom:"10px", marginLeft:"25%", width:"50%"}}
            className="mt-2 btn-success"
            onClick={handleSubmit}
          >
            {isLoading ? <Spinner size="lg"/> : "Sign In" }
          </Button>
        </Form>
        
      </Container>
    );
  };
  
  export default SignIn;
  