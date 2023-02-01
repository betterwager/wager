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
  NumberInputStepper,
  Text,
} from "@chakra-ui/react";
import "bootstrap/dist/css/bootstrap.css";
import React, { useEffect, useState, useCallback } from "react";
import uniqueHash from "unique-hash";
import PhoneInput from "react-phone-input-2";
import { Button, Container, Form } from "react-bootstrap";
import { API, Auth } from "aws-amplify";
import * as queries from "../../graphql/queries";
import * as mutations from "../../graphql/mutations";
import {
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";

function AccountEditModal(props) {
  const [isOpen, setIsOpen] = [props.isOpen, props.setIsOpen];

  const [user, userUpdate] = [props.user, props.userUpdate];
  const [newUser, setNewUser] = [props.newUser, props.setNewUser];
  const publicKey = props.publicKey;

  const [firstName, setFirstName] = [props.firstName, props.setFirstName];
  const [lastName, setLastName] = [props.lastName, props.setLastName];
  const [birthdate, setBirthdate] = [props.birthdate, props.setBirthdate];
  const [phoneNumber, setPhoneNumber] = [
    props.phoneNumber,
    props.setPhoneNumber,
  ];

  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value);
  };

  const handleLastNameChange = (e) => {
    setLastName(e.target.value);
  };

  const handleBirthdateChange = (e) => {
    setBirthdate(e.target.value);
  };

  const handleEditSubmit = async () => {
    let email = Auth.user.attributes.email;
    if (publicKey != null) {
      const name = firstName + " " + lastName;
      if (
        firstName != "" &&
        lastName != "" &&
        phoneNumber != "" &&
        birthdate != ""
      ) {
        let birthday = +new Date(birthdate);
        let age = ~~((Date.now() - birthday) / 31557600000);
        if (age >= 21) {
          if (user != null) {
            let newUser = {
              id: user.id,
              email: email,
              name: name,
              birthdate: birthdate,
              phonenumber: phoneNumber,
              _version: user._version,
            };

            userUpdate(newUser).then((res) => {
              setIsOpen(false);
            });
          } else {
            let newUser = {
              id: uniqueHash(email),
              email: email,
              name: name,
              birthdate: birthdate,
              phonenumber: phoneNumber,
              trustscore: 100,
              bettingscore: 0,
              bets: [],
              leaderboards: [],
            };

            const promise = await API.graphql({
              query: mutations.createUser,
              variables: { input: newUser },
            }).then((res) => {
              setNewUser(false);
              setIsOpen(false);
            });
          }
        } else {
          alert("Must be 21 years of age or older");
        }
      } else {
        alert("Fill out all fields");
      }
    } else {
      alert("Connect Solana Wallet");
    }
  };

  return (
    <Modal isOpen={isOpen}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Account Information</ModalHeader>
        <Form>
          <ModalBody>
            <Flex>
              <FormControl isRequired>
                <FormLabel>First Name</FormLabel>
                <Input
                  onChange={handleFirstNameChange}
                  value={firstName}
                  placeholder="First name"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Last Name</FormLabel>
                <Input
                  onChange={handleLastNameChange}
                  value={lastName}
                  placeholder="Last name"
                />
              </FormControl>
            </Flex>
            <br />
            <FormControl isRequired>
              <FormLabel>Phone Number</FormLabel>
              <PhoneInput
                country="us"
                placeholder="Enter phone number"
                onlyCountries={["us"]}
                value={phoneNumber}
                onChange={(phone) => setPhoneNumber(phone)}
              />
            </FormControl>
            <br />
            <FormControl isRequired>
              <FormLabel>Date of Birth</FormLabel>
              <Form.Control
                type="date"
                name="dob"
                value={birthdate}
                onChange={handleBirthdateChange}
              />
            </FormControl>
            <br />
            <FormLabel>Solana Wallet Connection</FormLabel>
            <Flex>
              <WalletMultiButton
                onClick={() => {
                  setIsOpen(false);
                }}
                style={{ margin: "1%" }}
              />

              <WalletDisconnectButton
                onClick={() => {
                  setIsOpen(false);
                }}
                style={{ margin: "1%" }}
              />
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="ghost"
              mr={3}
              onClick={() => {
                if (publicKey != null && !newUser) {
                  setIsOpen(false);
                }
              }}
            >
              Close
            </Button>
            <Button variant="primary" onClick={handleEditSubmit}>
              Submit
            </Button>
          </ModalFooter>
        </Form>
      </ModalContent>
    </Modal>
  );
}

export default AccountEditModal;
