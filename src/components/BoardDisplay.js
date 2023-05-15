import React, { useState, useCallback, useEffect } from "react";
import {
  Grid,
  SimpleGrid,
  GridItem,
  Button,
  Box,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Flex,
  FormControl,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  ModalOverlay,
  ModalContent,
  Select,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from "@chakra-ui/react";

function BoardDisplay(props) {
  return (
    <>
      <div
        style={{
          margin: "4rem",
          marginBottom: "1rem",
          color: "white",
          fontSize: "20px",
        }}
      >
        <Flex>
          <FormControl
            style={{ border: "black", maxWidth: "40%", color: "black" }}
          >
            <Select onChange={handleCurrentBoard} variant="filled">
              {boardNames.map((name, index) => (
                <option key={index} value={boardIDs[index]}>
                  {name}
                </option>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="primary"
            disabled={code == ""}
            // style={{ backgroundColor: "primaryColor", color: "white" }}
            backgroundColor="primaryColor"
            color="buttonTextColor"
            onClick={() => {
              if (code != "") {
                setCodeDisplayIsOpen(true);
              }
            }}
          >
            View Join Code
          </Button>
        </Flex>
      </div>
      <div
        id="scrollableDiv2"
        style={{
          overflow: "auto",
          height: "75vh",
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box",
          overflowX: "hidden",
        }}
      >
        <InfiniteScroll
          dataLength={boardUsers.length}
          hasMore={false}
          loader={<h4>Loading...</h4>}
          scrollableTarget="scrollableDiv2"
          style={{ boxSizing: "border-box", overflowX: "hidden" }}
          endMessage={
            <Row style={{ textAlign: "right" }}>
              <Button
                colorScheme="black"
                variant="ghost"
                rightIcon={<RepeatIcon />}
                onClick={() => {
                  getBoards().catch(console.error);
                }}
              >
                Refresh
              </Button>
            </Row>
          }
        >
          {currentBoard == null ? (
            <></>
          ) : (
            <TableContainer
              style={{
                marginLeft: "4rem",
                backgroundColor: "white",
              }}
              maxWidth="90%"
            >
              <Table variant="striped">
                <Thead>
                  <Tr>
                    <Th>User</Th>
                    <Th>Trust Score</Th>
                    <Th>Name</Th>
                    <Th>Bet Score</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {boardUsers.map((user, index) => (
                    <Tr key={index}>
                      <Td>{currentBoard[index]}</Td>
                      <Td>{user.trustscore}</Td>
                      <Td>{user.name}</Td>
                      <Td>{user.bettingscore}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          )}
        </InfiniteScroll>
      </div>
    </>
  );
}
