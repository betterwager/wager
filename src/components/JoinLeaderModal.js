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

function JoinLeaderModal(props) {
  const [isOpen, setIsOpen] = [props.isOpen, props.setIsOpen];
  const [user, userUpdate] = [props.user, props.userUpdate];
  const toast = props.toast;
  const [joinLeaderCode, setJoinLeaderCode] = useState("");

  useEffect(() => {
    const queryParameters = new URLSearchParams(window.location.search);
    if (queryParameters.has("leaderboard")) {
      setJoinLeaderCode(queryParameters.get("leaderboard"));
      setIsOpen(true);
    }
  });

  const leaderUpdate = useCallback(async (newLeader) => {
    const promise = await API.graphql({
      query: mutations.updateLeaderboard,
      variables: { input: newLeader },
    });
    return promise;
  });

  const handlejoinLeaderCodeChange = (e) => {
    setJoinLeaderCode(e.target.value);
  };

  const handleJoinLeaderSubmit = async () => {
    if (joinLeaderCode != "") {
      let currentBoards = user.leaderboards;
      if (!currentBoards.includes(joinLeaderCode)) {
        const currentLeaderboard = await API.graphql({
          query: queries.getLeaderboard,
          variables: { id: joinLeaderCode },
        }).then(() => {
          currentBoards.push(joinLeaderCode);

          let newUser = {
            id: user.id,
            leaderboards: currentBoards,
            _version: user._version,
          };

          userUpdate(newUser)
            .then(() => {
              let current = currentLeaderboard.data.getLeaderboard;
              let currentUsers = current.users;
              if (!currentUsers.includes(user.email)) {
                currentUsers.push(user.email);
                let board = {
                  id: current.id,
                  users: currentUsers,
                  name: current.name,
                };

                leaderUpdate(board);
                setIsOpen(false);
                toast({
                  title: "Leaderboard Joined!",
                  description: "Now it's time to brag.",
                  status: "success",
                  duration: 9000,
                  isClosable: true,
                });
                window.location.reload();
              }
            })
            .catch((e) => {
              alert("Invalid Leaderboard Code");
              return;
            });
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
