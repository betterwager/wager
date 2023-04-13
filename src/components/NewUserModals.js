import {
  useToast,
  Flex,
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
} from "@chakra-ui/react";
import "bootstrap/dist/css/bootstrap.css";
import { Container, Form } from "react-bootstrap";
import React, { useEffect, useState, useCallback } from "react";

import { QRCodeCanvas } from "qrcode.react";
import { BsFillDice5Fill } from "react-icons/bs";
import { FaDice } from "react-icons/fa";
import { MdLeaderboard } from "react-icons/md";
import { RiNumber1, RiNumber2, RiNumber3 } from "react-icons/ri";

function NewUserModals(props) {
  const [start1IsOpen, setStart1IsOpen] = [
    props.start1IsOpen,
    props.setStart1IsOpen,
  ];
  const [start2IsOpen, setStart2IsOpen] = useState(false);
  const [start3IsOpen, setStart3IsOpen] = useState(false);

  const [editIsOpen, setEditIsOpen] = [props.editIsOpen, props.setEditIsOpen];

  return (
    <>
      <Modal isOpen={start1IsOpen} size="lg" isCentered>
        <ModalOverlay backdropFilter="blur(10px) brightness(0%)" />
        <ModalContent>
          <ModalHeader>
            <Icon h={"10%"} w={"10%"} as={FaDice} color="primaryColor" />
            <Text fontSize="3xl" as="b" color="primaryColor">
              Welcome to Wager
            </Text>
          </ModalHeader>
          <ModalBody>
            <Text fontSize="xl">
              Wager is a social betting app that allows a user to bet on any
              event and compete with a network of users across the platform.
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button
              backgroundColor="primaryColor"
              onClick={() => {
                setStart1IsOpen(false);
                setStart2IsOpen(true);
              }}
            >
              Continue
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={start2IsOpen} size="lg" isCentered>
        <ModalOverlay backdropFilter="blur(10px) brightness(0%)" />
        <ModalContent>
          <ModalHeader>
            <Text fontSize="3xl" as="b" color="primaryColor">
              Wager Features
            </Text>
          </ModalHeader>
          <ModalBody>
            <Flex>
              <Icon as={BsFillDice5Fill} h={"7%"} w={"7%"} color="primaryColor" />
              <Text style={{ marginLeft: "15px" }} fontSize="xl">
                Set up and share bets with your friends with access through your{" "}
                <u>
                  <a href="https://phantom.app/" target="_blank">
                    Phantom
                  </a>
                </u>{" "}
                or{" "}
                <u>
                  <a href="https://glow.app/" target="_blank">
                    Glow
                  </a>
                </u>{" "}
                wallet
              </Text>{" "}
              <br />
            </Flex>{" "}
            <br />
            <Flex>
              <Icon as={MdLeaderboard} h={"7%"} w={"7%"} color="primaryColor" />
              <Text style={{ marginLeft: "15px" }} fontSize="xl">
                Compete using your bet records across the platforms through a
                leaderboard system
              </Text>
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button
              // colorScheme="green"
              backgroundColor="primaryColor"
              color="ButtonText"
              onClick={() => {
                setStart2IsOpen(false);
                setStart3IsOpen(true);
              }}
            >
              Continue
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={start3IsOpen} size="lg" isCentered>
        <ModalOverlay backdropFilter="blur(10px) brightness(0%)" />
        <ModalContent>
          <ModalHeader>
            <Text fontSize="3xl" as="b" color="primaryColor">
              Next Steps
            </Text>
          </ModalHeader>
          <ModalBody>
            <Flex>
              <Icon as={RiNumber1} h={"7%"} w={"7%"} color="primaryColor" />
              <Text style={{ marginLeft: "15px" }} fontSize="xl">
                Fill out the Account Information form to register as a user in
                Wager
              </Text>{" "}
              <br />
            </Flex>{" "}
            <br />
            <Flex>
              <Icon as={RiNumber2} h={"7%"} w={"7%"} color="primaryColor" />
              <Text style={{ marginLeft: "15px" }} fontSize="xl">
                Connect your Phantom or Glow wallet to the account to link your bets to
                the account
              </Text>{" "}
              <br />
            </Flex>{" "}
            <br />
            <Flex>
              <Icon as={RiNumber3} h={"7%"} w={"7%"} color="primaryColor" />
              <Text style={{ marginLeft: "15px" }} fontSize="xl">
                Start Wagering!
              </Text>
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button
              // colorScheme="green"
              backgroundColor="primaryColor"
              color="buttonTextColor"
              onClick={() => {
                setStart3IsOpen(false);
                setEditIsOpen(true);
              }}
            >
              Get Started
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default NewUserModals;
