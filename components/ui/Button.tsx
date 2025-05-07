import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps
} from 'react-native';
import { Colors } from '../../constants/Colors';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  isLoading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  disabled = false,
  style,
  textStyle,
  ...rest
}: ButtonProps) => {
  const getButtonStyle = () => {
    let buttonStyle: ViewStyle = { ...styles.button };
    
    // Variant styles
    switch (variant) {
      case 'primary':
        buttonStyle = { ...buttonStyle, ...styles.primary };
        break;
      case 'secondary':
        buttonStyle = { ...buttonStyle, ...styles.secondary };
        break;
      case 'outline':
        buttonStyle = { ...buttonStyle, ...styles.outline };
        break;
      case 'text':
        buttonStyle = { ...buttonStyle, ...styles.text };
        break;
    }
    
    // Size styles
    switch (size) {
      case 'small':
        buttonStyle = { ...buttonStyle, ...styles.small };
        break;
      case 'medium':
        buttonStyle = { ...buttonStyle, ...styles.medium };
        break;
      case 'large':
        buttonStyle = { ...buttonStyle, ...styles.large };
        break;
    }
    
    // Disabled style
    if (disabled || isLoading) {
      buttonStyle = { ...buttonStyle, ...styles.disabled };
    }
    
    return buttonStyle;
  };
  
  const getTextStyle = () => {
    let textStyleFinal: TextStyle = { ...styles.buttonText };
    
    // Variant text styles
    switch (variant) {
      case 'primary':
        textStyleFinal = { ...textStyleFinal, ...styles.primaryText };
        break;
      case 'secondary':
        textStyleFinal = { ...textStyleFinal, ...styles.secondaryText };
        break;
      case 'outline':
        textStyleFinal = { ...textStyleFinal, ...styles.outlineText };
        break;
      case 'text':
        textStyleFinal = { ...textStyleFinal, ...styles.textOnlyText };
        break;
    }
    
    // Size text styles
    switch (size) {
      case 'small':
        textStyleFinal = { ...textStyleFinal, ...styles.smallText };
        break;
      case 'medium':
        textStyleFinal = { ...textStyleFinal, ...styles.mediumText };
        break;
      case 'large':
        textStyleFinal = { ...textStyleFinal, ...styles.largeText };
        break;
    }
    
    // Disabled text style
    if (disabled || isLoading) {
      textStyleFinal = { ...textStyleFinal, ...styles.disabledText };
    }
    
    return textStyleFinal;
  };
  
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || isLoading}
      style={[getButtonStyle(), style]}
      activeOpacity={0.8}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'primary' ? Colors.neutral.white : Colors.primary.main} 
        />
      ) : (
        <Text style={[getTextStyle(), textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  
  // Variant styles
  primary: {
    backgroundColor: Colors.primary.main,
  },
  secondary: {
    backgroundColor: Colors.accent.coral,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.primary.main,
  },
  text: {
    backgroundColor: 'transparent',
  },
  
  // Size styles
  small: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  medium: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  large: {
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  
  // Text styles
  buttonText: {
    fontWeight: '600',
    textAlign: 'center',
  },
  primaryText: {
    color: Colors.neutral.white,
  },
  secondaryText: {
    color: Colors.neutral.white,
  },
  outlineText: {
    color: Colors.primary.main,
  },
  textOnlyText: {
    color: Colors.primary.main,
  },
  
  // Text size styles
  smallText: {
    fontSize: 12,
  },
  mediumText: {
    fontSize: 14,
  },
  largeText: {
    fontSize: 16,
  },
  
  // Disabled styles
  disabled: {
    opacity: 0.6,
  },
  disabledText: {
    opacity: 0.8,
  },
});

export default Button; 