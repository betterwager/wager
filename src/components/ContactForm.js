import React, { useState } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Image,
  Input,
  Modal,
  ModalHeader,
  ModalOverlay,
  ModalBody,
  ModalContent,
  ModalFooter,
  Text,
  useToast,
} from "@chakra-ui/react";
import { Card, Col, Container, Form, Nav, Navbar, Row } from "react-bootstrap";
import axios from "axios";

function ContactForm(props) {
  //State variables for contact form
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [email, setEmail] = [props.email, props.setEmail];
  const [message, setMessage] = useState("");
  const toast = props.toast;

  //Check Email Validity & Send to API
  const handleSubmit = async (e) => {
    e.preventDefault();
    let error = !email
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
    error &&
      toast({
        title: "Invalid Email",
        description: "Make sure to enter a valid email address!",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    if (!error) {
      await axios.post(
        `https://sheet.best/api/sheets/c122b525-c0e2-4ebd-997e-614116491820`,
        { first, last, email, message }
      );
      toast({
        title: "Success!",
        description:
          "We've got your contact and message noted and will reach out soon.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setFirst("");
      setLast("");
      setEmail("");
      setMessage("");
    }
  };

  return (
    <section id="contact" style={{ paddingTop: 20, paddingBottom: 50 }}>
      <Container className="text-center d-flex-column justify-content-space-around">
        <Heading as="h1" size="xl" className="text-center">
          Any Questions?
        </Heading>
        <Text as={"p"} className="lead" paddingBottom={3}>
          Fill out the form below and we will get back to you about Wager
        </Text>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col>
              <FormControl isRequired>
                <FormLabel>First name</FormLabel>
                <Input
                  placeholder="First name"
                  value={first}
                  onChange={(e) => {
                    setFirst(e.target.value);
                  }}
                />
              </FormControl>
            </Col>
            <Col>
              <FormControl isRequired>
                <FormLabel>Last name</FormLabel>
                <Input
                  placeholder="Last name"
                  value={last}
                  onChange={(e) => {
                    setLast(e.target.value);
                  }}
                />
              </FormControl>
            </Col>
          </Row>
          <Row>
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                placeholder="Email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </FormControl>
          </Row>
          <Row className="mb-3">
            <FormControl isRequired>
              <FormLabel>Message</FormLabel>
              <Input
                placeholder="Message"
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                }}
              />
            </FormControl>
          </Row>
          <Button
            width={"100%"}
            type="submit"
            size="lg"
          >
            Submit
          </Button>
        </Form>
      </Container>
    </section>
  );
}

export default ContactForm;
