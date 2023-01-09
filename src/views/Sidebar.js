import {
  useToast,
  Flex,
  FormControl,
  FormLabel,
  Icon,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Text,
} from "@chakra-ui/react";
import "bootstrap/dist/css/bootstrap.css";
import React, { useEffect, useState } from "react";

import {
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { QRCodeCanvas } from "qrcode.react";
import { BsFillDice5Fill } from "react-icons/bs";
import { FaDice } from "react-icons/fa";
import { MdLeaderboard } from "react-icons/md";
import { RiNumber1, RiNumber2, RiNumber3 } from "react-icons/ri";
import * as mutations from "../graphql/mutations";
import * as queries from "../graphql/queries";

import {
  CheckOutlined,
  CrownOutlined,
  DashboardOutlined,
  ExclamationCircleOutlined,
  PlusCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  PublicKey,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import { Layout, Menu } from "antd";
import { API, Auth } from "aws-amplify";
import { Buffer } from "buffer";
import { Button, Container, Form } from "react-bootstrap";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { NavLink as Link } from "react-router-dom";
import styled from "styled-components";
import { DASHBOARD, HOME, LEADERBOARD } from "../App.js";
import logo from "../assets/Wager.svg";
import { JoinBetInstruction, NewWagerInstruction } from "../utils/utils.js";
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

export function Sidebar(props) {
  const [toStart, setToStart] = useState(false);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [trustScore, setTrustScore] = useState("");
  const [bettingScore, setBettingScore] = useState("");
  const [leaderboards, setLeaderboards] = useState([]);
  const [allBoards, setAllBoards] = useState([]);

  const [user, setUser] = useState({});
  const [userID, setUserID] = useState("");
  const [betName, setBetName] = useState("");
  const [betCode, setBetCode] = useState("");
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
  const [addSuccessIsOpen, setAddSuccessIsOpen] = useState(false);
  const [addLeaderIsOpen, setAddLeaderIsOpen] = useState(false);
  const [addLeaderSuccessIsOpen, setAddLeaderSuccessIsOpen] = useState(false);
  const [newUser, setNewUser] = useState(false);
  const toast = useToast();

  const [start1IsOpen, setStart1IsOpen] = useState(false);
  const [start2IsOpen, setStart2IsOpen] = useState(false);
  const [start3IsOpen, setStart3IsOpen] = useState(false);

  const [joinIsOpen, setJoinIsOpen] = useState(false);
  const [joinLeaderIsOpen, setJoinLeaderIsOpen] = useState(false);

  const [joinCode, setJoinCode] = useState("");
  const [joinLeaderCode, setJoinLeaderCode] = useState("");

  //API Calls

  const getUsers = async () => {
    const users = await API.graphql({ query: queries.listUsers });
    return users;
  };
  const getBoards = async () => {
    const boards = await API.graphql({ query: queries.listLeaderboards });
    return boards;
  };

  useEffect(() => {
    let allBoards;
    getBoards()
      .catch(console.error)
      .then((boards) => {
        allBoards = boards.data.listLeaderboards.items;
        allBoards = allBoards.map((board) => board.id);
        setAllBoards(allBoards);
        getUsers()
          .catch(console.error)
          .then((users) => {
            let email = Auth.user.attributes.email;
            setEmail(email);
            let currentUser = users.data.listUsers.items.find(
              (x) => x.email == email
            );
            setUser(currentUser);
            if (currentUser != null) {
              let names = currentUser.name.split(" ");
              setFirstName(names[0]);
              setLastName(names[1]);
              setBirthdate(currentUser.birthdate);
              setPhoneNumber(currentUser.phonenumber);
              setLeaderboards(currentUser.leaderboards);
              setTrustScore(currentUser.trustscore);
              setBettingScore(currentUser.bettingscore);

              const queryParameters = new URLSearchParams(
                window.location.search
              );
              if (queryParameters.has("bet")) {
                betAPICall(queryParameters.get("bet"));
                setJoinCode(queryParameters.get("bet"));
                setJoinIsOpen(true);
              }
              if (queryParameters.has("leaderboard")) {
                setJoinLeaderCode(queryParameters.get("leaderboard"));
                setJoinLeaderIsOpen(true);
              }
            } else {
              setEditIsOpen(true);
              setNewUser(true);
              setStart1IsOpen(true);
            }
            if (publicKey != null && !newUser) {
              setEditIsOpen(false);
            }
          });
      });
  }, []);


  const betAPICall = async (betParam) => {
    //WRITE LOGIC FOR ADDING NEW BET FROM URL HERE
    //Param: betParam is the url parameter
    let [potPDA, potBump] = await PublicKey.findProgramAddress(
        [Buffer.from(betParam, 0, 20)],
        programId
      );

      let [playerPDA, playerBump] = await PublicKey.findProgramAddress(
        [Buffer.from(betParam, 0, 20), publicKey.toBytes()],
        programId
      );
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
      data: JoinBetInstruction(),
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

  let { connection } = useConnection();
  let { publicKey, sendTransaction } = useWallet();
  const systemProgram = new PublicKey("11111111111111111111111111111111");
  const rentSysvar = new PublicKey(
    "SysvarRent111111111111111111111111111111111"
  );

  const programId = new PublicKey(
    "GvtuZ3JAXJ29cU3CE5AW24uoHc2zAgrPaMGcFT4WMcrm"
  );

  //Handling Methods
  const clearBetState = () => {
    setBetName("");
    setMinPlayers(2);
    setMaxPlayers(2);
    setMinBet(0.0);
    setMaxBet(0.0);
    setOption("");
    setAllOptions([]);
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
    setTime(e);
  };

  const handleminPlayersChange = (e) => {
    setMinPlayers(e);
  };

  const handlemaxPlayersChange = (e) => {
    setMaxPlayers(e);
  };

  const handleminBetChange = (e) => {
    setMinBet(e);
  };

  const handlemaxBetChange = (e) => {
    setMaxBet(e);
  };
  const handleOptionNewChange = (e) => {
    setOption(e.target.value);
  };


  const handleOptionEnter = () => {
    if (OptionsList.indexOf(option) == -1) {
      if (option === "DELETE" || option == "") {
        OptionsList.splice(OptionsList.length - 1);
      } else {
        OptionsList.push(option);
      }
      setOption("");
    }
  };

  const handleBetSubmit = async (e) => {
    e.preventDefault();
    if (parseInt(maxPlayers) >= parseInt(minPlayers) && parseFloat(maxBet) >= parseFloat(minBet) && OptionsList != [] && time >= 0) {
      let totalOptions = [...OptionsList]
      while (totalOptions.length < 8) {
        totalOptions.push("zero");
      }
      let tempStr = betName + " ".repeat(20-betName.length);
      setBetName(tempStr);
      console.log(Buffer.from(tempStr))
      console.log(totalOptions);
      console.log(Buffer.from(betName));

      let timestamp = Math.floor(Date.now() / 1000) + (time * 3600); //TIME IN HOURS
      console.log(timestamp);

      //let index = uniqueHash(betName + maxBet + allOptions);
      console.log(Buffer.from(betName, 0, 20));

      let [potPDA, potBump] = await PublicKey.findProgramAddress(
        [Buffer.from(tempStr, 0, 20)],
        programId
      );

      let [playerPDA, playerBump] = await PublicKey.findProgramAddress(
        [Buffer.from(tempStr, 0, 20), publicKey.toBytes()],
        programId
      );
        console.log(betName);
        console.log(potPDA.toBase58());
        console.log(potBump);
        console.log(PublicKey.isOnCurve(potPDA));

      console.log([
        { name: totalOptions[0], vote_count: 0 },
        { name: totalOptions[1], vote_count: 0 },
        { name: totalOptions[2], vote_count: 0 },
        { name: totalOptions[3], vote_count: 0 },
        { name: totalOptions[4], vote_count: 0 },
        { name: totalOptions[5], vote_count: 0 },
        { name: totalOptions[6], vote_count: 0 },
        { name: totalOptions[7], vote_count: 0 },
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
          tempStr,
          minPlayers,
          maxPlayers,
          minBet,
          maxBet,
          //Options
          [
            { name: Buffer.from(totalOptions[0]), bet_count : 0, vote_count: 0 },
            { name: Buffer.from(totalOptions[1]), bet_count : 0, vote_count: 0 },
            { name: Buffer.from(totalOptions[2]), bet_count : 0, vote_count: 0 },
            { name: Buffer.from(totalOptions[3]), bet_count : 0, vote_count: 0 },
            { name: Buffer.from(totalOptions[4]), bet_count : 0, vote_count: 0 },
            { name: Buffer.from(totalOptions[5]), bet_count : 0, vote_count: 0 },
            { name: Buffer.from(totalOptions[6]), bet_count : 0, vote_count: 0 },
            { name: Buffer.from(totalOptions[7]), bet_count : 0, vote_count: 0 },
          ],
          time,
          potBump
          //Hours
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
      setJoinCode(betName);
      setAddIsOpen(false);
      clearBetState();
      setAddSuccessIsOpen(true);
    } else {
      alert("Invalid Bet Parameters");
    }
  };

  const handleLeaderSubmit = async (e) => {
    if (leaderName != "") {
      let board = {
        users: [Auth.user.attributes.email],
        name: leaderName,
      };
      let id;
      const leaderboard = await API.graphql({
        query: mutations.createLeaderboard,
        variables: { input: board },
      }).then((res) => {
        id = res.data.createLeaderboard.id;
        setJoinLeaderCode(id);
      });

      let currentBoards = user.leaderboards;
      currentBoards.push(id);

      const fullName = firstName + " " + lastName;

      let newUser = {
        id: user.id,
        email: email,
        name: fullName,
        birthdate: birthdate,
        phonenumber: phoneNumber,
        trustscore: user.trustscore,
        bettingscore: user.bettingscore,
        bets: user.bets,
        leaderboards: currentBoards,
        _version: user._version,
      };

      const userUpdate = await API.graphql({
        query: mutations.updateUser,
        variables: { input: newUser },
      }).then(() => {
        setAddLeaderIsOpen(false);
        setAddLeaderSuccessIsOpen(true);
      });
    } else {
      alert("Fill out all fields");
    }
  };

  const handlejoinCodeChange = (e) => {
    setJoinCode(e.target.value);
  };

  const downloadQRCode = () => {
    // Generate download with use canvas and stream
    const canvas = document.getElementById("qr-gen1");
    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    let downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `${joinCode}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const downloadQRCodeLeader = () => {
    // Generate download with use canvas and stream
    const canvas = document.getElementById("qr-gen2");
    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    let downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `${joinLeaderCode}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const handlejoinLeaderCodeChange = (e) => {
    setJoinLeaderCode(e.target.value);
  };

  const handleJoinBet = async (e) => {
    e.preventDefault();
    //let option = betOption;
    //let value = value;
    //let joinCode = joinCode; //bet object in contention
    console.log(publicKey.toString());
    let tempStr = joinCode + " ".repeat(20-joinCode.length);
    setJoinCode(tempStr);

    console.log(Buffer.from(joinCode));
    //Sending Bet Transaction and Balance for Bet
    let [potPDA, potBump] = await PublicKey.findProgramAddress(
      [Buffer.from(tempStr)],
      programId
    );
    console.log([
      Buffer.from(tempStr),
      publicKey.toBytes(),
      programId.toBytes(),
    ]);
    let [playerPDA, playerBump] = await PublicKey.findProgramAddress(
      [Buffer.from(tempStr, 0, 20), publicKey.toBytes()],
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
      data: JoinBetInstruction(),
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
    setJoinIsOpen(false);
    toast({
      title: joinCode + " Successfuly Joined.",
      description: "Now let's get betting!",
      status: "success",
      duration: 9000,
      isClosable: true,
    });
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

  const handleEditSubmit = async () => {
    if (publicKey != null) {
      const name = firstName + " " + lastName;
      if (
        firstName != "" &&
        lastName != "" &&
        phoneNumber != "" &&
        birthdate != ""
      ) {
        let birthday = +new Date(birthdate);
        let age = ~~((Date.now() - birthday) / 31557600000);
        if (age >= 21) {
          if (user != null) {
            let newUser = {
              id: user.id,
              email: email,
              name: name,
              birthdate: birthdate,
              phonenumber: phoneNumber,
              trustscore: user.trustscore,
              bettingscore: user.bettingscore,
              bets: user.bets,
              leaderboards: user.leaderboards,
              _version: user._version,
            };

            const promise = await API.graphql({
              query: mutations.updateUser,
              variables: { input: newUser },
            }).then((res) => {
              setEditIsOpen(false);
            });
          } else {
            let newUser = {
              email: email,
              name: name,
              birthdate: birthdate,
              phonenumber: phoneNumber,
              trustscore: 100,
              bettingscore: 0,
              bets: [],
              leaderboards: [],
            };

            const promise = await API.graphql({
              query: mutations.createUser,
              variables: { input: newUser },
            }).then((res) => {
              setNewUser(false);
              setEditIsOpen(false);
            });
          }
        } else {
          alert("Must be 21 years of age or older");
        }
      } else {
        alert("Fill out all fields");
      }
    } else {
      alert("Connect Solana Wallet");
    }
  };

  const handleJoinLeaderSubmit = async () => {
    if (joinLeaderCode != "") {
      let currentBoards = user.leaderboards;
      if (
        !currentBoards.includes(joinLeaderCode) &&
        allBoards.includes(joinLeaderCode)
      ) {
        currentBoards.push(joinLeaderCode);
        const fullName = firstName + " " + lastName;

        let newUser = {
          id: user.id,
          email: email,
          name: fullName,
          birthdate: birthdate,
          phonenumber: phoneNumber,
          trustscore: user.trustscore,
          bettingscore: user.bettingscore,
          bets: user.bets,
          leaderboards: currentBoards,
          _version: user._version,
        };

        const userUpdate = await API.graphql({
          query: mutations.updateUser,
          variables: { input: newUser },
        });

        const currentLeaderboard = await API.graphql({
          query: queries.getLeaderboard,
          variables: { id: joinLeaderCode },
        });

        let current = currentLeaderboard.data.getLeaderboard;
        let currentUsers = current.users;
        if (!currentUsers.includes(email)) {
          currentUsers.push(email);
          let board = {
            id: current.id,
            users: email,
            name: current.name,
          };

          const leaderboard = await API.graphql({
            query: mutations.updateLeaderboard,
            variables: { input: board }
          })
        }
        setJoinLeaderIsOpen(false);
        toast({
          title: "Leaderboard Joined!",
          description: "Now it's time to brag.",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      } else {
        alert("Invalid Leaderboard Code");
      }
    } else {
      alert("Fill out all fields");
    }
  };

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
            window.location.pathname == DASHBOARD || window.location.pathname == DASHBOARD.toLowerCase() ? ["1"] : ["2"]
          }
          mode="inline"
        >
          <SubMenu key="sub1" title={email} icon={<UserOutlined />}>
            <Menu.Item onClick={() => setAccIsOpen(true)} key="8">
              Account Details
            </Menu.Item>
            <Menu.Item onClick={handleSignOut} key="9">
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
          {window.location.pathname == DASHBOARD || window.location.pathname == DASHBOARD.toLowerCase()? (
            <>
              <Menu.Item
                onClick={() => {
                  if (publicKey == null){
                    setEditIsOpen(true);
                  }else{
                    setAddIsOpen(true);
                  }
                }}
                icon={<PlusCircleOutlined />}
                key="6"
              >
                Create a Bet
              </Menu.Item>
              <Menu.Item
                onClick={() => {
                  if (publicKey == null){
                    setEditIsOpen(true);
                  }else{
                  setJoinIsOpen(true)
                  }
                }}
                icon={<CheckOutlined />}
                key="7"
              >
                Join Bet
              </Menu.Item>

              <Modal isOpen={addIsOpen} onClose={() => setAddIsOpen(false)}>
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>Create New Bet</ModalHeader>
                  <Form>
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
                              min={minPlayers}
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
                              min={minBet}
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
                            value = {time}
                            placeholder="Enter Time for Betting"
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
                      <Button onClick={handleBetSubmit} variant="primary">
                        Wager!
                      </Button>
                    </ModalFooter>
                  </Form>
                </ModalContent>
              </Modal>

              <Modal
                isOpen={addSuccessIsOpen}
                onClose={() => {
                  setAddSuccessIsOpen(false);
                  setJoinCode("");
                  window.location.reload();
                }}
              >
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>Bet Created!</ModalHeader>
                  <ModalBody>
                  <h1 style = {{fontSize: "15px"}}><strong>Bet Code:</strong><u><a onClick={() => {
                          navigator.clipboard.writeText(joinCode)
                          alert("Copied to Clipboard")
                          }}> {joinCode}</a></u></h1><br/>
                    <h3 style={{ fontSize: "15px" }}>
                      <strong>Join Link:</strong>{" "}
                      <u>
                        <a
                          onClick={() => {
                            navigator.clipboard.writeText(
                              window.location.href + "?bet=" + joinCode
                            );
                            alert("Copied to Clipboard");
                          }}
                        >
                          {window.location.href + "?bet=" + joinCode}
                        </a>
                      </u>
                    </h3>
                    <br />
                    <QRCodeCanvas
                      id="qr-gen1"
                      includeMargin={true}
                      value={window.location.href + "?bet=" + joinCode}
                    />

                    <Button onClick={downloadQRCode}>Download QR Code</Button>
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      variant="ghost"
                      mr={3}
                      onClick={() => {
                        setAddSuccessIsOpen(false);
                        setJoinCode("");
                        window.location.reload();
                      }}
                    >
                      Close
                    </Button>
                  </ModalFooter>
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
                            value={joinCode}
                            onChange={handlejoinCodeChange}
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
                      <Button type="submit" variant="primary">
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
                  <Form>
                    <ModalBody>
                      <>
                        <FormControl isRequired>
                          <FormLabel>Leaderboard Name</FormLabel>
                          <Input
                            onChange={handleLeaderNameChange}
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
                      <Button onClick={handleLeaderSubmit} variant="primary">
                        Create
                      </Button>
                    </ModalFooter>
                  </Form>
                </ModalContent>
              </Modal>

              <Modal
                isOpen={addLeaderSuccessIsOpen}
                onClose={() => setAddLeaderSuccessIsOpen(false)}
              >
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>Leaderboard Created!</ModalHeader>
                  <ModalBody>
                  <h1 style = {{fontSize: "15px"}}><strong>Leaderboard Code:</strong><u><a onClick={() => {
                          navigator.clipboard.writeText(joinLeaderCode)
                          alert("Copied to Clipboard")
                          }}> {joinLeaderCode}</a></u></h1><br/>
                    <h3 style={{ fontSize: "15px" }}>
                      <strong>Join Link:</strong>{" "}
                      <u>
                        <a
                          onClick={() => {
                            navigator.clipboard.writeText(
                              window.location.href +
                                "?leaderboard=" +
                                joinLeaderCode
                            );
                            alert("Copied to Clipboard");
                          }}
                        >
                          {window.location.href +
                            "?leaderboard=" +
                            joinLeaderCode}
                        </a>
                      </u>
                    </h3>
                    <br />
                    <QRCodeCanvas
                      id="qr-gen2"
                      includeMargin={true}
                      value={
                        window.location.href + "?leaderboard=" + joinLeaderCode
                      }
                    />
                    <Button onClick={downloadQRCodeLeader}>
                      Download QR Code
                    </Button>
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      variant="ghost"
                      mr={3}
                      onClick={() => {
                        setAddLeaderSuccessIsOpen(false);
                        setJoinLeaderCode("");
                      }}
                    >
                      Close
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>

              <Modal
                isOpen={joinLeaderIsOpen}
                onClose={() => setJoinLeaderIsOpen(false)}
              >
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>Join Leaderboard</ModalHeader>
                  <Form>
                    <ModalBody>
                      <>
                        <FormControl isRequired>
                          <FormLabel>Leaderboard Code</FormLabel>
                          <Input
                            placeholder="Leaderboard Code"
                            value={joinLeaderCode}
                            onChange={handlejoinLeaderCodeChange}
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
                      <Button
                        onClick={handleJoinLeaderSubmit}
                        variant="primary"
                      >
                        Join
                      </Button>
                    </ModalFooter>
                  </Form>
                </ModalContent>
              </Modal>
            </>
          )}
          <Menu.Item icon={<ExclamationCircleOutlined />} key = "8">
            <a
              href="https://forms.gle/r288veKH6uAU6spUA"
              target="_blank"
        
            >
              Contact Support
            </a>
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
            <strong>Trust Score: </strong> {trustScore} <br />
            <br />
            <strong>Betting Score: </strong> {bettingScore} <br />
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

      <Modal isOpen={editIsOpen}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Account Information</ModalHeader>
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
                    value={lastName}
                    placeholder="Last name"
                  />
                </FormControl>
              </Flex>
              <br />
              <FormControl isRequired>
                <FormLabel>Phone Number</FormLabel>
                <PhoneInput
                  country="us"
                  placeholder="Enter phone number"
                  onlyCountries={["us"]}
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
                  value={birthdate}
                  onChange={handleBirthdateChange}
                />
              </FormControl>
              <br />
              <FormLabel>Solana Wallet Connection</FormLabel>
              <Flex>
                <WalletMultiButton
                  onClick={() => {
                    setEditIsOpen(false);
                  }}
                  style={{ margin: "1%" }}
                />

                <WalletDisconnectButton
                  onClick={() => {
                    setEditIsOpen(false);
                  }}
                  style={{ margin: "1%" }}
                />
              </Flex>
            </ModalBody>
            <ModalFooter>
              <Button
                variant="ghost"
                mr={3}
                onClick={() => {
                  if (publicKey != null && !newUser) {
                    setEditIsOpen(false);
                  }
                }}
              >
                Close
              </Button>
              <Button variant="primary" onClick={handleEditSubmit}>
                Submit
              </Button>
            </ModalFooter>
          </Form>
        </ModalContent>
      </Modal>

      <Modal isOpen={start1IsOpen} size="lg" isCentered>
        <ModalOverlay backdropFilter="blur(10px) brightness(0%)" />
        <ModalContent>
          <ModalHeader>
            <Icon h={"10%"} w={"10%"} as={FaDice} color="#195F50" />
            <Text fontSize="3xl" as="b" color="#195F50">
              Welcome to Wager
            </Text>
          </ModalHeader>
          <ModalBody>
            <Text fontSize="xl">
              Wager is a social betting app that allows a user to bet on any
              event and compete with a network of users across the platform.
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="primary"
              onClick={() => {
                setStart1IsOpen(false);
                setStart2IsOpen(true);
              }}
            >
              Continue
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={start2IsOpen} size="lg" isCentered>
        <ModalOverlay backdropFilter="blur(10px) brightness(0%)" />
        <ModalContent>
          <ModalHeader>
            <Text fontSize="3xl" as="b" color="#195F50">
              Wager Features
            </Text>
          </ModalHeader>
          <ModalBody>
            <Flex>
              <Icon as={BsFillDice5Fill} h={"7%"} w={"7%"} color="#195F50" />
              <Text style={{ marginLeft: "15px" }} fontSize="xl">
                Set up and share bets with your friends with access through your{" "}
                <u>
                  <a href="https://phantom.app/" target="_blank">Phantom</a>
                </u>{" "}
                wallet
              </Text>{" "}
              <br />
            </Flex>{" "}
            <br />
            <Flex>
              <Icon as={MdLeaderboard} h={"7%"} w={"7%"} color="#195F50" />
              <Text style={{ marginLeft: "15px" }} fontSize="xl">
                Compete using your bet records across the platforms through a
                leaderboard system
              </Text>
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="primary"
              onClick={() => {
                setStart2IsOpen(false);
                setStart3IsOpen(true);
              }}
            >
              Continue
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={start3IsOpen} size="lg" isCentered>
        <ModalOverlay backdropFilter="blur(10px) brightness(0%)" />
        <ModalContent>
          <ModalHeader>
            <Text fontSize="3xl" as="b" color="#195F50">
              Next Steps
            </Text>
          </ModalHeader>
          <ModalBody>
            <Flex>
              <Icon as={RiNumber1} h={"7%"} w={"7%"} color="#195F50" />
              <Text style={{ marginLeft: "15px" }} fontSize="xl">
                Fill out the Account Information form to register as a user in
                Wager
              </Text>{" "}
              <br />
            </Flex>{" "}
            <br />
            <Flex>
              <Icon as={RiNumber2} h={"7%"} w={"7%"} color="#195F50" />
              <Text style={{ marginLeft: "15px" }} fontSize="xl">
                Connect your Phantom wallet to the account to link your bets to
                the account
              </Text>{" "}
              <br />
            </Flex>{" "}
            <br />
            <Flex>
              <Icon as={RiNumber3} h={"7%"} w={"7%"} color="#195F50" />
              <Text style={{ marginLeft: "15px" }} fontSize="xl">
                Start Wagering!
              </Text>
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="primary"
              onClick={() => {
                setStart3IsOpen(false);
                setEditIsOpen(true);
              }}
            >
              Get Started
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default Sidebar;
