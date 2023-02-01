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
  NumberInputStepper,
  Text,
} from "@chakra-ui/react";
import "bootstrap/dist/css/bootstrap.css";
import React, { useEffect, useState, useCallback } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { API, Auth } from "aws-amplify";
import * as mutations from "../graphql/mutations";
import LeaderInfoModal from "./LeaderInfoModal";

function CreateLeaderModal(props) {
  const [leaderCode, setLeaderCode] = useState("");
  const [isOpen, setIsOpen] = [props.isOpen, props.setIsOpen];
  const [user, userUpdate] = [props.user, props.userUpdate];

  const [leaderName, setLeaderName] = useState("");
  const [addLeaderSuccessIsOpen, setAddLeaderSuccessIsOpen] = useState(false);

  const handleLeaderNameChange = (e) => {
    setLeaderName(e.target.value);
  };

  const handleLeaderSubmit = async (e) => {
    if (leaderName != "") {
      let board = {
        id: leaderName,
        users: [Auth.user.attributes.email],
        name: leaderName,
      };
      let id = leaderName;
      const leaderboard = await API.graphql({
        query: mutations.createLeaderboard,
        variables: { input: board },
      })
        .then((res) => {
          setLeaderCode(id);
          let currentBoards = user.leaderboards;
          currentBoards.push(id);

          let newUser = {
            id: user.id,
            leaderboards: currentBoards,
            _version: user._version,
          };

          userUpdate(newUser);
        })
        .then(() => {
          setIsOpen(false);
          setAddLeaderSuccessIsOpen(true);
        })
        .catch(() => {
          alert("Choose another Leaderboard Name");
          return;
        });
    } else {
      alert("Fill out all fields");
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
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
              <Button variant="ghost" mr={3} onClick={() => setIsOpen(false)}>
                Close
              </Button>
              <Button onClick={handleLeaderSubmit} variant="primary">
                Create
              </Button>
            </ModalFooter>
          </Form>
        </ModalContent>
      </Modal>
      <LeaderInfoModal
        code={leaderCode}
        setCode={setLeaderCode}
        isOpen={addLeaderSuccessIsOpen}
        setIsOpen={setAddLeaderSuccessIsOpen}
      />
    </>
  );
}

export default CreateLeaderModal;
