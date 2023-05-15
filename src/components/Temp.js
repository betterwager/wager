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

const Temp = (props) => {
    const navigate = useNavigate();
  
    return (
      <Container style={{alignItems:"center", justifyContent: "center" }} className="mt-5">
        <h2 className="text-center display-4 fw-bold pb-2">Welcome to Wager!</h2>
          <div style = {{marginTop:"10px", marginBottom:"10px", marginLeft:"20%", marginRight:"20%", width:"60%", textAlign: "center"}}>
          <Text
          style = {{marginBottom: 10, marginTop: 10}}
          >
            Thank you for registering on our platform. Stay on the lookout for our launch at <a href="https://wager.social" target="_blank">Wager.Social</a>
          </Text>
          </div>
          <Button
            size="lg"
            // colorScheme="green"
            backgroundColor = "primaryColor"
            color = "buttonTextColor"
            style = {{marginTop:"10px", marginBottom:"10px", marginLeft:"20%", marginRight:"20%", width:"60%"}}
            className="mt-2 btn-success"
            onClick={() => 
                {
                    Auth.signOut()
                    .then (() => {
                        navigate("/")
                    });
                }
            }
          >
            Return to Home
          </Button>
        
      </Container>
    );
  };
  
  export default Temp;
  