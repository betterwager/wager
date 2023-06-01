import {
  extendTheme,
  defineStyle,
  createMultiStyleConfigHelpers,
} from "@chakra-ui/react";
import { menuAnatomy } from "@chakra-ui/anatomy";
import { whiten } from "@chakra-ui/theme-tools";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(menuAnatomy.keys);

export const allColors = {
  //another color 6E260E
  primaryColor: "#195F50",
  accentColor: "#3E36D9",
  buttonTextColor: "#fff",
  textColor: "#000000",
  hoverColor: "#7DC3B4",
  formLabelColor: "#344054",
  formDescriptionColor: "#475467",
  formTitleColor: "#101828",
  borderLightColor: "#EAECF0",
};

const Button = {
  baseStyle: {},
  sizes: {},
  variants: {
    base: {},
    standard: {
      bg: allColors.primaryColor,
      color: allColors.buttonTextColor,
      _hover: {
        bg: allColors.hoverColor,
      },
    },
    // outline: {
    //     _hover: {
    //         bg: allColors.hoverColor
    //     },
    // }
  },
  defaultProps: {
    variant: "standard",
  },
};

export const standardStyling = extendTheme({
  colors: {
    primaryColor: allColors.primaryColor,
    accentColor: allColors.accentColor,
    buttonTextColor: allColors.buttonTextColor,
    hoverColor: allColors.hoverColor,
    formLabelColor: allColors.formLabelColor,
    formDescriptionColor: allColors.formDescriptionColor,
    formTitleColor: allColors.formTitleColor,
    borderLightColor: allColors.borderLightColor,
  },
  components: {
    Button,
  },
});
