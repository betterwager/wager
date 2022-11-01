import React from "react";
import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import Dashboard from "./Dashboard.js";
import Home from "./Home.js";
import Login from "./Login.js";
import Signup from "./Signup.js";
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import awsExports from './aws-exports.js';
import {Amplify} from "aws-amplify"
import Leaderboard from "./Leaderboard.js";

Amplify.configure(awsExports);

export var HOME = "/";
export var DASHBOARD = "/Dashboard";
export var LOGIN = "/login";
export var SIGNUP = "/signup";
export var LEADERBOARD = "/Leaderboard";

function App(){
    return (
      <ChakraProvider>
        <Router>
          <Routes>
            <Route exact path={HOME} element={<Home />} />
            <Route exact path={DASHBOARD} element={<Dashboard />} />
            <Route exact path={LEADERBOARD} element={<Leaderboard />} />
          </Routes>
        </Router>
      </ChakraProvider>
    );
}

export default App;
