import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API, Auth } from "aws-amplify";
import { FaDice, FaUsers, FaMoneyCheckAlt, FaDiceD20 } from "react-icons/fa";
import * as mutations from "../graphql/mutations";
import {
  Box,
  Center,
  Icon,
  IconButton,
  Avatar,
  Text,
  Flex,
  Menu,
  MenuItem,
  MenuButton,
  MenuList,
} from "@chakra-ui/react";
import { Navbar } from "react-bootstrap";
import { AddIcon, HamburgerIcon } from "@chakra-ui/icons";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { getUserProfilePicture } from "../utils/utils";
import {
  PublicKey,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";

import CreateBetModal from "./CreateBetModal";
import JoinBetModal from "./JoinBetModal";
import CreateLeaderModal from "./CreateLeaderModal";
import JoinLeaderModal from "./JoinLeaderModal";
import AccountInfoModal from "./AccountInfoModal";
import AccountEditModal from "./AccountEditModal";

const Header = (props) => {
  const navigate=useNavigate();
  const [addIsOpen, setAddIsOpen] = useState(false);
  const [joinIsOpen, setJoinIsOpen] = useState(false);

  const [addLeaderIsOpen, setAddLeaderIsOpen] = useState(false);
  const [joinLeaderIsOpen, setJoinLeaderIsOpen] = useState(false);

  const [user, setUser] = [props.user, props.setUser]
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthdate, setBirthdate] = useState("");


  useEffect(() => {
    if (user){
      let names = user.name.split(" ");
        setFirstName(names[0]);
        setLastName(names[1]);
        setBirthdate(user.birthdate);
    }
  },[])

  const getBets = () => {
    props.refresh(publicKey);
  };

  const handleSignOut = () => {
    const promise = Auth.signOut();
    setTimeout(() => navigate("/"), 1000);
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

  const [accIsOpen, setAccIsOpen] = useState(false);
  const [editIsOpen, setEditIsOpen] = useState(false);
  const [newUser, setNewUser] = useState(false);


  const toast = props.toast;

  const userUpdate = useCallback(async (newUser) => {
    const promise = await API.graphql({
      query: mutations.updateUser,
      variables: { input: newUser },
    });
    return promise;
  });

  return (
    <>
      {props.showSidebarButton && (
        <Navbar
          style={{
            borderBottom: "solid",
            borderColor: "primaryColor",
            backgroundColor: "#F7F8FC",
          }}
        >
          <Navbar.Brand style={{ marginLeft: "10px" }}>
            <Flex align={"center"} w={"100%"}>
              <Icon h={"40%"} w={"40%"} as={FaDice} color="primaryColor" />
              <Text fontSize="3xl" fontWeight={"bold"} color="primaryColor">
                Wager
              </Text>
            </Flex>
          </Navbar.Brand>

          <Box flex="1" />
          {/* <Menu>
            <MenuButton
              isDisabled={publicKey == null && props.page == "Dashboard"}
              //colorScheme="blue"
              // backgroundColor="#ff0000"
              // color="#ff0000"
              as={IconButton}
            >
              <AddIcon w={8} h={8} />
            </MenuButton>
            <MenuList style={{ color: "#000000" }}>
              {props.page == "Dashboard" ? (
                <>
                  <MenuItem
                    onClick={() => {
                      setAddIsOpen(true);
                    }}
                  >
                    Create a Bet
                  </MenuItem>



                  <MenuItem
                    onClick={() => {
                      setJoinIsOpen(true);
                    }}
                  >
                    Join a Bet
                  </MenuItem>


                </>
              ) : (
                <>
                  <MenuItem
                    onClick={() => {
                      setAddLeaderIsOpen(true);
                    }}
                  >
                    Create a Leaderboard
                  </MenuItem>


                  <MenuItem
                    onClick={() => {
                      setJoinLeaderIsOpen(true);
                    }}
                  >
                    Join a Leaderboard
                  </MenuItem>


                </>
              )}
            </MenuList>
          </Menu> */}

          <div style={{ marginRight: "10px", marginLeft: "10px" }}></div>
          <Box>
            {props.showSidebarButton && (
              <>
                <IconButton
                  icon={<HamburgerIcon w={8} h={8} />}
                  style={{ marginRight: "10px" }}
                  colorScheme="blackAlpha"
                  variant="outline"
                  onClick={props.onShowSidebar}
                />
              </>
            )}
          </Box>
        </Navbar>
      )}

      <Flex bg="#F7F8FC" p={4} color="white" justifyContent="center">
        <Text as="b" color="black" style={{ margin: "5px" }} fontSize="xl">
          {props.page}
        </Text>

        {!props.showSidebarButton && (
          <>
            <Box flex="1" />
            <Text color="black" as="b" style={{margin: "10px", marginRight: "20px"}}>{props.user && props.user.name}</Text>

            <Menu>
              <MenuButton as={Avatar} size="md" src={props.profilePictureURL} />
              <MenuList>
                <MenuItem color="black" onClick={() => setAccIsOpen(true)}>
                  Account Details
                </MenuItem>
                <MenuItem color="black" onClick={handleSignOut}>
                  Sign Out
                </MenuItem>
              </MenuList>
            </Menu>
            <AccountInfoModal
                user={user}
                userUpdate={userUpdate}
                isOpen={accIsOpen}
                setIsOpen={setAccIsOpen}
                editIsOpen={editIsOpen}
                setEditIsOpen={setEditIsOpen}
                newUser={newUser}
                setNewUser={setNewUser}
                URL={props.profilePictureURL}
                self={true}
              />
              <AccountEditModal
                user={user}
                userUpdate={userUpdate}
                isOpen={editIsOpen}
                setIsOpen={setEditIsOpen}
                newUser={newUser}
                setNewUser={setNewUser}
                firstName={firstName}
                setFirstName={setFirstName}
                lastName={lastName}
                setLastName={setLastName}
                birthdate={birthdate}
                setBirthdate={setBirthdate}
                toast={toast}
                setUser={setUser}
                setURL={props.setProfilePictureURL}
                URL={props.profilePictureURL}
              />
            {/* <Menu>
              <MenuButton
                isDisabled={publicKey == null && props.page == "Dashboard"}
                //colorScheme="green"
                // backgroundColor="primaryColor"
                // color="buttonTextColor"
                _hover={
                  publicKey == null && props.page == "Dashboard"
                    ? {
                        background: "primaryColor",
                        color: "buttonTextColor",
                      }
                    : {
                        background: "hoverColor",
                        color: "buttonTextColor",
                      }
                }
                as={IconButton}
              >
                <AddIcon w={8} h={8} />
              </MenuButton>
              <MenuList style={{ color: "#000000" }}>
                {props.page == "Dashboard" ? (
                  <>
                    <MenuItem
                      onClick={() => {
                        setAddIsOpen(true);
                      }}
                    >
                      Create a Bet
                    </MenuItem>

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

                    <MenuItem
                      onClick={() => {
                        setJoinIsOpen(true);
                      }}
                    >
                      Join a Bet
                    </MenuItem>

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
                  </>
                ) : (
                  <>
                    <MenuItem
                      onClick={() => {
                        setAddLeaderIsOpen(true);
                      }}
                    >
                      Create a Leaderboard
                    </MenuItem>

                    <CreateLeaderModal
                      isOpen={addLeaderIsOpen}
                      setIsOpen={setAddLeaderIsOpen}
                      user={user}
                      userUpdate={userUpdate}
                    />

                    <MenuItem
                      onClick={() => {
                        setJoinLeaderIsOpen(true);
                      }}
                    >
                      Join a Leaderboard
                    </MenuItem>

                    <JoinLeaderModal
                      isOpen={joinLeaderIsOpen}
                      setIsOpen={setJoinLeaderIsOpen}
                      user={user}
                      userUpdate={userUpdate}
                    />
                  </>
                )}
              </MenuList>
            </Menu> */}
          </>
        )}
      </Flex>
    </>
  );
};

export default Header;
