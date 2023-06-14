import "bootstrap/dist/css/bootstrap.css";
import "@aws-amplify/ui-react/styles.css";
import React, { useEffect, useState, useCallback } from "react";
import {
  useToast,
  Grid,
  Flex,
  FormControl,
  FormLabel,
  Icon,
  Input,
  Modal,
  Select,
  SimpleGrid,
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
  IconButton,
  Divider,
  Box,
} from "@chakra-ui/react";
import { Container, Card, Row, Col, Form } from "react-bootstrap";
import { AiOutlineInfo } from "react-icons/ai";

import BetDataModal from "./BetDataModal.js";

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

function BetDisplayCards(props) {
  const state = props.state;
  const [code, setCode] = [props.code, props.setCode];
  const [codeDisplayIsOpen, setCodeDisplayIsOpen] = [
    props.codeDisplayIsOpen,
    props.setCodeDisplayIsOpen,
  ];
  const [betIsOpen, setBetIsOpen] = [props.betIsOpen, props.setBetIsOpen];
  const [betInfoIsOpen, setBetInfoIsOpen] = useState(false);
  const [currentBet, setCurrentBet] = [props.currentBet, props.setCurrentBet];
  const [currentOptions, setCurrentOptions] = [
    props.currentOptions,
    props.setCurrentOptions,
  ];
  const [joinCode, setJoinCode] = [props.joinCode, props.setJoinCode];
  const playerAccountInfo = props.playerAccountInfo;
  const allUserBets = props.allUserBets;

  const bet = props.bet;
  const index = props.index;

  const toast = props.toast;
  const connection = props.connection;
  const programId = props.programId;
  const systemProgram = props.systemProgram;
  const sendTransaction = props.sendTransaction;
  const publicKey = props.publicKey;

  const handlePayout = props.handlePayout;
  const submitOption = props.submitOption;
  const selectOption = props.selectOption;

  const handlePing = async (name, index) => {
    let option = 0;
    //let value = betValue;
    //let bet = userBets[index]; //bet object in contention
    //Sending Bet Transaction and Balance for Bet
    let tempStr = name + " ".repeat(20 - name.length);
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
      data: MakeBetInstruction(option, playerBump, 0),
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
      title: "Voting Stage Requested",
      status: "success",
      duration: 9000,
      isClosable: true,
    });
  };

  return (
    <>
      {state >= 1 && state <= 3 ? (
        <Container key={index}>
          {
            <BetDataModal
              position={
                playerAccountInfo[index].bet_amount == 0
                  ? "N/A"
                  : String.fromCharCode
                      .apply(
                        String,
                        bet.options[props.playerAccountInfo[index].option_index]
                          .name
                      )
                      .substr(
                        0,
                        String.fromCharCode
                          .apply(
                            String,
                            bet.options[
                              props.playerAccountInfo[index].option_index
                            ].name
                          )
                          .indexOf("\0")
                      )
              }
              stake={playerAccountInfo[index].bet_amount / 100000000}
              pot={bet.balance / 100000000}
              time={new Date(bet.time * 1000).toLocaleTimeString("en-US", {
                timeStyle: "short",
              })}
              players={bet.player_count}
              isOpen={betInfoIsOpen}
              setIsOpen={setBetInfoIsOpen}
            />
          }
          <Box
            marginTop="1rem"
            marginBottom="1rem"
            border="solid"
            borderWidth="1px"
            borderColor="#DFE0EB"
            borderRadius={8}
            backgroundColor="#fff"
            boxShadow={"sm"}
            _hover={{
              border: "1px",
              borderColor: "primaryColor",
              boxShadow: "xl",
            }}
          >
            {
              {
                1: (
                  <Box p={5}>
                    <Box
                      display="flex"
                      flexDirection={"row"}
                      justifyContent={"space-between"}
                      alignItems={"center"}
                    >
                      <Box
                        width="75%"
                        display="flex"
                        flexDirection={"column"}
                        alignItems={"flex-start"}
                        onClick={() => {
                          let name = bet.bet_identifier;
                          name = String.fromCharCode.apply(String, name);
                          if (name.indexOf(" ") >= 0) name = name.trim();
                          setCode(name);
                          setCodeDisplayIsOpen(true);
                        }}
                        ml={3}
                      >
                        <Box display="flex" gap={2}>
                          <Text fontSize="xl" fontWeight={700}>
                            {String.fromCharCode.apply(
                              String,
                              bet.bet_identifier
                            )}
                          </Text>
                        </Box>
                        <Text color="#aaaaaa">Status: Created</Text>
                      </Box>

                      <Box width="25%" display="flex" justifyContent="flex-end">
                        <Button
                          style={{ margin: "5px" }}
                          borderColor="accentColor"
                          borderRadius="20px"
                          color="accentColor"
                          variant="outline"
                          mr={3}
                          onClick={() => {
                            let name = bet.bet_identifier;
                            name = String.fromCharCode.apply(String, name);
                            if (name.indexOf(" ") >= 0) name = name.trim();
                            handlePing(name, index);
                          }}
                        >
                          Ping
                        </Button>
                        <Button
                          variant={"outline"}
                          borderColor={"accentColor"}
                          borderRadius={20}
                          color="accentColor"
                          width="50%"
                          mr={3}
                          style={{ margin: "5px" }}
                          boxShadow={"sm"}
                          onClick={() => {
                            setBetIsOpen(true);
                            setCurrentBet(bet);
                            let name = bet.bet_identifier;
                            name = String.fromCharCode.apply(String, name);
                            if (name.indexOf(" ") >= 0) name = name.trim();
                            setJoinCode(name);
                            setCurrentOptions(bet.options);
                          }}
                          disabled={playerAccountInfo[index].bet_amount != 0}
                        >
                          Make Bet
                        </Button>
                      </Box>
                    </Box>
                    <Box
                      display="flex"
                      justifyContent="space-evenly"
                      alignItems="center"
                      mt={5}
                    >
                      <Box
                        width="20%"
                        display="flex"
                        justifyContent="space-around"
                        borderRight="solid"
                        borderRightWidth="thin"
                        borderColor="#252733"
                      >
                        <Text fontWeight={600}>Position</Text>
                        <Text width="50%" fontWeight={600} color={"#9FA2B4"}>
                          {playerAccountInfo[index].bet_amount == 0
                            ? "N/A"
                            : String.fromCharCode
                                .apply(
                                  String,
                                  bet.options[
                                    props.playerAccountInfo[index].option_index
                                  ].name
                                )
                                .substr(
                                  0,
                                  String.fromCharCode
                                    .apply(
                                      String,
                                      bet.options[
                                        props.playerAccountInfo[index]
                                          .option_index
                                      ].name
                                    )
                                    .indexOf("\0")
                                )}
                        </Text>
                      </Box>

                      <Box
                        width="20%"
                        display="inline-flex"
                        justifyContent="space-around"
                        borderRight="solid"
                        borderRightWidth="thin"
                        borderColor="#252733"
                      >
                        <Text fontWeight={600}>Stake </Text>
                        <Text width="50%" fontWeight={600} color={"#9FA2B4"}>
                          ${playerAccountInfo[index].bet_amount / 100000000}
                        </Text>
                      </Box>

                      <Box
                        width="20%"
                        display="inline-flex"
                        justifyContent="space-around"
                        borderRight="solid"
                        borderRightWidth="thin"
                        borderColor="#252733"
                      >
                        <Text fontWeight={600}>Total Pot </Text>
                        <Text width="50%" fontWeight={600} color={"#9FA2B4"}>
                          ${bet.balance / 100000000}
                        </Text>
                      </Box>

                      <Box
                        width="20%"
                        display="flex"
                        justifyContent="space-around"
                        alignItems={"center"}
                        borderRight="solid"
                        borderRightWidth="thin"
                        borderColor="#252733"
                      >
                        <Text fontWeight={600}>Time </Text>
                        <Text width="50%" fontWeight={600} color={"#9FA2B4"}>
                          {new Date(bet.time * 1000).toLocaleTimeString(
                            "en-US",
                            {
                              timeStyle: "short",
                            }
                          )}
                        </Text>
                      </Box>

                      <Box
                        width="20%"
                        display="inline-flex"
                        justifyContent="space-around"
                      >
                        <Text fontWeight={600}>Players </Text>
                        <Text width="50%" fontWeight={600} color={"#9FA2B4"}>
                          {bet.player_count}
                        </Text>
                      </Box>
                    </Box>
                  </Box>
                ),

                2: (
                  <Box p={5}>
                    <Box
                      display="flex"
                      flexDirection={"row"}
                      justifyContent={"space-between"}
                      alignItems={"center"}
                    >
                      <Box
                        display="flex"
                        flexDirection={"column"}
                        alignItems={"flex-start"}
                        ml={3}
                      >
                        <Box display="flex" gap={2}>
                          <Text fontSize="xl" fontWeight={700}>
                            {String.fromCharCode.apply(
                              String,
                              bet.bet_identifier
                            )}
                          </Text>
                        </Box>
                        <Text color="#aaaaaa">Status: Voting</Text>
                      </Box>
                      <Box
                        width="40%"
                        display="flex"
                        justifyContent="flex-end"
                        alignItems={"center"}
                        gap={2}
                      >
                        {playerAccountInfo[index].voted == 0 ? (
                          <Select
                            onChange={(e) => {
                              selectOption(e, index);
                            }}
                            borderColor="accentColor"
                            variant="outline"
                            placeholder="Select option"
                          >
                            {bet.options.map((option, index) => {
                              let name = String.fromCharCode.apply(
                                String,
                                option.name
                              );
                              if (name.indexOf("\0") >= 0)
                                name = name.substr(0, name.indexOf("\0"));
                              if (name !== "zero" && name !== "") {
                                return (
                                  <option
                                    key={index}
                                    value={name + "@&@" + index}
                                  >
                                    {name}
                                  </option>
                                );
                              }
                            })}
                          </Select>
                        ) : (
                          <Select variant="outline" disabled />
                        )}

                        <Button
                          disabled={playerAccountInfo[index].voted == 1}
                          variant={"outline"}
                          borderColor={"accentColor"}
                          borderRadius={20}
                          color="accentColor"
                          width="50%"
                          mr={3}
                          style={{ margin: "5px" }}
                          boxShadow={"sm"}
                          onClick={submitOption}
                        >
                          Vote
                        </Button>
                      </Box>
                    </Box>
                    <Box
                      display="flex"
                      justifyContent="space-evenly"
                      alignItems="center"
                      mt={5}
                    >
                      <Box
                        width="20%"
                        display="flex"
                        justifyContent="space-around"
                        borderRight="solid"
                        borderRightWidth="thin"
                        borderColor="#252733"
                      >
                        <Text fontWeight={600}>Position</Text>
                        <Text width="50%" fontWeight={600} color={"#9FA2B4"}>
                          {playerAccountInfo[index].bet_amount == 0
                            ? "N/A"
                            : String.fromCharCode
                                .apply(
                                  String,
                                  bet.options[
                                    props.playerAccountInfo[index].option_index
                                  ].name
                                )
                                .substr(
                                  0,
                                  String.fromCharCode
                                    .apply(
                                      String,
                                      bet.options[
                                        props.playerAccountInfo[index]
                                          .option_index
                                      ].name
                                    )
                                    .indexOf("\0")
                                )}
                        </Text>
                      </Box>

                      <Box
                        width="20%"
                        display="inline-flex"
                        justifyContent="space-around"
                        borderRight="solid"
                        borderRightWidth="thin"
                        borderColor="#252733"
                      >
                        <Text fontWeight={600}>Stake </Text>
                        <Text width="50%" fontWeight={600} color={"#9FA2B4"}>
                          ${playerAccountInfo[index].bet_amount / 100000000}
                        </Text>
                      </Box>

                      <Box
                        width="20%"
                        display="inline-flex"
                        justifyContent="space-around"
                        borderRight="solid"
                        borderRightWidth="thin"
                        borderColor="#252733"
                      >
                        <Text fontWeight={600}>Total Pot </Text>
                        <Text width="50%" fontWeight={600} color={"#9FA2B4"}>
                          ${bet.balance / 100000000}
                        </Text>
                      </Box>

                      <Box
                        width="20%"
                        display="flex"
                        justifyContent="space-around"
                        alignItems={"center"}
                        borderRight="solid"
                        borderRightWidth="thin"
                        borderColor="#252733"
                      >
                        <Text fontWeight={600}>Time </Text>
                        <Text width="50%" fontWeight={600} color={"#9FA2B4"}>
                          {new Date(bet.time * 1000).toLocaleTimeString(
                            "en-US",
                            {
                              timeStyle: "short",
                            }
                          )}
                        </Text>
                      </Box>

                      <Box
                        width="20%"
                        display="inline-flex"
                        justifyContent="space-around"
                      >
                        <Text fontWeight={600} mr={3}>
                          Players{" "}
                        </Text>
                        <Text width="50%" fontWeight={600} color={"#9FA2B4"}>
                          {bet.player_count}
                        </Text>
                      </Box>
                    </Box>
                  </Box>
                ),

                3: (
                  <Card.Body>
                    <Row>
                      <Col md="auto">
                        <IconButton
                          colorScheme="blue"
                          variant="ghost"
                          onClick={() => setBetInfoIsOpen(true)}
                          aria-label="Bet Info"
                          icon={<AiOutlineInfo />}
                        />
                      </Col>
                      <Col style={{ textAlign: "left" }}>
                        <Card.Title>
                          {String.fromCharCode.apply(
                            String,
                            bet.bet_identifier
                          )}
                        </Card.Title>
                        <Card.Text style={{ color: "#aaaaaa" }}>
                          Status: Settled
                        </Card.Text>
                      </Col>
                      <Col style={{ textAlign: "right" }}>
                        <Button
                          style={{ margin: "1%" }}
                          color="purple"
                          variant="outline"
                        >
                          Winning Option:{" "}
                          {String.fromCharCode
                            .apply(
                              String,
                              bet.options[allUserBets[index].winner_index].name
                            )
                            .substr(
                              0,
                              String.fromCharCode
                                .apply(
                                  String,
                                  bet.options[allUserBets[index].winner_index]
                                    .name
                                )
                                .indexOf("\0")
                            )}
                        </Button>
                        {true ? (
                          <Button
                            style={{ margin: "1%" }}
                            colorScheme="primaryColor"
                            color="buttonTextColor"
                            onClick={() => handlePayout()}
                          >
                            Settle Funds
                          </Button>
                        ) : (
                          <Button
                            style={{ margin: "1%" }}
                            // colorScheme="green"
                            backgroundColor="primaryColor"
                            color="buttonTextColor"
                          >
                            You Won:
                          </Button>
                        )}
                      </Col>
                    </Row>
                  </Card.Body>
                ),
              }[state]
            }
          </Box>
        </Container>
      ) : (
        <Container key={index}></Container>
      )}
    </>
  );
}

export default BetDisplayCards;
