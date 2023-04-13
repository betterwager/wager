import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Auth, API } from "aws-amplify";
import { Text } from "@chakra-ui/react";
import { Spinner,
  Button } from '@chakra-ui/react'
import PhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/style.css'
import { Container, FloatingLabel,  Form } from "react-bootstrap";
import { isPossiblePhoneNumber, isValidPhoneNumber } from 'react-phone-number-input'

const SignIn = (props) => {
    const navigate = useNavigate();
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [error, setError] = useState(false);
    const [password, setPassword] = useState("");
  
    useEffect(() => {
      console.log(phoneNumber)
    })
    const handleSubmit = async (e) => {
      e.preventDefault()
      setIsLoading(true);

      let phone = "+" + phoneNumber
      try {
        const promise = await Auth.signUp({
            username: phone,
            password: Date.now().toString()
          })
        const trust = await Auth.signIn(phone)
        .then((res) =>{
            props.setAuth(true);
            props.setUser(res);
        })
      } catch(e) {
        console.log(e);
        try{
            const trust = await Auth.signIn(phone)
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
      <Container style={{ maxWidth: "60%", width:"1000px", alignItems:"center" }} className="mt-5">
        <h2 className="text-center display-4 fw-bold pb-2">Sign In</h2>
        <Form onSubmit={handleSubmit}>
          <div style = {{marginTop:"10px", marginBottom:"10px", marginLeft:"20%", marginRight:"20%", width:"60%", textAlign: "center"}}>
          <Text
          style = {{marginBottom: 10, marginTop: 10}}
          >
            Enter your phone number to start betting
          </Text>
             <PhoneInput
                country="us"
                placeholder="Enter phone number"
                onlyCountries={["us"]}
                value={phoneNumber}
                inputStyle = {{width:"100%"}}
                onChange={(phone) => setPhoneNumber(phone)}
              />
          </div>
          <Button
            disabled={isLoading}
            size="lg"
            // colorScheme="green"
            backgroundColor = "primaryColor"
            color = "color"
            style = {{marginTop:"10px", marginBottom:"10px", marginLeft:"20%", marginRight:"20%", width:"60%"}}
            className="mt-2 btn-success"
            type="submit"
          >
            {isLoading ? <Spinner size="lg"/> : "Sign In" }
          </Button>
        </Form>
        
      </Container>
    );
  };
  
  export default SignIn;
  