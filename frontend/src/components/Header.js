import React, { useState, useCallback, useEffect } from "react";
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
    <React.Fragment>


      <Flex bg="#F7F8FC" p={4} color="white" justifyContent="center">
        <Text as="b" color="black" style={{ margin: "5px" }} fontSize="xl">
          {props.page}
        </Text>

        {!props.showSidebarButton && (
          <React.Fragment>
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
          </React.Fragment>
        )}
      </Flex>
    </React.Fragment>
  );
};

export default Header;
