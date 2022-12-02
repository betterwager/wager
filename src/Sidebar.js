import React, { useEffect, useState, useMemo } from "react";
import "bootstrap/dist/css/bootstrap.css";
import {
  Modal,
  NumberInput,
  NumberInputField,
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
  Flex,
} from "@chakra-ui/react";
import * as queries from "./graphql/queries";
import * as mutations from "./graphql/mutations";
import * as subscriptions from "./graphql/subscriptions";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";

import { clusterApiUrl } from "@solana/web3.js";
import { DataStore } from "@aws-amplify/datastore";
import { User } from "./models";
import { Form, Container, Button } from "react-bootstrap";
import { Auth, API } from "aws-amplify";
import styled from "styled-components";
import logo from "./assets/Wager.svg";
import { NavLink as Link } from "react-router-dom";
import { HOME, DASHBOARD, LEADERBOARD } from "./App.js";
import {
  DashboardOutlined,
  CrownOutlined,
  UserOutlined,
  PlusCircleOutlined,
  ExclamationCircleOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import {
  getProvider,
  connect,
  NewWagerInstruction,
  JoinBetInstruction,
} from "./utils.js";
import {
  Keypair,
  Connection,
  TransactionInstruction,
  Transaction,
  PublicKey,
} from "@solana/web3.js";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { Buffer } from "buffer";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Layout, Menu } from "antd";
require("@solana/wallet-adapter-react-ui/styles.css");
const { Sider } = Layout;
const { SubMenu } = Menu;
const NavLink = styled(Link)`
  color: #fff;
  display: flex;
  align-items: center;
  text-decoration: none;
  height: 100%;
  cursor: pointer;
  &.active {
    color: #15cdfc;
  }
`;

let OptionsList = [];

