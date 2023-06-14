import {
  useToast,
  Flex,
  FormControl,
  FormLabel,
  Icon,
  Input,
  Modal,
  Select,
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
  Button,
  Box,
  CloseButton,
  Text,
  Center,
  Editable,
  EditableInput,
  EditablePreview,
  EditableTextarea,
} from "@chakra-ui/react";
import "bootstrap/dist/css/bootstrap.css";
import React, { useEffect, useState, useCallback } from "react";
import { Container, Form } from "react-bootstrap";
import { FaDice } from "react-icons/fa";
import {
  PublicKey,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import * as BufferLayout from "@solana/buffer-layout";
import { Buffer } from "buffer";
import { JoinBetInstruction, NewWagerInstruction } from "../utils/utils.js";
import {
  MakeBetInstruction,
  VoteInstruction,
  PayoutInstruction,
} from "../utils/utils.js";

function MakeBetModal(props) {
  const [isOpen, setIsOpen] = [props.isOpen, props.setIsOpen];
  //Join Code for entering a new Bet
  const [joinCode, setJoinCode] = [props.joinCode, props.setJoinCode];
  //Chosen User Option for a Bet
  const [betOption, setBetOption] = useState("");
  //Amount Bet on specific bet
  const [betValue, setBetValue] = useState(0.0);
  //Input Validation for bet amount
  const [outRange, setOutRange] = useState(false);

  const currentBet = props.currentBet;
  const currentOptions = props.currentOptions;
  const getBets = props.getBets;

  const toast = props.toast;

  const programId = props.programId;
  const [publicKey, sendTransaction] = [props.publicKey, props.sendTransaction];
  const systemProgram = props.systemProgram;
  const rentSysvar = props.rentSysvar;
  const connection = props.connection;

  const handlejoinCodeChange = (e) => {
    setJoinCode(e.target.value);
  };

  const handleBetOption = (e) => {
    setBetOption(e.target.value);
  };

  const handleBetValue = (e) => {
    console.log(parseFloat(e.target.value));
    if (
      isNaN(parseFloat(e.target.value)) ||
      parseFloat(e.target.value) > parseFloat(currentBet.max_bet) ||
      parseFloat(e.target.value) < parseFloat(currentBet.min_bet)
    ) {
      setOutRange(true);
    } else {
      setOutRange(false);
      setBetValue(parseFloat(e.target.value));
    }
  };

  const handleBetting = async (e, index) => {
    e.preventDefault();
    let option = betOption;
    //let value = betValue;
    //let bet = userBets[index]; //bet object in contention
    //Sending Bet Transaction and Balance for Bet
    let tempStr = joinCode + " ".repeat(20 - joinCode.length);
    setJoinCode(tempStr);
    let [potPDA, potBump] = await PublicKey.findProgramAddress(
      [Buffer.from(tempStr)],
      programId
    );
    let [playerPDA, playerBump] = await PublicKey.findProgramAddress(
      [Buffer.from(tempStr), publicKey.toBytes()],
      programId
    );
    //Make bet RPC Call(Send Transaction for Make Bet)
    let instruction = new TransactionInstruction({
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
      ],
      programId: programId,
      data: MakeBetInstruction(option, playerBump, betValue * 100000000),
    });
    const transaction = new Transaction().add(instruction);
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
    const transactionResults = await connection.getTransaction(signature);
    console.log(transactionResults.meta.logMessages);

    toast({
      title: "Bet Successfully Placed.",
      description: joinCode,
      status: "success",
      duration: 9000,
      isClosable: true,
    });
    setIsOpen(false);
    getBets(publicKey);
  };

  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader
          borderBottom={"1px"}
          borderBottomColor={"borderLightColor"}
        >
          <Box
            width={"100%"}
            display={"inline-flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Box
              display={"flex"}
              justifyContent={"flex-start"}
              gap={2}
              width={"60%"}
            >
              <Icon
                display={"flex"}
                justifyContent={"flex-start"}
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
              <Box
                mt={2.5}
                display="flex"
                flexDirection={"column"}
                alignItems="flex-start"
              >
                <Text
                  color="formTitleColor"
                  fontWeight={700}
                  fontSize={"lg"}
                  onClick={() => {
                    navigator.clipboard.writeText(joinCode);
                    alert("Copied to Clipboard");
                  }}
                >
                  {joinCode}
                </Text>
                <Text
                  fontSize={"md"}
                  color="formDescriptionColor"
                  fontWeight={400}
                >
                  Enter bet amount and option
                </Text>
              </Box>
            </Box>
            <CloseButton
              color={"formLabelColor"}
              size="lg"
              onClick={() => setIsOpen(false)}
            />
          </Box>
        </ModalHeader>
        <ModalBody>
          <Form>
            <Box
              height={200}
              width="100%"
              display="flex"
              flexDirection="column"
              borderBottom={"1px"}
              borderBottomColor={"borderLightColor"}
            >
              <Box
                height="75%"
                justifySelf="flex-end"
                alignSelf={"center"}
                color={outRange && "#d0342c"}
              >
                <Box display="flex" gap={1}>
                  <Text mt={1} fontSize={72} fontWeight={600}>
                    $
                  </Text>
                  <FormControl isRequired>
                    <Editable
                      startWithEditView
                      defaultValue={currentBet.min_bet}
                      fontWeight={600}
                      fontSize={72}
                      textAlign={"center"}
                    >
                      <EditablePreview />
                      <EditableInput
                        value={betValue}
                        onChange={handleBetValue}
                        type="numeric"
                      />
                    </Editable>
                    {/*                     <NumberInput
                      px={2}
                      width={"100%"}
                      size={"lg"}
                      variant="unstyled"
                      inputMode="numeric"
                      fontWeight={600}
                      allowMouseWheel
                      onChange={handleBetValue}
                      min={currentBet.min_bet}
                      max={currentBet.max_bet}
                      precision={2}
                      step={0.5}
                    >
                      <NumberInputField />
                    </NumberInput> */}
                  </FormControl>
                </Box>
              </Box>
              {outRange && (
                <Text
                  fontSize="lg"
                  fontWeight={500}
                  align={"center"}
                  color={"#d0342c"}
                  mb={8}
                >
                  Value must be within ${currentBet.min_bet} and $
                  {currentBet.max_bet}
                </Text>
              )}
              <FormControl isRequired>
                <Select
                  isDisabled={outRange}
                  border="1px"
                  borderColor="primaryColor"
                  onChange={handleBetOption}
                  placeholder="Select option"
                  boxShadow={"md"}
                  mt={-5}
                >
                  {currentOptions.map((option, index) => {
                    let name = String.fromCharCode.apply(String, option.name);
                    name = name.substr(0, name.indexOf("\0"));
                    if (name !== "zero" && name !== "") {
                      return (
                        <option key={name} value={index}>
                          {name}
                        </option>
                      );
                    }
                  })}
                </Select>
              </FormControl>
            </Box>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Box width="100%" display={"flex"}>
            <Button
              isDisabled={outRange}
              width="100%"
              onClick={handleBetting}
              // colorScheme="green"
              backgroundColor="primaryColor"
              color="buttonTextColor"
              boxShadow={"sm"}
              mb={2}
            >
              Place Bet!
            </Button>
          </Box>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default MakeBetModal;
