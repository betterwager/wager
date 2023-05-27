import React, { useState, useCallback, useEffect } from "react";
import {useNavigate} from "react-router-dom";
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
import uniqueHash from "unique-hash"
import LeaderInfoModal from "../components/LeaderInfoModal.js";
import Loading from "../components/Loading.js";
import Login from "../components/Login.js";
import Header from "../components/Header.js";
import { magic } from "../utils/globals.js";
import Temp from "../components/Temp.js";

const smVariant = { navigation: 'drawer', navigationButton: true }
const mdVariant = { navigation: 'sidebar', navigationButton: false }

function Leaderboard() {
  const [allUsers, setAllUsers] = useState([]);
  const [result, setResult] = useState([]);
  const [boards, setBoards] = useState([]);
  const [boardNames, setBoardNames] = useState([]);
  const [boardIDs, setBoardIDs] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const [currentBoard, setCurrentBoard] = useState(0);
  const [boardUsers, setBoardUsers] = useState([]);
  const [code, setCode] = useState("");
  const [codeDisplayIsOpen, setCodeDisplayIsOpen] = useState(false);

   //Sidebar Open
   const [isSidebarOpen, setSidebarOpen] = useState(false)
   const variants = useBreakpointValue({ base: smVariant, md: mdVariant })
   const toggleSidebar = () => setSidebarOpen(!isSidebarOpen)




  const getBoardUsers = async (boardid) => {
    console.log(boardid)
    const res = await API.graphql({ 
      query: queries.getLeaderboard,
      variables: {
          id: boardid
      }
      })
    .then((res) => {
      let boardusers = res.data.getLeaderboard.users.items.map(user => user.user)
      boardusers = boardusers.sort((a, b) => a.bettingscore - b.bettingscore);
      setBoardUsers(boardusers);
    })
  };

  
  const [isLoading, setIsLoading] = useState(true);
  


  const getUser = async () => {
    if (magicUser != null){
      const user = await API.graphql({ 
        query: queries.getUser,
        variables: {
            id: uniqueHash(magicUser.phoneNumber.substring(1))
        }
        })
      return user;
    }

  };

  const [magicUser, setMagicUser] = useState({})


  const navigate = useNavigate()
  useEffect(() => {
    Auth.currentUserCredentials()
    .catch((e) => {
      console.log("=== currentcredentials", { e });
    });
  Auth.currentAuthenticatedUser()
    .then((user) => {
      magic.user
        .isLoggedIn()
        .then((isLoggedIn) => {
          return isLoggedIn
            ? magic.user
                .getMetadata()
                .then((userData) =>
                {
                  setMagicUser({ ...userData, identityId: user.id });
                  setIsLoading(false);
                  console.log({ ...userData, identityId: user.id })
                })
            : setMagicUser({ user: null }) && navigate("/login");
        })
        .catch((e) => {
          console.log("currentUser", { e });
        });
    })
    .catch((e) => {
      setMagicUser({ user: null });
      navigate("/login")
    });

    getUser()
      .catch(console.error)
      .then((res) => {
        console.log(res);
        setCurrentUser(res.data.getUser);
        let userBoards = res.data.getUser.leaderboards.items
        console.log(userBoards)
        let boardnames = userBoards.map(board => board.leaderboard.name); 
        console.log(boardnames)
        setBoardNames(boardnames);
        let boardids = userBoards.map(board => board.leaderboard.id);
        setBoardIDs(boardids);
        if (boardids && boardids.length > 0){
          getBoardUsers(boardids[0])
          .then((res) => {
            setIsLoading(false);
          })
        }else{
          setIsLoading(false)
        }
      });
  },[])

  

  const handleCurrentBoard = (e) => {
    let index = e.target.value;
    setCode(boardIDs[index]);
    setCurrentBoard(index)
    getBoardUsers(boardIDs[index])
    .then(() => {

    })
  };

  return (
    (isLoading ? (<Loading/>) : 
    <div style= {{overflow:"hidden"}}>
    <Sidebar variant={variants?.navigation}
      isOpen={isSidebarOpen}
      onClose={toggleSidebar} user={currentUser} magicUser = {magicUser}/>
    <Box ml={!variants?.navigationButton && 250}  bg="#FFFFFF" style = {{display: "flex", flexFlow: "column", height: "100vh"}}>
      <Header
        showSidebarButton={variants?.navigationButton}
        onShowSidebar={toggleSidebar}
        user={currentUser}
        boardIDs={boardIDs}
        setBoardIDs={setBoardIDs}
        page="Leaderboard"
      />
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
                  <option key={index} value={index}>
                    {name}
                  </option>
                ))}
              </Select>
            </FormControl>
            <div style={{margin:"10px"}}></div>
            <Button
              // colorScheme="green"
              disabled={code == ""}
              backgroundColor="primaryColor"
              color="buttonTextColor"
              // style={{ backgroundColor: "#702963", color: "white" }}
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
            overflowX: "hidden"
          }}
        >
          <InfiniteScroll
            dataLength={boardUsers.length}
            hasMore={false}
            loader={<h4>Loading...</h4>}
            scrollableTarget="scrollableDiv2"
            style={{ boxSizing: "border-box", overflowX: "hidden" }}
            endMessage={<Row style={{ textAlign: "right" }}>
            <Button
              colorScheme="black"
              variant="ghost"
              rightIcon={<RepeatIcon />}
              onClick={() => {
                getBoardUsers(boardIDs[currentBoard]).catch(console.error);
              }}
            >
              Refresh
            </Button>
    </Row>}
          >
            {boardUsers == null ? (
              <></>
            ) : (
              <TableContainer
                style={{
                  backgroundColor: "white",
                  borderRadius: 10,
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
                        <Td>{user.phonenumber}</Td>
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
        
      </Box>

      <LeaderInfoModal
        isOpen={codeDisplayIsOpen}
        setIsOpen={setCodeDisplayIsOpen}
        code={code}
        setCode={setCode}
      />
    </div>
    ) )
}

export default Leaderboard;
