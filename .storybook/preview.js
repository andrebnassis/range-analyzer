import { StyledEngineProvider, ThemeProvider } from "@mui/material/styles";
import { createTheme } from '@mui/material';

const theme = createTheme({
  typography: {
    fontFamily: [
      '"Ubuntu"', 'sans-serif',
  ].join(','),
    fontSize: 16,
  },
  components:{}
});

export const parameters = {
  options: {
    storySort: {
      method: 'numeric',
    },
  },
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

export const decorators = [
  (Story) => (
    <ThemeProvider theme={theme}>
    <StyledEngineProvider injectFirst>
      {Story()}
    </StyledEngineProvider>
    </ThemeProvider>
  ),
];