import React from 'react';
import { ThemeProvider } from 'styled-components';
import { dark_theme_config, light_theme_config } from './theme-config';

const Theme = ({ children, is_dark }) => (
    <ThemeProvider theme={is_dark ? dark_theme_config : light_theme_config}>{children}</ThemeProvider>
);

export default Theme;
