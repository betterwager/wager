import { useState } from "react";
import {
    useToast,
    Flex,
    FormControl,
    FormLabel,
    Icon,
    IconButton,
    Input,
    Avatar,
    Modal,
    GridItem,
    Center,
    ModalBody,
    ButtonGroup,
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
  import { getUserProfilePicture } from "../utils/utils";
  import PhoneInput from "react-phone-input-2"
  import { FaDice } from "react-icons/fa";
  import {CloseButton} from "@chakra-ui/react"
  import AccountInfoModal from "./AccountInfoModal";

  function FriendsModal(props) {
    const [isOpen, setIsOpen] = [props.isOpen, props.setIsOpen];
    
    const toast = props.toast

    const [user, setUser] = [props.user, props.setUser]
    const [phoneNumber, setPhoneNumber] = useState("")
    const [requestMode, setRequestMode] = useState(false)

    const [currentFriend, setCurrentFriend] = useState({})
    const [currentFriendIsOpen, setCurrentFriendIsOpen] = useState(false)

    const openFriend = (e,phone) => {
      if (e.target == e.currentTarget) {
        getUser(uniqueHash(phone))
        .then((res) => {
          setCurrentFriend(res.data.getUser)
          setCurrentFriendIsOpen(true)
        })
      }
    }
    

    const requestFriend = async (e) => {
      e.preventDefault()
      let userPhone = user.phonenumber
      getUser(uniqueHash(phoneNumber))
      .then((res) => {
        let updatedUser = res.data.getUser;
        if (!updatedUser.requests.includes(userPhone)){
          updatedUser.requests.push(userPhone);
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

    const rejectFriendRequest = async(e, phoneNumber) => {
      //remove from requests
      e.preventDefault();
      let requests = user.requests
      requests = requests.filter(item => item !== phoneNumber)
      let updatedUser = {
        id: uniqueHash(user.phonenumber),
        requests: requests,
        _version: user._version,
      }
      console.log(updatedUser)
      userUpdate(updatedUser)
      .then((res) => {
        setUser(res.data.updateUser)
      })
    }

    const acceptFriendRequest = async (e, phoneNumber) => {
      //move from requests to friends
      e.preventDefault();
      let userPhone = user.phonenumber
      let requests = user.requests
      requests = requests.filter(item => item !== phoneNumber)

      let friends = user.friends
      if (!friends.includes(phoneNumber)){
        friends.push(phoneNumber)
      }
      let updatedUser = {
        id: uniqueHash(user.phonenumber),
        requests: requests,
        friends: friends,
        _version: user._version,
      }
      userUpdate(updatedUser)
      .then((res) => {
        setUser(res.data.updateUser)
      })

      getUser(uniqueHash(phoneNumber))
      .then((res) => {
        let updatedUser = res.data.getUser;
        if (!updatedUser.friends.includes(userPhone)){
          updatedUser.friends.push(userPhone);
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
  
    const removeFriend = async (e, phoneNumber) => {
      e.preventDefault();
      let friends = user.friends
      friends = friends.filter(item => item !== phoneNumber)
      console.log(friends)
      let updatedUser = {
        id: uniqueHash(user.phonenumber),
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
      <>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
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
                <Form onSubmit={requestFriend}>
          <ModalBody>
            <>
              <FormControl isRequired>
                <Box mb={4}>
                  <Text color="formTitleColor" fontWeight={600} fontSize={"lg"}>
                    Find Friends
                  </Text>
                  <Text color="formDescriptionColor" fontWeight={400}>
                    Enter phone number to find friends
                  </Text>
                </Box>
                {/*                 <Text color="formLabelColor" fontWeight={500} mb={1}>
                  Bet Code*
                </Text> */}
                <Flex>
                <PhoneInput
                  country="us"
                  placeholder="Enter phone number"
                  onlyCountries={["us"]}
                  value={phoneNumber}
                  inputStyle = {{width:"100%", height: "100%"}}
                  onChange={(phone) => setPhoneNumber(phone)}
              />
                <IconButton
                        // colorScheme="green"
                        backgroundColor="primaryColor"
                        color="buttonTextColor"
                        type="submit"
                        icon={<AddIcon />}
                  />
                  </Flex>
              </FormControl>
              <Center>
                <Button onClick={() => setRequestMode(false)} variant={requestMode ? "ghost" : "solid"} style={{margin:"10px", color: "primaryColor"}} width='400px'>All Friends</Button>
                <Button onClick={() => setRequestMode(true)}  variant={requestMode ? "solid" : "ghost"} style={{margin:"10px"}} width='400px'>Friend Requests</Button>
              </Center>
              <Row>

              {!requestMode ? (
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
            <InfiniteScroll
            dataLength={user && user.friends ? user.friends.length : 0}
              hasMore={false}
              loader={<h4>Loading...</h4>}
              scrollableTarget="scrollableDiv1"
              endMessage={<Row style={{ textAlign: "right" }}></Row>}>
              {(user && user.friends) && user.friends.map((friend) => (
                <Box
                  marginTop="1rem"
                  marginBottom="1rem"
                  border="solid"
                  borderWidth="1px"
                  borderColor="#DFE0EB"
                  borderRadius={8}
                  backgroundColor="#fff"
                  boxShadow={"sm"}
                  _hover={{
                    border: "1px",
                    borderColor: "primaryColor",
                    boxShadow: "sm",
                  }}
                  onClick={(e) => openFriend(e,friend)}
                >       
                <Flex style = {{justifyContent:"space-between", margin: 10, alignItems:"center"}}>
                  <Avatar size="md" src={getUserProfilePicture(friend)}/>

                  <Text as="b">{friend}</Text>
                  <IconButton
                          colorScheme="red"
                          onClick={(e) => removeFriend(e,friend)}
                          variant="ghost"
                          icon={<CloseIcon />}
                    />
                </Flex>
                </Box>
              ))}

              </InfiniteScroll>
              </div>
              </Col>
              ): (
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
              <InfiniteScroll
              dataLength={user && user.requests ? user.requests.length : 0}
                hasMore={false}
                loader={<h4>Loading...</h4>}
                scrollableTarget="scrollableDiv2"
                endMessage={<Row style={{ textAlign: "right" }}></Row>}>
                {(user && user.requests) && user.requests.map((request) => (
                  <>
                   <Box
                  marginTop="1rem"
                  marginBottom="1rem"
                  border="solid"
                  borderWidth="1px"
                  borderColor="#DFE0EB"
                  borderRadius={8}
                  backgroundColor="#fff"
                  boxShadow={"sm"}
                  _hover={{
                    border: "1px",
                    borderColor: "primaryColor",
                    boxShadow: "sm",
                  }}
                  onClick={(e) => openFriend(e,request)}
                >
                  <Flex style = {{justifyContent:"space-between", margin: 10, alignItems:"center"}}>
                    <Avatar size="md" src={getUserProfilePicture(request)}/>
                    <Text as="b">{request}</Text>
                    <div>
                    <IconButton
                            // colorScheme="green"
                            backgroundColor="primaryColor"
                            color="buttonTextColor"
                            onClick={(e) => acceptFriendRequest(e,request)}
                            variant="solid"
                            icon={<CheckIcon />}
                      />
                    <IconButton
                            colorScheme="red"
                            onClick={(e) => rejectFriendRequest(e,request)}
                            variant="ghost"
                            icon={<CloseIcon />}
                      />
                    </div>
                  </Flex>
                  </Box>
                  <Box
                  marginTop="1rem"
                  marginBottom="1rem"
                  border="solid"
                  borderWidth="1px"
                  borderColor="#DFE0EB"
                  borderRadius={8}
                  backgroundColor="#fff"
                  boxShadow={"sm"}
                  _hover={{
                    border: "1px",
                    borderColor: "primaryColor",
                    boxShadow: "sm",
                  }}
                  onClick={() => openFriend(request)}
                >
                  <Flex style = {{justifyContent:"space-between", margin: 10, alignItems:"center"}}>
                    <Avatar size="md" src={getUserProfilePicture(request)}/>
                    <Text as="b">{request}</Text>
                    <div>
                    <IconButton
                            // colorScheme="green"
                            backgroundColor="primaryColor"
                            color="buttonTextColor"
                            onClick={(e) => acceptFriendRequest(e,request)}
                            variant="solid"
                            icon={<CheckIcon />}
                      />
                    <IconButton
                            colorScheme="red"
                            onClick={(e) => rejectFriendRequest(e,request)}
                            variant="ghost"
                            icon={<CloseIcon />}
                      />
                    </div>
                  </Flex>
                  </Box>
                  </>
                ))}
  
                </InfiniteScroll>
                </div>
                </Col>
              )}
                
              
                <AccountInfoModal
                user={currentFriend}
                isOpen={currentFriendIsOpen}
                setIsOpen={setCurrentFriendIsOpen}
                URL={getUserProfilePicture(currentFriend.phonenumber)}
                self={false}
              />

          
              </Row>
            </>
          </ModalBody>

          <ModalFooter>
            <Box width="100%" display={"flex"} flexDirection={"column"}>
              <Button
                variant="outline"
                mt={2}
                boxShadow={"sm"}
                onClick={() => setIsOpen(false)}
              >
                Close
              </Button>
            </Box>
          </ModalFooter>
        </Form>
      </ModalContent>
    </Modal>
      </>
    );
  }
  
  export default FriendsModal;
  