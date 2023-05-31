import {
  Box,
  CloseButton,
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
import uniqueHash from "unique-hash";
import { userLeaderCreate } from "../utils/utils";
import { FaDice } from "react-icons/fa";
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
          userID: user.id,
        };
        userLeaderCreate(userLeaderboard)
          .then(() => {
            setIsOpen(false);
            let allBoards = props.boardIDs;
            allBoards.push(uniqueHash(joinLeaderCode));
            props.setBoardIDs(allBoards);
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
        </ModalHeader>{" "}
        <Form>
          <ModalBody>
            <>
              <FormControl isRequired>
                <Box mb={3}>
                  <Text color="formTitleColor" fontWeight={600} fontSize={"lg"}>
                    Join Leaderboard
                  </Text>
                  <Text color="formDescriptionColor" fontWeight={400}>
                    Enter the unique code to join the leaderboard!
                  </Text>
                </Box>
                <Input
                  placeholder="Enter Leaderboard Code"
                  value={joinLeaderCode}
                  onChange={handlejoinLeaderCodeChange}
                />
              </FormControl>
            </>
          </ModalBody>

          <ModalFooter>
            <Box width="100%" display="flex">
              <Button
                width="100%"
                onClick={handleJoinLeaderSubmit}
                // colorScheme="green"
                backgroundColor="primaryColor"
                color="buttonTextColor"
                boxShadow={"sm"}
                mb={2}
              >
                Join!
              </Button>
            </Box>
          </ModalFooter>
        </Form>
      </ModalContent>
    </Modal>
  );
}

export default JoinLeaderModal;
