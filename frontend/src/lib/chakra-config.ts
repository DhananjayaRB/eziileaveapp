import { extendTheme } from "@chakra-ui/react";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";

export const chakraTheme = extendTheme({
  colors: {
    brand: {
      "header-gray": "#0F1216",
      green: "#08705C",
      "light-gray": "#F2F3F3",
      "light-green": "#08705C1F",
    },
  },
  fonts: {
    body: "Poppins, system-ui, sans-serif",
  },
  //   components: {
  //     Button,
  //     Text,
  //     Heading,
  //   },
});

/**
 * import type { ComponentStyleConfig } from "@chakra-ui/react";

export const Button: ComponentStyleConfig = {
  baseStyle: {
    borderRadius: "999",
    textTransform: "uppercase",
    transition: "0.3s",
    _focus: {
      boxShadow: "none",
    },
    _disabled: {
      bg: "brand.blue",
      shadow: "0px 10px 5px #00A0FA4A",
    },
  },
  variants: {
    solid: {
      padding: "5",
      color: "white",
      fontSize: "13px",
      bg: "brand.blue",
      _hover: {
        bg: "brand.blue",
        shadow: "0px 10px 5px #00A0FA4A",
      },
      _active: {
        bg: "brand.blue",
        opacity: 0.8,
        shadow: "0px 10px 5px #00A0FA4A",
      },
    },
    inactive: {
      padding: "5",
      color: "white",
      fontSize: "14px",
      bg: "brand.lightBrown",
      textTransform: "normal",
      _hover: {
        bg: "brand.lightBrown",
        shadow: "0px 10px 5px #00A0FA4A",
      },
      _active: {
        bg: "brand.lightBrown",
        opacity: 0.8,
        shadow: "0px 10px 5px #00A0FA4A",
      },
    },
    unemployed: {
      padding: "5",
      color: "white",
      fontSize: "14px",
      bg: "brand.pink",
      textTransform: "normal",
      _hover: {
        bg: "brand.pink",
        shadow: "0px 10px 5px #00A0FA4A",
      },
      _active: {
        bg: "brand.pink",
        opacity: 0.8,
        shadow: "0px 10px 5px #00A0FA4A",
      },
    },
    outline: {
      padding: "5",
      color: "black",
      fontSize: "13px",
      bg: "transparent",
      border: "1px solid",
      borderColor: "brand.blue",
      _hover: {
        bg: "brand.blue",
        color: "white",
        shadow: "0px 10px 5px #00A0FA4A",
      },
      _active: {
        bg: "brand.blue",
        color: "white",
        opacity: 0.8,
        shadow: "0px 10px 5px #00A0FA4A",
      },
    },
  },
};

 */
