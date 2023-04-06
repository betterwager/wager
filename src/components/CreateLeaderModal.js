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
  Button,
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
import { Container, Form } from "react-bootstrap";
import { API, Auth } from "aws-amplify";
import * as mutations from "../graphql/mutations";
import { userLeaderCreate, leaderCreate } from "../utils/utils";
import uniqueHash from "unique-hash"
import LeaderInfoModal from "./LeaderInfoModal";

function CreateLeaderModal(props) {
  const [leaderCode, setLeaderCode] = useState("");
  const [isOpen, setIsOpen] = [props.isOpen, props.setIsOpen];
  const [user, userUpdate] = [props.user, props.userUpdate];

  const [leaderName, setLeaderName] = useState("");
  const [addLeaderSuccessIsOpen, setAddLeaderSuccessIsOpen] = useState(false);

  const handleLeaderNameChange = (e) => {
    console.log(user);
    setLeaderName(e.target.value);
  };

  const handleLeaderSubmit = async (e) => {
    let leaderID = uniqueHash(leaderName)
    if (leaderName != "") {
      let board = {
        id: leaderID,
        name: leaderName,
      };
      
      leaderCreate(board)
        .then((res) => {
          console.log(res);
          setLeaderCode(leaderID);

          let userLeaderboard = {
            leaderboardId: leaderID,
            userId: user.id
        }
        userLeaderCreate(userLeaderboard)
          .then((res) => {
            let allBoards = props.boardIDs;
            allBoards.push(leaderID)
            props.setBoardIDs(allBoards)
            console.log(res);
            setIsOpen(false);
            setAddLeaderSuccessIsOpen(true);
          })
          .catch((e) => {
            console.log(e)
            alert("Choose another Leaderboard Name");
            return;
          });
        })
      
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
              <Button onClick={handleLeaderSubmit} colorScheme="green">
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
