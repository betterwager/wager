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
} from "@chakra-ui/react";
import { Card, Row, Col, Container } from "react-bootstrap";
import {useNavigate} from "react-router-dom"
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
import { Auth, API, a } from "aws-amplify";
import { withAuthenticator } from "@aws-amplify/ui-react";
import uniqueHash from "unique-hash";
import { ConsoleLogger } from "@aws-amplify/core";

//Internal Imports
import Sidebar from "../components/Sidebar.js";
import Login from "../components/Login.js";
import Header from "../components/Header.js"
import {
  MakeBetInstruction,
  VoteInstruction,
  PayoutInstruction,
  checkLogin,
} from "../utils/utils.js";
import MakeBetModal from "../components/MakeBetModal";
import BetInfoModal from "../components/BetInfoModal";
import BetDisplayCards from "../components/BetDisplayCards";
import WalletEntryModal from "../components/WalletEntryModal";
import Loading from "../components/Loading";

const smVariant = { navigation: 'drawer', navigationButton: true }
const mdVariant = { navigation: 'sidebar', navigationButton: false }

function Dashboard() {
  //AWS Object of User
  const [currentUser, setCurrentUser] = useState({});
  //Retrieved Web3 Bets for User
  const [allUserBets, setUserBets] = useState([]);
  //Current Wagered Bet
  const [currentBet, setCurrentBet] = useState({});

  //All User Bet Addresses for Display
  const [betAddresses, setBetAddresses] = useState([]);
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
  //User's actions on all bets
  const [playerAccountInfo, setPlayerAccountInfo] = useState([]);
  //Voting Option Selected
  const [voteOption, setVoteOption] = useState("");
  //Voting Index Selected
  const [voteIndex, setVoteIndex] = useState(0);
  //Voted Bet
  const [currentBetIndex, setCurrentBetIndex] = useState(0);

  //Sidebar Open
  const [isSidebarOpen, setSidebarOpen] = useState(false)
  const variants = useBreakpointValue({ base: smVariant, md: mdVariant })
  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen)

  const [walletIsOpen, setWalletIsOpen] = useState(false)

  //Vars
  /* let network = "https://api.devnet.solana.com";
  connection = new Connection(network);
  let provider = getProvider(); // see "Detecting the Provider" */

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

  useEffect(() => {
    setIsLoading(false);
  },[]);


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

  const getUsers = async () => {
    const users = await API.graphql({ query: queries.listUsers });
    return users;
  };


  const submitOption = async () => {
    if (voteOption == ""){
      toast({
        title: "Enter Vote",
        description: "Please choose a voting option",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    }else{
      let optionChose = voteOption;
      let index = currentBetIndex;
      let votedIndex = voteIndex;
  
      let betID = allUserBets[index].bet_identifier;
      //use bet id and option to process vote for user
      let potPDA = betAddresses[index];
  
      let [playerPDA, playerBump] = await PublicKey.findProgramAddress(
        [betID, publicKey.toBytes()],
        programId
      );
      //Make bet RPC Call(Send Transaction for Make Bet)
      let instruction = new TransactionInstruction({
        keys: [
          {
            pubkey: publicKey,
            isSigner: true,
            isWritable: true,
          },
          {
            pubkey: potPDA,
            isSigner: false,
            isWritable: true,
          },
          {
            pubkey: playerPDA,
            isSigner: false,
            isWritable: true,
          },
          {
            pubkey: systemProgram,
            isSigner: false,
            isWritable: false,
          },
          {
            pubkey: programId,
            isSigner: false,
            isWritable: false,
          },
        ],
        programId: programId,
        data: VoteInstruction(votedIndex),
      });
      const transaction = new Transaction().add(instruction);
      const {
        context: { slot: minContextSlot },
        value: { blockhash, lastValidBlockHeight },
      } = await connection.getLatestBlockhashAndContext();
      transaction.recentBlockhash = blockhash;
      console.log("blockhash retrieved");
      const signature = await sendTransaction(transaction, connection, {
        minContextSlot,
      });
      await connection.confirmTransaction({
        blockhash,
        lastValidBlockHeight,
        signature,
      });
      toast({
        title: "Voting Success!",
        description: "You voted for: " + optionChose,
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    }
    
  };

  const handlePayout = async () => {
    let index = currentBetIndex;
    let potPDA = betAddresses[index];
    let betID = allUserBets[index].bet_identifier;
    let [playerPDA, playerBump] = await PublicKey.findProgramAddress(
      [betID, publicKey.toBytes()],
      programId
    );
    //Make bet RPC Call(Send Transaction for Make Bet)
    let instruction = new TransactionInstruction({
      keys: [
        {
          pubkey: publicKey,
          isSigner: true,
          isWritable: true,
        },
        {
          pubkey: potPDA,
          isSigner: false,
          isWritable: true,
        },
        {
          pubkey: playerPDA,
          isSigner: false,
          isWritable: true,
        },
        {
          pubkey: systemProgram,
          isSigner: false,
          isWritable: false,
        },
      ],
      programId: programId,
      data: PayoutInstruction(),
    });
    const transaction = new Transaction().add(instruction);
    const {
      context: { slot: minContextSlot },
      value: { blockhash, lastValidBlockHeight },
    } = await connection.getLatestBlockhashAndContext();

    transaction.recentBlockhash = blockhash;
    console.log("blockhash retreived");
    const signature = await sendTransaction(transaction, connection, {
      minContextSlot,
    });
    await connection.confirmTransaction({
      blockhash,
      lastValidBlockHeight,
      signature,
    });
  };

  const getBets = useCallback(async () => {
    if (publicKey == null){
      setBetAddresses([]);
      setPlayerAccountInfo([])
      setUserBets([])
    }else{
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
              allPlayerAccounts.push(playerLayout.decode(playerAccountInfo.data));
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

  const selectOption = (e, betIndex) => {
    let list = e.target.value.split("@&@");
    setVoteOption(list[0]);
    setVoteIndex(parseInt(list[1]));
    setCurrentBetIndex(betIndex);
  };


  useEffect(() => {
    getUsers()
      .catch(console.error)
      .then((users) => {
        users = users.data.listUsers.items;
        let email = Auth.user.attributes.email;
        let user;
        for (var i = 0; i < users.length; i++) {
          if (users[i].email === email) {
            user = users[i];
            break;
          }
        }
        setCurrentUser(user);
        getBets(publicKey).catch(console.error);
      });
  }, [getBets]); // eslint-disable-line react-hooks/exhaustive-deps
  /* useEffect(() => {
  }, [getBets,publicKey]); */
  //getBets(publicKey).catch(console.error);

  return (

    (isLoading ? (<Loading/>) : 
    (isAuthenticated ? (
      <div style= {{overflow:"hidden"}}>
      <Sidebar variant={variants?.navigation}
        isOpen={isSidebarOpen}
        onClose={toggleSidebar} refresh={getBets} user={currentUser} />
      <Box ml={!variants?.navigationButton && 250} bg="#F7F8FC" style={{height: "100vh"}}>
        <Header
          showSidebarButton={variants?.navigationButton}
          onShowSidebar={toggleSidebar}
          toast={toast}
          page="Dashboard"
        />
        <Container>
          <Row
            xs={2}
            md={2}
            lg={4}
            className="g-4"
            style = {{marginLeft: "3%", marginRight: "3%"}}
          >
            <Col>
              <Card
                style={{
                  borderColor: "#1D5F50",
                  textAlign: "center",
                }}
              >
                <Card.Body>
                  <Card.Text style={{ color: "#888888" }}>Earnings</Card.Text>
                  <Card.Title>
                    {currentUser == null ? (
                      <strong>$0</strong>
                    ) : (
                      <strong>${currentUser.bettingscore}</strong>
                    )}
                  </Card.Title>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card
                style={{
                  borderColor: "#1D5F50",
                  textAlign: "center",
                }}
              >
                <Card.Body>
                  <Card.Text style={{ color: "#888888" }}>
                    Active Bets
                  </Card.Text>
                  <Card.Title>
                    <strong>{allUserBets.length}</strong>
                  </Card.Title>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card
                style={{
                  borderColor: "#1D5F50",
                  textAlign: "center",
                }}
              >
                <Card.Body>
                  <Card.Text style={{ color: "#888888" }}>Voting</Card.Text>
                  <Card.Title>
                    <strong>
                      {allUserBets.filter((obj) => obj.state === 2).length}
                    </strong>
                  </Card.Title>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card
                style={{
                  borderColor: "#1D5F50",
                  textAlign: "center",
                }}
              >
                <Card.Body>
                  <Card.Text style={{ color: "#888888" }}>
                    Closed Bets
                  </Card.Text>
                  <Card.Title>
                    <strong>
                      {allUserBets.filter((obj) => obj.state === 3).length}
                    </strong>
                  </Card.Title>
                </Card.Body>
              </Card>
            </Col>
          </Row>
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
              endMessage={<Row style={{ textAlign: "right" }}>
              <Button
                colorScheme="black"
                variant="ghost"
                rightIcon={<RepeatIcon />}
                onClick={() => {
                  if(publicKey==null){
                    setWalletIsOpen(true);
                    getBets(null);
                  }else{
                    getBets(publicKey);
                  }
                }}
                style = {{marginBottom:"100px"}}
              >
                Refresh
              </Button>
            </Row>}
              style={{ boxSizing: "border-box", overflowX: "hidden" }}
            >
              <MakeBetModal
                getBets={getBets}
                toast={toast}
                connection={connection}
                programId={programId}
                publicKey={publicKey}
                sendTransaction={sendTransaction}
                rentSysvar={rentSysvar}
                systemProgram={systemProgram}
                isOpen={betIsOpen}
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
                    setCode={setCode}
                    joinCode={joinCode}
                    setJoinCode={setJoinCode}
                    playerAccountInfo={playerAccountInfo}
                    allUserBets={allUserBets}
                    codeDisplayIsOpen={codeDisplayIsOpen}
                    setCodeDisplayIsOpen={setCodeDisplayIsOpen}
                    betAddresses={betAddresses}
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
    
    <WalletEntryModal publicKey={publicKey} toast={toast} isOpen={walletIsOpen} setIsOpen={setWalletIsOpen}/>
    </div>) : (<Login setIsAuthenticated={setIsAuthenticated}/>)
    )
    )
    )
    

}

export default Dashboard;
