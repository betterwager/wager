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
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Col, Container, Form, Nav, Navbar, Row } from "react-bootstrap";
import NavbarCollapse from "react-bootstrap/esm/NavbarCollapse";
import { DASHBOARD } from "../App.js";
//icon imports
import { FaDice, FaUsers, FaMoneyCheckAlt, FaDiceD20 } from "react-icons/fa";
//image imports
import creation from "../assets/creation.svg";
import hero from "../assets/hero.svg";
import payout from "../assets/payout.svg";
import voting from "../assets/voting.svg";

const Home = (props) => {
  //State variables for contact form
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const toast = useToast();
  const [validateIsOpen, setValidateIsOpen] = useState(false);
  const navigate = useNavigate();

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

  const handleValidateEmail = async (e) => {
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
      const res = await axios.get(
        `https://sheet.best/api/sheets/c122b525-c0e2-4ebd-997e-614116491820`
      );
      let users = res.data.map((user) => user.email);
      if (users.includes(email)) {
        navigate(DASHBOARD);
      } else {
        toast({
          title: "Invalid Email",
          description: "Email address is not registered for alpha testing",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  return (
    <>
      <Navbar
        style={{
          borderBottom: "solid",
          borderColor: "#195F50",
          backgroundColor: "#F7F8FC",
        }}
        expand="lg"
        fixed="top"
        className="main-nav"
      >
        <Container>
          <Navbar.Brand href="#hero">
            <Flex align={"center"} w={"100%"}>
              <Icon h={"40%"} w={"40%"} as={FaDice} color="#195F50" />
              <Text fontSize="3xl" fontWeight={"bold"} color="#195F50">
                Wager
              </Text>
            </Flex>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar-nav" />

          <NavbarCollapse id="navbar-nav" className="justify-content-around ">
            <Nav>
              <Nav.Link href="#about" style={{ color: "#252733" }}>
                About
              </Nav.Link>
              <Nav.Link href="#process" style={{ color: "#252733" }}>
                Process
              </Nav.Link>
              <Nav.Link href="#contact" style={{ color: "#252733" }}>
                Contact
              </Nav.Link>
            </Nav>
          </NavbarCollapse>

          <Button
            borderColor="#195F50"
            color="#195F50"
            variant="outline"
            onClick={() => navigate(DASHBOARD)}
          >
            Let's Go!
          </Button>
        </Container>
      </Navbar>
      <section
        id="hero"
        style={{
          backgroundColor: "#F7F8FC",
          paddingTop: 90,
          paddingBottom: 50,
        }}
      >
        <Container className="container-lg">
          <Row
            className="justify-content-around align-items-center"
            display="flex"
          >
            <Col md={6} className="text-start d-none d-md-block">
              <Image
                fluid="true"
                className="img-fluid"
                src={hero}
                alt="poker king and queen"
              />
            </Col>
            <Col md={5} className="text-center tx-md-start mx-3">
              <Heading as="h1" size="lg">
                Anytime, Anywhere,
                <span style={{ color: "#195F50" }}> Any Event</span>
              </Heading>
              <Text as="p" fontSize="lg" className="lead" paddingTop="3">
                Step up your betting game with Wager, the social betting app
                built on the Solana blockchain. Create and join bets with
                friends on any event and experience the excitement of betting
                together.
              </Text>
              <Box paddingTop={3}>
                <Button
                  backgroundColor="#195F50"
                  color={"#fff"}
                  size="lg"
                  onClick={() => navigate(DASHBOARD)}
                >
                  Start Betting
                </Button>
              </Box>
            </Col>
          </Row>
        </Container>
      </section>
      <section
        id="about"
        style={{
          backgroundColor: "#Fff",
          paddingTop: 20,
          paddingBottom: 50,
        }}
      >
        <Container>
          <Heading
            as="h1"
            size="xl"
            fontWeight={"bold"}
            className="text-center"
          >
            About Wager
          </Heading>
          <Text as={"p"} paddingBottom={3} className="text-center lead">
            What you can expect from us
          </Text>
          <Row className="g-3">
            <Col md={4} className="d-flex align-items-stretch">
              <Card className="shadow">
                <Card.Img
                  variant="top"
                  as={"i"}
                  className="d-flex align-items-center justify-content-center"
                >
                  <Icon h={"60%"} w={"60%"} as={FaDiceD20} color="#195F50" />
                </Card.Img>
                <Card.Body className="text-center">
                  <Card.Title className="h5">Any Event</Card.Title>
                  <Card.Text className="p">
                    Wager lets you bet on anything, anytime. Got a hunch about
                    who will win the big game? Want to make a friendly wager
                    with your friends? Wager has you covered. Bet on any event
                    and let the voting system determine the outcome.
                  </Card.Text>
                </Card.Body>
                <Card.Footer></Card.Footer>
              </Card>
            </Col>
            <Col md={4} className="d-flex align-items-stretch">
              <Card className="shadow">
                <Card.Img
                  variant="top"
                  as={"i"}
                  className="d-flex align-items-center justify-content-center"
                >
                  <Icon
                    h={"60%"}
                    w={"60%"}
                    as={FaMoneyCheckAlt}
                    color="#195F50"
                  />
                </Card.Img>
                <Card.Body className="text-center">
                  <Card.Title className="h5">Guaranteed payout</Card.Title>
                  <Card.Text className="p">
                    With Wager, you can be confident that you'll receive your
                    winnings when you bet on the correct outcome. Our
                    decentralized payment escrow securely holds and releases
                    funds to the winners of each bet. No bookie, no hassle.
                  </Card.Text>
                </Card.Body>
                <Card.Footer></Card.Footer>
              </Card>
            </Col>
            <Col md={4} className="d-flex align-items-stretch">
              <Card className="shadow">
                <Card.Img
                  variant="top"
                  as={"i"}
                  className="d-flex align-items-center justify-content-center"
                >
                  <Icon h={"60%"} w={"60%"} as={FaUsers} color="#195F50" />
                </Card.Img>
                <Card.Body className="text-center">
                  <Card.Title className="h5">Fully social</Card.Title>
                  <Card.Text className="p">
                    Take your betting to the next level with Wager's social
                    features. Create leaderboards with your friends to track
                    your winnings and bet scores, and see who comes out on top.
                    The social glory of betting is now here to stay!
                  </Card.Text>
                </Card.Body>
                <Card.Footer></Card.Footer>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
      <section
        id="process"
        style={{
          backgroundColor: "#F7F8FC",
          paddingTop: 20,
          paddingBottom: 50,
        }}
      >
        <Container>
          <Heading as="h1" size="xl" className="text-center" paddingBottom={3}>
            The Wager Process
          </Heading>
          <Text as={"p"} paddingBottom={3} className="text-center lead">
            The Bet from Start to Finish
          </Text>
          <Container className="container-lg border-bottom border-1 my-5">
            <Row className="justify-content-around align-items-center">
              <Col md={5} className="text-center text-md-start">
                <Heading
                  as="h3"
                  size="xl"
                  fontWeight={"bold"}
                  className="text-center"
                >
                  Creation
                </Heading>
                <Text as={"p"} className="lead text-center">
                  Set the stakes and create the ultimate bet with your friends.
                  Choose the bet size, stakes, and outcomes. Invite friends to
                  join and place their bets.
                </Text>
              </Col>
              <Col md={5} className="text-start d-none d-md-block">
                <Image variant="top" src={creation} className="img-fluid" />
              </Col>
            </Row>
          </Container>
          <Container className="container-lg border-bottom border-1 my-5">
            <Row className="justify-content-around align-items-center">
              <Col md={5} className="text-start d-none d-md-block">
                <Image variant="top" src={voting} className="img-fluid" />
              </Col>
              <Col md={5} className="text-center text-md-start">
                <Heading
                  as="h3"
                  size="xl"
                  fontWeight={"bold"}
                  className="text-center"
                >
                  Voting
                </Heading>
                <Text as={"p"} className=" text-center lead">
                  Cast your vote on the outcome of the event and see how your
                  predictions stack up against the group. Reach an internal
                  consensus with the Wager voting system.
                </Text>
              </Col>
            </Row>
          </Container>
          <Container className="container-lg border-bottom border-1 my-5">
            <Row className="justify-content-around align-items-center">
              <Col md={5} className="text-center text-md-start">
                <Heading
                  as="h3"
                  size="xl"
                  fontWeight={"bold"}
                  className="text-center"
                >
                  Payout
                </Heading>
                <Text as={"p"} className=" text-center lead">
                  Collect your winnings automatically if you bet on the correct
                  outcome. Wager ensures fairness and security with a trust
                  score algorithm and MAD protection.
                </Text>
              </Col>
              <Col md={5} className="text-start d-none d-md-block">
                <Image variant="top" src={payout} className="img-fluid" />
              </Col>
            </Row>
          </Container>
        </Container>
      </section>
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
              backgroundColor="#195F50"
              color="#fff"
              variant="outline"
              type="submit"
              size="lg"
            >
              Submit
            </Button>
          </Form>
        </Container>
      </section>
      <footer
        style={{
          backgroundColor: "#F7F8FC",
          paddingTop: 30,
          paddingBottom: 50,
        }}
      >
        <Box
          as="footer"
          mt={8}
          p={4}
          textAlign="center"
          fontSize="md"
          color="#252733"
          bg="#F7F8FC"
          w="100%"
        >
          <Box display={"inline-flex"}>
            <Icon h={"40%"} w={"40%"} as={FaDice} color="#195F50" />
            <Text fontSize="3xl" fontWeight={"bold"} color="#195F50">
              Wager
            </Text>
          </Box>
          <Text>
            © 2023{" "}
            <u>
              <a className="text-reset" href="https://wager.social">
                Wager.social
              </a>
            </u>{" "}
            All rights reserved.
          </Text>
        </Box>
      </footer>

      <Modal isOpen={validateIsOpen} onClose={() => setValidateIsOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Validate Email</ModalHeader>
          <ModalBody>
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                value={email}
                placeholder="Email"
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="ghost"
              mr={3}
              onClick={() => setValidateIsOpen(false)}
            >
              Close
            </Button>
            <Button colorScheme="blue" onClick={handleValidateEmail}>
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Home;
