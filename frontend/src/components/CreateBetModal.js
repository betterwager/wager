import {
  useToast,
  Box,
  Badge,
  CloseButton,
  Flex,
  FormControl,
  FormLabel,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  GridItem,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  IconButton,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  Button,
  NumberInputField,
  NumberInputStepper,
  Text,
  Divider,
} from "@chakra-ui/react";

import "bootstrap/dist/css/bootstrap.css";
import React, { useEffect, useState, useCallback } from "react";
import { Container, Form } from "react-bootstrap";
import { AddIcon } from "@chakra-ui/icons";
import {
  PublicKey,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import * as BufferLayout from "@solana/buffer-layout";
import { Buffer } from "buffer";
import { JoinBetInstruction, NewWagerInstruction } from "../utils/utils.js";
import BetInfoModal from "./BetInfoModal.js";
import { FaDice } from "react-icons/fa";
import DateTimePicker from "react-datetime-picker";
import { WagerFactory } from "../utils/globals.js";

let OptionsList = [];

function CreateBetModal(props) {
  const [betName, setBetName] = useState("");
  const [betCode, setBetCode] = useState("");
  const [minPlayers, setMinPlayers] = useState(2);
  const [maxPlayers, setMaxPlayers] = useState(2);
  const [minBet, setMinBet] = useState(0.0);
  const [maxBet, setMaxBet] = useState(0.0);
  const [option, setOption] = useState("");
  const [time, setTime] = useState(null);

  const [addSuccessIsOpen, setAddSuccessIsOpen] = useState(false);

  const [isOpen, setIsOpen] = [props.isOpen, props.setIsOpen];
  const toast = props.toast;

  const magicUser = props.magicUser;

  const handleBetNameChange = (e) => {
    setBetName(e.target.value);
  };

  const handleminPlayersChange = (e) => {
    setMinPlayers(e);
  };

  const handlemaxPlayersChange = (e) => {
    setMaxPlayers(e);
  };

  const handleminBetChange = (e) => {
    setMinBet(e);
  };

  const handlemaxBetChange = (e) => {
    setMaxBet(e);
    console.log(magicUser)
  };

  const handleOptionNewChange = (e) => {
    e.preventDefault();
    setOption(e.target.value);
  };

  const handleOptionEnter = (e) => {
    e.preventDefault();
    if (OptionsList.indexOf(option) == -1) {
      if (option === "DELETE" || option == "") {
        OptionsList.splice(OptionsList.length - 1);
      } else {
        OptionsList.push(option);
      }
      setOption("");
    }
  };

  const handleTimeChange = (e) => {
    setTime(e);
  };

  const handleBetSubmit = async (e) => {
    e.preventDefault();
    if (
      parseInt(maxPlayers) >= parseInt(minPlayers) &&
      parseFloat(maxBet) >= parseFloat(minBet) &&
      OptionsList != [] &&
      time != null
    ) {
      try {
        await WagerFactory.methods
          .createWager(
            parseFloat(minBet),
            parseFloat(maxBet),
            parseInt(minPlayers),
            parseInt(maxPlayers),
            betName,
            OptionsList,
            Math.floor(time.getTime() / 1000) //Miliseconds from 1970
          )
          .send({ from: magicUser.publicAddress })
          .then(() => {
            toast({
              title: "Bet Created",
              description: "Now let's get betting!",
              status: "success",
              duration: 9000,
              isClosable: true,
            });
            setBetCode(betName);
            setIsOpen(false);
            clearBetState();
            setAddSuccessIsOpen(true);
            props.getBets();
          });
      } catch (error) {
        console.log(error);
        toast({
          title: "Bet Failed",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
        setIsOpen(false);
      }
    } else {
      alert("Invalid Bet Parameters");
    }
  };

  const clearBetState = () => {
    setBetName("");
    setMinPlayers(2);
    setMaxPlayers(2);
    setMinBet(0.0);
    setMaxBet(0.0);
    setOption("");
    OptionsList = [];
    setTime(null);
  };

  return (
    <React.Fragment>
      <Modal size={"2xl"} isOpen={isOpen} onClose={() => setIsOpen(false)}>
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
          <ModalBody>
            <React.Fragment>
              <Box mb={4}>
                <Text color="formTitleColor" fontWeight={600} fontSize={"lg"}>
                  Create a Wager!
                </Text>
                <Text color="formDescriptionColor" fontWeight={400}>
                  Choose from our prebuilt templates or create a custom Wager
                  below!
                </Text>
              </Box>
              <Box display="flex" flexDirection="column" gap={3}>
                <FormControl isRequired>
                  <Box>
                    <Text color="formLabelColor" fontWeight={500} mb={1}>
                      Wager Name*
                    </Text>
                    <Input
                      onChange={handleBetNameChange}
                      placeholder="Enter Wager Name"
                    />
                  </Box>
                </FormControl>
                <Box display={"flex"} justifyContent={"space-evenly"} gap={4}>
                  <FormControl isRequired>
                    <Text color="formLabelColor" fontWeight={500} mb={1}>
                      Minimum Players*
                    </Text>
                    <NumberInput onChange={handleminPlayersChange} min={2}>
                      <NumberInputField placeholder="Ex: 2" />
                      <NumberInputStepper>
                        <NumberIncrementStepper color="formLabelColor" />
                        <NumberDecrementStepper color="formLabelColor" />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>

                  <FormControl isRequired>
                    <Text color="formLabelColor" fontWeight={500} mb={1}>
                      Maximum Players*
                    </Text>
                    <NumberInput
                      onChange={handlemaxPlayersChange}
                      min={minPlayers}
                    >
                      <NumberInputField placeholder="Ex: 2" />
                      <NumberInputStepper>
                        <NumberIncrementStepper color="formLabelColor" />
                        <NumberDecrementStepper color="formLabelColor" />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                </Box>
                <Box display="flex" justifyContent={"space-evenly"} gap={4}>
                  <FormControl isRequired>
                    <Text color="formLabelColor" fontWeight={500} mb={1}>
                      Minimum Bet ($)*
                    </Text>{" "}
                    <NumberInput
                      onChange={handleminBetChange}
                      min={0.0}
                      precision={2}
                      step={0.5}
                    >
                      <NumberInputField placeholder="Ex: $5" />
                      <NumberInputStepper>
                        <NumberIncrementStepper color="formLabelColor" />
                        <NumberDecrementStepper color="formLabelColor" />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>

                  <FormControl isRequired>
                    <Text color="formLabelColor" fontWeight={500} mb={1}>
                      Maximum Bet ($)*
                    </Text>{" "}
                    <NumberInput
                      onChange={handlemaxBetChange}
                      min={minBet}
                      precision={2}
                      step={0.5}
                    >
                      <NumberInputField placeholder="Ex: $10" />
                      <NumberInputStepper>
                        <NumberIncrementStepper color="formLabelColor" />
                        <NumberDecrementStepper color="formLabelColor" />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                </Box>
                <FormControl>
                  <Box>
                    <Text color="formLabelColor" fontWeight={500} mb={1}>
                      Options (All possible outcomes)*
                    </Text>
                    {OptionsList.map((option) => {
                      return (
                        <Badge key={option} mr={1} mb={2}>
                          {option}
                        </Badge>
                      );
                    })}
                    <Form onSubmit={handleOptionEnter}>
                      <Flex>
                        <InputGroup>
                          <Input
                            onChange={handleOptionNewChange}
                            value={option}
                            placeholder="Type the outcome and press enter!"
                          />
                          <InputRightElement>
                            <IconButton
                              // colorScheme="green"
                              color="primaryColor"
                              aria-label="Add Option"
                              variant={"ghost"}
                              type="submit"
                              icon={<AddIcon />}
                            />
                          </InputRightElement>
                        </InputGroup>
                      </Flex>
                    </Form>
                  </Box>
                </FormControl>
                <FormControl isRequired>
                  <Box>
                    <Text color="formLabelColor" fontWeight={500} mb={1}>
                      When does betting end?*
                    </Text>
                    <DateTimePicker
                      minDate={new Date()}
                      onChange={handleTimeChange}
                      value={time}
                    />
                    <Input
                      size="md"
                      type="datetime-local"
                      onChange={handleTimeChange}
                      value={time}
                    />
                  </Box>
                </FormControl>
              </Box>
            </React.Fragment>
          </ModalBody>
          <ModalFooter>
            <Box width="100%" display={"flex"} flexDirection={"column"}>
              <Button
                onClick={handleBetSubmit}
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
                onClick={() => {
                  setIsOpen(false);
                  clearBetState();
                }}
                boxShadow={"sm"}
              >
                Close
              </Button>
            </Box>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <BetInfoModal
        code={betCode}
        setCode={setBetCode}
        isOpen={addSuccessIsOpen}
        setIsOpen={setAddSuccessIsOpen}
      />
    </React.Fragment>
  );
}

export default CreateBetModal;
