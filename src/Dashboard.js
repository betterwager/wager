import React, { useEffect, useMemo } from "react";
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
import { getProvider, connect, NewWagerInstruction, MakeBetInstruction } from "./utils.js";
import {
  Keypair,
  Connection,
  TransactionInstruction,
  Transaction,
  PublicKey,
  clusterApiUrl,
} from "@solana/web3.js";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";

import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";

import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { Buffer } from "buffer";

require("@solana/wallet-adapter-react-ui/styles.css");


function Dashboard() {
  const [bets, setBets] = useState([]);
  const [betComplete, setBetComplete] = useState([]);
  const [currentBet, setCurrentBet] = useState({});
  const [userBets, setUserBets] = useState([]);
  const [joinCode, setJoinCode] = useState("");
 const [betOption, setBetOption] = useState("");
 const [betValue, setBetValue] = useState(0);
 
 const [betIsOpen, setBetIsOpen] = useState(false);
 
 const network = WalletAdapterNetwork.Devnet;
 const endpoint = useMemo(() => clusterApiUrl(network), [network]);
 const wallets = useMemo(() => [new PhantomWalletAdapter()], []);
  
  useEffect(() => {
    // Wallet detection
    console.log("I am here");
    //GET ALL BETS FOR USER FROM WEB3
    /* async function  getAccounts() {
      console.log(connection);
      const accounts = await connection.getParsedProgramAccounts(
        programId, // new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
        {
          filters: [
            {
              dataSize: 26, // number of bytes
            },
          ],
        }
        );
    } */
    },
    []);

    //wallet/connection constants
    console.log(wallets);
    const {connection} = useConnection();
    const { publicKey, sendTransaction } = useWallet();
    const systemProgram = new PublicKey("11111111111111111111111111111111");
    const rentSysvar = new PublicKey(
      "SysvarRent111111111111111111111111111111111"
    );

    const programId = Keypair.generate();
    
    const handlejoinCodeChange = (e) => {
      setJoinCode(e.target.value);
    };

  const handleBetOption = (e) => {
    setBetOption(e.target.value);
  };

  const handleBetValue = (e) => {
    setBetValue(e.target.value);
  };

  const getAccounts = async () => {
    console.log(connection);
    const accounts = await connection.getParsedProgramAccounts(
      programId, // new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
      {
        filters: [
          {
            dataSize: 26, // number of bytes
          },
        ],
      }
      );
      console.log(accounts);
  }

  const handleBetting = async (e, index) => {
    e.preventDefault();
    let option = betOption;
    let value = value;
    let bet = userBets[index]; //bet object in contention

    //Sending Bet Transaction and Balance for Bet
        //Sending Bet Transaction and Balance for Bet
        let [potPDA, potBump] = await PublicKey.findProgramAddress(
          [Buffer.from(bet)],
          programId
        );
        let [playerPDA, playerBump] = await PublicKey.findProgramAddress(
          [Buffer.from(bet)],
          publicKey,
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
              isWritable: true},
            { 
              pubkey: playerPDA, 
              isSigner: false, 
              isWritable: true},
            {
              pubkey: systemProgram,
              isSigner: false,
              isWritable: false,
            },
            {
              pubkey: rentSysvar,
              isSigner: false,
              isWritable: false,
            },
          ],
          programId: programId,
          data: MakeBetInstruction(bet, value, option, playerBump),
        });
        const transaction = new Transaction().add(instruction);
        console.log(transaction); 
        console.log(connection);
        getAccounts();
        const {
          context: { slot: minContextSlot },
          value: { blockhash, lastValidBlockHeight },
        } = await connection.getLatestBlockhashAndContext();
        transaction.recentBlockhash = blockhash;
        console.log("blockhash retreived");
        const signature = await sendTransaction(
          transaction,
          connection,
          { minContextSlot }
          );
          await connection.confirmTransaction({
            blockhash,
            lastValidBlockHeight,
            signature,
          });
        };
        
        const handleJoinBet = async (id) => {
    //use account info to join based on if bet in id is active - WEB3
  };

  const selectOption = (id, option) => {
    //use bet id and option
  };

  return (
    <ConnectionProvider endpoint={endpoint}>
    <WalletProvider wallets={wallets} autoConnect>
    <WalletModalProvider>
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
      <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <Sidebar />
      </WalletProvider>
      </ConnectionProvider>
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
          <Row style={{ margin: "5%" }} xs={1} md={4} className="g-4">
            <Col>
              <Card style={{ width: "90%", textAlign: "center" }}>
                <Card.Body>
                  <Card.Text style={{ color: "#888888" }}>Earnings</Card.Text>
                  <Card.Title>
                    <strong>$60</strong>
                  </Card.Title>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card style={{ width: "90%", textAlign: "center" }}>
                <Card.Body>
                  <Card.Text style={{ color: "#888888" }}>
                    Active Bets
                  </Card.Text>
                  <Card.Title>
                    <strong>1</strong>
                  </Card.Title>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card style={{ width: "90%", textAlign: "center" }}>
                <Card.Body>
                  <Card.Text style={{ color: "#888888" }}>
                    Closed Bets
                  </Card.Text>
                  <Card.Title>
                    <strong>3</strong>
                  </Card.Title>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card style={{ width: "90%", textAlign: "center" }}>
                <Card.Body>
                  <Card.Text style={{ color: "#888888" }}>Voting</Card.Text>
                  <Card.Title>
                    <strong>2</strong>
                  </Card.Title>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <InfiniteScroll
            dataLength={bets.length}
            next={bets}
            hasMore={false}
            loader={<h4>Loading...</h4>}
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
                    <Button colorScheme="purple" variant="outline">
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
                    <Button
                      style={{ margin: "1%" }}
                      colorScheme="purple"
                      variant="outline"
                    >
                      Option 1
                    </Button>
                    <Button
                      style={{ margin: "1%" }}
                      colorScheme="purple"
                      variant="outline"
                    >
                      Option 2
                    </Button>
                    <Button
                      style={{ margin: "1%" }}
                      colorScheme="purple"
                      variant="outline"
                    >
                      Option 3
                    </Button>
                    <Button
                      style={{ margin: "1%" }}
                      colorScheme="purple"
                      variant="outline"
                    >
                      Option 4
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

            {userBets.map((bet, index) =>
              betComplete[index] ? (
                <>
                  <Card id={bet.id} style={{ margin: "1rem", width: "90%" }}>
                    <Card.Header>ID: {bet.id}</Card.Header>
                    <Card.Title>{bet.name}</Card.Title>
                    <SimpleGrid columns={2} spacing={10}>
                      <Box>
                        Position: {bet.currentOption} <br />
                        Stake: {bet.stake} <br />
                      </Box>
                      <Box>
                        Total Pot: {bet.total} <br />
                        Total Players: {bet.playerCount} <br />
                        <br />
                      </Box>
                    </SimpleGrid>
                  </Card>
                </>
              ) : (
                <Card id={bet.id} style={{ margin: "1rem", width: "90%" }}>
                  <Card.Header>ID: {bet.id}</Card.Header>

                  <Card.Title>{bet.name}</Card.Title>
                  <Card.Body>
                    <SimpleGrid columns={2} spacing={10}>
                      <Box>
                        Position: {bet.position} <br />
                        Stake: {bet.stake} <br />
                      </Box>
                      <Box>
                        Betting Expires: {bet.time} <br />
                        Total Players: {bet.playerCount} <br />
                        <br />
                      </Box>
                    </SimpleGrid>
                  </Card.Body>
                  <Card.Footer align="right">
                    <Button
                      colorScheme="green"
                      mr={3}
                      onClick={() => {
                        setBetIsOpen(true);
                        setCurrentBet(index);
                      }}
                    >
                      Make Bet
                    </Button>

                    <Modal
                      isOpen={betIsOpen}
                      onClose={() => setBetIsOpen(false)}
                    >
                      <ModalOverlay />
                      <ModalContent>
                        <Form onSubmit={(e) => handleBetting(e,index)}>
                          <ModalHeader>Make Bet</ModalHeader>
                          <ModalBody>
                            <>
                              <FormControl isRequired>
                                <FormLabel>Bet Option</FormLabel>
                                <Select
                                  onChange={(e) => handleBetOption(e)}
                                  placeholder="Select option"
                                >
                                  {bet.options.map((option) => (
                                    <option value={option}>{option}</option>
                                  ))}
                                </Select>
                              </FormControl>

                              <FormControl isRequired>
                                <FormLabel>Bet Value ($)</FormLabel>
                                <NumberInput
                                  onChange={() => handleBetValue}
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
                            <Button type="submit" colorScheme="blue">
                              Wager!
                            </Button>
                          </ModalFooter>
                        </Form>
                      </ModalContent>
                    </Modal>
                  </Card.Footer>
                </Card>
              )
            )}
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
                        onChange={() => handlejoinCodeChange}
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Bet Option</FormLabel>
                      <Select
                        onChange={(e) => handleBetOption(e)}
                        placeholder="Select option"
                      >
                        <option value={1}>option 1</option>
                        <option value={2}>option 2</option>
                        <option value={3}>option 3</option>
                      </Select>
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Bet Value ($)</FormLabel>
                      <NumberInput
                        onChange={() => handleBetValue}
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
                  <Button colorScheme="blue" onClick={() => handleJoinBet}>
                    Wager!
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </InfiniteScroll>
        </Container>
      </GridItem>
    </Grid>
    </WalletModalProvider>
    </WalletProvider>
    </ConnectionProvider>
  );
}

/*

*/
/*
                        {bets.map((bet, index) => (
                            <Card key = {bet.id} style = {{margin:"1rem", width: "90%"}}>
                                <Card.Header>{bet.name}</Card.Header>
                                <Card.Body> what bet, time, total players, money, total pot
                                    <Card.Title>Special title treatment</Card.Title>
                                </Card.Body>
                            </Card>
                        ))}
                        */

export default withAuthenticator(Dashboard);
