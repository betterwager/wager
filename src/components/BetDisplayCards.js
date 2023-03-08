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
  IconButton
} from "@chakra-ui/react";
import { Container, Card, Row, Col, Form } from "react-bootstrap";
import {AiFillInfoCircle} from "react-icons/ai"

import BetDataModal from "./BetDataModal.js"

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

  const bet = props.bet
  const index = props.index

  const handlePayout = props.handlePayout;
  const submitOption = props.submitOption;
  const selectOption = props.selectOption;

  return (
    <>
      {state >= 1 && state <= 3 ? (
          <Container key={index}>
                                    <BetDataModal 
                          position=  {playerAccountInfo[index].bet_amount == 0
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
                                stake={playerAccountInfo[index].bet_amount / 100000000}
                                pot={bet.balance / 100000000}
                                time={new Date(bet.time * 1000).toLocaleTimeString("en-US", {
                                  timeStyle: "short",
                                })}
                                players={bet.player_count}
                                isOpen={betInfoIsOpen}
                                setIsOpen={setBetInfoIsOpen}
                        />
            <Card style={{ marginTop: "1rem", marginBottom: "1rem" }}>
              {
                {
                  1: (
                    <Card.Body>
                      <Row>
                      <Col md="auto">
                        <IconButton colorScheme="blue" variant="ghost" onClick={() => setBetInfoIsOpen(true)} aria-label='Bet Info' icon={<AiFillInfoCircle />}/>
                        </Col>
                        <Col style={{ textAlign: "left" }}>
                          <Card.Title>
                            <strong>Bet Name:</strong>{" "}
                            {String.fromCharCode.apply(
                              String,
                              bet.bet_identifier
                            )}
                          </Card.Title>
                          <Card.Text style={{ color: "#aaaaaa" }}>
                            Status: Created
                          </Card.Text>
                        </Col>
                        <Col style={{ textAlign: "right" }}>
                          <Button
                          
                          style = {{margin:"5px"}}
                            colorScheme="green"
                            variant="outline"
                            mr={3}
                            onClick={() => {
                              let name = bet.bet_identifier;
                              name = String.fromCharCode.apply(String, name);
                              if (name.indexOf(" ") >= 0) name = name.trim();
                              setCode(name);
                              setCodeDisplayIsOpen(true);
                            }}
                          >
                            Bet Info
                          </Button>
                          <Button
                            colorScheme="purple"
                            mr={3}
                            
                            style = {{margin:"5px"}}
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
                        </Col>
                      </Row>
                    </Card.Body>
                  ),

                  2: (
                    <Card.Body>
                      <Row>
                        <Col md="auto">
                        <IconButton colorScheme="blue" variant="ghost" onClick={() => setBetInfoIsOpen(true)} aria-label='Bet Info' icon={<AiFillInfoCircle />}/>
                        </Col>
                        <Col style={{ textAlign: "left" }}>
                        <Flex>
                          <Card.Title>
                            <strong>Bet Name:</strong>{" "}
                            {String.fromCharCode.apply(
                              String,
                              bet.bet_identifier
                            )}
                          </Card.Title>
                        </Flex>
                          <Card.Text style={{ color: "#aaaaaa" }}>
                            Status: Voting
                          </Card.Text>
                        
                        </Col>
                        <Col style={{ textAlign: "right" }}>
                          <Flex>
                            {playerAccountInfo[index].voted == 0 ? (
                              <Select
                                style={{ margin: "1%" }}
                                onChange={(e) => {
                                  selectOption(e, index);
                                }}
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
                              <Select
                                style={{ margin: "1%" }}
                                variant="outline"
                                disabled
                              />
                            )}

                            <div style={{margin:"10px"}}></div>
                            <Button
                              disabled={playerAccountInfo[index].voted == 1}
                              colorScheme="purple"
                              onClick={submitOption}
                            >
                              Vote
                            </Button>
                          </Flex>
                        </Col>
                      </Row>
                    </Card.Body>
                  ),

                  3: (
                    <Card.Body>
                      <Row>
                      <Col md="auto">
                        <IconButton  colorScheme="blue" variant="ghost" onClick={() => setBetInfoIsOpen(true)} aria-label='Bet Info' icon={<AiFillInfoCircle />}/>
                        </Col>
                        <Col style={{ textAlign: "left" }}>
                          <Card.Title>
                            <strong>Bet Name:</strong>{" "}
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
                                bet.options[allUserBets[index].winner_index]
                                  .name
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
                              colorScheme="green"
                              onClick={() => handlePayout()}
                            >
                              Settle Funds
                            </Button>
                          ) : (
                            <Button
                              style={{ margin: "1%" }}
                              colorScheme="green"
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
            </Card>
          </Container>
        ) : (
          <Container key={index}></Container>
        )
      }
    </>
  );
}

export default BetDisplayCards;
