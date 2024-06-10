import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0d47a1',
    },
    secondary: {
      main: '#ffeb3b',
    },
    background: {
      default: '#f5f5f5',
    },
    text: {
      primary: '#212121',
      secondary: '#ffffff',
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputLabel-root': {
            color: 'rgba(0, 0, 0, 0.54)', // Колір підказки
          },
          '& .MuiInputBase-input': {
            color: '#212121', // Основний колір тексту
          },
        },
      },
    },
  },
});

export default theme;
