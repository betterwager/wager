import React, { useEffect, useState, useMemo } from "react";
import 'bootstrap/dist/css/bootstrap.css';
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
import { DataStore } from '@aws-amplify/datastore';
import { User } from './models';
import {Form, Container, Button} from 'react-bootstrap';
import { Auth } from 'aws-amplify';
import styled from 'styled-components';
import logo from './assets/Wager.svg'
import{ 
  NavLink as Link,
} from "react-router-dom";
import {HOME, DASHBOARD, LEADERBOARD} from './App.js'
import {
  DashboardOutlined,
  CrownOutlined,
  UserOutlined,
  PlusCircleOutlined,
  ExclamationCircleOutlined,
  CheckOutlined
} from '@ant-design/icons';
import { getProvider, connect, NewWagerInstruction } from "./utils.js";
import {
  Keypair,
  Connection,
  TransactionInstruction,
  Transaction,
  PublicKey,
} from "@solana/web3.js";
import {
  useWallet,
  useConnection,
} from "@solana/wallet-adapter-react";
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { Layout, Menu } from 'antd';
require("@solana/wallet-adapter-react-ui/styles.css");
const {Sider } = Layout;
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


  export function Sidebar(){
    
    const network = WalletAdapterNetwork.Devnet;

    // You can also provide a custom RPC endpoint.
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  
    const wallets = useMemo(
      () => [
        /**
         * Wallets that implement either of these standards will be available automatically.
         *
         *   - Solana Mobile Stack Mobile Wallet Adapter Protocol
         *     (https://github.com/solana-mobile/mobile-wallet-adapter)
         *   - Solana Wallet Standard
         *     (https://github.com/solana-labs/wallet-standard)
         *
         * If you wish to support a wallet that supports neither of those standards,
         * instantiate its legacy wallet adapter here. Common legacy adapters can be found
         * in the npm package `@solana/wallet-adapter-wallets`.
         */
        new PhantomWalletAdapter(),
      ],
      []
    );
    //API Calls
    useEffect(() => {
      const getUsers = async () => {
        setEmail(Auth.user.attributes.email);
        const users = await DataStore.query(User, a => a.email("eq", email));
        console.log(users);
        if (users.length == 0){
          setToStart(true);
        }else{
          setUser(users[0])
          setEmail(users[0].email)
          setFirstName(users[0].name.split(" ")[0])
          setLastName(users[0].name.split(" ")[1])
          setBirthdate(users[0].birthdate)
          setPhoneNumber(users[0].phoneNumber)
          setTrustScore(users[0].trustScore)
          setBettingScore(users[0].bettingScore)
          setWallet(users[0].wallet)
        }
      }
      getUsers()
      .catch(console.error);
    },[])

    let connection = useConnection();  
    let {publicKey, sendTransaction} = useWallet();
    const systemProgram = new PublicKey("11111111111111111111111111111111");
    const rentSysvar = new PublicKey(
      "SysvarRent111111111111111111111111111111111"
    );
    
    const programId = Keypair.generate();



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
    const [minPlayers, setMinPlayers] = useState(0);
    const [maxPlayers, setMaxPlayers] = useState(0);
    const [minBet, setMinBet] = useState(0.0);
    const [maxBet, setMaxBet] = useState(0.0);
    const [allOptions, setAllOptions] = useState([]);
    const [option, setOption] = useState("");
    const [time, setTime] = useState(0);

    const [editIsOpen, setEditIsOpen] = useState(false);
    const [accIsOpen, setAccIsOpen] = useState(false);
    const [addIsOpen, setAddIsOpen] = useState(false);
    const [joinIsOpen, setJoinIsOpen] = useState(false);
    const [joinCode, setJoinCode] = useState("");

  //Handling Methods
    const handleBetNameChange = (e) => {
      setBetName(e.target.value);
    };

    const handleTimeChange = (e) => {
      setTime(e.target.value);
    };

    const handleminPlayersChange = (e) => {
      setMinPlayers(e.target.value);
    };

    const handlemaxPlayersChange = (e) => {
      setMaxPlayers(e.target.value);
    };

    const handleminBetChange = (e) => {
      setMinBet(e.target.value);
    };

    const handlemaxBetChange = (e) => {
      setMaxBet(e.target.value);
    };
    const handleOptionNewChange = (e) => {
      setOption(e.target.value);
    };
  
    const handleOptionEnter = () => {
      if (option === "DELETE" || option == "") {
        OptionsList.splice(OptionsList.length - 1);
      } else {
        console.log(option);
        OptionsList.push(option);
      }
      setAllOptions(OptionsList);
      setOption("");
    }


    const handleBetSubmit = async (e) => {
      while (allOptions.length < 8) {
        let temp = allOptions;
        temp.push("zero");
        setAllOptions(temp);
      }
      console.log(allOptions);
      console.log(Buffer.from(betName));
  
      let [potPDA, potBump] = await PublicKey.findProgramAddress(
        [Buffer.from(betName)],
        programId.publicKey
      );
      /*     console.log(name);
      console.log(this.provider.publicKey.toBase58());
      console.log(potPDA.toBase58());
      console.log(potBump);
      console.log(PublicKey.isOnCurve(potPDA)); */
      //Create bet RPC Call(Send Transaction for Create Bet)
      let instruction = new TransactionInstruction({
        programId: programId.publicKey,
        keys: [
          {
            pubkey: publicKey,
            isSigner: true,
            isWritable: true,
          },
          { pubkey: potPDA, isSigner: false, isWritable: true },
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
          allOptions[0],
          allOptions[1],
          allOptions[2],
          allOptions[3],
          allOptions[4],
          allOptions[5],
          allOptions[6],
          allOptions[7],
          time
        ),
      });
      let transaction = new Transaction().add(instruction);
      console.log(transaction);
      // transaction.recentBlockhash = await connection.getLatestBlockhash();
      // console.log("blockhas retreived");
      // transaction.feePayer = provider.publicKey;
      // console.log(transaction);
      // const signedTransaction = await provider.signTransaction(transaction);
      // const signature = await connection.sendRawTransaction(
      //   signedTransaction.serialize()
      // );
      /* const signature = await this.provider.signAndSendTransaction(transaction);
      console.log("success!");
      await this.connection.getSignatureStatus(signature); */
    };
  
    const handlejoinCodeChange = (e) => {
      setJoinCode(e.target.value);
    };

    const handleJoinBet = async (id) => {
      //use account info to join based on if bet in id is active
    };

    const selectOption = (id, option) => {
      //use bet id and option
    }

    const handleSignOut = () => {
      Auth.signOut();
    }

    useEffect(() => {
      // Wallet detection
      //connect(provider);
    })


    const handleFirstNameChange = (e) => {
      console.log("test")
      setFirstName(e.target.value)
    }

    const handleLastNameChange = (e) => {
      setLastName(e.target.value)
    }

    const handleBirthdateChange = (e) => {
      setBirthdate(e.target.value)
    }

    const handlePhoneNumberChange = (e) => {
      setPhoneNumber(e.target.value)
    }

    const handleWalletChange = (e) => {
      setWallet(e.target.value)
    }

    const handleEditSubmit = async () =>{
      const name = firstName + " " + lastName
      
      console.log(toStart);
      if (toStart){
        await DataStore.save(
          new User({
          "email": email,
          "name": name,
          "birthdate": birthdate,
          "phonenumber": phoneNumber,
          "trustscore": 0,
          "bettingscore": 0,
          "bets": [],
          "wallet": wallet,
          "leaderboards": []
        })
      );
      }else{
      await DataStore.save(User.copyOf(user, item => {
        item.email = email;
        item.name = name;
        item.birthdate = birthdate;
        item.phoneNumber = phoneNumber;
        item.wallet = wallet;
      }));
      }
    }

      const path = window.location.pathname
      return(
        <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
        <Sider style = {{position: 'fixed', height: '100vh', width:"10vw", backgroundColor: "#195F50"}}>
        <Container style = {{marginLeft: "1vh", marginTop: "3vh", marginBottom: "3vh", width: "100%", alignContent: "center"}}>
        <div style = {{ marginLeft: '0px', padding: '0.5vw'}}><NavLink to = {HOME}><img height='40vh' className="img-responsive"  src={logo}  alt="logo"/></NavLink></div>
        </Container>
        <Menu style = {{backgroundColor: "#195F50"}} theme="dark" defaultSelectedKeys={((path === DASHBOARD) ? ['1'] : (path === LEADERBOARD ? ['2'] : [])) } mode="inline">
          <SubMenu key="sub1" title = {email} icon={<UserOutlined />}>
            <Menu.Item onClick = {() => setAccIsOpen(true)}  key="8">Account Details</Menu.Item>
            <Menu.Item onClick = {() => handleSignOut}  key="9">Sign Out</Menu.Item>
          </SubMenu>
          <Menu.Item key="1" href = {DASHBOARD} icon={<DashboardOutlined/>}>
            <a href = {DASHBOARD} >Dashboard</a>
          </Menu.Item>
          <Menu.Item key="2"  icon={<CrownOutlined />}>
            <a href = {LEADERBOARD} >Leaderboard</a>
          </Menu.Item>
          
          

        </Menu>
        <br/><br/><br/><br/><br/><br/><br/><br/><br/>
        <Menu style = {{backgroundColor: "#195F50"}} theme="dark" mode="inline">
        <Menu.Item onClick = {() => setAddIsOpen(true)} icon={<PlusCircleOutlined />}  key="6">Create a Bet</Menu.Item>
        <Menu.Item onClick = {() => setJoinIsOpen(true)} icon={<CheckOutlined />}  key="7">Join Bet</Menu.Item>
        <Menu.Item icon={<ExclamationCircleOutlined />}  key="8"><a href = {HOME} >Contact Support</a></Menu.Item>
        </Menu>
      </Sider>

        
      <Modal isOpen={accIsOpen} onClose={() => setAccIsOpen(false)}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Account Details</ModalHeader>
              <ModalBody>
                <strong>Name: </strong> Kaustubh Sonawane {firstName}{" "}
                {lastName}
                <br />
                <br />
                <strong>Email: </strong> kaustubh.sonawane@utexas.edu {email} <br />
                <br />
                <strong>Phone Number: </strong> kaustubh.sonawane@utexas.edu {phoneNumber} <br />
                <br />
                <strong>Wallet: </strong> kaustubh.sonawane@utexas.edu {wallet} <br />
                <br />
                <strong>Trust Score: </strong> 0.85 {trustScore}{" "}
                <br />
                <br />
                <strong>Betting Score: </strong> $85{bettingScore}{" "}
                <br />
              </ModalBody>

              <ModalFooter>
                <Button variant="ghost" mr={3} onClick={() => setAccIsOpen(false)}>
                  Close
                </Button>
                <Button mr={3} onClick={() => {
                  setAccIsOpen(false);
                  setEditIsOpen(true);
                }}>
                  Edit
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

          <Modal isOpen={addIsOpen} onClose={() => setAddIsOpen(false)}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Create New Bet</ModalHeader>
              <Form
              onSubmit={() => handleBetSubmit}
              >
              <ModalBody>
                <>
                  <FormControl isRequired>
                    <FormLabel>Bet Name</FormLabel>
                    <Input
                      onChange={() => handleBetNameChange}
                      placeholder="Bet name"
                    />
                  </FormControl>

                  <br />
                  <Flex>
                    <FormControl isRequired>
                      <FormLabel>Minimum Players</FormLabel>
                      <NumberInput
                        onChange={() => handleminPlayersChange}
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
                        onChange={() => handlemaxPlayersChange}
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
                        onChange={() => handleminBetChange}
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
                        onChange={() => handlemaxBetChange}
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
                    <FormControl isRequired>
                      <FormLabel>Options</FormLabel>
                      <Input
                        onChange={() => handleOptionNewChange}
                        placeholder="Enter Option"
                      />
                      <Button
                        variant="secondary"
                        onClick={() => handleOptionEnter}
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
                      onChange={() => handleTimeChange}
                      placeholder="Enter Option"
                    >
                      <NumberInputField />
                    </NumberInput>
                  </FormControl>
                </>
              </ModalBody>
              <ModalFooter>
                <Button variant="ghost" mr={3} onClick={() => setAddIsOpen(false)}>
                  Close
                </Button>
                <Button type="submit" colorScheme="blue">
                  Wager!
                </Button>
              </ModalFooter>
              </Form>
            </ModalContent>
          </Modal>

      <Modal isOpen={editIsOpen} onClose={() => setEditIsOpen(false)}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Edit Account Information</ModalHeader>
              <Form
              >
              <ModalBody>
                <Flex>
                <FormControl isRequired>
                    <FormLabel>First Name</FormLabel>
                    <Input
                      onChange={handleFirstNameChange}
                      placeholder="First name"
                    />
                </FormControl>
                <FormControl isRequired>
                    <FormLabel>Last Name</FormLabel>
                    <Input
                      onChange={() => handleLastNameChange}
                      placeholder="Last name"
                    />
                </FormControl>
                </Flex>
                   <br />
                    <FormControl isRequired>
                      <FormLabel>Phone Number</FormLabel>
                      <PhoneInput
                      placeholder="Enter phone number"
                      value = {phoneNumber}
                      onChange={() => handlePhoneNumberChange}/>
                    </FormControl>
                    <br/>
                    <FormControl isRequired>
                      <FormLabel>Date of Birth</FormLabel>
                      <Form.Control type="date" name="dob" onChange={(e) => handleBirthdateChange}/>
                    </FormControl>
                    <br/>
                    <FormControl isRequired>
                    <FormLabel>Solana Wallet Address</FormLabel>
                    <Input
                      onChange={() => handleWalletChange}
                      placeholder="Wallet Address"
                    />
                    <br/>
                    <Flex>
                    <WalletMultiButton onClick = {() => setEditIsOpen(false)} style={{margin: "1%"}}/>
                    <WalletDisconnectButton onClick = {() => setEditIsOpen(false)}  style={{margin: "1%"}}/>
                    </Flex>
                </FormControl>
              </ModalBody>
              <ModalFooter>
                <Button variant="ghost" mr={3} onClick={() => setEditIsOpen(false)}>
                  Close
                </Button>
                <Button colorScheme="blue" onClick = {(e) => handleEditSubmit}>
                  Submit
                </Button>
              </ModalFooter>
              </Form>
            </ModalContent>
          </Modal>

          <Modal isOpen={joinIsOpen} onClose={() => setJoinIsOpen(false)}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Join Bet</ModalHeader>
              <Form
              onSubmit = {() => {}}
              >
              <ModalBody>
                <>
                  <FormControl isRequired>
                    <FormLabel>Bet Code</FormLabel>
                    <Input placeholder="Bet Code" onChange = {() => handlejoinCodeChange()} />
                  </FormControl>
                </>
              </ModalBody>

              <ModalFooter>
                <Button variant="ghost" mr={3} onClick={() => setJoinIsOpen(false)}>
                  Close
                </Button>
                <Button type = "submit" colorScheme="blue">Wager!</Button>
              </ModalFooter>
              </Form>
            </ModalContent>
          </Modal>
        </WalletModalProvider>
        </WalletProvider>
    </ConnectionProvider>
      );
  };

  export default Sidebar;