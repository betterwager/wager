import {
  Box,
  CloseButton,
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
  Avatar,
} from "@chakra-ui/react";
import "bootstrap/dist/css/bootstrap.css";
import { Container, Form } from "react-bootstrap";
import React, { useEffect, useState, useCallback } from "react";
import { FaDice } from "react-icons/fa";
function AccountInfoModal(props) {
  const [isOpen, setIsOpen] = [props.isOpen, props.setIsOpen];
  const user = props.user
  const nameParts = String(user.name).trim().split(" ");
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(" ");
  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size={"xl"}>
      <ModalOverlay />
      <ModalContent mr={3}>
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
        <ModalBody>
          <Box display={"flex"} justifyContent={"space-between"} gap={4}>
            <Box
              borderRadius="25px"
              boxShadow={"sm"}
              display={"flex"}
              flexDirection={"column"}
              alignItems={"center"}
              width={"30%"}
              gap={1}
              mr={4}
            >
              <Avatar
                size="xl"
                src={props.URL}
              />
              <Box>
                <Text
                  mb={-1}
                  color="formTitleColor"
                  fontWeight={700}
                  fontSize={"xl"}
                  align="center"
                >
                  {firstName}
                </Text>
                <Text
                  color="formTitleColor"
                  fontWeight={700}
                  fontSize={"xl"}
                  align="center"
                >
                  {lastName}
                </Text>
              </Box>
              <Box>
                <Text
                  mb={-1}
                  color="formLabelColor"
                  fontWeight={400}
                  align="center"
                >
                  Phone number
                </Text>
                <Text
                  color="formDescriptionColor"
                  fontWeight={300}
                  align="center"
                >
                  {user.phonenumber}
                </Text>
              </Box>
            </Box>
            <Box
              display={"flex"}
              flexDirection={"column"}
              justifyContent={"space-evenly"}
              gap={3}
              width={"70%"}
            >
              <Box
                border={"1px"}
                borderColor="primaryColor"
                borderRadius={"10px"}
                width={"100%"}
                boxShadow={"md"}
                display={"flex"}
                flexDirection={"column"}
                alignItems={"center"}
              >
                <Text color="formLabelColor" fontWeight={500}>
                  Trust Score
                </Text>
                <Text color="formDescriptionColor" fontWeight={600}>
                  {user.trustscore}
                </Text>
              </Box>
              <Box
                border={"1px"}
                borderColor="primaryColor"
                borderRadius={"10px"}
                width={"100%"}
                boxShadow={"md"}
                display={"flex"}
                flexDirection={"column"}
                alignItems={"center"}
              >
                <Text color="formLabelColor" fontWeight={500}>
                  Bet Score
                </Text>
                <Text color="formDescriptionColor" fontWeight={600}>
                  {user.bettingscore}
                </Text>
              </Box>
              <Box
                border={"1px"}
                borderColor="primaryColor"
                borderRadius={"10px"}
                width={"100%"}
                boxShadow={"md"}
                display={"flex"}
                flexDirection={"column"}
                alignItems={"center"}
              >
                <Text color="formLabelColor" fontWeight={500}>
                  Total Earnings
                </Text>
                <Text color="formDescriptionColor" fontWeight={600}>
                  ${user.bettingscore}
                </Text>
              </Box>
            </Box>
          </Box>
        </ModalBody>

        <ModalFooter>
          <Box width={"100%"}>
            {props.self == true &&
            <Button
              width={"100%"}
              onClick={() => {
                setIsOpen(false);
                props.setEditIsOpen(true);
              }} // colorScheme="green"
              backgroundColor="primaryColor"
              color="buttonTextColor"
              boxShadow={"sm"}
            >
              Edit
            </Button>}
          </Box>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default AccountInfoModal;
