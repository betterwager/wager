import React, { useEffect, useState } from "react";
import {
  Grid,
  SimpleGrid,
  Modal,
  ModalOverlay,
  FormControl,
  FormLabel,
  Input,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  GridItem,
  VStack,
  StackDivider,
  Heading,
  Image,
  Flex,
  Center,
  Box,
  IconButton,
  Text,
  Button,
  Container,
} from "@chakra-ui/react";
import{  
  BrowserRouter as Router,
    Route,
    NavLink as Link,
    Switch,
    Redirect,
    useHistory
  } from "react-router-dom";
import Sidebar from './Sidebar.js'

import logo from './assets/default.svg'
import { Layout, Menu } from 'antd';
import Header from "./Header.js";

import styled from 'styled-components';
import {
  DashboardOutlined,
  BookOutlined,
  UserOutlined
} from '@ant-design/icons';
import {HOME, DASHBOARD, LEADERBOARD} from './App.js'
const { SubMenu } = Menu;
const NavLink = styled(Link)`
  color: #fff;
  display: flex;
  align-items: center;
  text-decoration: none;
  height: 100%;
  cursor: pointer;
  &.active {
    color: #15cdfc;
  }
`;

function Holder(){
    const [result, setResult] = useState([])
    const api = () => {
            fetch('http://localhost:4000/api/users',{
                method: "GET"
            }) 
            .then((response) => response.json())
            .then((data) => 
            
            setResult(data.sort()));
        
    }
    useEffect(() => {
        api();
    }, [])
    return (
        <Leaderboard arr = {result}/>
    )
}

function Leaderboard(){
  const [result, setResult] = useState([])
  const [currentBoard, setCurrentBoard] = useState(null);
  const path = window.location.pathname
  const api = () => {
      fetch('http://localhost:4000/api/users',{
          method: "GET"
      }) 
      .then((response) => response.json())
      .then((data) => 
      
      setResult(data.sort()));

  }
  useEffect(() => {
  api();
  }, [])
    return (
      <Grid
        templateAreas={`"nav header"
                            "nav main"`}
        gridTemplateRows={'50px'}
        gridTemplateColumns={'150px'}
        color="blackAlpha.700"
        fontWeight="bold"
        minHeight="100vh"
      >

  
      <GridItem
          area={"nav"}
        >
      <Sidebar/>
        </GridItem>

        <GridItem
          colSpan={10}
          pl = "2"
          bg="#F7F8FC"
          area={"header"}
         
        >
          <br/>
          <div
           style={{
            marginLeft: "4rem",
            
            color: "white",
            fontSize: "25px",
          }}>

          <h1>Leaderboard</h1>
          </div>
        </GridItem>


        <GridItem
          pl="2"
          colSpan={10}
          bg="#F7F8FC"
          area={"main"}
        >
          <br />
        
          <br />
          {result.length != 0 && (
            <>
              <SimpleGrid columns={3}>
                <Box columns={1}>
                  <h1 style={{ fontSize: "50px" }}>Member:</h1>
                  <br/>
                  {result.map((member) => (
                    <>
                    <h3 style={{ fontSize: "20px"}}>{member.firstname} {member.lastname}</h3>
                    <br/>
                    </>
                  ))}
                </Box>
                <Box columns={1}>

                </Box>
                <Box columns={1}>
                  <h1 style={{ fontSize: "50px" }}>Score:</h1>
                  <br/>
                  {result.map((member) => (
                    <>
                    <h3 style={{ fontSize: "20px" }}>{member.betting_score}</h3>
                    <br/>
                    </>
                  ))}
                </Box>
              </SimpleGrid>
            </>
          )}
        </GridItem>
      </Grid>
    );
  
}

export default Holder;
