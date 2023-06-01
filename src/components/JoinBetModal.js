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

function JoinBetModal(props) {
  const [joinCode, setJoinCode] = useState("");
  const [isOpen, setIsOpen] = [props.isOpen, props.setIsOpen];
  const toast = props.toast;

  const programId = props.programId;
  const [publicKey, sendTransaction] = [props.publicKey, props.sendTransaction];
  const systemProgram = props.systemProgram;
  const rentSysvar = props.rentSysvar;
  const connection = props.connection;

  useEffect(() => {
    const queryParameters = new URLSearchParams(window.location.search);
    if (queryParameters.has("bet") && publicKey != null) {
      betAPICall(queryParameters.get("bet"));
      setJoinCode(queryParameters.get("bet"));
      setIsOpen(true);
    }
  }, []);

  const betAPICall = async (betParam) => {
    //WRITE LOGIC FOR ADDING NEW BET FROM URL HERE
    //Param: betParam is the url parameter
    let [potPDA, potBump] = await PublicKey.findProgramAddress(
      [Buffer.from(betParam, 0, 20)],
      programId
    );

    let [playerPDA, playerBump] = await PublicKey.findProgramAddress(
      [Buffer.from(betParam, 0, 20), publicKey.toBytes()],
      programId
    );
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
        {
          pubkey: rentSysvar,
          isSigner: false,
          isWritable: false,
        },
      ],
      programId: programId,
      data: JoinBetInstruction(),
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
  };

  const handlejoinCodeChange = (e) => {
    setJoinCode(e.target.value);
    console.log(e.target.value);
  };

  const handleJoinBet = async (e) => {
    e.preventDefault();
    //let option = betOption;
    //let value = value;
    //let joinCode = joinCode; //bet object in contention
    let tempStr = joinCode + " ".repeat(20 - joinCode.length);
    setJoinCode(tempStr);

    //Sending Bet Transaction and Balance for Bet
    let [potPDA, potBump] = await PublicKey.findProgramAddress(
      [Buffer.from(tempStr)],
      programId
    );
    console.log([
      Buffer.from(tempStr),
      publicKey.toBytes(),
      programId.toBytes(),
    ]);
    let [playerPDA, playerBump] = await PublicKey.findProgramAddress(
      [Buffer.from(tempStr, 0, 20), publicKey.toBytes()],
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
        {
          pubkey: rentSysvar,
          isSigner: false,
          isWritable: false,
        },
      ],
      programId: programId,
      data: JoinBetInstruction(),
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
    //use account info to join based on if bet in id is active
    setIsOpen(false);
    setJoinCode("");
    toast({
      title: joinCode + " Successfuly Joined.",
      description: "Now let's get betting!",
      status: "success",
      duration: 9000,
      isClosable: true,
    });
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
            <>
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
            </>
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
