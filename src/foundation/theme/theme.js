import { createTheme } from '@shopify/restyle';
import { colors } from '../colors/color';
import { textVariants } from '../textVariants/textVariants';

export const theme = createTheme({
  colors: colors,
  textVariants: textVariants,
});
