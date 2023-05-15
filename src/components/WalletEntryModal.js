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
    WalletDisconnectButton,
    WalletMultiButton,
    Button as SolButton
  } from "@solana/wallet-adapter-react-ui";
  import { Connection, Keypair, PublicKey } from "@solana/web3.js";
  import * as bs58 from "bs58";
  
  import { Container, Form, Row, Col} from "react-bootstrap";
  
  function WalletEntryModal(props) {
    const [isOpen, setIsOpen] = [props.isOpen, props.setIsOpen];
    const publicKey = props.publicKey
    const toast = props.toast

    const handleAirdrop = async () => {
        if (publicKey != null && publicKey.toString() != ""){
          const connection = new Connection("https://api.devnet.solana.com");
          let txhash = await connection.requestAirdrop(new PublicKey(props.publicKey.toString()), 1e9)
          .then(() => {
            toast({
              title: "Devnet SOL Airdropped",
              description: "Now let's get betting!",
              status: "success",
              duration: 3000,
              isClosable: true,
            });
          })
        }
      }
  
    return (
      <Modal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Wallet Management</ModalHeader>
          <ModalBody>
            <Form>
                <FormLabel>Solana Wallet Connection:</FormLabel>
                <Flex>
                <WalletMultiButton 
                    onClick={() => {
                    setIsOpen(false);
                    }}
                />
                <div style = {{margin: "10px"}}></div>
                <WalletDisconnectButton
                    onClick={() => {
                    setIsOpen(false);
                    }}
                />
                </Flex>
                <br/>
                <FormLabel>Airdrop 1 Devnet SOL to Wallet:</FormLabel>
                <Box className="sol-button" onClick={handleAirdrop}>
                Airdrop
                </Box>
            </Form>
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
  
  export default WalletEntryModal;
  