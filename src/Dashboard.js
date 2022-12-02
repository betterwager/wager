import React, { useEffect, useCallback } from "react";
import { useState } from "react";
import {
  Grid,
  SimpleGrid,
  Modal,
  NumberInput,
  NumberInputField,
  Select,
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
  Box,
  Button,
} from "@chakra-ui/react";
import { Card, Form, Row, Col, Container } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";
import { withAuthenticator } from "@aws-amplify/ui-react";
import uniqueHash from "unique-hash";
import "@aws-amplify/ui-react/styles.css";
import Sidebar from "./Sidebar.js";
import { getProvider, connect, MakeBetInstruction, VoteInstruction } from "./utils.js";
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
import { ConsoleLogger } from "@aws-amplify/core";
import { RepeatIcon } from "@chakra-ui/icons";

function Dashboard() {
  const [bets, setBets] = useState([]);
  const [betComplete, setBetComplete] = useState([]);
  const [currentBet, setCurrentBet] = useState({});
  const [betAddresses, setBetAddresses] = useState([]);
  const [joinCode, setJoinCode] = useState("");

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
  const programId = new PublicKey(
    "EEjpJXCfHEqcRyAxW6tr3MNZqpP2MjAErkezFyp4HEah"
  );

  const wagerLayout = BufferLayout.struct([
    BufferLayout.u32("balance"),
    BufferLayout.seq(
      BufferLayout.struct([
        BufferLayout.seq(BufferLayout.u8(), 20, "name"),
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
    BufferLayout.u16("vote_count"),
    BufferLayout.u8("bump_seed"),
    BufferLayout.u8("state"),
  ]);

  const [betOption, setBetOption] = useState("");
  const [betValue, setBetValue] = useState(0);

  const [betIsOpen, setBetIsOpen] = useState(false);

  const getBets = useCallback(async () => {
    let allBetAddresses = [];
    let allBets = await connection.getParsedProgramAccounts(programId, {
      filters: [
        {
          dataSize: 198,
        },
      ],
    });
    allBets.forEach(function (accountInfo, index) {
      allBetAddresses[index] = accountInfo.pubkey
      allBets[index] = wagerLayout.decode(accountInfo.account.data);
    });
    console.log(allBets);
    console.log(allBetAddresses);
    setBetAddresses(allBetAddresses);
    setBets(allBets);
  }, []);

  useEffect(() => {
    getBets().catch(console.error);
  }, [getBets]);

  const handlejoinCodeChange = (e) => {
    setJoinCode(e.target.value);
  };

  const handleBetOption = (e) => {
    setBetOption(e.target.value);
  };

  const handleBetValue = (e) => {
    setBetValue(e);
  };

  const handleBetting = async (e, index) => {
    e.preventDefault();
    let option = betOption;
    let value = betValue;
    //let bet = userBets[index]; //bet object in contention
    //Sending Bet Transaction and Balance for Bet
    let [potPDA, potBump] = await PublicKey.findProgramAddress(
      [Buffer.alloc(20, joinCode)],
      programId
    );
    let [playerPDA, playerBump] = await PublicKey.findProgramAddress(
      [Buffer.alloc(20, joinCode), publicKey.toBytes()],
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
      data: MakeBetInstruction(joinCode, betValue, 0, playerBump),
    });
    const transaction = new Transaction().add(instruction);
    console.log(transaction);
    console.log(connection);
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

  const handleJoinBet = async (id) => {
    //use account info to join based on if bet in id is active - WEB3
  };

  const selectOption = async (e, index) => {
    e.preventDefault();
    let optionChose = e.target.value
    console.log(optionChose);
    //use bet id and option to process vote for user
    let potPDA = betAddresses[index];
    
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
      ],
      programId: programId,
      data: VoteInstruction(optionChose),
    });
    const transaction = new Transaction().add(instruction);
    console.log(transaction);
    console.log(connection);
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
        <Sidebar />
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
        <Container>
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
                    <strong>$60</strong>
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
                    <strong>{bets.length}</strong>
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
                    <strong>2</strong>
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
                    <strong>0</strong>
                  </Card.Title>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <InfiniteScroll
            dataLength={bets.length}
            next={getBets}
            hasMore={false}
            loader={<h4>Loading...</h4>}
            endMessage={
              <Row style={{ textAlign: "right" }}>
                <Button
                  colorScheme="black"
                  variant="ghost"
                  rightIcon={<RepeatIcon />}
                  onClick={() => {
                    getBets();
                  }}
                >
                  Refresh
                </Button>
              </Row>
            }
          >
                         <Card style={{ margin: "1rem" }}>
              <Card.Body>
                <Row>
                  <Col style={{ textAlign: "left" }}>
                    <Card.Title>
                      <strong>Bet Name</strong>
                    </Card.Title>
                    <Card.Text>
                      <text style={{ color: "#aaaaaa" }}>Status: </text>Created
                    </Card.Text>
                  </Col>
                  <Col style={{ textAlign: "right" }}>
                    <Button
                      colorScheme="purple"
                      variant="outline"
                      onClick={() => {
                        setBetIsOpen(true);
                        setCurrentBet(0);
                      }}
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
                      <GridItem style={{ color: "#aaaaaa" }} w="100%" h="10">
                        4238
                      </GridItem>
                    </Grid>
                  </GridItem>
                  <GridItem w="100%" h="10">
                    <Grid templateColumns="repeat(2, 1fr)" gap={3}>
                      <GridItem w="100%" h="10">
                        Stake
                      </GridItem>
                      <GridItem style={{ color: "#aaaaaa" }} w="100%" h="10">
                        4238
                      </GridItem>
                    </Grid>
                  </GridItem>
                  <GridItem w="100%" h="10">
                    <Grid templateColumns="repeat(2, 1fr)" gap={3}>
                      <GridItem w="100%" h="10">
                        Pot
                      </GridItem>
                      <GridItem style={{ color: "#aaaaaa" }} w="100%" h="10">
                        4238
                      </GridItem>
                    </Grid>
                  </GridItem>
                  <GridItem w="100%" h="10">
                    <Grid templateColumns="repeat(2, 1fr)" gap={3}>
                      <GridItem w="100%" h="10">
                        Time
                      </GridItem>
                      <GridItem style={{ color: "#aaaaaa" }} w="100%" h="10">
                        4238
                      </GridItem>
                    </Grid>
                  </GridItem>
                  <GridItem w="100%" h="10">
                    <Grid templateColumns="repeat(2, 1fr)" gap={3}>
                      <GridItem w="100%" h="10">
                        Players
                      </GridItem>
                      <GridItem style={{ color: "#aaaaaa" }} w="100%" h="10">
                        4238
                      </GridItem>
                    </Grid>
                  </GridItem>
                </Grid>
              </Card.Footer>
            </Card>
            <Card style={{ margin: "1rem" }}>
              <Card.Body>
                <Row>
                  <Col style={{ textAlign: "left" }}>
                    <Card.Title>
                      <strong>Bet Name</strong>
                    </Card.Title>
                    <Card.Text>
                      <text style={{ color: "#aaaaaa" }}>Status: </text>Voting
                    </Card.Text>
                  </Col>
                  <Col style={{ textAlign: "right" }}>
                    <Select
                      style={{ margin: "1%" }}
                      colorScheme="purple"
                      onChange = {e => selectOption(e,1)}
                      variant="outline"
                      placeholder="Select option"
                      >
                        <option value={0}>option 1</option>
                        <option value={1}>option 2</option>
                        <option value={2}>option 3</option>
                      </Select>
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
                      <GridItem style={{ color: "#aaaaaa" }} w="100%" h="10">
                        4238
                      </GridItem>
                    </Grid>
                  </GridItem>
                  <GridItem w="100%" h="10">
                    <Grid templateColumns="repeat(2, 1fr)" gap={3}>
                      <GridItem w="100%" h="10">
                        Stake
                      </GridItem>
                      <GridItem style={{ color: "#aaaaaa" }} w="100%" h="10">
                        4238
                      </GridItem>
                    </Grid>
                  </GridItem>
                  <GridItem w="100%" h="10">
                    <Grid templateColumns="repeat(2, 1fr)" gap={3}>
                      <GridItem w="100%" h="10">
                        Pot
                      </GridItem>
                      <GridItem style={{ color: "#aaaaaa" }} w="100%" h="10">
                        4238
                      </GridItem>
                    </Grid>
                  </GridItem>
                  <GridItem w="100%" h="10">
                    <Grid templateColumns="repeat(2, 1fr)" gap={3}>
                      <GridItem w="100%" h="10">
                        Time
                      </GridItem>
                      <GridItem style={{ color: "#aaaaaa" }} w="100%" h="10">
                        4238
                      </GridItem>
                    </Grid>
                  </GridItem>
                  <GridItem w="100%" h="10">
                    <Grid templateColumns="repeat(2, 1fr)" gap={3}>
                      <GridItem w="100%" h="10">
                        Players
                      </GridItem>
                      <GridItem style={{ color: "#aaaaaa" }} w="100%" h="10">
                        4238
                      </GridItem>
                    </Grid>
                  </GridItem>
                </Grid>
              </Card.Footer>
            </Card>
            <Card style={{ margin: "1rem" }}>
              <Card.Body>
                <Row>
                  <Col style={{ textAlign: "left" }}>
                    <Card.Title>
                      <strong>Bet Name</strong>
                    </Card.Title>
                    <Card.Text>
                      <text style={{ color: "#aaaaaa" }}>Status: </text>Closed
                    </Card.Text>
                  </Col>
                  <Col style={{ textAlign: "right" }}>
                    <Button
                      style={{ margin: "1%" }}
                      colorScheme="purple"
                      variant="outline"
                    >
                      Option 4: -300
                    </Button>
                    {false ? (
                      <Button
                        style={{ margin: "1%" }}
                        colorScheme="green"
                        variant="outline"
                        onClick={() => {}}
                      >
                        Claim Funds
                      </Button>
                    ) : (
                      <Button
                        style={{ margin: "1%" }}
                        colorScheme="red"
                        variant="outline"
                      >
                        You Lost: $1000
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
                      <GridItem style={{ color: "#aaaaaa" }} w="100%" h="10">
                        4238
                      </GridItem>
                    </Grid>
                  </GridItem>
                  <GridItem w="100%" h="10">
                    <Grid templateColumns="repeat(2, 1fr)" gap={3}>
                      <GridItem w="100%" h="10">
                        Stake
                      </GridItem>
                      <GridItem style={{ color: "#aaaaaa" }} w="100%" h="10">
                        4238
                      </GridItem>
                    </Grid>
                  </GridItem>
                  <GridItem w="100%" h="10">
                    <Grid templateColumns="repeat(2, 1fr)" gap={3}>
                      <GridItem w="100%" h="10">
                        Pot
                      </GridItem>
                      <GridItem style={{ color: "#aaaaaa" }} w="100%" h="10">
                        4238
                      </GridItem>
                    </Grid>
                  </GridItem>
                  <GridItem w="100%" h="10">
                    <Grid templateColumns="repeat(2, 1fr)" gap={3}>
                      <GridItem w="100%" h="10">
                        Time
                      </GridItem>
                      <GridItem style={{ color: "#aaaaaa" }} w="100%" h="10">
                        4238
                      </GridItem>
                    </Grid>
                  </GridItem>
                  <GridItem w="100%" h="10">
                    <Grid templateColumns="repeat(2, 1fr)" gap={3}>
                      <GridItem w="100%" h="10">
                        Players
                      </GridItem>
                      <GridItem style={{ color: "#aaaaaa" }} w="100%" h="10">
                        4238
                      </GridItem>
                    </Grid>
                  </GridItem>
                </Grid>
              </Card.Footer>
            </Card> 

            {bets.map((bet, index) => {
              switch(bet.state){
                case 1:
                  return (
                    <Container key = {index}>
                      <Card style={{ margin: "1rem" }}>
                        <Card.Header>ID: {bet.address}</Card.Header>
                        <Card.Body>
                          <Row>
                            <Col style={{ textAlign: "left" }}>
                              <Card.Title>
                                <strong>
                                  Index: {index}
                                </strong>
                              </Card.Title>
                              <Card.Text>
                                <text style={{ color: "#aaaaaa" }}>Status: </text>
                                Created
                              </Card.Text>
                            </Col>
                            <Col style={{ textAlign: "right" }}>
                              <Button
                                colorScheme="purple"
                                variant="outline"
                                mr={3}
                                onClick={() => {
                                  setBetIsOpen(true);
                                  setCurrentBet(index);
                                }}
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
                                  {bet.position}
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
                                  {bet.stake}
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
                                  {bet.balance}
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
                                  {bet.time}
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
                  )

                case 2:
                  return (
                    <Container key = {index}>
                      <Card style={{ margin: "1rem" }}>
                        <Card.Header>ID: {bet.address}</Card.Header>
                        <Card.Body>
                          <Row>
                            <Col style={{ textAlign: "left" }}>
                              <Card.Title>
                                <strong>
                                Index: {index}
                                </strong>
                              </Card.Title>
                              <Card.Text>
                                <text style={{ color: "#aaaaaa" }}>Status: </text>
                                Voting
                              </Card.Text>
                            </Col>
                            <Col style={{ textAlign: "right" }}>
                              <Select
                              style={{ margin: "1%" }}
                              colorScheme="purple"
                              onChange = {e => selectOption(e,1)}
                              variant="outline"
                              placeholder="Select option"
                              >
                                <option value={0}>option 1</option>
                                <option value={1}>option 2</option>
                                <option value={2}>option 3</option>
                              </Select>
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
                                  {bet.position}
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
                                  {bet.stake}
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
                                  4238
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
                                  {bet.time}
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
                                  {bet.playerCount}
                                </GridItem>
                              </Grid>
                            </GridItem>
                          </Grid>

                        </Card.Footer>
                      </Card>
                    </Container>
                  )

                case 3:
                  return (
                    <Container key = {index}>
                      <Card style={{ margin: "1rem" }}>
                        <Card.Header>ID: {bet.address}</Card.Header>
                        <Card.Body>
                          <Row>
                            <Col style={{ textAlign: "left" }}>
                              <Card.Title>
                                <strong>
                                Index: {index}
                                </strong>
                              </Card.Title>
                              <Card.Text>
                                <text style={{ color: "#aaaaaa" }}>Status: </text>
                                Settled
                              </Card.Text>
                            </Col>
                            <Col style={{ textAlign: "right" }}>
                            <Button
                              style={{ margin: "1%" }}
                              colorScheme="purple"
                              variant="outline"
                            >
                              Option 4: -300
                            </Button>
                            {false ? (
                              <Button
                                style={{ margin: "1%" }}
                                colorScheme="green"
                                variant="outline"
                                onClick={() => {}}
                              >
                                Claim Funds
                              </Button>
                            ) : (
                              <Button
                                style={{ margin: "1%" }}
                                colorScheme="red"
                                variant="outline"
                              >
                                You Lost: $1000
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
                                  {bet.position}
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
                                  {bet.stake}
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
                                  4238
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
                                  {bet.time}
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
                                  {bet.playerCount}
                                </GridItem>
                              </Grid>
                            </GridItem>
                          </Grid>
    
                        </Card.Footer>
                      </Card>
                    </Container>
                  )

              }
              })}


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
                        onChange={(e) => handlejoinCodeChange(e)}
                      />
                    </FormControl>
                    <br />
                    <FormControl isRequired>
                      <FormLabel>Bet Option</FormLabel>
                      <Select
                        onChange={() => handleBetOption}
                        placeholder="Select option"
                      >
                        <option value={1}>option 1</option>
                        <option value={2}>option 2</option>
                        <option value={3}>option 3</option>
                      </Select>
                    </FormControl>
                    <br />
                    <FormControl isRequired>
                      <FormLabel>Bet Value ($)</FormLabel>
                      <NumberInput
                        onChange={(e) => handleBetValue(e)}
                        min={0.0}
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
                  <Button colorScheme="blue" onClick={(e) => handleBetting(e)}>
                    Wager!
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </InfiniteScroll>
        </Container>
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