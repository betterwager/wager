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
} from "@chakra-ui/react";

import { Button, Container, Form } from "react-bootstrap";
import { QRCodeCanvas } from "qrcode.react";

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
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Leaderboard Information</ModalHeader>
        <ModalBody>
          <h1 style={{ fontSize: "15px" }}>
            <strong>Leaderboard Code:</strong>
            <u>
              <a
                onClick={() => {
                  navigator.clipboard.writeText(code);
                  alert("Copied to Clipboard");
                }}
              >
                {" "}
                {code}
              </a>
            </u>
          </h1>
          <br />
          <h3 style={{ fontSize: "15px" }}>
            <strong>Join Link:</strong>{" "}
            <u>
              <a
                onClick={() => {
                  navigator.clipboard.writeText(
                    window.location.href +
                      "?leaderboard=" +
                      code.replace(" ", "%20")
                  );
                  alert("Copied to Clipboard");
                }}
              >
                {window.location.href + "?leaderboard=" + code}
              </a>
            </u>
          </h3>
          <br />
          <QRCodeCanvas
            id="qr-gen1"
            includeMargin={true}
            value={window.location.href + "?leaderboard=" + code}
          />
          <Button onClick={downloadQRCode}>Download QR Code</Button>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="ghost"
            mr={3}
            onClick={() => {
              setIsOpen(false);
              setCode("");
            }}
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default LeaderInfoModal;
