// app/theme/colors.ts

export const Colors = {
  // Primary Colors (WhatsApp-inspired)
  primary: {
    green: '#25D366',        // WhatsApp green
    darkGreen: '#128C7E',   // WhatsApp dark green
    teal: '#075E54',        // WhatsApp teal
    lightGreen: '#DCF8C6',  // Message bubble green
    blue: '#34B7F1',        // Info/link blue
  },
  
  // Background Colors
  background: {
    primary: '#FFFFFF',      // Main background
    secondary: '#F0F0F0',    // Chat background
    chat: '#ECE5DD',        // WhatsApp chat background
    inputBar: '#F0F0F0',     // Input areas
    card: '#FFFFFF',         // Card backgrounds
  },
  
  // Text Colors
  text: {
    primary: '#000000',      // Primary text
    secondary: '#667781',    // Secondary text (gray)
    tertiary: '#8696A0',     // Tertiary text (lighter gray)
    white: '#FFFFFF',        // White text
    link: '#34B7F1',         // Links
    success: '#25D366',      // Success messages
    error: '#E53935',        // Error messages
    warning: '#FFA726',      // Warning messages
  },
  
  // UI Elements
  ui: {
    border: '#E4E4E4',       // Border color
    divider: '#EDEDED',      // Divider lines
    shadow: '#000000',       // Shadow color
    overlay: 'rgba(0, 0, 0, 0.5)',
    statusBar: '#075E54',    // Status bar color
    headerBg: '#075E54',     // Header background
    tabBar: '#FFFFFF',       // Tab bar background
    ripple: 'rgba(0, 0, 0, 0.1)', // Touch feedback
    backgroundSelected: '#ECE5DD', // Selected item background
  },

  // Button Colors
  buttons: {
    primary: '#25D366',      // Primary button
    primaryDark: '#128C7E',  // Primary button pressed
    secondary: '#FFFFFF',    // Secondary button
    danger: '#E53935',       // Danger/delete button
    disabled: '#B0BEC5',     // Disabled button
  },

  // Status Colors
  status: {
    online: '#25D366',       // Online indicator
    offline: '#8696A0',      // Offline indicator
    typing: '#25D366',       // Typing indicator
    seen: '#4FC3F7',         // Message seen (blue ticks)
    delivered: '#8696A0',    // Message delivered (gray ticks)
    sent: '#8696A0',         // Message sent (single tick)
  },

  // Gradients (subtle, professional)
  gradients: {
    main: ['#FFFFFF', '#F5F5F5'],  // Subtle gradient
    header: ['#075E54', '#128C7E'], // Header gradient
    button: ['#25D366', '#128C7E'], // Button gradient
    card: ['#FFFFFF', '#FAFAFA'],   // Card gradient
  },
} as const;