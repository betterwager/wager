import { useState } from "react";
import {
    useToast,
    Flex,
    FormControl,
    FormLabel,
    Icon,
    IconButton,
    Input,
    Modal,
    GridItem,
    ModalBody,
    ModalContent,
    Box,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    Text,
    Button
  } from "@chakra-ui/react";
  import {
    AddIcon,
    CheckIcon,
    CloseIcon
  } from '@chakra-ui/icons'
  import {
    WalletDisconnectButton,
    WalletMultiButton,
    Button as SolButton
  } from "@solana/wallet-adapter-react-ui";
  import { Connection, Keypair, PublicKey } from "@solana/web3.js";
  import * as bs58 from "bs58";
  import uniqueHash from "unique-hash"
  import { getUser, userUpdate } from "../utils/utils";
  import {Auth} from "aws-amplify"
  import { Container, Form, Row, Col} from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";
  
  function FriendsModal(props) {
    const [isOpen, setIsOpen] = [props.isOpen, props.setIsOpen];
    
    const toast = props.toast

    const [user, setUser] = [props.user, props.setUser]
    const [email, setEmail] = useState("")
    const handleEmailChange = (e) => {
        setEmail(e.target.value)
    }


    const requestFriend = async (e) => {
      e.preventDefault()
      let userEmail = await Auth.user.attributes.email
      getUser(uniqueHash(email))
      .then((res) => {
        let updatedUser = res.data.getUser;
        if (!updatedUser.requests.includes(userEmail)){
          updatedUser.requests.push(userEmail);
        }
        let newUser = {
          id: updatedUser.id,
          requests: updatedUser.requests
        }
        userUpdate(newUser)
        .then(() => {
          toast({
            title: "Friend Request Sent",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        })
      })
      .catch(() => {
        toast({
          title: "User Doesn't Exist",
          description: "Please enter an existing Wager user",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
      })
      
    }

    const rejectFriendRequest = async(e, email) => {
      //remove from requests
      e.preventDefault();
      let requests = user.requests
      requests = requests.filter(item => item !== email)
      let updatedUser = {
        id: uniqueHash(user.email),
        requests: requests,
        _version: user._version,
      }
      console.log(updatedUser)
      userUpdate(updatedUser)
      .then((res) => {
        setUser(res.data.updateUser)
      })
    }

    const acceptFriendRequest = async (e, email) => {
      //move from requests to friends
      e.preventDefault();
      let userEmail = await Auth.user.attributes.email
      let requests = user.requests
      requests = requests.filter(item => item !== email)

      let friends = user.friends
      if (!friends.includes(email)){
        friends.push(email)
      }
      let updatedUser = {
        id: uniqueHash(user.email),
        requests: requests,
        friends: friends,
        _version: user._version,
      }
      userUpdate(updatedUser)
      .then((res) => {
        setUser(res.data.updateUser)
      })

      getUser(uniqueHash(email))
      .then((res) => {
        let updatedUser = res.data.getUser;
        if (!updatedUser.friends.includes(userEmail)){
          updatedUser.friends.push(userEmail);
        }
        let newUser = {
          id: updatedUser.id,
          friends: updatedUser.friends
        }
        userUpdate(newUser)
        .then(() => {
          toast({
            title: "Friend Added",
            description: "Say hi to your new friend!",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        })
      })
    }
  
    const removeFriend = async (e, email) => {
      e.preventDefault();
      let friends = user.friends
      friends = friends.filter(item => item !== email)
      console.log(friends)
      let updatedUser = {
        id: uniqueHash(user.email),
        friends: friends,
        _version: user._version,
      }
      userUpdate(updatedUser)
      .then((res) => {
        console.log(res)
        setUser(res.data.updateUser)
      })
    }

    
    return (
      <Modal
      size="2xl"
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}

      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Find Friends</ModalHeader>
          <ModalBody>
                <FormLabel>Enter Email Address</FormLabel>
                
                <Form onSubmit={requestFriend}>
                <Flex>
                <Input
                  onChange={handleEmailChange}
                  value={email}
                  placeholder="Email"
                />
                <IconButton
                        colorScheme="green"
                        type="submit"
                        icon={<AddIcon />}
                  />
                  </Flex>
            </Form>
            <Flex></Flex>
            <Row>
              <Col>
            
              <div
            id="scrollableDiv1"
            style={{
              height: "200px",
              overflow: "auto",
              flexDirection: "column",
              marginTop: "10px"
            }}
          >
            <Text fontSize="lg" as='b'>Friends: </Text>
            <InfiniteScroll
            dataLength={user && user.friends ? user.friends.length : 0}
              hasMore={false}
              loader={<h4>Loading...</h4>}
              scrollableTarget="scrollableDiv1"
              endMessage={<Row style={{ textAlign: "right" }}></Row>}>
              {(user && user.friends) && user.friends.map((friend) => (
                <Flex style = {{justifyContent:"space-between", marginTop: 10}}>
                  
                  <Text>{friend}</Text>
                  <IconButton
                          colorScheme="red"
                          onClick={(e) => removeFriend(e,friend)}
                          variant="link"
                          icon={<CloseIcon />}
                    />
                </Flex>
              ))}

              </InfiniteScroll>
              </div>
              </Col>
              <Col>

              <div
            id="scrollableDiv2"
            style={{
              height: "200px",
              overflow: "auto",
              flexDirection: "column",
              marginTop:'10px'
            }}
          >
            <Text fontSize="lg" as='b'>Requests: </Text>
            <InfiniteScroll
            dataLength={user && user.requests ? user.requests.length : 0}
              hasMore={false}
              loader={<h4>Loading...</h4>}
              scrollableTarget="scrollableDiv2"
              endMessage={<Row style={{ textAlign: "right" }}></Row>}>
              {(user && user.requests) && user.requests.map((request) => (
                <Flex style = {{justifyContent:"space-between", marginTop: 10}}>
                  
                  <Text >{request}</Text>
                  <div>
                  <IconButton
                          colorScheme="green"
                          onClick={(e) => acceptFriendRequest(e,request)}
                          variant="link"
                          icon={<CheckIcon />}
                    />
                  <IconButton
                          colorScheme="red"
                          onClick={(e) => rejectFriendRequest(e,request)}
                          variant="link"
                          icon={<CloseIcon />}
                    />
                  </div>
                </Flex>
              ))}

              </InfiniteScroll>
              </div>
              </Col>
            </Row>
            

            
          </ModalBody>
          <ModalFooter>
            <Button
              variant="ghost"
              mr={3}
              onClick={() => {
                setIsOpen(false);
              }}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }
  
  export default FriendsModal;
  