export function Sidebar() {
  //API Calls
  useEffect(() => {
    const getUsers = async () => {
      setEmail(Auth.user.attributes.email);
      let users = await API.graphql({ query: queries.listUsers });
      users = users.data.listUsers.items;
      console.log(users[0].name);
      if (users.length == 0) {
        setToStart(true);
      } else {
        setUser(users[0]);
        setFirstName(users[0].name.split(" ")[0]);
        setLastName(users[0].name.split(" ")[1]);
        setBirthdate(users[0].birthdate);
        setPhoneNumber(users[0].phonenumber);
        setTrustScore(users[0].trustscore);
        setBettingScore(users[0].bettingscore);
        setWallet(users[0].wallet);
      }
    };
    getUsers().catch(console.error);
  }, []);

  let { connection } = useConnection();
  let { publicKey, sendTransaction } = useWallet();
  const systemProgram = new PublicKey("11111111111111111111111111111111");
  const rentSysvar = new PublicKey(
    "SysvarRent111111111111111111111111111111111"
  );

  const programId = new PublicKey(
    "EEjpJXCfHEqcRyAxW6tr3MNZqpP2MjAErkezFyp4HEah"
  );

  //State Variables
  const [toStart, setToStart] = useState(false);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [trustScore, setTrustScore] = useState("");
  const [bettingScore, setBettingScore] = useState("");
  const [wallet, setWallet] = useState("");
  const [leaderboards, setLeaderboards] = useState("");

  const [user, setUser] = useState({});
  const [betName, setBetName] = useState("");
  const [leaderName, setLeaderName] = useState("");
  const [minPlayers, setMinPlayers] = useState(2);
  const [maxPlayers, setMaxPlayers] = useState(2);
  const [minBet, setMinBet] = useState(0.0);
  const [maxBet, setMaxBet] = useState(0.0);
  const [allOptions, setAllOptions] = useState([]);
  const [option, setOption] = useState("");
  const [time, setTime] = useState(0);

  const [editIsOpen, setEditIsOpen] = useState(false);
  const [accIsOpen, setAccIsOpen] = useState(false);
  const [addIsOpen, setAddIsOpen] = useState(false);
  const [addLeaderIsOpen, setAddLeaderIsOpen] = useState(false);

  const [joinIsOpen, setJoinIsOpen] = useState(false);
  const [joinLeaderIsOpen, setJoinLeaderIsOpen] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [joinLeaderCode, setJoinLeaderCode] = useState("");

  //Handling Methods
  const clearBetState = () => {
    setBetName("");
    setMinPlayers(2);
    setMaxPlayers(2);
    setMinBet(0.0);
    setMaxBet(0.0);
    setOption("");
    OptionsList = [];
    setTime(0);
  };

  const handleBetNameChange = (e) => {
    setBetName(e.target.value);
  };

  const handleLeaderNameChange = (e) => {
    setLeaderName(e.target.value);
  };

  const handleTimeChange = (e) => {
    setTime(e.value);
  };

  const handleminPlayersChange = (e) => {
    setMinPlayers(e.value);
  };

  const handlemaxPlayersChange = (e) => {
    setMaxPlayers(e.value);
  };

  const handleminBetChange = (e) => {
    setMinBet(e.value);
  };

  const handlemaxBetChange = (e) => {
    setMaxBet(e.value);
  };
  const handleOptionNewChange = (e) => {
    setOption(e.target.value);
  };

  const handleOptionEnter = () => {
    if (OptionsList.indexOf(option) == -1) {
      if (option === "DELETE" || option == "") {
        OptionsList.splice(OptionsList.length - 1);
      } else {
        console.log(option);
        OptionsList.push(option);
      }
      setAllOptions(OptionsList);
      setOption("");
    }
  };

  const handleBetSubmit = async (e) => {
    e.preventDefault();
    while (allOptions.length < 8) {
      let temp = allOptions;
      temp.push("zero");
      setAllOptions(temp);
    }
    console.log(allOptions);
    console.log(Buffer.from(betName));

    let hours = time; //TIME IN HOURS
    //let index = uniqueHash(betName + maxBet + allOptions);
    console.log(Buffer.alloc(20, betName));

    let [potPDA, potBump] = await PublicKey.findProgramAddress(
      [Buffer.alloc(20, betName)],
      programId
    );

    let [playerPDA, playerBump] = await PublicKey.findProgramAddress(
      [Buffer.alloc(20, betName), publicKey.toBytes()],
      programId
    );
    /*     console.log(name);
      console.log(provider.publicKey.toBase58());
      console.log(potPDA.toBase58());
      console.log(potBump);
      console.log(PublicKey.isOnCurve(potPDA)); */

    console.log([
      { name: allOptions[0], vote_count: 0 },
      { name: allOptions[1], vote_count: 0 },
      { name: allOptions[2], vote_count: 0 },
      { name: allOptions[3], vote_count: 0 },
      { name: allOptions[4], vote_count: 0 },
      { name: allOptions[5], vote_count: 0 },
      { name: allOptions[6], vote_count: 0 },
      { name: allOptions[7], vote_count: 0 },
    ]);

    //Create bet RPC Call(Send Transaction for Create Bet)
    const instruction = new TransactionInstruction({
      programId: programId,
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
          pubkey: rentSysvar,
          isSigner: false,
          isWritable: false,
        },
      ],
      data: NewWagerInstruction(
        betName,
        minPlayers,
        maxPlayers,
        minBet,
        maxBet,
        //options,
        [
          { name: Buffer.from(allOptions[0]), vote_count: 0 },
          { name: Buffer.from(allOptions[1]), vote_count: 0 },
          { name: Buffer.from(allOptions[2]), vote_count: 0 },
          { name: Buffer.from(allOptions[3]), vote_count: 0 },
          { name: Buffer.from(allOptions[4]), vote_count: 0 },
          { name: Buffer.from(allOptions[5]), vote_count: 0 },
          { name: Buffer.from(allOptions[6]), vote_count: 0 },
          { name: Buffer.from(allOptions[7]), vote_count: 0 },
        ],
        potBump
        //hours
      ),
    });
    let transaction = new Transaction().add(instruction);
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
    console.log(transaction);
    setAddIsOpen(false);
  };

  const handleLeaderSubmit = (e) => {
    //Create leaderboard
  };

  const handlejoinCodeChange = (e) => {
    setJoinCode(e.target.value);
  };

  const handlejoinLeaderCodeChange = (e) => {
    setJoinLeaderCode(e.target.value);
  };

  const handleJoinBet = async (e) => {
    e.preventDefault();
    //let option = betOption;
    //let value = value;
    //let joinCode = joinCode; //bet object in contention
    //Sending Bet Transaction and Balance for Bet
    //Sending Bet Transaction and Balance for Bet
    let [potPDA, potBump] = await PublicKey.findProgramAddress(
      [Buffer.alloc(20, joinCode)],
      programId
    );
    console.log([
      [Buffer.from(joinCode)],
      publicKey.toBytes(),
      programId.toBytes(),
    ]);
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
        {
          pubkey: rentSysvar,
          isSigner: false,
          isWritable: false,
        },
      ],
      programId: programId,
      data: JoinBetInstruction(joinCode),
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
    //use account info to join based on if bet in id is active
  };

  const selectOption = (id, option) => {
    //use bet id and option
  };

  const handleSignOut = () => {
    Auth.signOut();
  };

  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value);
  };

  const handleLastNameChange = (e) => {
    setLastName(e.target.value);
  };

  const handleBirthdateChange = (e) => {
    setBirthdate(e.target.value);
  };

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handleWalletChange = (e) => {
    setWallet(e.target.value);
  };

  const handleEditSubmit = async () => {
    console.log(birthdate);
    const name = firstName + " " + lastName;

    console.log(toStart);
    if (!toStart) {
      let User = {
        email: email,
        name: name,
        birthdate: birthdate,
        phonenumber: phoneNumber,
        trustscore: 0,
        bettingscore: 0,
        bets: [],
        wallet: wallet,
        leaderboards: [],
      };
      await API.graphql({
        query: mutations.createUser,
        variables: { input: User },
      });
    } else {
      let User = {
        email: email,
        name: name,
        birthdate: birthdate,
        phonenumber: phoneNumber,
        wallet: wallet,
      };
      await API.graphql({
        query: mutations.updateUser,
        variables: { input: User },
      });
    }
  };

  const path = window.location.pathname;
  return (
    <>
      <Sider
        style={{
          position: "fixed",
          height: "100vh",
          width: "10vw",
          backgroundColor: "#195F50",
        }}
      >
        <Container
          style={{
            marginLeft: "1vh",
            marginTop: "3vh",
            marginBottom: "3vh",
            width: "100%",
            alignContent: "center",
          }}
        >
          <div style={{ marginLeft: "0px", padding: "0.5vw" }}>
            <NavLink to={HOME}>
              <img
                height="40vh"
                className="img-responsive"
                src={logo}
                alt="logo"
              />
            </NavLink>
          </div>
        </Container>
        <Menu
          style={{ backgroundColor: "#195F50" }}
          theme="dark"
          defaultSelectedKeys={
            path === DASHBOARD ? ["1"] : path === LEADERBOARD ? ["2"] : []
          }
          mode="inline"
        >
          <SubMenu key="sub1" title={email} icon={<UserOutlined />}>
            <Menu.Item onClick={() => setAccIsOpen(true)} key="8">
              Account Details
            </Menu.Item>
            <Menu.Item onClick={() => handleSignOut} key="9">
              Sign Out
            </Menu.Item>
          </SubMenu>
          <Menu.Item key="1" href={DASHBOARD} icon={<DashboardOutlined />}>
            <a href={DASHBOARD}>Dashboard</a>
          </Menu.Item>
          <Menu.Item key="2" icon={<CrownOutlined />}>
            <a href={LEADERBOARD}>Leaderboard</a>
          </Menu.Item>
        </Menu>
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <Menu style={{ backgroundColor: "#195F50" }} theme="dark" mode="inline">
          {path == DASHBOARD ? (
            <>
              <Menu.Item
                onClick={() => {
                  setAddIsOpen(true);
                }}
                icon={<PlusCircleOutlined />}
                key="6"
              >
                Create a Bet
              </Menu.Item>
              <Menu.Item
                onClick={() => setJoinIsOpen(true)}
                icon={<CheckOutlined />}
                key="7"
              >
                Join Bet
              </Menu.Item>

              <Modal isOpen={addIsOpen} onClose={() => setAddIsOpen(false)}>
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>Create New Bet</ModalHeader>
                  <Form onSubmit={(e) => handleBetSubmit(e)}>
                    <ModalBody>
                      <>
                        <FormControl isRequired>
                          <FormLabel>Bet Name</FormLabel>
                          <Input
                            onChange={handleBetNameChange}
                            placeholder="Bet name"
                          />
                        </FormControl>

                        <br />
                        <Flex>
                          <FormControl isRequired>
                            <FormLabel>Minimum Players</FormLabel>
                            <NumberInput
                              onChange={handleminPlayersChange}
                              value={minPlayers}
                              min={2}
                            >
                              <NumberInputField />
                              <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                              </NumberInputStepper>
                            </NumberInput>
                          </FormControl>

                          <FormControl isRequired>
                            <FormLabel>Maximum Players</FormLabel>
                            <NumberInput
                              onChange={handlemaxPlayersChange}
                              value={maxPlayers}
                              min={2}
                            >
                              <NumberInputField />
                              <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                              </NumberInputStepper>
                            </NumberInput>
                          </FormControl>
                        </Flex>

                        <br />
                        <Flex>
                          <FormControl isRequired>
                            <FormLabel>Minimum Bet ($)</FormLabel>
                            <NumberInput
                              onChange={handleminBetChange}
                              value={minBet}
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

                          <FormControl isRequired>
                            <FormLabel>Maximum Bet ($)</FormLabel>
                            <NumberInput
                              onChange={handlemaxBetChange}
                              value={maxBet}
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
                        </Flex>

                        <br />

                        <Flex>
                          <FormControl>
                            <FormLabel>Options</FormLabel>
                            <Input
                              onChange={handleOptionNewChange}
                              value={option}
                              placeholder="Enter Option"
                            />
                            <Button
                              variant="secondary"
                              onClick={handleOptionEnter}
                              style={{ marginTop: 10 }}
                            >
                              Log Option
                            </Button>
                            <br />
                          </FormControl>
                        </Flex>
                        <br />
                        {OptionsList.map((option) => {
                          return <p key={option}>{option}</p>;
                        })}

                        <br />

                        <FormControl isRequired>
                          <FormLabel>Hours to Bet</FormLabel>
                          <NumberInput
                            onChange={handleTimeChange}
                            value={time}
                            placeholder="Enter Option"
                          >
                            <NumberInputField />
                          </NumberInput>
                        </FormControl>
                      </>
                    </ModalBody>
                    <ModalFooter>
                      <Button
                        variant="ghost"
                        mr={3}
                        onClick={() => {
                          setAddIsOpen(false);
                          clearBetState();
                        }}
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

              <Modal isOpen={joinIsOpen} onClose={() => setJoinIsOpen(false)}>
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>Join Bet</ModalHeader>
                  <Form onSubmit={(e) => handleJoinBet(e)}>
                    <ModalBody>
                      <>
                        <FormControl isRequired>
                          <FormLabel>Bet Code</FormLabel>
                          <Input
                            placeholder="Bet Code"
                            onChange={(e) => handlejoinCodeChange(e)}
                          />
                        </FormControl>
                      </>
                    </ModalBody>

                    <ModalFooter>
                      <Button
                        variant="ghost"
                        mr={3}
                        onClick={() => setJoinIsOpen(false)}
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
            </>
          ) : (
            <>
              <Menu.Item
                onClick={() => setAddLeaderIsOpen(true)}
                icon={<PlusCircleOutlined />}
                key="6"
              >
                Create a Leaderboard
              </Menu.Item>
              <Menu.Item
                onClick={() => setJoinLeaderIsOpen(true)}
                icon={<CheckOutlined />}
                key="7"
              >
                Join Leaderboard
              </Menu.Item>

              <Modal
                isOpen={addLeaderIsOpen}
                onClose={() => setAddLeaderIsOpen(false)}
              >
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>Create New Leaderboard</ModalHeader>
                  <Form onSubmit={() => handleLeaderSubmit}>
                    <ModalBody>
                      <>
                        <FormControl isRequired>
                          <FormLabel>Leaderboard Name</FormLabel>
                          <Input
                            onChange={() => handleLeaderNameChange}
                            placeholder="Bet name"
                          />
                        </FormControl>
                      </>
                    </ModalBody>
                    <ModalFooter>
                      <Button
                        variant="ghost"
                        mr={3}
                        onClick={() => setAddLeaderIsOpen(false)}
                      >
                        Close
                      </Button>
                      <Button type="submit" colorScheme="blue">
                        Create
                      </Button>
                    </ModalFooter>
                  </Form>
                </ModalContent>
              </Modal>

              <Modal
                isOpen={joinLeaderIsOpen}
                onClose={() => setJoinLeaderIsOpen(false)}
              >
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>Join Leaderboard</ModalHeader>
                  <Form onSubmit={() => {}}>
                    <ModalBody>
                      <>
                        <FormControl isRequired>
                          <FormLabel>Leaderboard Code</FormLabel>
                          <Input
                            placeholder="Bet Code"
                            onChange={() => handlejoinLeaderCodeChange()}
                          />
                        </FormControl>
                      </>
                    </ModalBody>

                    <ModalFooter>
                      <Button
                        variant="ghost"
                        mr={3}
                        onClick={() => setJoinLeaderIsOpen(false)}
                      >
                        Close
                      </Button>
                      <Button type="submit" colorScheme="blue">
                        Join
                      </Button>
                    </ModalFooter>
                  </Form>
                </ModalContent>
              </Modal>
            </>
          )}
          <Menu.Item icon={<ExclamationCircleOutlined />} key="8">
            <a href={HOME}>Contact Support</a>
          </Menu.Item>
        </Menu>
      </Sider>

      <Modal isOpen={accIsOpen} onClose={() => setAccIsOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Account Details</ModalHeader>
          <ModalBody>
            <strong>Name: </strong> {firstName} {lastName}
            <br />
            <br />
            <strong>Email: </strong> {email} <br />
            <br />
            <strong>Phone Number: </strong> {phoneNumber} <br />
            <br />
            <strong>Wallet: </strong> {wallet} <br />
            <br />
            <strong>Trust Score: </strong> 0.85 {trustScore} <br />
            <br />
            <strong>Betting Score: </strong> $85{bettingScore} <br />
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={() => setAccIsOpen(false)}>
              Close
            </Button>
            <Button
              mr={3}
              onClick={() => {
                setAccIsOpen(false);
                setEditIsOpen(true);
              }}
            >
              Edit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={editIsOpen} onClose={() => setEditIsOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Account Information</ModalHeader>
          <Form>
            <ModalBody>
              <Flex>
                <FormControl isRequired>
                  <FormLabel>First Name</FormLabel>
                  <Input
                    onChange={handleFirstNameChange}
                    value={firstName}
                    placeholder="First name"
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Last Name</FormLabel>
                  <Input
                    onChange={handleLastNameChange}
                    placeholder="Last name"
                  />
                </FormControl>
              </Flex>
              <br />
              <FormControl isRequired>
                <FormLabel>Phone Number</FormLabel>
                <PhoneInput
                  placeholder="Enter phone number"
                  value={phoneNumber}
                  onChange={(phone) => setPhoneNumber(phone)}
                />
              </FormControl>
              <br />
              <FormControl isRequired>
                <FormLabel>Date of Birth</FormLabel>
                <Form.Control
                  type="date"
                  name="dob"
                  onChange={handleBirthdateChange}
                />
              </FormControl>
              <br />
              <FormControl isRequired>
                <FormLabel>Solana Wallet Address</FormLabel>
                <Input
                  onChange={handleWalletChange}
                  placeholder="Wallet Address"
                />
                <br />
                <Flex>
                  <WalletMultiButton
                    onClick={() => setEditIsOpen(false)}
                    style={{ margin: "1%" }}
                  />
                  <WalletDisconnectButton
                    onClick={() => setEditIsOpen(false)}
                    style={{ margin: "1%" }}
                  />
                </Flex>
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button
                variant="ghost"
                mr={3}
                onClick={() => setEditIsOpen(false)}
              >
                Close
              </Button>
              <Button colorScheme="blue" onClick={handleEditSubmit}>
                Submit
              </Button>
            </ModalFooter>
          </Form>
        </ModalContent>
      </Modal>
    </>
  );
}

export default Sidebar;