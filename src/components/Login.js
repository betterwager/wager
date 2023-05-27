import { useState } from "react";

import SignIn from "./SignIn";
import SignInMagic from "./SignInMagic";
import Validate from "./Validate";

const Login = (props) => {
  const [validate, setValidate] = useState(false);
  const [user, setUser] = useState({})
  return (
    (!validate ? 
      <SignInMagic setAuth={setValidate} setIsAuthenticated={props.setIsAuthenticated} user={user} setUser={setUser}/>
      :
      <Validate setIsAuthenticated={props.setIsAuthenticated} setAuth={setValidate} user={user} setUser={setUser}/>
    )
  )
}

export default Login