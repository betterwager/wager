import { useEffect, useState, useContext} from "react";
import { useNavigate } from "react-router-dom";
import { Auth, API } from "aws-amplify";
import awsconfig from "../aws-exports";
import Loading from "./Loading";
import {magic, AuthUserContext} from "../utils/globals";




const Callback = (props) => {
const navigate = useNavigate();
  const [user, setUser] = useState({});

  // The redirect contains a `provider` query param if the user is logging in with a social provider
  useEffect(() => {
    let magicCredential = new URLSearchParams(window.location.search).get(
        "magic_credential"
      );
    authenticateWithServer(magicCredential);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // `loginWithCredential()` returns a didToken for the user logging in
  const finishRedirectLogin = () => {
    let magicCredential = new URLSearchParams(window.location.search).get(
      "magic_credential"
    );
    if (magicCredential)
      magic.auth
        .loginWithCredential()
        .then((didToken) => authenticateWithServer(didToken));
  };

  // Send token to server to validate
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
      user
    )


    if (credentials) {
      // Set the UserContext to the now logged in user
      let userMetadata = await magic.user.getMetadata();
      await setUser({ ...userMetadata, identityId: credentials.identityId })

    navigate("/dashboard");

    }
  };

  return <Loading />;
};

export default Callback;