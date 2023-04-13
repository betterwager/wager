import { useState, useCallback } from 'react';
import { API, Auth } from "aws-amplify";
import { FaDice, FaUsers, FaMoneyCheckAlt, FaDiceD20 } from "react-icons/fa";
import * as mutations from "../graphql/mutations";
import { Box, Center, Icon, IconButton, Text, Flex, Menu, MenuItem, MenuButton, MenuList } from '@chakra-ui/react'
import { Navbar } from 'react-bootstrap';
import { AddIcon, HamburgerIcon } from '@chakra-ui/icons'
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  PublicKey,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";

import CreateBetModal from './CreateBetModal';
import JoinBetModal from './JoinBetModal';
import CreateLeaderModal from './CreateLeaderModal';
import JoinLeaderModal from './JoinLeaderModal';


const Header = (props) => {

  const [addIsOpen, setAddIsOpen] = useState(false);
  const [joinIsOpen, setJoinIsOpen] = useState(false);


  const [addLeaderIsOpen, setAddLeaderIsOpen] = useState(false);
  const [joinLeaderIsOpen, setJoinLeaderIsOpen] = useState(false);

  const user = props.user


  const getBets = () => {
    props.refresh(publicKey);
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

  const toast = props.toast

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
          <Menu >
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
              {props.page == "Dashboard" ?
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
                  >Join a Bet
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

                </> :
                <>
                  <MenuItem
                    onClick={() => { setAddLeaderIsOpen(true) }}
                  >
                    Create a Leaderboard
                  </MenuItem>

                  <CreateLeaderModal
                    isOpen={addLeaderIsOpen}
                    setIsOpen={setAddLeaderIsOpen}
                    user={user}
                    boardIDs={props.boardIDs}
                    setBoardIDs={props.setBoardIDs}
                    userUpdate={userUpdate}
                  />

                  <MenuItem
                    onClick={() => { setJoinLeaderIsOpen(true) }}
                  >
                    Join a Leaderboard
                  </MenuItem>

                  <JoinLeaderModal
                    isOpen={joinLeaderIsOpen}
                    setIsOpen={setJoinLeaderIsOpen}
                    user={user}
                    boardIDs={props.boardIDs}
                    setBoardIDs={props.setBoardIDs}
                    userUpdate={userUpdate}
                  />

                </>}

            </MenuList>
          </Menu>


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

        <Text as='b' style={{ color: "#000000" }} fontSize="xl">{props.page}</Text>

        {!props.showSidebarButton &&
          <>
            <Box flex="1" />
            <Menu >
              <MenuButton isDisabled={publicKey == null && props.page == "Dashboard"}
                //colorScheme="green" 
                // backgroundColor="primaryColor"
                // color="buttonTextColor"
                _hover={publicKey == null && props.page == "Dashboard" ? {
                  background: "primaryColor",
                  color: "buttonTextColor",
                } : {
                  background: "hoverColor",
                  color: "buttonTextColor"
                }}
                as={IconButton} >
                <AddIcon w={8} h={8} />
              </MenuButton>
              <MenuList style={{ color: "#000000" }}>
                {props.page == "Dashboard" ?
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
                    >Join a Bet
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

                  </> :
                  <>
                    <MenuItem
                      onClick={() => { setAddLeaderIsOpen(true) }}
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
                      onClick={() => { setJoinLeaderIsOpen(true) }}
                    >
                      Join a Leaderboard
                    </MenuItem>

                    <JoinLeaderModal
                      isOpen={joinLeaderIsOpen}
                      setIsOpen={setJoinLeaderIsOpen}
                      user={user}
                      userUpdate={userUpdate}
                    />

                  </>}

              </MenuList>
            </Menu>
          </>
        }
      </Flex>
    </>
  )
}

export default Header
