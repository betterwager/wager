import React, { useState } from "react";
import {
  Grid,
  SimpleGrid,
  GridItem,
  Box,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from "@chakra-ui/react";
import Sidebar from './Sidebar.js'
import { DataGrid} from '@mui/x-data-grid';
import { withAuthenticator } from "@aws-amplify/ui-react";

function Leaderboard(){
  const [result, setResult] = useState([])
  const [currentBoard, setCurrentBoard] = useState(null);
  const path = window.location.pathname

    return (
      <Grid
        templateAreas={`"nav header"
                            "nav main"`}
        gridTemplateRows={'50px'}
        gridTemplateColumns={'150px'}
        color="blackAlpha.700"
        fontWeight="bold"
        minHeight="100vh"
      >

  
      <GridItem
      
          colSpan={2}
          area={"nav"}
        >
      <Sidebar/>
        </GridItem>

        <GridItem
          colSpan={19}
          pl = "2"
          bg="#F7F8FC"
          area={"header"}
         
        >
          <br/>
          <div
           style={{
            marginLeft: "4rem",
            
            color: "white",
            fontSize: "25px",
          }}>

          <h1>Leaderboard</h1>
          </div>
        </GridItem>


        <GridItem
          pl="2"
          colSpan={19}
          bg="#F7F8FC"
          area={"main"}
        >
          <div
           style={{
            margin: "4rem",
            marginBottom: "1rem",            
            color: "white",
            fontSize: "20px",
          }}>

          <h1>All Wagers</h1>
          </div>
          <TableContainer  style={{
            marginLeft: "4rem", backgroundColor: "white"
          }} maxWidth = "90%">
          <Table  variant='striped'>
            <Thead>
              <Tr>
                <Th>User 1</Th>
                <Th>Trust Score</Th>
                <Th>Open Bets</Th>
                <Th>Total Bets</Th>
                <Th>Earnings</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>User 2</Td>
                <Td>100</Td>
                <Td>5</Td>
                <Td>16</Td>
                <Td>1050</Td>
              </Tr>
              <Tr>
                <Td>User 3</Td>
                <Td>100</Td>
                <Td>5</Td>
                <Td>16</Td>
                <Td>1050</Td>
              </Tr>
              <Tr>
                <Td>User 4</Td>
                <Td>100</Td>
                <Td>5</Td>
                <Td>16</Td>
                <Td>1050</Td>
              </Tr>
              <Tr>
                <Td>User 5</Td>
                <Td>100</Td>
                <Td>5</Td>
                <Td>16</Td>
                <Td>1050</Td>
              </Tr>
              <Tr>
                <Td>User 6</Td>
                <Td>100</Td>
                <Td>5</Td>
                <Td>16</Td>
                <Td>1050</Td>
              </Tr>
              <Tr>
                <Td>User 7</Td>
                <Td>100</Td>
                <Td>5</Td>
                <Td>16</Td>
                <Td>1050</Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>

          
          


          {result.length != 0 && (
            <>
              <SimpleGrid columns={3}>
                <Box columns={1}>
                  <h1 style={{ fontSize: "50px" }}>Member:</h1>
                  <br/>
                  {result.map((member) => (
                    <>
                    <h3 style={{ fontSize: "20px"}}>{member.firstname} {member.lastname}</h3>
                    <br/>
                    </>
                  ))}
                </Box>
                <Box columns={1}>

                </Box>
                <Box columns={1}>
                  <h1 style={{ fontSize: "50px" }}>Score:</h1>
                  <br/>
                  {result.map((member) => (
                    <>
                    <h3 style={{ fontSize: "20px" }}>{member.betting_score}</h3>
                    <br/>
                    </>
                  ))}
                </Box>
              </SimpleGrid>
            </>
          )}
        </GridItem>
      </Grid>
    );
  
}

export default withAuthenticator(Leaderboard);
