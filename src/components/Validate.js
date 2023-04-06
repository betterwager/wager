import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Auth, API, a } from "aws-amplify";
import { Spinner, Center,
  Button } from '@chakra-ui/react'
import { Container, FloatingLabel, Form } from "react-bootstrap";
import { isPossiblePhoneNumber, isValidPhoneNumber } from 'react-phone-number-input'
import OtpInput from 'react-otp-input';

//import { useLogin } from "./hooks/useLogin";
const Validate = (props) => {
  const navigate = useNavigate();
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [code, setCode] = useState(0);
  const [error, setError] = useState(false);


  const handleCodeChange = (e) => {
    setCode(e);
    console.log(e);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    for (var i = 0; i < 3; i ++){
      try {
        const cognitoUser = await Auth.sendCustomChallengeAnswer(props.user, code)
        .then((res) => {
          console.log(res);
          setIsLoading(true);
          props.setIsAuthenticated(true);
        })
      } catch(e) {
        console.log(e);
        setIsLoading(false);
        setError("Invalid OTP Code")
        setTimeout(() => {  props.setAuth(false) }, 2000);
        // Handle 3 error thrown for 3 incorrect attempts. 
      }    
    }
    
  };

  return (
    <Container style={{ maxWidth: "60%", width:"1000px", alignItems:"center", textAlign:"center" }} className="mt-5">
        <h2 className="text-center display-4 fw-bold pb-2">Sign In</h2>
        <h5 className="text-center">Enter the OTP Code sent to your phone number</h5>
        <Form onSubmit={handleSubmit}>
        <Center>
        <OtpInput
        value={code}
        onChange={handleCodeChange}
        numInputs={6}
        isInputNum={true}
        separator={<span>-</span>}
        containerStyle = {{marginTop:"10px", marginBottom:"20px"}}
        inputStyle = {{fontSize: "25px"}}
      />
      </Center>
  
          <Button
            disabled={isLoading}
            colorScheme="green"
            type="submit"
            size="lg"
            style = {{marginTop:"10px", marginBottom:"10px", marginLeft:"20%", marginRight:"20%", width:"60%"}}
            className="mt-2 btn-success"
          >
            {isLoading ? <Spinner size="lg"/> : "Sign In" }
          </Button>
          </Form>
        {error && <div className="text-center text-danger ">{error}</div>}
    </Container>
  );
};

export default Validate;
