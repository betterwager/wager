//React Imports
import React, { useEffect, useCallback, useMemo } from "react";
import { useState } from "react";

//Styling Imports

import "@aws-amplify/ui-react/styles.css";
import {
  useToast,
  Grid,
  SimpleGrid,
  Modal,
  NumberInput,
  NumberInputField,
  Select,
  Flex,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  ModalOverlay,
  Box,
  FormControl,
  FormLabel,
  Input,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useBreakpointValue,
  GridItem,
  Button,
  Text,
} from "@chakra-ui/react";
import { Card, Row, Col, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { RepeatIcon } from "@chakra-ui/icons";
import InfiniteScroll from "react-infinite-scroll-component";
import { QRCodeCanvas } from "qrcode.react";

//Web3 Imports
import {
  Keypair,
  Connection,
  TransactionInstruction,
  Transaction,
  PublicKey,
} from "@solana/web3.js";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import * as BufferLayout from "@solana/buffer-layout";
import { Buffer } from "buffer";

//AWS Imports
import * as queries from "../graphql/queries";
import * as mutations from "../graphql/mutations";
import * as subscriptions from "../graphql/subscriptions";
import { Auth, API } from "aws-amplify";
import { withAuthenticator } from "@aws-amplify/ui-react";
import uniqueHash from "unique-hash";
import { ConsoleLogger } from "@aws-amplify/core";

//Internal Imports
import Sidebar from "../components/Sidebar.js";
import Login from "../components/Login.js";
import Header from "../components/Header.js";
import {
  MakeBetInstruction,
  VoteInstruction,
  PayoutInstruction,
} from "../utils/utils.js";
import MakeBetModal from "../components/MakeBetModal";
import BetInfoModal from "../components/BetInfoModal";
import BetDisplayCards from "../components/BetDisplayCards";
import WalletEntryModal from "../components/WalletEntryModal";
import Loading from "../components/Loading";
import Temp from "../components/Temp";
import { getUserProfilePicture } from "../utils/utils";
import { Magic } from "magic-sdk";

import { SolanaExtension } from "@magic-ext/solana";
import {web3, WagerFactory, Wager, magic} from "../utils/globals.js";

const smVariant = { navigation: "drawer", navigationButton: true };
const mdVariant = { navigation: "sidebar", navigationButton: false };



function Dashboard() {
  //AWS Object of User
  const [currentUser, setCurrentUser] = useState({});
  //Retrieved Web3 Bets for User
  const [allUserBets, setUserBets] = useState([]);
  //Current Wagered Bet
  const [currentBet, setCurrentBet] = useState({});

  //Join Code for entering a new Bet
  const [joinCode, setJoinCode] = useState("");
  //Open Betting Modal
  const [betIsOpen, setBetIsOpen] = useState(false);
  //Success Toasts
  const toast = useToast();
  //Options for the selected bet
  const [currentOptions, setCurrentOptions] = useState([]);
  //Bet Information Modal
  const [codeDisplayIsOpen, setCodeDisplayIsOpen] = useState(false);
  //Bet Information Display Current
  const [code, setCode] = useState("");
  //Voting Option Selected
  const [voteOption, setVoteOption] = useState("");
  //Voting Index Selected
  const [voteIndex, setVoteIndex] = useState(0);
  //Voted Bet
  const [currentBetIndex, setCurrentBetIndex] = useState(0);

  //Sidebar Open
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const variants = useBreakpointValue({ base: smVariant, md: mdVariant });
  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const [walletIsOpen, setWalletIsOpen] = useState(false);


  const [isLoading, setIsLoading] = useState(true);


  //Contract Information

  const userUpdate = async (newUser) => {
    const promise = await API.graphql({
      query: mutations.updateUser,
      variables: { input: newUser },
    });
    return promise;
  };

  const submitOption = async () => {
    if (voteOption == "") {
      toast({
        title: "Enter Vote",
        description: "Please choose a Voting option",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    } else {
      let optionChose = voteOption;
      let index = currentBetIndex;
      let votedIndex = voteIndex;
      let betCode = ""

      let betID = allUserBets[index].bet_identifier;

      try {
        await WagerFactory.methods.vote(betCode, optionChose).send({ from: magicUser.address })
        .then(() => {
          toast({
            title: "Voting Success!",
            description: "You voted for: " + optionChose,
            status: "success",
            duration: 9000,
            isClosable: true,
          });
        })
      } catch (error) {
        toast({
          title: "Voting Failed",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    }
  };

  const handlePayout = async () => {
  };

  

  const getBets = useCallback(async () => {
    if (magicUser.address == null) {
      setUserBets([]);
    } else {
      const fromAddress = (await web3.eth.getAccounts())[0];
      await WagerFactory.methods.getUserWagers().call({ from: fromAddress})
      .then((res) => {
        let userWagers = [];
        res.forEach(wager => {
          let newWager = {
            creator: wager.creator,
            name: wager.name,
            state: wager.state,
            minBet: wager.minBet,
            maxBet: wager.maxBet,
            minPlayers: wager.minPlayers,
            maxPlayers: wager.maxPlayers,
            outcomes: wager.outcomes,
            bettingEndTime: wager.bettingEndTime,
            participants: wager.participants,
            bets: wager.bets,
            votes: wager.votes
          }
          userWagers.push(newWager);
        });
        setUserBets(userWagers);
      })
    }
    //let news;
    //console.log(String.fromCharCode.apply(String, allBets[0].options[0].name))
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const selectOption = (e, betIndex) => {
    let list = e.target.value.split("@&@");
    setVoteOption(list[0]);
    setVoteIndex(parseInt(list[1]));
    setCurrentBetIndex(betIndex);
  };

  const getUser = async (phoneNumber) => {
    const user = await API.graphql({
      query: queries.getUser,
      variables: {
        id: uniqueHash(phoneNumber.substring(1)),
      },
    });
    return user;
  };

  const [magicUser, setMagicUser] = useState({});
  const [profilePictureURL, setProfilePictureURL] = useState("");
  
  const [boardNames, setBoardNames] = useState([]);
  const [boardIDs, setBoardIDs] = useState([]);

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
                      setCurrentUser(res.data.getUser);
                      getBets(magicUser.address).catch(console.error);
                      let url = getUserProfilePicture(res.data.getUser.phonenumber)
                          setProfilePictureURL(url);
                          console.log(url);
                      console.log(res);
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
                      setIsLoading(false);
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

  // useEffect(() => {

  // }, [getBets]); // eslint-disable-line react-hooks/exhaustive-deps
  // /* useEffect(() => {
  // }, [getBets,publicKey]); */
  // //getBets(publicKey).catch(console.error);

  return isLoading ? (
    <Loading />
  ) : (
    <div style={{ overflow: "hidden" }}>
      <Sidebar
        magicUser={magicUser}
        variant={variants.navigation}
        isOpen={isSidebarOpen}
        onClose={toggleSidebar}
        boardIDs={boardIDs}
        setBoardIDs={setBoardIDs}
        refresh={getBets}
        user={currentUser}
        walletIsOpen={walletIsOpen}
        setWalletIsOpen={setWalletIsOpen}
      />
      <Box
        ml={!variants.navigationButton && 250}
        bg="#F7F8FC"
        style={{ height: "100vh" }}
      >
        <Header
          showSidebarButton={variants.navigationButton}
          onShowSidebar={toggleSidebar}
          toast={toast}
          page="Dashboard"
          user={currentUser}
          setUser={setCurrentUser}
          boardIDs={boardIDs}
          setBoardIDs={setBoardIDs}
          walletIsOpen={walletIsOpen}
          setWalletIsOpen={setWalletIsOpen}
          profilePictureURL={profilePictureURL}
          setProfilePictureURL={setProfilePictureURL}
        />
        <Container>
          <Box display={"flex"} justifyContent={"space-evenly"}>
            <Box
              height={140}
              width={240}
              border={"1px"}
              _hover={{
                borderColor: "accentColor",
                color: "accentColor",
                boxShadow: "xl",
              }}
              borderColor="#DFE0EB"
              boxShadow={"sm"}
              backgroundColor={"#fff"}
              borderRadius={20}
              display={"flex"}
              flexDirection={"column"}
              alignItems={"center"}
              justifyContent={"center"}
            >
              <Text align={"center"} fontWeight={700} fontSize={"xl"}>
                Earnings
              </Text>
              {currentUser == null ? (
                <Text align={"center"} fontWeight={700} fontSize={"2xl"}>
                  $0
                </Text>
              ) : (
                <Text align={"center"} fontWeight={700} fontSize={"2xl"}>
                  ${currentUser.bettingscore}
                </Text>
              )}
            </Box>
            <Box
              height={140}
              width={240}
              border={"1px"}
              _hover={{
                borderColor: "accentColor",
                color: "accentColor",
                boxShadow: "xl",
              }}
              borderColor="#DFE0EB"
              boxShadow={"sm"}
              backgroundColor={"#fff"}
              borderRadius={20}
              display={"flex"}
              flexDirection={"column"}
              alignItems={"center"}
              justifyContent={"center"}
            >
              <Text align={"center"} fontWeight={700} fontSize={"xl"}>
                Active Bets
              </Text>

              <Text align={"center"} fontWeight={700} fontSize={"2xl"}>
                {allUserBets.length}
              </Text>
            </Box>
            <Box
              height={140}
              width={240}
              border={"1px"}
              _hover={{
                borderColor: "accentColor",
                color: "accentColor",
                boxShadow: "xl",
              }}
              borderColor="#DFE0EB"
              boxShadow={"sm"}
              backgroundColor={"#fff"}
              borderRadius={20}
              display={"flex"}
              flexDirection={"column"}
              alignItems={"center"}
              justifyContent={"center"}
            >
              <Text align={"center"} fontWeight={700} fontSize={"xl"}>
                Voting
              </Text>

              <Text align={"center"} fontWeight={700} fontSize={"2xl"}>
                {allUserBets.filter((obj) => obj.state === 2).length}
              </Text>
            </Box>
            <Box
              height={140}
              width={240}
              border={"1px"}
              _hover={{
                borderColor: "accentColor",
                color: "accentColor",
                boxShadow: "xl",
              }}
              borderColor="#DFE0EB"
              boxShadow={"sm"}
              backgroundColor={"#fff"}
              borderRadius={20}
              display={"flex"}
              flexDirection={"column"}
              alignItems={"center"}
              justifyContent={"center"}
            >
              <Text align={"center"} fontWeight={700} fontSize={"xl"}>
                Closed Bets
              </Text>

              <Text align={"center"} fontWeight={700} fontSize={"2xl"}>
                {allUserBets.filter((obj) => obj.state === 3).length}
              </Text>
            </Box>
          </Box>

          <div
            id="scrollableDiv"
            style={{
              height: "75vh",
              overflow: "auto",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <InfiniteScroll
              dataLength={allUserBets.length}
              hasMore={false}
              loader={<h4>Loading...</h4>}
              scrollableTarget="scrollableDiv"
              endMessage={
                <Row style={{ textAlign: "right" }}>
                  <Button
                    colorScheme="black"
                    variant="ghost"
                    rightIcon={<RepeatIcon />}
                    onClick={() => {
                      if (magicUser.address == null) {
                        setWalletIsOpen(true);
                        getBets(null);
                      } else {
                        getBets(magicUser.address);
                      }
                    }}
                    style={{ marginBottom: "100px" }}
                  >
                    Refresh
                  </Button>
                </Row>
              }
              style={{ boxSizing: "border-box", overflowX: "hidden" }}
            >
              <MakeBetModal
                getBets={getBets}
                toast={toast}
                isOpen={betIsOpen}
                magicUser={magicUser}
                setIsOpen={setBetIsOpen}
                currentBet={currentBet}
                currentOptions={currentOptions}
                joinCode={joinCode}
                setJoinCode={setJoinCode}
              />

              {allUserBets.map((bet, index) => {
                return (
                  <BetDisplayCards
                    key={index}
                    setCurrentBet={setCurrentBet}
                    selectOption={selectOption}
                    state={bet.state}
                    code={code}
                    toast={toast}
                    magicUser={magicUser}
                    setCode={setCode}
                    joinCode={joinCode}
                    setJoinCode={setJoinCode}
                    allUserBets={allUserBets}
                    codeDisplayIsOpen={codeDisplayIsOpen}
                    setCodeDisplayIsOpen={setCodeDisplayIsOpen}
                    bet={bet}
                    betIsOpen={betIsOpen}
                    setBetIsOpen={setBetIsOpen}
                    handlePayout={handlePayout}
                    submitOption={submitOption}
                    index={index}
                    getBets={getBets}
                    currentBet={currentBet}
                    setCurrentOptions={setCurrentOptions}
                    currentOptions={currentOptions}
                  />
                );
              })}
            </InfiniteScroll>
          </div>
        </Container>
      </Box>
      <BetInfoModal
        isOpen={codeDisplayIsOpen}
        setIsOpen={setCodeDisplayIsOpen}
        code={code}
        setCode={setCode}
      />

      <WalletEntryModal
        publicKey={magicUser.address}
        toast={toast}
        isOpen={walletIsOpen}
        setIsOpen={setWalletIsOpen}
      />
    </div>
  );
}

export default Dashboard;
