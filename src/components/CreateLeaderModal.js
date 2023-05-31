import {
  Box,
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
  CloseButton,
} from "@chakra-ui/react";
import "bootstrap/dist/css/bootstrap.css";
import React, { useEffect, useState, useCallback } from "react";
import { Container, Form } from "react-bootstrap";
import { API, Auth } from "aws-amplify";
import * as mutations from "../graphql/mutations";
import { userLeaderCreate, leaderCreate } from "../utils/utils";
import uniqueHash from "unique-hash";
import LeaderInfoModal from "./LeaderInfoModal";
import { FaDice } from "react-icons/fa";
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
    let leaderID = uniqueHash(leaderName);
    if (leaderName != "") {
      let board = {
        id: leaderID,
        name: leaderName,
      };

      leaderCreate(board).then((res) => {
        console.log(res);
        setLeaderCode(leaderID);

        let userLeaderboard = {
          id: uniqueHash(user.id + leaderID),
          leaderboardId: leaderID,
          userId: user.id,
        };
        console.log(userLeaderboard);
        userLeaderCreate(userLeaderboard)
          .then((res) => {
            let allBoards = props.boardIDs;
            allBoards.push(leaderID);
            props.setBoardIDs(allBoards);
            console.log(res);
            setIsOpen(false);
            setAddLeaderSuccessIsOpen(true);
          })
          .catch((e) => {
            console.log(e);
            alert("Choose another Leaderboard Name");
          });
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
          <ModalHeader mb={-5}>
            <Box
              width={"100%"}
              display={"inline-flex"}
              alignItems={"center"}
              justifyContent={"space-between"}
            >
              <Icon
                border={"1px"}
                borderRadius={"10px"}
                borderColor="borderLightColor"
                boxShadow={"sm"}
                p={2}
                my={3}
                h={"48px"}
                w={"48px"}
                as={FaDice}
                color="formLabelColor"
              />
              <CloseButton
                color={"formLabelColor"}
                size="lg"
                onClick={() => setIsOpen(false)}
              />
            </Box>
          </ModalHeader>
          <Form>
            <ModalBody>
              <>
                <Box mb={3}>
                  <Text color="formTitleColor" fontWeight={600} fontSize={"lg"}>
                    Create Leaderboard
                  </Text>
                  <Text color="formDescriptionColor" fontWeight={400}>
                    Enter the leaderboard name below create a leaderboard!
                  </Text>
                </Box>
                <FormControl isRequired>
                  <Input
                    onChange={handleLeaderNameChange}
                    placeholder="Enter Leaderboard Name"
                  />
                </FormControl>
              </>
            </ModalBody>
            <ModalFooter>
              <Box width="100%" display={"flex"} mb={2}>
                <Button
                  width="100%"
                  onClick={handleLeaderSubmit}
                  // colorScheme="green"
                  backgroundColor="primaryColor"
                  color="buttonTextColor"
                  boxShadow={"sm"}
                >
                  Create
                </Button>
              </Box>
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
