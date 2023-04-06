import {
  useToast,
  Flex,
  FormControl,
  FormLabel,
  Icon,
  Input,
  Modal,
  GridItem,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  Button,
  NumberInputStepper,
  Text,
} from "@chakra-ui/react";
import "bootstrap/dist/css/bootstrap.css";
import React, { useEffect, useState, useCallback } from "react";
import { Container, Form } from "react-bootstrap";
import { API, Auth } from "aws-amplify";
import * as queries from "../graphql/queries";
import * as mutations from "../graphql/mutations";
import uniqueHash from "unique-hash"
import { userLeaderCreate } from "../utils/utils";

function JoinLeaderModal(props) {
  const [isOpen, setIsOpen] = [props.isOpen, props.setIsOpen];
  const user = props.user;
  const toast = props.toast;
  const [joinLeaderCode, setJoinLeaderCode] = useState("");

  useEffect(() => {
    const queryParameters = new URLSearchParams(window.location.search);
    if (queryParameters.has("leaderboard")) {
      setJoinLeaderCode(queryParameters.get("leaderboard"));
      setIsOpen(true);
    }
  });


  const handlejoinLeaderCodeChange = (e) => {
    setJoinLeaderCode(e.target.value);
  };

  const handleJoinLeaderSubmit = async () => {
    if (joinLeaderCode != "") {
      let currentBoards = user.leaderboards;
      if (!currentBoards.includes(uniqueHash(joinLeaderCode))) {
        let userLeaderboard = {
          leaderboardID: uniqueHash(joinLeaderCode),
          userID: user.id
        }
        userLeaderCreate(userLeaderboard)
        .then(() => {
        setIsOpen(false);
        let allBoards = props.boardIDs;
        allBoards.push(uniqueHash(joinLeaderCode))
        props.setBoardIDs(allBoards)
        toast({
          title: "Leaderboard Joined!",
          description: "Now it's time to brag.",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        
        window.location.reload();
        })
        .catch((e) => {
          alert("Invalid Leaderboard Code");
          return;
        });
      } else {
        alert("User is already enrolled in the leaderboard");
      }
    } else {
      alert("Fill out all fields");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
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
            <Button variant="ghost" mr={3} onClick={() => setIsOpen(false)}>
              Close
            </Button>
            <Button onClick={handleJoinLeaderSubmit} colorScheme="green">
              Join
            </Button>
          </ModalFooter>
        </Form>
      </ModalContent>
    </Modal>
  );
}

export default JoinLeaderModal;
