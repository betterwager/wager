import {
  Box,
  Icon,
  CloseButton,
  Text,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  Avatar,
  AvatarBadge,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Button,
  Center,
} from "@chakra-ui/react";
import "bootstrap/dist/css/bootstrap.css";
import React, {useEffect, useRef, useState} from "react";
import uniqueHash from "unique-hash";
import PhoneInput from "react-phone-input-2";
import { Container, Form } from "react-bootstrap";
import { API, Auth } from "aws-amplify";
import * as queries from "../graphql/queries";
import * as mutations from "../graphql/mutations";
import { FaDice } from "react-icons/fa";
import { AiOutlineUserAdd } from "react-icons/ai";
import { Storage } from "@aws-amplify/storage"

function AccountEditModal(props) {
  const [isOpen, setIsOpen] = [props.isOpen, props.setIsOpen];

  const [user, setUser] = [props.user, props.setUser];
  const userUpdate = props.userUpdate;
  const [newUser, setNewUser] = [props.newUser, props.setNewUser];
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
          if (profilePicture){
            await Storage.put(user.phonenumber, profilePicture, {
              level: 'protected',
              contentType: profilePicture.type,
            })
            .then((result) => console.log(result))
          }
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
          if (profilePicture){
            await Storage.put(user.phonenumber, profilePicture, {
              level: 'protected',
              contentType: profilePicture.type,
            })
            .then((result) => console.log(result))
          }
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

  const submitProfilePicture = (e) => {
    e.preventDefault()
    inputRef.current.click();
  }

  const inputRef = useRef(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePictureURL, setProfilePictureURL] = useState(props.URL);

  const handleFileChange = async (event) => {
    const fileObj = event.target.files && event.target.files[0];
    if (!fileObj) {
      return;
    }
    event.target.value = null;
    
    console.log(fileObj);
    console.log(user.phonenumber)
    setProfilePicture(fileObj)
    setProfilePictureURL(URL.createObjectURL(fileObj))
  };

  return (
    <Modal isOpen={isOpen}>
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
        <Form>
          <ModalBody>
            <Box mb={4}>
              <Text color="formTitleColor" fontWeight={600} fontSize={"lg"}>
                Account Information
              </Text>
              <Text color="formDescriptionColor" fontWeight={400}>
                Edit your account information below
              </Text>
            </Box>
            <Center display="flex"  gap={3}>
            <Avatar onClick={submitProfilePicture} 
            src = {profilePictureURL}
            bg='gray.400'
            hover={{
                backgroundColor: "primaryColor",
                boxShadow: "xl",
              }} size="2xl" icon={<AiOutlineUserAdd fontSize='6rem' />} />
            <input
              style={{display: 'none'}}
              ref={inputRef}
              type="file"
              onChange={handleFileChange}
              accept="image/png, image/jpeg"
            />
            </Center>
            <Box display="flex" flexDirection="column" gap={3}>
              <FormControl isRequired>
                <Box>
                  <Text color="formLabelColor" fontWeight={500} mb={1}>
                    First Name*
                  </Text>
                  <Input
                    onChange={handleFirstNameChange}
                    value={firstName}
                    placeholder="Enter First Name"
                  />
                </Box>
              </FormControl>
              <FormControl isRequired>
                <Box>
                  <Text color="formLabelColor" fontWeight={500} mb={1}>
                    Last Name*
                  </Text>
                  <Input
                    onChange={handleLastNameChange}
                    value={lastName}
                    placeholder="Enter Last Name"
                  />
                </Box>
              </FormControl>
              <FormControl isRequired>
                <Box>
                  <Text color="formLabelColor" fontWeight={500} mb={1}>
                    Date of Birth*
                  </Text>

                  <Form.Control
                    type="date"
                    name="dob"
                    max={new Date().toISOString().slice(0, 10)}
                    value={birthdate}
                    onChange={handleBirthdateChange}
                  />
                </Box>
              </FormControl>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Box width="100%" display={"flex"} flexDirection={"column"}>
              <Button
                onClick={handleEditSubmit}
                // colorScheme="green"
                backgroundColor="primaryColor"
                color="buttonTextColor"
                boxShadow={"sm"}
              >
                Submit
              </Button>
              <Button
                variant="outline"
                mt={2}
                onClick={() => {
                  if (!newUser) {
                    setIsOpen(false);
                  }
                }}
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

export default AccountEditModal;
