// Custom typography system for BioSignal Monitor
export const Typography = {
  // Font families
  fontFamily: {
    primary: 'System', // Will use system font
    secondary: 'System',
    monospace: 'monospace',
  },
  
  // Font sizes
  fontSize: {
    micro: 10,
    tiny: 12,
    small: 14,
    medium: 16,
    large: 18,
    xl: 22,
    xxl: 26,
    xxxl: 32,
    display: 42,
  },
  
  // Font weights
  fontWeight: {
    thin: '200',
    light: '300',
    regular: '400',
    medium: '500',
    semiBold: '600',
    bold: '700',
    heavy: '800',
  },
  
  // Line heights (multiplier of font size)
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
    loose: 1.8,
  },
  
  // Letter spacing
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
    extraWide: 1,
  },
  
  // Text variants
  variant: {
    h1: {
      fontSize: 32,
      fontWeight: '700',
      lineHeight: 1.2,
      letterSpacing: -0.5,
    },
    h2: {
      fontSize: 26,
      fontWeight: '700',
      lineHeight: 1.2,
      letterSpacing: -0.5,
    },
    h3: {
      fontSize: 22,
      fontWeight: '600',
      lineHeight: 1.3,
      letterSpacing: -0.3,
    },
    h4: {
      fontSize: 18,
      fontWeight: '600',
      lineHeight: 1.3,
      letterSpacing: -0.2,
    },
    h5: {
      fontSize: 16,
      fontWeight: '600',
      lineHeight: 1.4,
      letterSpacing: 0,
    },
    body1: {
      fontSize: 16,
      fontWeight: '400',
      lineHeight: 1.5,
      letterSpacing: 0,
    },
    body2: {
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 1.5,
      letterSpacing: 0,
    },
    caption: {
      fontSize: 12,
      fontWeight: '400',
      lineHeight: 1.4,
      letterSpacing: 0.2,
    },
    button: {
      fontSize: 14,
      fontWeight: '600',
      lineHeight: 1.4,
      letterSpacing: 0.5,
      textTransform: 'uppercase',
    },
    overline: {
      fontSize: 10,
      fontWeight: '500',
      lineHeight: 1.4,
      letterSpacing: 1,
      textTransform: 'uppercase',
    },
    dataValue: {
      fontSize: 42,
      fontWeight: '700',
      lineHeight: 1.1,
      letterSpacing: -0.5,
    },
    dataUnit: {
      fontSize: 16,
      fontWeight: '500',
      lineHeight: 1.3,
      letterSpacing: 0,
    },
    metric: {
      fontSize: 32,
      fontWeight: '600',
      lineHeight: 1.2,
      letterSpacing: -0.3,
      fontFamily: 'monospace',
    },
  }
}; 