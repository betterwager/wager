import { Box, Center, IconButton, Text, Flex } from '@chakra-ui/react'
import { AddIcon, HamburgerIcon } from '@chakra-ui/icons'



const Header = (props) => {
  return (
    <Flex bg="#F7F8FC" p={4} color="white" justifyContent="center">
      <div style = {{margin: "10px"}}></div>
        <Text as='b' style={{color:"#000000"}} fontSize="xl">{props.page}</Text>
      <Box flex="1" />
      <IconButton
            icon={<AddIcon w={8} h={8} />}
            colorScheme="green"
        />
        
      <div style={{marginRight:"10px", marginLeft:"10px"}}></div>
      <Box>
        {props.showSidebarButton && (
          <>
          <IconButton
            icon={<HamburgerIcon w={8} h={8} />}
            colorScheme="blackAlpha"
            variant="outline"
            onClick={props.onShowSidebar}
          />
          </>
        )}
      </Box>

    </Flex>
  )
}

export default Header
