'use client'

import { AppBar, Typography, Container } from '@mui/material';

function AppHeader() {

    return (
        <AppBar elevation={1} position="static" color='transparent'>
            <Container sx={{ py: 1 }}>
                <Typography
                    variant="h6"
                    noWrap
                >
                    Spotter
                </Typography>
            </Container>
        </AppBar>
    );
}
export default AppHeader;