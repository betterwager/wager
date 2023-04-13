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
  Text,
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
    setBetValue(parseFloat(e));
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
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Make Bet</ModalHeader>
        <ModalBody>
          <Form>
            <FormControl isRequired>
              <FormLabel>Bet Code</FormLabel>
              <Input
                placeholder="Bet Code"
                value={joinCode}
                onChange={(e) => handlejoinCodeChange(e)}
              />
            </FormControl>
            <br />
            <FormControl isRequired>
              <FormLabel>Bet Option</FormLabel>
              <Select onChange={handleBetOption} placeholder="Select option">
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
            <br />
            <FormControl isRequired>
              <FormLabel>Bet Value ($)</FormLabel>
              <NumberInput
                onChange={handleBetValue}
                min={currentBet.min_bet}
                max={currentBet.max_bet}
                precision={2}
                step={0.5}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={() => setIsOpen(false)}>
            Close
          </Button>
          <Button
            // colorScheme="green" onClick={handleBetting}
            backgroundColor="primaryColor"
            color="buttonTextColor"
          >
            Wager!
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default MakeBetModal;
