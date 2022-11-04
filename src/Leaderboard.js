import React, { useState } from "react";
import {
  Grid,
  SimpleGrid,
  GridItem,
  Box
} from "@chakra-ui/react";
import Sidebar from './Sidebar.js'
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
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
          area={"nav"}
        >
      <Sidebar/>
        </GridItem>

        <GridItem
          colSpan={10}
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
          colSpan={10}
          bg="#F7F8FC"
          area={"main"}
        >
          <br />
        
          <br />
          


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
