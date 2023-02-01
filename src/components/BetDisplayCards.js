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
  NumberInputStepper,
  Text,
} from "@chakra-ui/react";
import { Button, Container, Card, Row, Col, Form } from "react-bootstrap";

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
  const [currentBet, setCurrentBet] = [props.currentBet, props.setCurrentBet];
  const [currentOptions, setCurrentOptions] = [
    props.currentOptions,
    props.setCurrentOptions,
  ];
  const [joinCode, setJoinCode] = [props.joinCode, props.setJoinCode];
  const playerAccountInfo = props.playerAccountInfo;
  const allUserBets = props.allUserBets;

  const handlePayout = props.handlePayout;
  const submitOption = props.submitOption;
  const selectOption = props.selectOption;

  return (
    <>
      {allUserBets.map((bet, index) => {
        return state >= 1 && state <= 3 ? (
          <Container key={index}>
            <Card style={{ marginTop: "1rem", marginBottom: "1rem" }}>
              {
                {
                  1: (
                    <Card.Body>
                      <Row>
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
                            color="green"
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
                            color="purple"
                            variant="outline"
                            mr={3}
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
                        <Col style={{ textAlign: "left" }}>
                          <Card.Title>
                            <strong>Bet Name:</strong>{" "}
                            {String.fromCharCode.apply(
                              String,
                              bet.bet_identifier
                            )}
                          </Card.Title>
                          <Card.Text style={{ color: "#aaaaaa" }}>
                            Status: Voting
                          </Card.Text>
                        </Col>
                        <Col style={{ textAlign: "right" }}>
                          <Flex>
                            {playerAccountInfo[index].voted == 0 ? (
                              <Select
                                style={{ margin: "1%" }}
                                color="purple"
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
                                color="purple"
                                variant="outline"
                                disabled
                              />
                            )}

                            <br />
                            <Button
                              disabled={playerAccountInfo[index].voted == 1}
                              variant="primary"
                              style={{
                                backgroundColor: "purple",
                                color: "white",
                              }}
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
                              color="purple"
                              onClick={() => handlePayout()}
                            >
                              Settle Funds
                            </Button>
                          ) : (
                            <Button
                              style={{ margin: "1%" }}
                              color="green"
                              variant="outline"
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

              <Card.Footer style={{ backgroundColor: "#fff" }}>
                <SimpleGrid columns={[1, null, 5]}>
                  <GridItem w="100%" h="10">
                    <Grid templateColumns="repeat(2, 1fr)" gap={3}>
                      <GridItem w="100%" h="10">
                        Position
                      </GridItem>
                      <GridItem style={{ color: "#aaaaaa" }} w="100%" h="10">
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
                      </GridItem>
                    </Grid>
                  </GridItem>
                  <GridItem w="100%" h="10">
                    <Grid templateColumns="repeat(2, 1fr)" gap={3}>
                      <GridItem w="100%" h="10">
                        Stake
                      </GridItem>
                      <GridItem style={{ color: "#aaaaaa" }} w="100%" h="10">
                        ${playerAccountInfo[index].bet_amount / 100000000}
                      </GridItem>
                    </Grid>
                  </GridItem>

                  <GridItem w="100%" h="10">
                    <Grid templateColumns="repeat(2, 1fr)" gap={3}>
                      <GridItem w="100%" h="10">
                        Pot
                      </GridItem>
                      <GridItem style={{ color: "#aaaaaa" }} w="100%" h="10">
                        ${bet.balance / 100000000}
                      </GridItem>
                    </Grid>
                  </GridItem>
                  <GridItem w="100%" h="10">
                    <Grid templateColumns="repeat(2, 1fr)" gap={3}>
                      <GridItem w="100%" h="10">
                        Time
                      </GridItem>
                      <GridItem style={{ color: "#aaaaaa" }} w="100%" h="10">
                        {new Date(bet.time * 1000).toLocaleTimeString("en-US", {
                          timeStyle: "short",
                        })}
                      </GridItem>
                    </Grid>
                  </GridItem>
                  <GridItem w="100%" h="10">
                    <Grid templateColumns="repeat(2, 1fr)" gap={3}>
                      <GridItem w="100%" h="10">
                        Players
                      </GridItem>
                      <GridItem style={{ color: "#aaaaaa" }} w="100%" h="10">
                        {bet.player_count}
                      </GridItem>
                    </Grid>
                  </GridItem>
                </SimpleGrid>
              </Card.Footer>
            </Card>
          </Container>
        ) : (
          <Container key={index}></Container>
        );
      })}
    </>
  );
}

export default BetDisplayCards;
