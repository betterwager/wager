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

function AccountInfoModal(props) {
  const [isOpen, setIsOpen] = [props.isOpen, props.setIsOpen];
  const [editIsOpen, setEditIsOpen] = [props.editIsOpen, props.setEditIsOpen];
  const [user, userUpdate] = [props.user, props.userUpdate];

  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Account Details</ModalHeader>
        <ModalBody>
          <strong>Name: </strong> {user.name}
          <br />
          <br />
          <strong>Phone Number: </strong> {user.phonenumber} <br />
          <br />
          <strong>Trust Score: </strong> {user.trustscore} <br />
          <br />
          <strong>Betting Score: </strong> {user.bettingscore} <br />
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={() => setIsOpen(false)}>
            Close
          </Button>
          <Button
            mr={3}
            colorScheme="blue"
            onClick={() => {
              setIsOpen(false);
              setEditIsOpen(true);
            }}
          >
            Edit
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default AccountInfoModal;
