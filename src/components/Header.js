import { useState, useCallback } from 'react';
import { API, Auth } from "aws-amplify";
import * as mutations from "../graphql/mutations";
import { Box, Center, IconButton, Text, Flex, Menu, MenuItem, MenuButton, MenuList} from '@chakra-ui/react'
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
    <Flex bg="#F7F8FC" p={4} color="white" justifyContent="center">
      <div style = {{margin: "10px"}}></div>
        <Text as='b' style={{color:"#000000"}} fontSize="xl">{props.page}</Text>
      <Box flex="1" />
      <Menu >
        <MenuButton isDisabled={publicKey==null} colorScheme="green" as={IconButton} >
        <AddIcon w={8} h={8} />
        </MenuButton>
        <MenuList style={{color:"#000000"}}>
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
            />

          </> : 
          <>
            <MenuItem
              onClick={() => {setAddLeaderIsOpen(true)}}
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
            onClick={() => {setJoinLeaderIsOpen(true)}}
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
    
      
      <div style={{marginRight:"10px", marginLeft:"10px"}}></div>
      <Box>
        {props.showSidebarButton && (
          <>
          <IconButton
            icon={<HamburgerIcon w={8} h={8} />}
            colorScheme="blackAlpha"
            variant="outline"
            onClick={props.onShowSidebar}
          />
          </>
        )}
      </Box>

    </Flex>
  )
}

export default Header
