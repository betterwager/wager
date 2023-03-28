import {
  useToast,
  Flex,
  FormControl,
  FormLabel,
  Icon,
  Input,
  Modal,
  GridItem,
  Box,
  Drawer,
  DrawerOverlay,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerContent,
  ModalBody,
  ModalContent,
  Button,
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
import React, { useEffect, useState, useCallback } from "react";

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
  DollarCircleOutlined,
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
import {Container, Form, Navbar} from "react-bootstrap";
import uniqueHash from "unique-hash";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { NavLink as Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { DASHBOARD, HOME, LEADERBOARD } from "../App.js";
import logo from "../assets/Wager.svg";
import AccountInfoModal from "./AccountInfoModal";
import AccountEditModal from "./AccountEditModal";
import NewUserModals from "./NewUserModals";
import WalletEntryModal from "./WalletEntryModal";

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

export function SidebarContent(props) {
  const [user, setUser] = useState({});
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [accIsOpen, setAccIsOpen] = useState(false);

  const [editIsOpen, setEditIsOpen] = useState(false);

  const [walletIsOpen, setWalletIsOpen] = useState(false)

  const [newUser, setNewUser] = useState(false);
  const toast = useToast();
  const [isOpen, setIsOpen] = [props.isOpen, props.setIsOpen]

  const [start1IsOpen, setStart1IsOpen] = useState(false);

  

  const navigate = useNavigate();
  
  let { publicKey, sendTransaction } = useWallet();

  //API Calls

  const getUsers = async () => {
    const promise = await API.graphql({
      query: queries.getUser,
      variables: { id: uniqueHash(Auth.user.attributes.email) },
    });
    return promise;
  };
  const getBoards = async () => {
    const boards = await API.graphql({ query: queries.listLeaderboards });
    return boards;
  };

  const userUpdate = useCallback(async (newUser) => {
    const promise = await API.graphql({
      query: mutations.updateUser,
      variables: { input: newUser },
    })
    return promise;
  });

  useEffect(() => {
    getUsers()
      .catch(console.error)
      .then((users) => {
        let currentUser = users.data.getUser;

        if (currentUser != null) {
          setUser(currentUser);
          let names = currentUser.name.split(" ");
          setFirstName(names[0]);
          setLastName(names[1]);
          setBirthdate(currentUser.birthdate);
          setPhoneNumber(currentUser.phonenumber);
        }
        if (currentUser == null) {
          setNewUser(true);
          setStart1IsOpen(true);
        }
      });
  }, []);




  //Handling Methods

  const handleSignOut = () => {
    const promise = Auth.signOut()
    setTimeout(() => navigate("/"), 1000);
  };

  return (
    <div style= {{overflow:"hidden"}}>
      <Container
        style={{
          marginLeft: "1vh",
          marginTop: "3vh",
          marginBottom: "3vh",
          width: "100%",
          alignContent: "center",
        }}
      >
        <div style = {{marginLeft: "10px"}}>
          <Navbar.Brand href={HOME}>
            <Flex align={"center"} w={"100%"}>
                    <Icon h={"20%"} w={"20%"} as={FaDice} color="#ffffff" />
                    <Text fontSize="3xl" fontWeight={"bold"} color="#ffffff">
                      Wager
                    </Text>
            </Flex>
          </Navbar.Brand>
        </div>  
      </Container>
      <Menu
        style={{ backgroundColor: "#195F50" }}
        theme="dark"
        defaultSelectedKeys={
          window.location.pathname == DASHBOARD ||
          window.location.pathname == DASHBOARD.toLowerCase()
            ? ["1"]
            : ["2"]
        }
        mode="inline"
      >
        <SubMenu
          selectable={false}
          key="sub1"
          title={Auth.user.attributes.email.slice(0, 15) + "..."}
          icon={<UserOutlined />}
        >
          <Menu.Item onClick={() => {
            setAccIsOpen(true)
            }} key="8">
            Account Details
          </Menu.Item>

          <NewUserModals
            start1IsOpen={start1IsOpen}
            setStart1IsOpen={setStart1IsOpen}
            editIsOpen={editIsOpen}
            setEditIsOpen={setEditIsOpen}
          />

          <AccountInfoModal
            user={user}
            userUpdate={userUpdate}
            isOpen={accIsOpen}
            setIsOpen={setAccIsOpen}
            editIsOpen={editIsOpen}
            setEditIsOpen={setEditIsOpen}
            publicKey={publicKey}
            newUser={newUser}
            setNewUser={setNewUser}
          />
          <AccountEditModal
            user={user}
            userUpdate={userUpdate}
            isOpen={editIsOpen}
            setIsOpen={setEditIsOpen}
            publicKey={publicKey}
            newUser={newUser}
            setNewUser={setNewUser}
            firstName={firstName}
            setFirstName={setFirstName}
            lastName={lastName}
            setLastName={setLastName}
            birthdate={birthdate}
            setBirthdate={setBirthdate}
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            toast={toast}
            setUser={setUser}
          />

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
      <Menu selectable={false} style={{ backgroundColor: "#195F50" }} theme="dark" mode="inline">
      <Menu.Item onClick={() => {
        setWalletIsOpen(true)
        }} icon={<DollarCircleOutlined />}>
            Connect Wallet
        </Menu.Item>

        <WalletEntryModal publicKey={publicKey} toast={toast} isOpen={walletIsOpen} setIsOpen={setWalletIsOpen}/>

        <Menu.Item icon={<ExclamationCircleOutlined />}>
          <a href="https://forms.gle/r288veKH6uAU6spUA" target="_blank">
            Contact Support
          </a>
        </Menu.Item>
      </Menu>
    </div>
  );
}


const Sidebar = (props) => {
  return props.variant === 'sidebar' ? (
    <Box
      position="fixed"
      left={0}
      p={2}
      w="250px"
      top={0}
      h="100%"
      bg="#195F50"
    >
      <SidebarContent refresh={props.refresh} user={props.user}  isOpen={props.isOpen} setIsOpen={props.setIsOpen}/>
    </Box>
  ) : (
    <Drawer isOpen={props.isOpen} placement="left" onClose={props.onClose}>
      <DrawerOverlay>
        <DrawerContent style={{backgroundColor:"#195F50"}}>
          <DrawerCloseButton style = {{color:"#ffffff"}}/>
          <DrawerBody>

            <SidebarContent refresh={props.refresh} user={props.user}  isOpen={props.isOpen} setIsOpen={props.onClose}/>

          </DrawerBody>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  )
}


export default Sidebar;
