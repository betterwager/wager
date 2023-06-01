import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  Text,
  useToast,
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
  Avatar,
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
import uniqueHash from "unique-hash";
import LeaderInfoModal from "../components/LeaderInfoModal.js";
import Loading from "../components/Loading.js";
import Login from "../components/Login.js";
import Header from "../components/Header.js";
import { magic } from "../utils/globals.js";
import { getUserProfilePicture } from "../utils/utils.js";
import AccountInfoModal from "../components/AccountInfoModal.js";
import Temp from "../components/Temp.js";
import {
  Keypair,
  Connection,
  TransactionInstruction,
  Transaction,
  PublicKey,
} from "@solana/web3.js";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import * as BufferLayout from "@solana/buffer-layout";
import { FaTrophy } from 'react-icons/fa';

const smVariant = { navigation: "drawer", navigationButton: true };
const mdVariant = { navigation: "sidebar", navigationButton: false };

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
  
  const [profilePictureURL, setProfilePictureURL] = useState("");
  const [accIsOpen, setAccIsOpen] = useState(false);
  const [accUser, setAccUser] = useState({});

  //Sidebar Open
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const variants = useBreakpointValue({ base: smVariant, md: mdVariant });
  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const getBoardUsers = async (boardid) => {
    console.log(boardid);
    const res = await API.graphql({
      query: queries.getLeaderboard,
      variables: {
        id: boardid,
      },
    }).then((res) => {
      let boardusers = res.data.getLeaderboard.users.items.map(
        (user) => user.user
      );
      boardusers = boardusers.sort((a, b) => a.bettingscore - b.bettingscore);
      setBoardUsers(boardusers);
    });
  };

  const [isLoading, setIsLoading] = useState(true);

  const [allUserBets, setUserBets] = useState([]);
  const [betAddresses, setBetAddresses] = useState([]);
  const [playerAccountInfo, setPlayerAccountInfo] = useState([]);
  const toast=useToast();


  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const systemProgram = new PublicKey("11111111111111111111111111111111");
  const rentSysvar = new PublicKey(
    "SysvarRent111111111111111111111111111111111"
  );
  const programId = useMemo(
    () => new PublicKey("GvtuZ3JAXJ29cU3CE5AW24uoHc2zAgrPaMGcFT4WMcrm"),
    []
  );

  const wagerLayout = BufferLayout.struct([
    BufferLayout.seq(BufferLayout.u8(), 20, "bet_identifier"),
    BufferLayout.nu64("balance"),
    BufferLayout.seq(
      BufferLayout.struct([
        BufferLayout.seq(BufferLayout.u8(), 20, "name"),
        BufferLayout.u8("bet_count"),
        BufferLayout.u8("vote_count"),
        BufferLayout.nu64("bet_total"),
      ]),
      8,
      "options"
    ),
    BufferLayout.nu64("min_bet"),
    BufferLayout.nu64("max_bet"),
    BufferLayout.u8("min_players"),
    BufferLayout.u8("max_players"),
    BufferLayout.u8("player_count"),
    BufferLayout.nu64("time"),
    BufferLayout.u8("vote_count"),
    BufferLayout.u8("winner_index"),
    BufferLayout.u8("bump_seed"),
    BufferLayout.u8("state"),
  ]);

  const playerLayout = BufferLayout.struct([
    BufferLayout.u8("option_index"),
    BufferLayout.nu64("bet_amount"),
    BufferLayout.u8("voted"),
    BufferLayout.u8("bump_seed"),
  ]);

  const getUser = async (phoneNumber) => {
    const user = await API.graphql({
      query: queries.getUser,
      variables: {
        id: uniqueHash(phoneNumber.substring(1)),
      },
    });
    return user;
  };

  const getBets = useCallback(async () => {
    if (publicKey == null) {
      setBetAddresses([]);
      setPlayerAccountInfo([]);
      setUserBets([]);
    } else {
      let tempAddress = {};
      let tempBet = {};
      let allBetAddresses = [];
      let allBets = [];
      let allPlayerAccounts = [];
      let tempBets = await connection.getParsedProgramAccounts(programId, {
        filters: [
          {
            dataSize: 299,
          },
        ],
      });
      tempBets.forEach(async function (accountInfo, index) {
        tempBet = wagerLayout.decode(accountInfo.account.data);
        tempAddress = PublicKey.findProgramAddressSync(
          [tempBet.bet_identifier, publicKey.toBytes()],
          programId
        ); //{
        console.log(tempAddress[0]);
        await connection
          .getAccountInfo(tempAddress[0])
          .then((playerAccountInfo) => {
            console.log(playerAccountInfo);
            if (playerAccountInfo !== null) {
              console.log("Success!");
              allBetAddresses.push(accountInfo.pubkey);
              allBets.push(wagerLayout.decode(accountInfo.account.data));
              allPlayerAccounts.push(
                playerLayout.decode(playerAccountInfo.data)
              );
            }
          });
        if (index === tempBets.length - 1) {
          console.log(allBets);
          console.log(allBetAddresses);
          console.log(allPlayerAccounts);
          setBetAddresses(allBetAddresses);
          setUserBets(allBets);
          setPlayerAccountInfo(allPlayerAccounts);
        }
      });
    }
    //let news;
    //console.log(String.fromCharCode.apply(String, allBets[0].options[0].name))
  }, [publicKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const [magicUser, setMagicUser] = useState({});

  const navigate = useNavigate();
  useEffect(() => {
    Auth.currentUserCredentials().catch((e) => {
      console.log("=== currentcredentials", { e });
    });
    Auth.currentAuthenticatedUser()
      .then((user) => {
        magic.user
          .isLoggedIn()
          .then((isLoggedIn) => {
            return isLoggedIn
              ? magic.user.getMetadata().then((userData) => {
                  setMagicUser({ ...userData, identityId: user.id });
                  console.log({ ...userData, identityId: user.id });
                  getUser(userData.phoneNumber)
                    .catch(console.error)
                    .then((res) => {
                      console.log(res);
                      setCurrentUser(res.data.getUser);
                      let url = getUserProfilePicture(res.data.getUser.phonenumber)
                        setProfilePictureURL(url);
                        console.log(url);
                      
                      let userBoards = res.data.getUser.leaderboards.items;
                      console.log(userBoards);
                      let boardnames = userBoards.map(
                        (board) => board.leaderboard.name
                      );
                      console.log(boardnames);
                      setBoardNames(boardnames);
                      let boardids = userBoards.map(
                        (board) => board.leaderboard.id
                      );
                      setBoardIDs(boardids);
                      if (boardids && boardids.length > 0) {
                        getBoardUsers(boardids[0]).then((res) => {
                          setIsLoading(false);
                        });
                      } else {
                        setIsLoading(false);
                      }
                    });
                })
              : setMagicUser({ user: null }) && navigate("/login");
          })
          .catch((e) => {
            console.log("currentUser", { e });
          });
      })
      .catch((e) => {
        setMagicUser({ user: null });
        navigate("/login");
      });
  }, []);

  const handleCurrentBoard = (e) => {
    let index = e.target.value;
    setCode(boardIDs[index]);
    setCurrentBoard(index);
    getBoardUsers(boardIDs[index]).then(() => {});
  };

  return isLoading ? (
    <Loading />
  ) : (
    <div style={{ overflow: "hidden" }}>
      <Sidebar
        magicUser={magicUser}
        variant={variants?.navigation}
        boardIDs={boardIDs}
        setBoardIDs={setBoardIDs}
        isOpen={isSidebarOpen}
        refresh={getBets}
        onClose={toggleSidebar}
        user={currentUser}
      />
      <Box
        ml={!variants?.navigationButton && 250}
        bg="#F7F8FC"
        style={{ display: "flex", flexFlow: "column", height: "100vh" }}
      >
        <Header
          showSidebarButton={variants?.navigationButton}
          onShowSidebar={toggleSidebar}
          setUser={setCurrentUser}
          user={currentUser}
          toast={toast}
          boardIDs={boardIDs}
          setBoardIDs={setBoardIDs}
          page="Leaderboard"
          profilePictureURL={profilePictureURL}
          setProfilePictureURL={setProfilePictureURL}
        />
        <div
          style={{
            marginLeft: "5%",
          }}
        >
          <Flex>
            <FormControl
              style={{
                border: "black",
                maxWidth: "40%",
                marginBottom: "2%",
                color: "black",
              }}
            >
              <Select onChange={handleCurrentBoard} variant="filled">
                {boardNames.map((name, index) => (
                  <option key={index} value={index}>
                    {name}
                  </option>
                ))}
              </Select>
            </FormControl>
            <div style={{ margin: "10px" }}></div>
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
              overflowX: "hidden",
            }}
          >
            <InfiniteScroll
              dataLength={boardUsers.length}
              hasMore={false}
              loader={<h4>Loading...</h4>}
              scrollableTarget="scrollableDiv2"
              style={{ boxSizing: "border-box", overflowX: "hidden" }}
              endMessage={
                <Row style={{ textAlign: "right" }}>
                  <Button
                    colorScheme="black"
                    variant="ghost"
                    rightIcon={<RepeatIcon />}
                    onClick={() => {
                      getBoardUsers(boardIDs[currentBoard]).catch(
                        console.error
                      );
                    }}
                  >
                    Refresh
                  </Button>
                </Row>
              }
            >
                        <Box
                        marginBottom="1rem"
                        boxShadow={"sm"}
                      >
                        <Box p={3}>
                        <Box
                          display="flex"
                          flexDirection={"row"}
                          justifyContent={"space-between"}
                          alignItems={"center"}
                        >
                           <Box
                            width="25%"
                            display="flex"
                            flexDirection={"column"}
                            alignItems={"flex-start"}
                            ml={3}
                          >
                            <Text fontSize="md" fontWeight={700} color="black">
                              Rank
                            </Text>
                          </Box>
                          <Box
                            width="50%"
                            display="flex"
                            flexDirection={"column"}
                            alignItems={"flex-start"}
                            ml={3}
                          >
                          </Box>
    
                          <Box width="25%" display="flex" justifyContent="flex-end">
                          
                          <Text fontSize="md" fontWeight={700} color="black">
                              Bet Score
                            </Text>
                          </Box>
                          </Box>
                        </Box>
                      </Box>

              {boardUsers == null ? (
                <></>
              ) : (
                      boardUsers.map((user, index) => (
                        <Box
                        onClick={() => {
                          setAccUser(user)
                          setAccIsOpen(true)}
                        }
                        marginTop="1rem"
                        marginBottom="1rem"
                        border="solid"
                        borderWidth="1px"
                        borderColor="#DFE0EB"
                        borderRadius={8}
                        backgroundColor="#fff"
                        boxShadow={"sm"}
                        _hover={{
                          border: "1px",
                          borderColor: "primaryColor",
                          boxShadow: "xl",
                        }}
                      >
                        <Box p={5}>
                        <Box
                          display="flex"
                          flexDirection={"row"}
                          justifyContent={"space-between"}
                          alignItems={"center"}
                        >
                           <Box
                            width="5%"
                            display="flex"
                            flexDirection={"column"}
                            alignItems={"flex-start"}
                            ml={3}
                          >
                            <Box display="flex" gap={2}>
                              <Text fontSize="4xl" fontWeight={700} color={index == 0 ? "gold" : (index == 1 ? "silver" : "brown")}>
                                {index + 1}
                              </Text>
                            </Box>
                          </Box>
                          
                          
                          <Box
                            width="15%"
                            display="flex"
                            flexDirection={"column"}
                            alignItems={"flex-start"}
                            ml={3}
                          >
                            <Avatar size="lg" src={getUserProfilePicture(user.phonenumber)}/>
                          </Box>
                          <Box
                            width="45%"
                            display="flex"
                            flexDirection={"column"}
                            alignItems={"flex-start"}
                            ml={3}
                          >
                            <Box display="flex" gap={5} style={{alignItems:"center"}}>
                              <Text fontSize="xl" fontWeight={700} >
                                {user.name}
                              </Text>
                            </Box>
                          </Box>
    
                          <Box width="15%" display="flex" justifyContent="flex-end">
                          <Box display="flex" gap={2}>
                              <Text fontSize="xl" fontWeight={700}>
                                {user.bettingscore}
                              </Text>
                            </Box>
                          </Box>
                        </Box>
    
                      </Box>
                      </Box>
                      ))
              )}

            <AccountInfoModal
                user={accUser}
                isOpen={accIsOpen}
                setIsOpen={setAccIsOpen}
                URL={getUserProfilePicture(currentUser.phonenumber)}
                self={false}
              />

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
  );
}

export default Leaderboard;
