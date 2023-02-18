import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, FloatingLabel, Button, Form } from "react-bootstrap";
import { isPossiblePhoneNumber, isValidPhoneNumber } from 'react-phone-number-input'

import SignIn from "./SignIn";
import Validate from "./Validate";

const Login = (props) => {
  const [validate, setValidate] = useState(false);
  const [user, setUser] = useState({})
  return (
    (!validate ? 
      <SignIn setAuth={setValidate} user={user} setUser={setUser}/>
      :
      <Validate setIsAuthenticated={props.setIsAuthenticated} setAuth={setValidate} user={user} setUser={setUser}/>
    )
  )
}

export default Login