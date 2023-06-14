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
} from "@chakra-ui/react";

import { Container, Form } from "react-bootstrap";
import { QRCodeCanvas } from "qrcode.react";
import { FaDice } from "react-icons/fa";

function LeaderInfoModal(props) {
  const [isOpen, setIsOpen] = [props.isOpen, props.setIsOpen];
  const [code, setCode] = [props.code, props.setCode];

  const downloadQRCode = () => {
    // Generate download with use canvas and stream
    const canvas = document.getElementById("qr-gen1");
    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    let downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `${code}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setIsOpen(false);
        setCode("");
      }}
      size={"lg"}
    >
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
            <Text
              color="formTitleColor"
              fontWeight={700}
              fontSize={"xl"}
              onClick={() => {
                navigator.clipboard.writeText(code);
                alert("Copied to Clipboard");
              }}
            >
              Leaderboard Code: {code}
            </Text>
            <CloseButton
              color={"formLabelColor"}
              size="lg"
              onClick={() => setIsOpen(false)}
            />
          </Box>
        </ModalHeader>{" "}
        <ModalBody mt={1}>
          <Box mb={4}>
            <Text color="formTitleColor" fontWeight={600} fontSize={"lg"}>
              Leaderboard Info
            </Text>
            <Text color="formDescriptionColor" fontWeight={400}>
              Screenshot this QR code or copy the link below and send it to your
              friends to build your leaderboard!
            </Text>
          </Box>
          <Box
            width={"100%"}
            height={150}
            backgroundColor="#F7F8FC"
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
            borderRadius={10}
          >
            <QRCodeCanvas
              id="qr-gen1"
              includeMargin={true}
              value={window.location.href + "?leaderboard=" + code}
            />
          </Box>
          {/*           <Box display={"flex"} gap={2}>
          <Text color="formTitleColor" fontWeight={600} fontSize={"md"}>
            Join Link:
          </Text>
          <Text
            color="formDescriptionColor"
            fontWeight={400}
            onClick={() => {
              navigator.clipboard.writeText(
                window.location.href + "?bet=" + code.replace(" ", "%20")
              );
              alert("Copied to Clipboard");
            }}
          >
            {window.location.href + "?bet=" + code}
          </Text>
        </Box> */}
        </ModalBody>
        <ModalFooter>
          <Box
            width={"100%"}
            display={"flex"}
            flexDirection={"column"}
            gap={2}
            mb={1}
          >
            <Button
              width={"100%"}
              borderColor="primaryColor"
              variant="outline"
              boxShadow={"sm"}
              onClick={() => {
                navigator.clipboard.writeText(
                  window.location.href +
                    "?leaderboard=" +
                    code.replace(" ", "%20")
                );
                alert("Copied to Clipboard");
              }}
            >
              Copy Join Link
            </Button>
            <Button
              variant="outline"
              width={"100%"}
              backgroundColor="primaryColor"
              color="buttonTextColor"
              boxShadow={"sm"}
              onClick={downloadQRCode}
            >
              Download QR Code
            </Button>
          </Box>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default LeaderInfoModal;
