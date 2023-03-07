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
  useBreakpointValue,
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
import { Row } from "react-bootstrap";
import { RepeatIcon } from "@chakra-ui/icons";
import InfiniteScroll from "react-infinite-scroll-component";
import Sidebar from "../components/Sidebar.js";
import { QRCodeCanvas } from "qrcode.react";
import { DataGrid } from "@mui/x-data-grid";
import { withAuthenticator } from "@aws-amplify/ui-react";
import * as queries from "../graphql/queries";
import * as mutations from "../graphql/mutations";
import * as subscriptions from "../graphql/subscriptions";
import { Auth, API } from "aws-amplify";
import LeaderInfoModal from "../components/LeaderInfoModal.js";
import Loading from "../components/Loading.js";
import Login from "../components/Login.js";
import Header from "../components/Header.js";

const smVariant = { navigation: 'drawer', navigationButton: true }
const mdVariant = { navigation: 'sidebar', navigationButton: false }

function Leaderboard() {
  const [allUsers, setAllUsers] = useState([]);
  const [result, setResult] = useState([]);
  const [boards, setBoards] = useState([]);
  const [boardNames, setBoardNames] = useState([]);
  const [boardIDs, setBoardIDs] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const [currentBoard, setCurrentBoard] = useState([]);
  const [boardUsers, setBoardUsers] = useState([]);
  const [code, setCode] = useState("");
  const [codeDisplayIsOpen, setCodeDisplayIsOpen] = useState(false);
   //Sidebar Open
   const [isSidebarOpen, setSidebarOpen] = useState(false)
   const variants = useBreakpointValue({ base: smVariant, md: mdVariant })
   const toggleSidebar = () => setSidebarOpen(!isSidebarOpen)

  const getUsers = async () => {
    const users = await API.graphql({ query: queries.listUsers });
    return users;
  };
  const getBoards = useCallback(async () => {
    let allBoards, email;
    const boards = await API.graphql({ query: queries.listLeaderboards })
      .catch(console.error)
      .then((boards) => {
        allBoards = boards.data.listLeaderboards.items;
        allBoards = allBoards.filter((board) =>
          board.users.includes(Auth.user.attributes.email)
        );
        setBoards(allBoards);
        email = Auth.user.attributes.email;
        if (allBoards.length > 0) {
          let boardNames = [];
          let boardID = [];
          for (var i = 0; i < allBoards.length; i++) {
            if (allBoards[i].users.includes(email)) {
              boardNames.push(allBoards[i].name);
              boardID.push(allBoards[i].id);
            }
          }
          setBoardNames(boardNames);
          setBoardIDs(boardID);
          let list = allBoards[0].users;
          list = list.sort(
            (a, b) => parseFloat(a.bettingscore) - parseFloat(b.bettingscore)
          );
          setCurrentBoard(list);
          setCode(allBoards[0].id);
        }
        getUsers()
          .catch(console.error)
          .then((users) => {
            users = users.data.listUsers.items;
            setAllUsers(users);
            let currentUser = users.find((x) => x.email == email);
            let boardUserList = [];
            let board = allBoards[0].users;
            for (var i = 0; i < board.length; i++) {
              boardUserList.push(users.find((user) => user.email == board[i]));
            }
            setBoardUsers(boardUserList);
            setCurrentUser(currentUser);
          });
      });
  });

  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const checkLogin = async () => {
    
    try {
      const data = await Auth.currentAuthenticatedUser()
      .then((res) => {
        console.log(res)
        setIsAuthenticated(true);
      })
    } catch {
      // User not logged in
      setIsAuthenticated(false)
      
    }
  }
  useEffect(()=>{
    checkLogin();
  })


  useEffect(() => {
    getBoards()
    .then(() => {
      setIsLoading(false);
    })
    .catch(console.error);
    
  }, []);

  const handleCurrentBoard = (e) => {
    let ID = e.target.value;
    setCode(ID);
    for (var i = 0; i < boards.length; i++) {
      if (boards[i].id == ID) {
        let list = boards[i].users;
        list = list.sort((a, b) => a.bettingscore - b.bettingscore);
        setCurrentBoard(list);
        break;
      }
    }
    let board = boards[i].users;
    let boardUserList = [];
    for (var i = 0; i < board.length; i++) {
      boardUserList.push(allUsers.find((user) => user.email == board[i]));
    }
    setBoardUsers(boardUserList);
  };

  return (
    (isLoading ? (<Loading/>) : 
    (isAuthenticated ? (
    <>
    <Sidebar variant={variants?.navigation}
      isOpen={isSidebarOpen}
      onClose={toggleSidebar} user={currentUser} />
    <Box ml={!variants?.navigationButton && 250}>
      <Header
        showSidebarButton={variants?.navigationButton}
        onShowSidebar={toggleSidebar}
        user={currentUser}
        page="Leaderboard"
      />
      <GridItem  bg="#F7F8FC" >
        <div
          style={{
            marginLeft: "5%"
          }}
        >
          <Flex>
            <FormControl
              style={{ border: "black", maxWidth: "40%", marginBottom:"2%", color: "black" }}
            >
              <Select onChange={handleCurrentBoard} variant="filled">
                {boardNames.map((name, index) => (
                  <option key={index} value={boardIDs[index]}>
                    {name}
                  </option>
                ))}
              </Select>
            </FormControl>
            <div style={{margin:"10px"}}></div>
            <Button
              colorScheme="green"
              disabled={code == ""}
              style={{ backgroundColor: "green", color: "white" }}
              onClick={() => {
                if (code != "") {
                  setCodeDisplayIsOpen(true);
                }
              }}
            >
              View Join Code
            </Button>
          </Flex>
        
        <div
          id="scrollableDiv2"
          style={{
            overflow: "auto",
            height: "75vh",
            display: "flex",
            flexDirection: "column",
            boxSizing: "border-box",
            overflowX: "hidden",
          }}
        >
          <InfiniteScroll
            dataLength={boardUsers.length}
            hasMore={false}
            loader={<h4>Loading...</h4>}
            scrollableTarget="scrollableDiv2"
            style={{ boxSizing: "border-box", overflowX: "hidden" }}
          >
            {currentBoard == null ? (
              <></>
            ) : (
              <TableContainer
                style={{
                  backgroundColor: "white",
                }}
                maxWidth="90%"
              >
                <Table variant="striped">
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
                      <Tr key={index}>
                        <Td>{currentBoard[index]}</Td>
                        <Td>{user.trustscore}</Td>
                        <Td>{user.name}</Td>
                        <Td>{user.bettingscore}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            )}
          </InfiniteScroll>
        </div>
        </div>
        <Row style={{ textAlign: "right" }}>
                <Button
                  colorScheme="black"
                  variant="ghost"
                  rightIcon={<RepeatIcon />}
                  onClick={() => {
                    getBoards().catch(console.error);
                  }}
                >
                  Refresh
                </Button>
        </Row>
      </GridItem>
      </Box>

      <LeaderInfoModal
        isOpen={codeDisplayIsOpen}
        setIsOpen={setCodeDisplayIsOpen}
        code={code}
        setCode={setCode}
      />
    </>) : (<Login setIsAuthenticated={setIsAuthenticated}/>))))
}

export default Leaderboard;
