import React, { useState } from "react";
import {
  Grid,
  SimpleGrid,
  GridItem,
  Box
} from "@chakra-ui/react";
import Sidebar from './Sidebar.js'
import { DataGrid} from '@mui/x-data-grid';
import { withAuthenticator } from "@aws-amplify/ui-react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function Leaderboard(){
  const [result, setResult] = useState([])
  const [currentBoard, setCurrentBoard] = useState(null);
  const path = window.location.pathname

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'firstName', headerName: 'First name', width: 130 },
    { field: 'lastName', headerName: 'Last name', width: 130 },
    {
      field: 'age',
      headerName: 'Age',
      type: 'number',
      width: 90,
    },
    {
      field: 'fullName',
      headerName: 'Full name',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 160,
      valueGetter: (params) =>
        `${params.row.firstName || ''} ${params.row.lastName || ''}`,
    },
  ];
  
  const rows = [
    { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
    { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
    { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
    { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
    { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
    { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
    { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
    { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
    { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
  ];

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

          <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Dessert (100g serving)</TableCell>
                <TableCell align="right">User</TableCell>
                <TableCell align="right">Trust Score&nbsp;(g)</TableCell>
                <TableCell align="right">Betting Score&nbsp;(g)</TableCell>
                <TableCell align="right">Total Bets&nbsp;(g)</TableCell>
                <TableCell align="right">Earnings&nbsp;(g)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={row.name}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="right">{row.calories}</TableCell>
                  <TableCell align="right">{row.fat}</TableCell>
                  <TableCell align="right">{row.carbs}</TableCell>
                  <TableCell align="right">{row.protein}</TableCell>
                  <TableCell align="right">{row.protein}</TableCell>
                </TableRow>
              ))}
            </TableBody>
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
