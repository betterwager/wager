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
    Button
  } from "@chakra-ui/react";
  
  import { Container, Form, Row, Col} from "react-bootstrap";
  
  function BetDataModal(props) {
    const [isOpen, setIsOpen] = [props.isOpen, props.setIsOpen];
  
    return (
      <Modal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Bet Information</ModalHeader>
          <ModalBody>
            <h3>
                <strong>Position: </strong> {props.position}<br/><br/>
                <Row>
                    <Col>                
                    <strong>Stake: </strong> ${props.stake}<br/><br/>
                    </Col>
                    <Col>
                    <strong>Pot: </strong> ${props.pot}<br/><br/>
                    </Col>
                </Row>
                <Row>
                    <Col>
                    <strong>Time: </strong> {props.time}<br/><br/>
                    </Col>
                    <Col>
                    <strong>Players: </strong> {props.players}<br/><br/>
                    </Col>
                </Row>
                
            </h3>
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
  
  export default BetDataModal;
  