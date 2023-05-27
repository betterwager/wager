import { useEffect, useState, useContext} from "react";
import { Link, useNavigate } from "react-router-dom";
import { Auth, API } from "aws-amplify";
import { Text } from "@chakra-ui/react";
import { Spinner,
  Button } from '@chakra-ui/react'
import awsconfig from "../aws-exports";
import PhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/style.css'
import {magic, AuthUserContext} from "../utils/globals";
import { SolanaExtension } from "@magic-ext/solana";
import { Container, FloatingLabel,  Form } from "react-bootstrap";
import { isPossiblePhoneNumber, isValidPhoneNumber } from 'react-phone-number-input'


const SignInMagic = (props) => {
    const navigate = useNavigate();
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [error, setError] = useState(false);
    const [password, setPassword] = useState("");
    const [magicUser, setMagicUser] = useState({});


    useEffect(() => {
      magicUser && magicUser.issuer && navigate("/dashboard");
    }, [magicUser]);


    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true);
        try {
          // Prevent login state inconsistency between Magic and the client side
          await magic.user.logout();
          // Trigger Magic link to be sent to user
          await magic.auth.loginWithSMS({
            phoneNumber: "+" + phoneNumber
          })
          .then((res) => {
            console.log(res);
            authenticateWithServer(res);
        })

        } catch (error) {
          console.log(error);
        }
        
    };

    const authenticateWithServer = async (didToken) => {
      let userMetadata = await magic.user.getInfo();
      const res = await API.post(
        awsconfig.aws_cloud_logic_custom[0].name,
        "/auth",
        {
          body: {
            didToken,
            issuer: userMetadata.issuer,
          },
        }
      )
      .catch((e) => {
          console.log(e)
      })
  
      const credentials = await Auth.federatedSignIn(
        "developer",
        {
          identity_id: res.IdentityId,
          token: res.Token,
          expires_at: 3600 * 1000 + new Date().getTime(),
        },
        magicUser
      )
  
  
      if (credentials) {
        // Set the UserContext to the now logged in user
        let userMetadata = await magic.user.getMetadata();
        await setMagicUser({ ...userMetadata, identityId: credentials.identityId })
  
      navigate("/dashboard");
  
      }
    };


    return (
      <Container style={{alignItems:"center", justifyContent: "center" }} className="mt-5">
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
            color = "buttonTextColor"
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
  
  export default SignInMagic;
  