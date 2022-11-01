import React, { useEffect } from "react";
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
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  GridItem,
  VStack,
  StackDivider,
  Heading,
  Link,
  Image,
  Flex,
  Center,
  Box,
  IconButton,
  Text,
  Button,
  Container,
} from "@chakra-ui/react";
import { Card, Form } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";
import { DataStore } from '@aws-amplify/datastore';
import { User } from './models';
import { BsFillPlusCircleFill } from "react-icons/bs";
import { MdAccountCircle } from "react-icons/md";
import { RiMoneyDollarCircleFill } from "react-icons/ri";
import uniqueHash from "unique-hash";
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import Sidebar from "./Sidebar.js"
import Header from "./Header.js";
import { getProvider, connect, NewWagerInstruction } from "./utils.js";
import {
  Keypair,
  Connection,
  TransactionInstruction,
  sendAndConfirmTransaction,
  Transaction,
  PublicKey,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import {
  useWallet,
  useConnection,
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { Buffer } from "buffer";

let OptionsList = [];

function Dashboard(){

  const [bets, setBets] = useState([]);
  const [betComplete, setBetComplete] = useState([]);
  const [currentBet, setCurrentBet] = useState({});
  const [userBets, setUserBets] = useState([]);
  const [joinCode, setJoinCode] = useState("");

  //Vars
  let network = "https://api.devnet.solana.com";
  let connection = useConnection();
  connection = new Connection(network);
  let provider = getProvider(); // see "Detecting the Provider"

  let publicKey = useWallet();
  const systemProgram = new PublicKey("11111111111111111111111111111111");
  const rentSysvar = new PublicKey(
    "SysvarRent111111111111111111111111111111111"
  );
  const programId = Keypair.generate();

  const [betOption, setBetOption] = useState("");
  const [betValue, setBetValue] = useState(0);

  const [betIsOpen, setBetIsOpen] = useState(false);

  
  useEffect(() => {
    // Wallet detection
    connect(provider);
  })
  

  const handlejoinCodeChange = (e) => {
    setJoinCode(e.target.value);
  };

 
  const handleBetOption = (e) => {
    setBetOption(e.target.value);
  };

  const handleBetValue = (e) => {
    setBetValue(e.target.value);
  };

  const handleBetting = async (index) => {
    let option = betOption;
    let value = value;
    let bet = userBets[index]; //bet object in contention

    //Sending Bet Transaction and Balance for Bet
    let [potPDA, potBump] = await PublicKey.findProgramAddress(
      [Buffer.from(bet)],
      programId.publicKey
    );
    //Make bet RPC Call(Send Transaction for Make Bet)
    let instruction = new TransactionInstruction({
      keys: [
        {
          pubkey: publicKey,
          isSigner: false,
          isWritable: false,
        },
        { pubkey: potPDA, isSigner: false, isWritable: true },
        {
          pubkey: systemProgram.toString(),
          isSigner: false,
          isWritable: false,
        },
        {
          pubkey: rentSysvar.toString(),
          isSigner: false,
          isWritable: false,
        },
      ],
      programId: programId.publicKey.toString(),
      data: NewWagerInstruction(bet, value, option),
    });
    const transaction = new Transaction().add(instruction);
    transaction.recentBlockhash = await connection.getLatestBlockhash();
    transaction.feePayer = provider.publicKey;

    const signature = await provider.signAndSendTransaction(transaction);
    console.log("success!");
    await connection.getSignatureStatus(signature);
  };

  const handleJoinBet = async (id) => {
    //use account info to join based on if bet in id is active
  };

  const selectOption = (id, option) => {
    //use bet id and option
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
          area={"nav"}
        >
          <Sidebar/>
        </GridItem>

        <GridItem
          colSpan={10}
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

          <h1>Dashboard</h1>
          </div>
        </GridItem>
        
        <GridItem
          pl="2"
          colSpan={10}
          bg="#F7F8FC"
          area={"main"}
        >
          <InfiniteScroll
            dataLength={bets.length}
            next={bets}
            hasMore={false}
            loader={<h4>Loading...</h4>}
          >
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
                    <Card.Footer align="right">
                      {bet.options.map((option) => (
                        <Button
                          colorScheme="green"
                          mr={3}
                          onClick={() => selectOption(bet.id, option)}
                        >
                          {option}
                        </Button>
                      ))}
                    </Card.Footer>
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
                      onClick={() =>{
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
                      <Form
                          onSubmit={() => handleBetting(index)}
                          >
                        <ModalHeader>Make Bet</ModalHeader>
                        <ModalBody>
                          <>

                          
                            <FormControl isRequired>
                              <FormLabel>Bet Option</FormLabel>
                              <Select
                                onChange={() => handleBetOption}
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
                          <Button
                            type = "submit"
                            colorScheme="blue"
                          >
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
                                onChange={() => handleBetOption}
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
                      <Button variant="ghost" mr={3} onClick={() => setBetIsOpen(false)}>
                        Close
                      </Button>
                      <Button colorScheme="blue" onClick={() => handleJoinBet}>
                        Wager!
                      </Button>
                    </ModalFooter>
                  </ModalContent>
                </Modal>

          </InfiniteScroll>
        </GridItem>
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