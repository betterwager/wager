import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Accordion, Nav, Navbar, NavDropdown, Image, Jumbotron, ListGroup, Container, Col, Row, Carousel, Card, Button, Form, CardColumns } from 'react-bootstrap';
import styled from 'styled-components';
import {
  Grid,
  GridItem,
} from "@chakra-ui/react";
import{  
BrowserRouter as Router,
  Route,
  NavLink as Link,
  Switch,
  Redirect,
  useHistory
} from "react-router-dom";
import logo from './assets/cover.png';
import {HOME, DASHBOARD, LEADERBOARD} from './App.js'

  function Header(props){
        return(
          <div></div>

        );

  }
                /*
                <NavBtn>
                  <NavBtnLink to = '/' onClick = {this.signOut} >Sign Out</NavBtnLink>
                </NavBtn>
                */

  export default Header;


