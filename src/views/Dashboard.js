//React Imports
import React, { useEffect, useCallback, useMemo } from "react";
import { useState } from "react";

//Styling Imports
import "@aws-amplify/ui-react/styles.css";
import {
  useToast,
  Grid,
  Modal,
  NumberInput,
  NumberInputField,
  Select,
  Flex,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  ModalOverlay,
  FormControl,
  FormLabel,
  Input,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  GridItem,
  Button,
} from "@chakra-ui/react";
import { Card, Row, Col, Container } from "react-bootstrap";
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
import Sidebar from "./Sidebar.js";
import {
  MakeBetInstruction,
  VoteInstruction,
  PayoutInstruction,
} from "../utils/utils.js";

function Dashboard() {
  //AWS Object of User
  const [currentUser, setCurrentUser] = useState({});
  //Retrieved Web3 Bets for User
  const [allUserBets, setUserBets] = useState([]);
  //Current Wagered Bet
  const [currentBet, setCurrentBet] = useState({});
  //Voted Bet
  const [currentBetIndex, setCurrentBetIndex] = useState(0);
  //All User Bet Addresses for Display
  const [betAddresses, setBetAddresses] = useState([]);
  //Join Code for entering a new Bet
  const [joinCode, setJoinCode] = useState("");
  //Chosen User Option for a Bet
  const [betOption, setBetOption] = useState("");
  //Amount Bet on specific bet
  const [betValue, setBetValue] = useState(0.0);
  //Open Betting Modal
  const [betIsOpen, setBetIsOpen] = useState(false);
  //Success Toasts
  const toast = useToast();
  //Options for the selected bet
  const [currentOptions, setCurrentOptions] = useState([]);
  //Voting Option Selected
  const [voteOption, setVoteOption] = useState("");
  //Voting Index Selected
  const [voteIndex, setVoteIndex] = useState(0);
  //Bet Information Modal
  const [codeDisplayIsOpen, setCodeDisplayIsOpen] = useState(false);
  //Bet Information Display Current
  const [code, setCode] = useState("");
  //User's actions on all bets
  const [playerAccountInfo, setPlayerAccountInfo] = useState([]);

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
    BufferLayout.u32("balance"),
    BufferLayout.seq(
      BufferLayout.struct([
        BufferLayout.seq(BufferLayout.u8(), 20, "name"),
        BufferLayout.u16("bet_count"),
        BufferLayout.u16("vote_count"),
      ]),
      8,
      "options"
    ),
    BufferLayout.u32("min_bet"),
    BufferLayout.u32("max_bet"),
    BufferLayout.u16("min_players"),
    BufferLayout.u16("max_players"),
    BufferLayout.u16("player_count"),
    BufferLayout.nu64("time"),
    BufferLayout.u16("vote_count"),
    BufferLayout.u8("winner_index"),
    BufferLayout.u8("bump_seed"),
    BufferLayout.u8("state"),
  ]);

  const playerLayout = BufferLayout.struct([
    BufferLayout.u8("option_index"),
    BufferLayout.u32("bet_amount"),
    BufferLayout.u8("voted"),
    BufferLayout.u8("bump_seed"),
  ]);

  const getUsers = async () => {
    const users = await API.graphql({ query: queries.listUsers });
    return users;
  };

  const style = {
    height: 30,
    border: "1px solid green",
    margin: 6,
    padding: 8,
  };

  const getBets = useCallback(async () => {
    let tempAddress = {};
    let tempBet = {};
    let allBetAddresses = [];
    let allBets = [];
    let allPlayerAccounts = [];
    let tempBets = await connection.getParsedProgramAccounts(programId, {
      filters: [
        {
          dataSize: 243,
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
        console.log(allUserBets);
      }
    });
    //let news;
    //console.log(String.fromCharCode.apply(String, allBets[0].options[0].name))
  }, [publicKey]); // eslint-disable-line react-hooks/exhaustive-deps

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

  const handlejoinCodeChange = (e) => {
    setJoinCode(e.target.value);
  };

  const handleBetOption = (e) => {
    setBetOption(e.target.value);
  };

  const handleBetValue = (e) => {
    setBetValue(parseFloat(e));
  };

  const handleBetting = async (e, index) => {
    e.preventDefault();
    let option = betOption;
    //let value = betValue;
    //let bet = userBets[index]; //bet object in contention
    //Sending Bet Transaction and Balance for Bet
    let tempStr = joinCode + " ".repeat(20 - joinCode.length);
    setJoinCode(tempStr);
    let [potPDA, potBump] = await PublicKey.findProgramAddress(
      [Buffer.from(tempStr)],
      programId
    );
    let [playerPDA, playerBump] = await PublicKey.findProgramAddress(
      [Buffer.from(tempStr), publicKey.toBytes()],
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
      data: MakeBetInstruction(option, playerBump, betValue * 100000000),
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
    toast({
      title: "Bet Successfully Placed.",
      description: joinCode,
      status: "success",
      duration: 9000,
      isClosable: true,
    });
    setBetIsOpen(false);
  };

  const handleJoinBet = async (id) => {
    //use account info to join based on if bet in id is active - WEB3
  };

  const selectOption = (e, betIndex) => {
    let list = e.target.value.split("@&@");
    setVoteOption(list[0]);
    setVoteIndex(parseInt(list[1]));
    setCurrentBetIndex(betIndex);
  };

  const submitOption = async () => {
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

  const downloadQRCode = () => {
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
      gridTemplateRows={"50px"}
      gridTemplateColumns={"150px"}
      color="blackAlpha.700"
      fontWeight="bold"
      minHeight="100vh"
    >
      <GridItem colSpan={2} area={"nav"}>
        <Sidebar refresh={getBets} user={currentUser} />
      </GridItem>

      <GridItem colSpan={19} pl="2" bg="#F7F8FC" area={"header"}>
        <br />
        <div
          style={{
            marginLeft: "4rem",

            color: "white",
            fontSize: "25px",
          }}
        >
          <h1>Dashboard</h1>
        </div>
      </GridItem>

      <GridItem pl="2" colSpan={19} bg="#F7F8FC" area={"main"}>
        <Container style={{ height: "100%" }}>
          <Row
            style={{ margin: "5%", marginTop: "1%", marginBottom: "1%" }}
            xs={1}
            md={4}
            className="g-4"
          >
            <Col>
              <Card
                style={{
                  borderColor: "#1D5F50",
                  width: "100%",
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
                  width: "100%",
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
                  width: "100%",
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
                  width: "100%",
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
          <InfiniteScroll
            dataLength={allUserBets.length}
            hasMore={false}
            loader={<h4>Loading...</h4>}
            endMessage={
              <Row style={{ textAlign: "right" }}>
                <Button
                  colorScheme="black"
                  variant="ghost"
                  rightIcon={<RepeatIcon />}
                  onClick={() => {
                    getBets(publicKey);
                  }}
                >
                  Refresh
                </Button>
              </Row>
            }
          >
            <Modal isOpen={betIsOpen} onClose={() => setBetIsOpen(false)}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Make Bet</ModalHeader>
                <ModalBody>
                  <>
                    <FormControl isRequired>
                      <FormLabel>Bet Code</FormLabel>
                      <Input
                        placeholder="Bet Code"
                        value={joinCode}
                        onChange={(e) => handlejoinCodeChange(e)}
                      />
                    </FormControl>
                    <br />
                    <FormControl isRequired>
                      <FormLabel>Bet Option</FormLabel>
                      <Select
                        onChange={handleBetOption}
                        placeholder="Select option"
                      >
                        {currentOptions.map((option, index) => {
                          let name = String.fromCharCode.apply(
                            String,
                            option.name
                          );
                          name = name.substr(0, name.indexOf("\0"));
                          if (name !== "zero" && name !== "") {
                            return (
                              <option key={name} value={index}>
                                {name}
                              </option>
                            );
                          }
                        })}
                      </Select>
                    </FormControl>
                    <br />
                    <FormControl isRequired>
                      <FormLabel>Bet Value ($)</FormLabel>
                      <NumberInput
                        onChange={handleBetValue}
                        min={currentBet.min_bet}
                        max={currentBet.max_bet}
                        precision={2}
                        step={0.5}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </FormControl>
                  </>
                </ModalBody>
                <ModalFooter>
                  <Button
                    variant="ghost"
                    mr={3}
                    onClick={() => setBetIsOpen(false)}
                  >
                    Close
                  </Button>
                  <Button colorScheme="blue" onClick={handleBetting}>
                    Wager!
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>

            {allUserBets.map((bet, index) => {
              switch (bet.state) {
                case 1:
                  return (
                    <Container key={index}>
                      <Card style={{ margin: "1rem", marginLeft: 50 }}>
                        <Card.Body>
                          <Row>
                            <Col style={{ textAlign: "left" }}>
                              <Card.Title>
                                <strong>Bet Name:</strong>{" "}
                                {String.fromCharCode.apply(
                                  String,
                                  bet.bet_identifier
                                )}
                              </Card.Title>
                              <Card.Text style={{ color: "#aaaaaa" }}>
                                Status: Created
                              </Card.Text>
                            </Col>
                            <Col style={{ textAlign: "right" }}>
                              <Button
                                colorScheme="green"
                                variant="outline"
                                mr={3}
                                onClick={() => {
                                  let name = bet.bet_identifier;
                                  name = String.fromCharCode.apply(
                                    String,
                                    name
                                  );
                                  if (name.indexOf(" ") >= 0)
                                    name = name.trim();
                                  setCode(name);
                                  setCodeDisplayIsOpen(true);
                                }}
                              >
                                Bet Info
                              </Button>
                              <Button
                                colorScheme="purple"
                                variant="outline"
                                mr={3}
                                onClick={() => {
                                  setBetIsOpen(true);
                                  setCurrentBet(bet);
                                  let name = bet.bet_identifier;
                                  name = String.fromCharCode.apply(
                                    String,
                                    name
                                  );
                                  if (name.indexOf(" ") >= 0)
                                    name = name.trim();
                                  setJoinCode(name);
                                  setCurrentOptions(bet.options);
                                }}
                                disabled={
                                  playerAccountInfo[index].bet_amount != 0
                                }
                              >
                                Make Bet
                              </Button>
                            </Col>
                          </Row>
                        </Card.Body>
                        <Card.Footer style={{ backgroundColor: "#fff" }}>
                          <Grid templateColumns="repeat(5, 1fr)" gap={6}>
                            <GridItem w="100%" h="10">
                              <Grid templateColumns="repeat(2, 1fr)" gap={3}>
                                <GridItem w="100%" h="10">
                                  Position
                                </GridItem>
                                <GridItem
                                  style={{ color: "#aaaaaa" }}
                                  w="100%"
                                  h="10"
                                >
                                  {String.fromCharCode
                                    .apply(
                                      String,
                                      bet.options[
                                        playerAccountInfo[index].option_index
                                      ].name
                                    )
                                    .substr(
                                      0,
                                      String.fromCharCode
                                        .apply(
                                          String,
                                          bet.options[
                                            playerAccountInfo[index]
                                              .option_index
                                          ].name
                                        )
                                        .indexOf("\0")
                                    )}
                                </GridItem>
                              </Grid>
                            </GridItem>
                            <GridItem w="100%" h="10">
                              <Grid templateColumns="repeat(2, 1fr)" gap={3}>
                                <GridItem w="100%" h="10">
                                  Stake
                                </GridItem>
                                <GridItem
                                  style={{ color: "#aaaaaa" }}
                                  w="100%"
                                  h="10"
                                >
                                  $
                                  {playerAccountInfo[index].bet_amount /
                                    100000000}
                                </GridItem>
                              </Grid>
                            </GridItem>

                            <GridItem w="100%" h="10">
                              <Grid templateColumns="repeat(2, 1fr)" gap={3}>
                                <GridItem w="100%" h="10">
                                  Pot
                                </GridItem>
                                <GridItem
                                  style={{ color: "#aaaaaa" }}
                                  w="100%"
                                  h="10"
                                >
                                  ${bet.balance / 100000000}
                                </GridItem>
                              </Grid>
                            </GridItem>
                            <GridItem w="100%" h="10">
                              <Grid templateColumns="repeat(2, 1fr)" gap={3}>
                                <GridItem w="100%" h="10">
                                  Time
                                </GridItem>
                                <GridItem
                                  style={{ color: "#aaaaaa" }}
                                  w="100%"
                                  h="10"
                                >
                                  {new Date(bet.time).toLocaleTimeString(
                                    "en-US",
                                    { timeStyle: "short" }
                                  )}
                                </GridItem>
                              </Grid>
                            </GridItem>
                            <GridItem w="100%" h="10">
                              <Grid templateColumns="repeat(2, 1fr)" gap={3}>
                                <GridItem w="100%" h="10">
                                  Players
                                </GridItem>
                                <GridItem
                                  style={{ color: "#aaaaaa" }}
                                  w="100%"
                                  h="10"
                                >
                                  {bet.player_count}
                                </GridItem>
                              </Grid>
                            </GridItem>
                          </Grid>
                        </Card.Footer>
                      </Card>
                    </Container>
                  );

                case 2:
                  return (
                    <Container key={index}>
                      <Card style={{ margin: "1rem", marginLeft: 50 }}>
                        <Card.Body>
                          <Row>
                            <Col style={{ textAlign: "left" }}>
                              <Card.Title>
                                <strong>Bet Name:</strong>{" "}
                                {String.fromCharCode.apply(
                                  String,
                                  bet.bet_identifier
                                )}
                              </Card.Title>
                              <Card.Text style={{ color: "#aaaaaa" }}>
                                Status: Voting
                              </Card.Text>
                            </Col>
                            <Col style={{ textAlign: "right" }}>
                              <Flex>
                                {playerAccountInfo[index].voted == 0 ? (
                                  <Select
                                    style={{ margin: "1%" }}
                                    colorScheme="purple"
                                    onChange={(e) => {
                                      selectOption(e, index);
                                    }}
                                    variant="outline"
                                    placeholder="Select option"
                                  >
                                    {bet.options.map((option, index) => {
                                      let name = String.fromCharCode.apply(
                                        String,
                                        option.name
                                      );
                                      if (name.indexOf("\0") >= 0)
                                        name = name.substr(
                                          0,
                                          name.indexOf("\0")
                                        );
                                      if (name !== "zero" && name !== "") {
                                        return (
                                          <option
                                            key={index}
                                            value={name + "@&@" + index}
                                          >
                                            {name}
                                          </option>
                                        );
                                      }
                                    })}
                                  </Select>
                                ) : (
                                  <Select
                                    style={{ margin: "1%" }}
                                    colorScheme="purple"
                                    variant="outline"
                                    placeholder={String.fromCharCode
                                      .apply(
                                        String,
                                        bet.options[
                                          playerAccountInfo[index].option_index
                                        ].name
                                      )
                                      .substr(
                                        0,
                                        String.fromCharCode
                                          .apply(
                                            String,
                                            bet.options[
                                              playerAccountInfo[index]
                                                .option_index
                                            ].name
                                          )
                                          .indexOf("\0")
                                      )}
                                  />
                                )}

                                <br />
                                <Button
                                  disabled={playerAccountInfo[index].voted == 1}
                                  variant="primary"
                                  style={{
                                    backgroundColor: "purple",
                                    color: "white",
                                  }}
                                  onClick={submitOption}
                                >
                                  Vote
                                </Button>
                              </Flex>
                            </Col>
                          </Row>
                        </Card.Body>
                        <Card.Footer style={{ backgroundColor: "#fff" }}>
                          <Grid templateColumns="repeat(5, 1fr)" gap={6}>
                            <GridItem w="100%" h="10">
                              <Grid templateColumns="repeat(2, 1fr)" gap={3}>
                                <GridItem w="100%" h="10">
                                  Position
                                </GridItem>
                                <GridItem
                                  style={{ color: "#aaaaaa" }}
                                  w="100%"
                                  h="10"
                                >
                                  {String.fromCharCode
                                    .apply(
                                      String,
                                      bet.options[
                                        playerAccountInfo[index].option_index
                                      ].name
                                    )
                                    .substr(
                                      0,
                                      String.fromCharCode
                                        .apply(
                                          String,
                                          bet.options[
                                            playerAccountInfo[index]
                                              .option_index
                                          ].name
                                        )
                                        .indexOf("\0")
                                    )}
                                </GridItem>
                              </Grid>
                            </GridItem>
                            <GridItem w="100%" h="10">
                              <Grid templateColumns="repeat(2, 1fr)" gap={3}>
                                <GridItem w="100%" h="10">
                                  Stake
                                </GridItem>
                                <GridItem
                                  style={{ color: "#aaaaaa" }}
                                  w="100%"
                                  h="10"
                                >
                                  $
                                  {playerAccountInfo[index].bet_amount /
                                    100000000}
                                </GridItem>
                              </Grid>
                            </GridItem>

                            <GridItem w="100%" h="10">
                              <Grid templateColumns="repeat(2, 1fr)" gap={3}>
                                <GridItem w="100%" h="10">
                                  Pot
                                </GridItem>
                                <GridItem
                                  style={{ color: "#aaaaaa" }}
                                  w="100%"
                                  h="10"
                                >
                                  ${bet.balance / 100000000}
                                </GridItem>
                              </Grid>
                            </GridItem>
                            <GridItem w="100%" h="10">
                              <Grid templateColumns="repeat(2, 1fr)" gap={3}>
                                <GridItem w="100%" h="10">
                                  Time
                                </GridItem>
                                <GridItem
                                  style={{ color: "#aaaaaa" }}
                                  w="100%"
                                  h="10"
                                >
                                  {new Date(bet.time).toLocaleTimeString(
                                    "en-US",
                                    { timeStyle: "short" }
                                  )}{" "}
                                </GridItem>
                              </Grid>
                            </GridItem>
                            <GridItem w="100%" h="10">
                              <Grid templateColumns="repeat(2, 1fr)" gap={3}>
                                <GridItem w="100%" h="10">
                                  Players
                                </GridItem>
                                <GridItem
                                  style={{ color: "#aaaaaa" }}
                                  w="100%"
                                  h="10"
                                >
                                  {bet.player_count}
                                </GridItem>
                              </Grid>
                            </GridItem>
                          </Grid>
                        </Card.Footer>
                      </Card>
                    </Container>
                  );

                case 3:
                  return (
                    <Container key={index}>
                      <Card style={{ margin: "1rem", marginLeft: 50 }}>
                        <Card.Body>
                          <Row>
                            <Col style={{ textAlign: "left" }}>
                              <Card.Title>
                                <strong>Bet Name:</strong>{" "}
                                {String.fromCharCode.apply(
                                  String,
                                  bet.bet_identifier
                                )}
                              </Card.Title>
                              <Card.Text style={{ color: "#aaaaaa" }}>
                                Status: Settled
                              </Card.Text>
                            </Col>
                            <Col style={{ textAlign: "right" }}>
                              <Button
                                style={{ margin: "1%" }}
                                colorScheme="purple"
                                variant="outline"
                              >
                                You Chose:{" "}
                                {String.fromCharCode
                                  .apply(
                                    String,
                                    bet.options[
                                      playerAccountInfo[index].option_index
                                    ].name
                                  )
                                  .substr(
                                    0,
                                    String.fromCharCode
                                      .apply(
                                        String,
                                        bet.options[
                                          playerAccountInfo[index].option_index
                                        ].name
                                      )
                                      .indexOf("\0")
                                  )}
                              </Button>
                              {true ? (
                                <Button
                                  style={{ margin: "1%" }}
                                  colorScheme="purple"
                                  onClick={() => handlePayout()}
                                >
                                  Settle Funds
                                </Button>
                              ) : (
                                <Button
                                  style={{ margin: "1%" }}
                                  colorScheme="green"
                                  variant="outline"
                                >
                                  You Won:
                                </Button>
                              )}
                            </Col>
                          </Row>
                        </Card.Body>
                        <Card.Footer style={{ backgroundColor: "#fff" }}>
                          <Grid templateColumns="repeat(5, 1fr)" gap={6}>
                            <GridItem w="100%" h="10">
                              <Grid templateColumns="repeat(2, 1fr)" gap={3}>
                                <GridItem w="100%" h="10">
                                  Position
                                </GridItem>
                                <GridItem
                                  style={{ color: "#aaaaaa" }}
                                  w="100%"
                                  h="10"
                                >
                                  {String.fromCharCode
                                    .apply(
                                      String,
                                      bet.options[
                                        playerAccountInfo[index].option_index
                                      ].name
                                    )
                                    .substr(
                                      0,
                                      String.fromCharCode
                                        .apply(
                                          String,
                                          bet.options[
                                            playerAccountInfo[index]
                                              .option_index
                                          ].name
                                        )
                                        .indexOf("\0")
                                    )}
                                </GridItem>
                              </Grid>
                            </GridItem>
                            <GridItem w="100%" h="10">
                              <Grid templateColumns="repeat(2, 1fr)" gap={3}>
                                <GridItem w="100%" h="10">
                                  Stake
                                </GridItem>
                                <GridItem
                                  style={{ color: "#aaaaaa" }}
                                  w="100%"
                                  h="10"
                                >
                                  {playerAccountInfo[index].bet_amount /
                                    100000000}
                                </GridItem>
                              </Grid>
                            </GridItem>

                            <GridItem w="100%" h="10">
                              <Grid templateColumns="repeat(2, 1fr)" gap={3}>
                                <GridItem w="100%" h="10">
                                  Pot
                                </GridItem>
                                <GridItem
                                  style={{ color: "#aaaaaa" }}
                                  w="100%"
                                  h="10"
                                >
                                  {bet.balance / 100000000}
                                </GridItem>
                              </Grid>
                            </GridItem>
                            <GridItem w="100%" h="10">
                              <Grid templateColumns="repeat(2, 1fr)" gap={3}>
                                <GridItem w="100%" h="10">
                                  Time
                                </GridItem>
                                <GridItem
                                  style={{ color: "#aaaaaa" }}
                                  w="100%"
                                  h="10"
                                >
                                  {new Date(bet.time).toLocaleTimeString(
                                    "en-US",
                                    { timeStyle: "short" }
                                  )}{" "}
                                </GridItem>
                              </Grid>
                            </GridItem>
                            <GridItem w="100%" h="10">
                              <Grid templateColumns="repeat(2, 1fr)" gap={3}>
                                <GridItem w="100%" h="10">
                                  Players
                                </GridItem>
                                <GridItem
                                  style={{ color: "#aaaaaa" }}
                                  w="100%"
                                  h="10"
                                >
                                  {bet.player_count}
                                </GridItem>
                              </Grid>
                            </GridItem>
                          </Grid>
                        </Card.Footer>
                      </Card>
                    </Container>
                  );
                default:
                  return <Container></Container>;
              }
            })}
          </InfiniteScroll>
        </Container>
        <Modal
          isOpen={codeDisplayIsOpen}
          onClose={() => setCodeDisplayIsOpen(false)}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Bet Information</ModalHeader>
            <ModalBody>
              <h1 style={{ fontSize: "15px" }}>
                <strong>Bet Code: </strong>
                <u>
                  <a
                    onClick={() => {
                      navigator.clipboard.writeText(code);
                      alert("Copied to Clipboard");
                    }}
                  >
                    {code}
                  </a>
                </u>
              </h1>
              <br />
              <h3 style={{ fontSize: "15px" }}>
                <strong>Join Link: </strong>
                <u>
                  <a
                    onClick={() => {
                      navigator.clipboard.writeText(
                        window.location.href + "?bet=" + code
                      );
                      alert("Copied to Clipboard");
                    }}
                  >
                    {window.location.href + "?bet=" + code}
                  </a>
                </u>
              </h3>
              <br />
              <QRCodeCanvas
                id="qr-gen"
                includeMargin={true}
                value={window.location.href + "?bet=" + code}
              />
              <Button onClick={downloadQRCode}>Download QR Code</Button>
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
      </GridItem>
      <Row>
        <div className="holder">
          <h1>
            <a href="/#">K</a>
          </h1>
        </div>
      </Row>
    </Grid>
  );
}

/*
 */
/*
                        {this.state.bets.map((bet, index) => (
                            <Card key = {bet.id} style = {{margin:"1rem", width: "90%"}}>
                                <Card.Header>{bet.name}</Card.Header>
                                <Card.Body> what bet, time, total players, money, total pot
                                    <Card.Title>Special title treatment</Card.Title>
                                </Card.Body>
                            </Card>
                        ))}
                        */

export default withAuthenticator(Dashboard);
