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
import { allColors } from "../theme";

import React, { useEffect, useState, useCallback } from "react";

import { QRCodeCanvas } from "qrcode.react";
import { BsFillDice5Fill } from "react-icons/bs";
import { FaDice, FaMoneyBill } from "react-icons/fa";
import {
  MdAdd,
  MdAddToPhotos,
  MdLeaderboard,
  MdOutlineCreate,
} from "react-icons/md";
import { RiNumber1, RiNumber2, RiNumber3 } from "react-icons/ri";
import * as mutations from "../graphql/mutations";
import * as queries from "../graphql/queries";

import {
  CheckOutlined,
  CrownOutlined,
  UsergroupAddOutlined,
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
import { Container, Form, Navbar } from "react-bootstrap";
import uniqueHash from "unique-hash";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { NavLink as Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getUserProfilePicture } from "../utils/utils";
import { magic } from "../utils/globals";
import { DASHBOARD, HOME, LEADERBOARD } from "../App.js";
import logo from "../assets/Wager.svg";
import AccountInfoModal from "./AccountInfoModal";
import AccountEditModal from "./AccountEditModal";
import NewUserModals from "./NewUserModals";
import WalletEntryModal from "./WalletEntryModal";
import FriendsModal from "./FriendsModal";
import CreateBetModal from "./CreateBetModal";
import JoinBetModal from "./JoinBetModal";
import CreateLeaderModal from "./CreateLeaderModal";
import JoinLeaderModal from "./JoinLeaderModal";

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
  const [friendsIsOpen, setFriendsIsOpen] = useState(false);
  const [walletIsOpen, setWalletIsOpen] = useState(false);

  const [newUser, setNewUser] = useState(false);
  const toast = useToast();
  const [isOpen, setIsOpen] = [props.isOpen, props.setIsOpen];

  const [start1IsOpen, setStart1IsOpen] = useState(false);

  const navigate = useNavigate();

  let { publicKey, sendTransaction } = useWallet();

  //API Calls

  const userUpdate = useCallback(async (newUser) => {
    const promise = await API.graphql({
      query: mutations.updateUser,
      variables: { input: newUser },
    });
    return promise;
  });

  useEffect(() => {
    getUser()
      .catch(console.error)
      .then((users) => {
        let currentUser = users.data.getUser;

        if (currentUser != null) {
          setUser(currentUser);
        }
        if (currentUser == null) {
          setNewUser(true);
          setStart1IsOpen(true);
        }
      });
  }, []);

  const getUser = async () => {
    const user = await API.graphql({
      query: queries.getUser,
      variables: {
        id: uniqueHash(magicUser.phoneNumber.substring(1)),
      },
    });
    return user;
  };

  const magicUser = props.magicUser;

  let { connection } = useConnection();
  const systemProgram = new PublicKey("11111111111111111111111111111111");
  const rentSysvar = new PublicKey(
    "SysvarRent111111111111111111111111111111111"
  );

  const getBets = () => {
    props.refresh(publicKey);
  };

  const programId = new PublicKey(
    "GvtuZ3JAXJ29cU3CE5AW24uoHc2zAgrPaMGcFT4WMcrm"
  );

  const [addIsOpen, setAddIsOpen] = useState(false);
  const [joinIsOpen, setJoinIsOpen] = useState(false);
  const [addLeaderIsOpen, setAddLeaderIsOpen] = useState(false);
  const [joinLeaderIsOpen, setJoinLeaderIsOpen] = useState(false);
  //Handling Methods


  return (
    <div style={{ overflow: "hidden", height: "100%" }}>
      <Container
        style={{
          marginLeft: "1vh",
          marginTop: "3vh",
          marginBottom: "3vh",
          width: "100%",
          alignContent: "center",
        }}
      >
        <div style={{ marginLeft: "10px" }}>
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
      <Box height={"90%"} display={"flex"} flexDirection={"column"}>
        <Box
          height="25%"
          justifySelf="flex-start"
          display="flex"
          flexDirection="column"
          justifyContent={"flex-start"}
          py={2}
          borderBottom="2px"
          borderBottomColor={"#256759"}
        >
          <Menu
            style={{
              backgroundColor: allColors.primaryColor,
              color: allColors.buttonTextColor,
            }}
            theme="dark"
            defaultSelectedKeys={
              window.location.pathname == DASHBOARD ||
              window.location.pathname == DASHBOARD.toLowerCase()
                ? ["1"]
                : ["2"]
            }
            mode="inline"
          >
            <Menu.Item key="1" href={DASHBOARD} icon={<DashboardOutlined />}>
              <a href={DASHBOARD}>Dashboard</a>
            </Menu.Item>
            <Menu.Item key="2" icon={<CrownOutlined />}>
              <a href={LEADERBOARD}>Leaderboard</a>
            </Menu.Item>
          </Menu>
        </Box>
        <Box
          height="35%"
          justifySelf="center"
          display="flex"
          flexDirection="column"
          justifyContent={"center"}
          py={2}
          borderBottom="2px"
          borderBottomColor={"#256759"}
        >
          <Menu
            selectable={false}
            style={{
              backgroundColor: allColors.primaryColor,
              color: allColors.buttonTextColor,
            }}
            theme="dark"
            mode="inline"
          >
            <Menu.Item
              onClick={() => setAddIsOpen(true)}
              icon={<MdOutlineCreate />}
            >
              Create Wager
            </Menu.Item>

            <CreateBetModal
                    getBets={getBets}
                    toast={toast}
                    connection={connection}
                    programId={programId}
                    publicKey={publicKey}
                    sendTransaction={sendTransaction}
                    rentSysvar={rentSysvar}
                    systemProgram={systemProgram}
                    isOpen={addIsOpen}
                    setIsOpen={setAddIsOpen}
                  />


            <Menu.Item
              onClick={() => setJoinIsOpen(true)}
              icon={<FaMoneyBill />}
            >
              Join Wager
            </Menu.Item>
            <JoinBetModal
                    getBets={getBets}
                    toast={toast}
                    connection={connection}
                    programId={programId}
                    publicKey={publicKey}
                    sendTransaction={sendTransaction}
                    rentSysvar={rentSysvar}
                    systemProgram={systemProgram}
                    isOpen={joinIsOpen}
                    setIsOpen={setJoinIsOpen}
                    walletIsOpen={props.walletIsOpen}
                    setWalletIsOpen={props.setWalletIsOpen}
                  />
            <Menu.Item
              onClick={() => setAddLeaderIsOpen(true)}
              icon={<MdAddToPhotos />}
            >
              Create Leaderboard
            </Menu.Item>
            <CreateLeaderModal
                    isOpen={addLeaderIsOpen}
                    setIsOpen={setAddLeaderIsOpen}
                    user={user}
                    boardIDs={props.boardIDs}
                    setBoardIDs={props.setBoardIDs}
                    userUpdate={userUpdate}
                  />
            <Menu.Item
              onClick={() => setJoinLeaderIsOpen(true)}
              icon={<MdLeaderboard />}
            >
              Join Leaderboard
            </Menu.Item>
            <JoinLeaderModal
                    isOpen={joinLeaderIsOpen}
                    setIsOpen={setJoinLeaderIsOpen}
                    user={user}
                    boardIDs={props.boardIDs}
                    setBoardIDs={props.setBoardIDs}
                    userUpdate={userUpdate}
                  />
          </Menu>
        </Box>
        <Box
          height="35%"
          justifySelf="flex-end"
          display="flex"
          flexDirection="column"
          justifyContent={"flex-end"}
          py={2}
        >
          <Menu
            selectable={false}
            style={{
              backgroundColor: allColors.primaryColor,
              color: allColors.buttonTextColor,
            }}
            theme="dark"
            mode="inline"
          >
            <Menu.Item
              onClick={() => setFriendsIsOpen(true)}
              icon={<UsergroupAddOutlined />}
            >
              Find Friends
            </Menu.Item>
            <FriendsModal
              user={user}
              setUser={setUser}
              toast={toast}
              isOpen={friendsIsOpen}
              setIsOpen={setFriendsIsOpen}
            />

            <Menu.Item
              onClick={() => {
                setWalletIsOpen(true);
              }}
              icon={<DollarCircleOutlined />}
            >
              Connect Wallet
            </Menu.Item>

            <WalletEntryModal
              publicKey={publicKey}
              toast={toast}
              isOpen={walletIsOpen}
              setIsOpen={setWalletIsOpen}
            />

            <Menu.Item icon={<ExclamationCircleOutlined />}>
              <a href="https://forms.gle/r288veKH6uAU6spUA" target="_blank">
                Contact Support
              </a>
            </Menu.Item>
          </Menu>
        </Box>
      </Box>
    </div>
  );
}

const Sidebar = (props) => {
  return props.variant === "sidebar" ? (
    <Box
      position="fixed"
      left={0}
      p={2}
      w="250px"
      top={0}
      h="100%"
      bg="primaryColor"
    >
      <SidebarContent
        refresh={props.refresh}
        magicUser={props.magicUser}
        user={props.user}
        boardIDs={props.boardIDs}
        setBoardIDs={props.setBoardIDs}
        isOpen={props.isOpen}
        setIsOpen={props.setIsOpen}
      />
    </Box>
  ) : (
    <Drawer isOpen={props.isOpen} placement="left" onClose={props.onClose}>
      <DrawerOverlay>
        <DrawerContent style={{ backgroundColor: "primaryColor" }}>
          <DrawerCloseButton style={{ color: "#ffffff" }} />
          <DrawerBody>
            <SidebarContent
              refresh={props.refresh}
              user={props.user}
              magicUser={props.magicUser}
              isOpen={props.isOpen}
              setIsOpen={props.onClose}
              boardIDs={props.boardIDs}
              setBoardIDs={props.setBoardIDs}
            />
          </DrawerBody>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};

export default Sidebar;
