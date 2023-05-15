import { extendTheme, defineStyle, createMultiStyleConfigHelpers } from "@chakra-ui/react";
import { menuAnatomy } from '@chakra-ui/anatomy'
import { whiten } from "@chakra-ui/theme-tools";


const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(menuAnatomy.keys)



export const allColors = {
  //another color 6E260E
  primaryColor: "#195F50",
  buttonTextColor: "#fff",
  hoverColor: "#7DC3B4",
}


const Button = {
  baseStyle: {
  },
  sizes: {},
  variants: {
    base: {},
    standard: {
      bg: allColors.primaryColor,
      color: allColors.buttonTextColor,
      _hover: {
        bg: allColors.hoverColor
      },
    },
    // outline: {
    //     _hover: {
    //         bg: allColors.hoverColor
    //     },
    // }
  },
  defaultProps: {
    variant: "standard"
  },
}


export const standardStyling = extendTheme({
  colors: {
    primaryColor: allColors.primaryColor,
    buttonTextColor: allColors.buttonTextColor,
    hoverColor: allColors.hoverColor,
  },
  components: {
    Button,
  }


})
