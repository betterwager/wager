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
import {magic} from "../utils/globals.js";
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
import { WagerFactory } from "../utils/globals.js";

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
  const allUserBets = props.allUserBets;

  const bet = props.bet;
  const index = props.index;

  const handlePayout = props.handlePayout;
  const submitOption = props.submitOption;
  const selectOption = props.selectOption;

  const magicUser = props.magicUser

  

  return (
    <React.Fragment>
      {state >= 1 && state <= 3 ? (
        <Container key={index}>
          {
            <BetDataModal
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
                          setCode(bet.name);
                          setCodeDisplayIsOpen(true);
                        }}
                        ml={3}
                      >
                        <Box display="flex" gap={2}>
                          <Text fontSize="xl" fontWeight={700}>
                            {bet.name}
                          </Text>
                        </Box>
                        <Text color="#aaaaaa">Status: Created</Text>
                      </Box>

                      <Box width="25%" display="flex" justifyContent="flex-end">
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
                            setJoinCode(bet.name);
                            setCurrentOptions(bet.options);
                          }}
                          disabled={bet.bets[magicUser.address].betAmount != 0}
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
                         {bet.bets[magicUser.address].betAmount != 0 ? bet.bets[magicUser.address].option : "N/A"}
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
                          {bet.bets[magicUser.address].betAmount != 0 ? bet.bets[magicUser.address].betAmount / 100000000 : "N/A"}
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
                          {() => {
                            let pool = WagerFactory.getTotalPool();
                            return pool;
                          }}
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
                          {bet.bettingEndTime}
                        </Text>
                      </Box>

                      <Box
                        width="20%"
                        display="inline-flex"
                        justifyContent="space-around"
                      >
                        <Text fontWeight={600}>Players </Text>
                        <Text width="50%" fontWeight={600} color={"#9FA2B4"}>
                          {bet.participants.length}
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
                            {bet.name}
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
                        {WagerFactory.checkIfVoted(bet.address) == false ? (
                          <Select
                            onChange={(e) => {
                              selectOption(e, index);
                            }}
                            borderColor="accentColor"
                            variant="outline"
                            placeholder="Select option"
                          >
                            {bet.outcomes.map((option) => {
                              
                                return (
                                  <option
                                    key={option}
                                    value={option}
                                  >
                                    {option}
                                  </option>
                                );
                              })}
                          </Select>
                        ) : (
                          <Select variant="outline" disabled />
                        )}

                        <Button
                          disabled={WagerFactory.checkIfVoted() == 1}
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
                          {bet.bets[magicUser.address].betAmount == 0
                            ? "N/A"
                            : bet.bets[magicUser.address].option
                                }
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
                          ${bet.bets[magicUser.address].betAmount / 100000000}
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
                          ${WagerFactory.getTotalPool() / 100000000}
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
                          {new Date(bet.bettingEndTime * 1000).toLocaleTimeString(
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
                          {bet.participants.length}
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
                          {bet.name}
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
                          {WagerFactory.getWinningOption(bet.address)}
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
    </React.Fragment>
  );
}

export default BetDisplayCards;
