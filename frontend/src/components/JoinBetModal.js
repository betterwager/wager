import {
  useToast,
  Box,
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
  CloseButton,
} from "@chakra-ui/react";
import "bootstrap/dist/css/bootstrap.css";
import React, { useEffect, useState, useCallback } from "react";
import { Container, Form } from "react-bootstrap";
import {
  PublicKey,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import * as BufferLayout from "@solana/buffer-layout";
import { Buffer } from "buffer";
import { JoinBetInstruction, NewWagerInstruction } from "../utils/utils.js";
import { FaDice } from "react-icons/fa";
import { WagerFactory, Wager } from "../utils/globals.js";

function JoinBetModal(props) {
  const [joinCode, setJoinCode] = useState("");
  const [isOpen, setIsOpen] = [props.isOpen, props.setIsOpen];
  const toast = props.toast;

  const magicUser = props.magicUser;

  useEffect(() => {
    const queryParameters = new URLSearchParams(window.location.search);
    if (queryParameters.has("bet")) {
      setJoinCode(queryParameters.get("bet"));
      setIsOpen(true);
    }
  }, []);

  const handlejoinCodeChange = (e) => {
    setJoinCode(e.target.value);
    console.log(e.target.value);
  };

  const handleJoinBet = async (e) => {
    e.preventDefault();
    //let option = betOption;
    //let value = value;
    //let joinCode = joinCode; //bet object in contention
    try {
      await WagerFactory.methods.joinWager(parseInt(joinCode)).send({ from: magicUser.address })
      .then(() => {
        toast({
          title: joinCode + " Successfuly Joined.",
          description: "Now let's get betting!",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      })
    } catch (error) {
      setIsOpen(false);
      setJoinCode("");
      toast({
        title: "Failed to join the Wager",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }

    //use account info to join based on if bet in id is active

    props.getBets();
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
        </ModalHeader>
        <Form onSubmit={(e) => handleJoinBet(e)}>
          <ModalBody>
            <React.Fragment>
              <FormControl isRequired>
                <Box mb={4}>
                  <Text color="formTitleColor" fontWeight={600} fontSize={"lg"}>
                    Join Bet
                  </Text>
                  <Text color="formDescriptionColor" fontWeight={400}>
                    Enter the unique code to join a friendly Wager!
                  </Text>
                </Box>
                {/*                 <Text color="formLabelColor" fontWeight={500} mb={1}>
                  Bet Code*
                </Text> */}
                <Input
                  placeholder="Enter unique code"
                  value={joinCode}
                  onChange={handlejoinCodeChange}
                />
              </FormControl>
            </React.Fragment>
          </ModalBody>

          <ModalFooter>
            <Box width="100%" display={"flex"} flexDirection={"column"}>
              <Button
                type="submit"
                // colorScheme="green"
                backgroundColor="primaryColor"
                color="buttonTextColor"
                boxShadow={"sm"}
              >
                Wager!
              </Button>
              <Button
                variant="outline"
                mt={2}
                onClick={() => setIsOpen(false)}
                boxShadow={"sm"}
              >
                Close
              </Button>
            </Box>
          </ModalFooter>
        </Form>
      </ModalContent>
    </Modal>
  );
}

export default JoinBetModal;
