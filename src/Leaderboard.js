import React, { useState, useCallback, useEffect } from "react";
import {
  Grid,
  SimpleGrid,
  GridItem,
  Box,
  Table,
  Thead,
  Tbody,
  Tfoot,
  FormControl,
  Select,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from "@chakra-ui/react";
import Sidebar from './Sidebar.js'
import { DataGrid} from '@mui/x-data-grid';
import { withAuthenticator } from "@aws-amplify/ui-react";
import * as queries from "./graphql/queries";
import * as mutations from "./graphql/mutations";
import * as subscriptions from "./graphql/subscriptions";
import { Auth, API } from "aws-amplify";

function Leaderboard(){
  const [allUsers, setAllUsers] = useState([])
  const [result, setResult] = useState([])
  const [boards, setBoards] = useState([])
  const [boardNames, setBoardNames] = useState([])
  const [boardIDs, setBoardIDs] = useState([])
  const [currentUser, setCurrentUser] = useState({})
  const [currentBoard, setCurrentBoard] = useState([]);
  const [boardUsers, setBoardUsers] = useState([])
  const path = window.location.pathname

  const getUsers = async () => {
    const users = await API.graphql({ query: queries.listUsers })
    return users
  }
  const getBoards = async () => {
    const boards = await API.graphql({ query: queries.listLeaderboards})
    return boards
  }

  useEffect(() => {
    let allBoards,email;
    getBoards().catch(console.error)
    .then((boards) => {
      console.log(boards)
      allBoards = boards.data.listLeaderboards.items
      allBoards = allBoards.filter(board => board.users.includes(Auth.user.attributes.email))
      setBoards(allBoards);
      email = Auth.user.attributes.email;
      if (allBoards.length > 0){
        let boardNames = []
        let boardID = []
        for (var i = 0; i < allBoards.length; i ++){
          if (allBoards[i].users.includes(email)){
            boardNames.push(allBoards[i].name)
            boardID.push(allBoards[i].id)
            
            console.log(allBoards[i])
          }
        }
        setBoardNames(boardNames)
        console.log(boardNames)
        setBoardIDs(boardID)
        let board = allBoards[0].users
        setCurrentBoard(board)
        console.log(boardNames)
        console.log(allBoards)
      }
    })

    getUsers().catch(console.error)
    .then((users) => {
      console.log(users)
      users = users.data.listUsers.items;
      setAllUsers(users)
      let currentUser = users.find(x => x.email == email);
      let boardUserList = []
      let board = allBoards[0].users
      for (var i = 0; i < board.length; i ++){
        boardUserList.push(users.find(user => user.email == board[i]))
      }
      setBoardUsers(boardUserList)
      console.log(boardUserList)
      setCurrentUser(currentUser);
      
})},[])


    const handleCurrentBoard = (e) => {
      let ID = e.target.value
      for (var i = 0; i < boards.length; i++){
        if (boards[i].id == ID){
          setCurrentBoard(boards[i].users)  
          break;
        }
      }
      let board = boards[i].users
      let boardUserList = []
      for (var i = 0; i < board.length; i ++){
        boardUserList.push(allUsers.find(user => user.email == board[i]))
      }
      setBoardUsers(boardUserList)
    }

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
      
          colSpan={2}
          area={"nav"}
        >
      <Sidebar/>
        </GridItem>

        <GridItem
          colSpan={19}
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
          colSpan={19}
          bg="#F7F8FC"
          area={"main"}
        >
          <div
           style={{
            margin: "4rem",
            marginBottom: "1rem",            
            color: "white",
            fontSize: "20px",
          }}>

          <FormControl style = {{border: "black", maxWidth: "40%", color: "black"}}>
            <Select onChange = {handleCurrentBoard} variant = "filled">
              {boardNames.map((name, index) => (
                <option key = {index} value = {boardIDs[index]}>{name}</option>
              ))}
            </Select>
          </FormControl>
          </div>
          {currentBoard == null ? (<></>) :
          (
          <TableContainer  style={{
              marginLeft: "4rem", backgroundColor: "white"
            }} maxWidth = "90%">
            <Table  variant='striped'>
              <Thead>
                <Tr>
                  <Th>User</Th>
                  <Th>Trust Score</Th>
                  <Th>Name</Th>
                  <Th>Bet Score</Th>
                </Tr>
              </Thead>
              <Tbody>
                {boardUsers.map((user, index) => (
                <Tr key = {index}>
                  <Td>{currentBoard[index]}</Td>
                  <Td>{user.trustscore}</Td>
                  <Td>{user.name}</Td>
                  <Td>{user.bettingscore}</Td>
                </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
          )
          }

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

export default withAuthenticator(Leaderboard);
