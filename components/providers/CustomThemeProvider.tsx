'use client'

import { createTheme, ThemeProvider } from '@mui/material/styles';
import React from 'react';

const theme = createTheme({
    palette: {
        primary: {
            light: '#339999',
            main: '#008080',
            dark: '#005959',
            contrastText: '#fff',
        },
        secondary: {
            light: '#f96d7f',
            main: '#F84960',
            dark: '#ad3343',
            contrastText: '#000',
        },
    },
});

export default function CustomThemeProvider({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ThemeProvider theme={theme}>
            {children}
        </ThemeProvider>
    );
}