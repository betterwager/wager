import {
  Flex,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Button,
} from "@chakra-ui/react";
import "bootstrap/dist/css/bootstrap.css";
import React from "react";
import uniqueHash from "unique-hash";
import PhoneInput from "react-phone-input-2";
import { Container, Form } from "react-bootstrap";
import { API, Auth } from "aws-amplify";
import * as queries from "../graphql/queries";
import * as mutations from "../graphql/mutations";

function AccountEditModal(props) {
  const [isOpen, setIsOpen] = [props.isOpen, props.setIsOpen];

  const [user, setUser] = [props.user, props.setUser];
  const userUpdate = props.userUpdate;
  const [newUser, setNewUser] = [props.newUser, props.setNewUser];
  const publicKey = props.publicKey;
  const toast = props.toast;

  const [firstName, setFirstName] = [props.firstName, props.setFirstName];
  const [lastName, setLastName] = [props.lastName, props.setLastName];
  const [birthdate, setBirthdate] = [props.birthdate, props.setBirthdate];

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
    let phoneNumber = user.phonenumber;
    const name = firstName + " " + lastName;
    if (firstName != "" && lastName != "" && birthdate != "") {
      let birthday = +new Date(birthdate);
      let age = ~~((Date.now() - birthday) / 31557600000);
      if (age >= 18) {
        if (user != null && JSON.stringify(user) !== "{}") {
          let newUser = {
            id: user.id,
            name: name,
            birthdate: birthdate,
            _version: user._version,
          };

          userUpdate(newUser).then((res) => {
            setUser(res.data.updateUser);
            setIsOpen(false);
            toast({
              title: "User Information Updated",
              description: "Now let's get betting!",
              status: "success",
              duration: 3000,
              isClosable: true,
            });
          });
        } else {
          let newUser = {
            id: uniqueHash(phoneNumber),
            name: name,
            phonenumber: phoneNumber,
            birthdate: birthdate,
            trustscore: 100,
            bettingscore: 0,
            requests: [],
            friends: [],
            publickey: " ",
            privatekey: " ",
          };

          const promise = await API.graphql({
            query: mutations.createUser,
            variables: { input: newUser },
          }).then((res) => {
            setUser(newUser);
            setNewUser(false);
            setIsOpen(false);
            toast({
              title: "User Information Updated",
              description: "Now let's get betting!",
              status: "success",
              duration: 3000,
              isClosable: true,
            });
          });
        }
      } else {
        toast({
          title: "Invalid Date of Birth",
          description: "Must be 18 years of age or older",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
      }
    } else {
      toast({
        title: "Invalid Entry",
        description: "Please fill out all fields",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
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
              <FormLabel>Date of Birth</FormLabel>
              <Form.Control
                type="date"
                name="dob"
                max={new Date().toISOString().slice(0, 10)}
                value={birthdate}
                onChange={handleBirthdateChange}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="ghost"
              mr={3}
              onClick={() => {
                if (!newUser) {
                  setIsOpen(false);
                }
              }}
            >
              Close
            </Button>
            <Button colorScheme="blue" onClick={handleEditSubmit}>
              Submit
            </Button>
          </ModalFooter>
        </Form>
      </ModalContent>
    </Modal>
  );
}

export default AccountEditModal;
