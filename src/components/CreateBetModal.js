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

  const programId = props.programId;
  const [publicKey, sendTransaction] = [props.publicKey, props.sendTransaction];
  const systemProgram = props.systemProgram;
  const rentSysvar = props.rentSysvar;
  const connection = props.connection;

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
      let totalOptions = [...OptionsList];
      while (totalOptions.length < 8) {
        totalOptions.push("zero");
      }
      let tempStr = betName + " ".repeat(20 - betName.length);
      setBetName(tempStr);

      let timestamp = time.getTime() / 1000;

      //let index = uniqueHash(betName + maxBet + allOptions);

      let [potPDA, potBump] = await PublicKey.findProgramAddress(
        [Buffer.from(tempStr, 0, 20)],
        programId
      );

      let [playerPDA, playerBump] = await PublicKey.findProgramAddress(
        [Buffer.from(tempStr, 0, 20), publicKey.toBytes()],
        programId
      );
      console.log(betName);
      console.log(potPDA.toBase58());
      console.log(potBump);
      console.log(PublicKey.isOnCurve(potPDA));

      console.log([
        { name: totalOptions[0], vote_count: 0 },
        { name: totalOptions[1], vote_count: 0 },
        { name: totalOptions[2], vote_count: 0 },
        { name: totalOptions[3], vote_count: 0 },
        { name: totalOptions[4], vote_count: 0 },
        { name: totalOptions[5], vote_count: 0 },
        { name: totalOptions[6], vote_count: 0 },
        { name: totalOptions[7], vote_count: 0 },
      ]);

      //Create bet RPC Call(Send Transaction for Create Bet)
      const instruction = new TransactionInstruction({
        programId: programId,
        keys: [
          {
            pubkey: publicKey,
            isSigner: true,
            isWritable: true,
          },
          {
            pubkey: potPDA,
            isSigner: false,
            isWritable: true,
          },
          {
            pubkey: playerPDA,
            isSigner: false,
            isWritable: true,
          },
          {
            pubkey: systemProgram,
            isSigner: false,
            isWritable: false,
          },
          {
            pubkey: rentSysvar,
            isSigner: false,
            isWritable: false,
          },
        ],
        data: NewWagerInstruction(
          tempStr,
          minPlayers,
          maxPlayers,
          minBet,
          maxBet,
          //Options
          [
            { name: Buffer.from(totalOptions[0]), bet_count: 0, vote_count: 0 },
            { name: Buffer.from(totalOptions[1]), bet_count: 0, vote_count: 0 },
            { name: Buffer.from(totalOptions[2]), bet_count: 0, vote_count: 0 },
            { name: Buffer.from(totalOptions[3]), bet_count: 0, vote_count: 0 },
            { name: Buffer.from(totalOptions[4]), bet_count: 0, vote_count: 0 },
            { name: Buffer.from(totalOptions[5]), bet_count: 0, vote_count: 0 },
            { name: Buffer.from(totalOptions[6]), bet_count: 0, vote_count: 0 },
            { name: Buffer.from(totalOptions[7]), bet_count: 0, vote_count: 0 },
          ],
          timestamp,
          potBump
          //Hours
        ),
      });
      let transaction = new Transaction().add(instruction);
      const {
        context: { slot: minContextSlot },
        value: { blockhash, lastValidBlockHeight },
      } = await connection.getLatestBlockhashAndContext();
      transaction.recentBlockhash = blockhash;
      console.log("blockhash retreived");
      const signature = await sendTransaction(transaction, connection, {
        minContextSlot,
      });
      await connection.confirmTransaction({
        blockhash,
        lastValidBlockHeight,
        signature,
      });
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
    <>
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
            <>
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
                        <>
                          <Badge key={option} mr={1} mb={2}>
                            {option}
                          </Badge>
                        </>
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
            </>
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
    </>
  );
}

export default CreateBetModal;
