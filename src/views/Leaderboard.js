import React, { useState, useCallback, useEffect } from "react";
import {
  Grid,
  SimpleGrid,
  GridItem,
  Button,
  Box,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Flex,
  FormControl,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  ModalOverlay,
  ModalContent,
  Select,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from "@chakra-ui/react";
import {Row} from "react-bootstrap"
import { RepeatIcon } from "@chakra-ui/icons";
import InfiniteScroll from "react-infinite-scroll-component";
import Sidebar from './Sidebar.js'
import {QRCodeCanvas} from 'qrcode.react';
import { DataGrid} from '@mui/x-data-grid';
import { withAuthenticator } from "@aws-amplify/ui-react";
import * as queries from "../graphql/queries";
import * as mutations from "../graphql/mutations";
import * as subscriptions from "../graphql/subscriptions";
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
  const [code, setCode] = useState("")
  const [codeDisplayIsOpen, setCodeDisplayIsOpen] = useState(false);
  const path = window.location.pathname

  const getUsers = async () => {
    const users = await API.graphql({ query: queries.listUsers })
    return users
  }
  const getBoards = useCallback(async () => {
    let allBoards,email;
    const boards = await API.graphql({ query: queries.listLeaderboards})
    .catch(console.error)
    .then((boards) => {
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
            
          }
        }
        setBoardNames(boardNames)
        setBoardIDs(boardID)
        let list = allBoards[0].users;
        list = list.sort((a,b) => parseFloat(a.bettingscore) - parseFloat(b.bettingscore))
        setCurrentBoard(list)
        setCode(allBoards[0].id)
      }
      getUsers().catch(console.error)
      .then((users) => {
        users = users.data.listUsers.items;
        setAllUsers(users)
        let currentUser = users.find(x => x.email == email);
        let boardUserList = []
        let board = allBoards[0].users
        for (var i = 0; i < board.length; i ++){
          boardUserList.push(users.find(user => user.email == board[i]))
        }
        setBoardUsers(boardUserList)
        setCurrentUser(currentUser);

    })
  })})

  useEffect(() => {
    getBoards().catch(console.error)
    },[])


    const handleCurrentBoard = (e) => {
      let ID = e.target.value
      setCode(ID);
      for (var i = 0; i < boards.length; i++){
        if (boards[i].id == ID){
          let list = boards[i].users;
          list = list.sort((a,b) => a.bettingscore - b.bettingscore)
          setCurrentBoard(list)  
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

    const downloadQRCodeLeader = () => {
      // Generate download with use canvas and stream
      const canvas = document.getElementById("qr-gen");
      const pngUrl = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
      let downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `${code}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    };
    return (
      <Grid
        templateAreas={`"nav header"
                            "nav main"`}
        gridTemplateRows={'50px'}
        gridTemplateColumns={'150px'}
        color="blackAlpha.700"
        fontWeight="bold"
        minHeight="100vh"
        style = {{
          boxSizing: "border-box",
          overflowY: "hidden"
        }}
      >

      <GridItem colSpan={2} area={"nav"}  style={{
          height: "100vh",
          backgroundColor: "#195F50",
          overflow: "hidden",
          marginBottom:"-5000px",
          paddingBottom:"5000px",
        }}>
        <Sidebar user={currentUser} />
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
          
          <Flex>
          <FormControl style = {{border: "black", maxWidth: "40%", color: "black"}}>
            <Select onChange = {handleCurrentBoard} variant = "filled">
              {boardNames.map((name, index) => (
                <option key = {index} value = {boardIDs[index]}>{name}</option>
              ))}
            </Select>
          </FormControl>

          <Button variant="primary" disabled = {code==""}style = {{backgroundColor: "green", color:"white"}} onClick={() => {
              if (code != ""){
                setCodeDisplayIsOpen(true);
              }
          }}>
            View Join Code
          </Button>
          </Flex>
          </div>
          <div
            id="scrollableDiv2"
            style={{
              overflow: 'auto',
              height: "75vh",
              display: 'flex',
              flexDirection: 'column',
              boxSizing: "border-box",
              overflowX: "hidden"
            }}>
          <InfiniteScroll
            dataLength={boardUsers.length}
            hasMore={false}
            loader={<h4>Loading...</h4>}
            scrollableTarget="scrollableDiv2"
            style = {{boxSizing: "border-box",
            overflowX: "hidden"}}
            endMessage={
              <Row style={{ textAlign: "right" }}>
                <Button
                  colorScheme="black"
                  variant="ghost"
                  rightIcon={<RepeatIcon />}
                  onClick={() => {
                    getBoards().catch(console.error)
                  }}
                >
                  Refresh
                </Button>
              </Row>
            }
          >
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

        </InfiniteScroll>
        </div>
        
        </GridItem>

        <Modal isOpen={codeDisplayIsOpen} onClose={() => setCodeDisplayIsOpen(false)}>
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>Leaderboard Information</ModalHeader>
                    <ModalBody>
                        <h1 style = {{fontSize: "15px"}}><strong>Leaderboard Code: </strong><u><a onClick={() => {
                          navigator.clipboard.writeText(code)
                          alert("Copied to Clipboard")
                          }}>{code}</a></u></h1><br/>
                        <h3 style = {{fontSize: "15px"}}><strong>Join Link: </strong><u><a onClick={() => {
                          navigator.clipboard.writeText(window.location.href + "?leaderboard=" + code.replace(" ", "%20"))
                          alert("Copied to Clipboard")
                          }}>{window.location.href + "?leaderboard=" + code.replace(" ", "%20")}</a></u></h3><br/>
                        <QRCodeCanvas 
                        id="qr-gen"
                        includeMargin={true}
                        value= {window.location.href + "?leaderboard=" + code.replace(" ", "%20")} />
                        <Button onClick={downloadQRCodeLeader}>
                            Download QR Code
                        </Button>
                    </ModalBody>
                    <ModalFooter>
                      <Button
                        variant="ghost"
                        mr={3}
                        onClick={() => {
                          setCodeDisplayIsOpen(false);
                        }}
                      >
                        Close
                      </Button>
                    </ModalFooter>
                </ModalContent>
              </Modal>
      </Grid>
    );
  
}

export default withAuthenticator(Leaderboard);
