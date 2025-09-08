// src/theme.js
import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';

const palette = {
  mode: 'dark',
  primary: {
    main: '#0DB37D',
    dark: '#0A8A61',
    light: '#33C598',
    contrastText: '#E6FFF5',
  },
  secondary: {
    main: '#1F7A8C',
    contrastText: '#E6F7FA',
  },
  background: {
    default: '#0B0F10',
    paper: '#111517',
  },
  text: {
    primary: '#E5ECEA',
    secondary: '#A8B3AF',
  },
  success: { main: '#2BB673' },
  warning: { main: '#E0A938' },
  error: { main: '#F16664' },
  info: { main: '#29A3FF' },
};

const typography = {
  fontFamily: `'Inter', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`,
  h1: { fontWeight: 700 },
  h2: { fontWeight: 700 },
  h3: { fontWeight: 700 },
  h4: { fontWeight: 700 },
  h5: { fontWeight: 700 },
  h6: { fontWeight: 700 },
  button: { fontWeight: 700, textTransform: 'none' },
};

const shape = { borderRadius: 10 };

const components = {
  MuiCssBaseline: {
    styleOverrides: (theme) => ({
      'html, body, #root': { height: '100%' },
      body: {
        backgroundColor: palette.background.default,
        color: palette.text.primary,
      },
      '*::-webkit-scrollbar': { width: 10, height: 10 },
      '*::-webkit-scrollbar-track': { backgroundColor: '#0E1213' },
      '*::-webkit-scrollbar-thumb': {
        backgroundColor: alpha('#0DB37D', 0.35),
        borderRadius: 8,
        border: `2px solid ${palette.background.default}`,
      },
    }),
  },
  MuiButton: {
    defaultProps: { size: 'medium', disableElevation: true },
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: 8,
        fontWeight: 700,
      }),
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: { backgroundColor: palette.background.paper, backgroundImage: 'none' },
    },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundColor: alpha('#FFFFFF', 0.02),
        '& fieldset': { borderColor: alpha('#FFFFFF', 0.06) },
        '&.Mui-focused fieldset': {
          borderColor: theme.palette.primary.main,
          boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.12)}`,
        },
      }),
    },
  },
};

let base = createTheme({ palette, typography, shape, components });
const theme = responsiveFontSizes(base, { factor: 2.2 });
export default theme;
