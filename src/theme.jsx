// src/theme.js
import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    brand: {
      50: '#fff8e1',
      100: '#ffecb3',
      200: '#ffe082',
      300: '#ffd54f',
      400: '#ffca28',
      500: '#ffc107',
      600: '#ffb300',
      700: '#ffa000',
      800: '#ff8f00',
      900: '#ff6f00',
    },
  },
  styles: {
    global: {
      'html, body': {
        fontSize: '16px',
        fontFamily: 'Roboto, sans-serif',
        bg: 'brand.50',  // Fundo em um tom claro de laranja
        color: 'brand.900', // Texto em um tom escuro de laranja
        margin: 0,
        padding: 0,
      },
      h1: {
        fontSize: '2rem',
        fontWeight: 'bold',
        marginBottom: '1rem',
        color: 'brand.700', // Cor dos títulos em um tom médio de laranja
      },
      '.form-container': {
        maxWidth: '600px',
        margin: 'auto',
        padding: '2rem',
        backgroundColor: 'white',
        borderRadius: 'md',
        boxShadow: 'md',
        border: '2px solid',
        borderColor: 'brand.200', // Borda em um tom claro de laranja
      },
      '.form-content': {
        marginTop: '1rem',
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'bold',
        borderRadius: 'md',
        textTransform: 'uppercase',
      },
      variants: {
        solid: {
          bg: 'brand.500', // Botão sólido em um tom de laranja forte
          color: 'white',
          _hover: {
            bg: 'brand.600', // Cor do botão sólido quando em hover
          },
        },
        outline: {
          borderColor: 'brand.300', // Borda do botão outline em um tom de laranja claro
          color: 'brand.800', // Texto do botão outline em um tom de laranja escuro
          _hover: {
            borderColor: 'brand.400', // Cor da borda do botão outline quando em hover
            bg: 'brand.100', // Cor de fundo do botão outline quando em hover
          },
        },
      },
    },
    Divider: {
      baseStyle: {
        borderColor: 'brand.300', // Cor da linha divisória em um tom de laranja claro
      },
    },
    Select: {
      baseStyle: {
        borderColor: 'brand.300', // Cor da borda do Select em um tom de laranja claro
      },
    },
  },
});

export default theme;
