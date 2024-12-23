import {
  Button as ChakraButton,
  ButtonProps as ChakraButtonProps,
  Icon,
} from "@chakra-ui/react";
import { forwardRef } from "react";
import { IconType } from "react-icons";

interface ButtonProps extends Omit<ChakraButtonProps, "variant"> {
  variant?: "solid" | "outline";
  icon?: IconType;
  iconPosition?: "left" | "right";
  applyColor?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      applyColor,
      variant = "solid",
      icon,
      iconPosition = "left",
      ...props
    },
    ref
  ) => {
    const baseStyles = {
      display: "flex",
      alignItems: "center",
      gap: "2",
      px: "3",
      py: "2",
      height: "auto",
      fontWeight: "600",
      transition: "all 0.2s",
      borderRadius: "8",
      _hover: {
        transform: "translateY(-1px)",
      },
      _active: {
        transform: "translateY(0)",
      },
    };

    const variantStyles = {
      solid: {
        bg: "#08705C",
        color: "white",
        _hover: {
          ...baseStyles._hover,
          bg: "#065C4B",
        },
      },
      outline: {
        bg: "transparent",
        color: applyColor || "#08705C",
        border: "1px solid",
        borderColor: "#08705C",
        _hover: {
          ...baseStyles._hover,
          bg: "#F0FDF4",
        },
      },
    };

    // const justifyContent = icon ? "flex-start" : "center";
    const justifyContent = "center";

    const IconComponent = icon ? (
      <Icon
        as={icon}
        fontSize="lg"
        ml={iconPosition === "right" ? "2" : "0"}
        mr={iconPosition === "left" ? "2" : "0"}
        color={applyColor}
      />
    ) : null;

    return (
      <ChakraButton
        ref={ref}
        {...baseStyles}
        {...variantStyles[variant]}
        justifyContent={justifyContent}
        {...props}
      >
        {iconPosition === "left" && IconComponent}
        {children}
        {iconPosition === "right" && IconComponent}
      </ChakraButton>
    );
  }
);

Button.displayName = "Button";
