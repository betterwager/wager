import { extendTheme, defineStyle, createMultiStyleConfigHelpers } from "@chakra-ui/react";
import { menuAnatomy } from '@chakra-ui/anatomy'
import { whiten } from "@chakra-ui/theme-tools";


const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(menuAnatomy.keys)



export const allColors = {
    primaryColor: "#195F50",
    buttonTextColor: "#fff",
    hoverColor: "#7DC3B4",
}

const baseStyle = definePartsStyle({
    style: {
        background: allColors.primaryColor
    },
    // list: {
    //     // this will style the MenuList component
    //     bg: "#195F50",
    //   },
})

const MenuTheme = defineMultiStyleConfig({ baseStyle })

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
        //another color 6E260E
        buttonTextColor: allColors.buttonTextColor,
        hoverColor: allColors.hoverColor,
    },
    components: {
        Button,
        Menu: MenuTheme,
    }


})
