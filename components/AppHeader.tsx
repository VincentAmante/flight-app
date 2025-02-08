'use client'

import Image from 'next/image';
import {
    AppBar,
    Typography,
    Container, 
    Stack,
} from '@mui/material';

function AppHeader() {

    return (
        <AppBar elevation={1} position="static" color='transparent' sx={{
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            backdropFilter: 'blur(1px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.4)',
        }}>
            <Container sx={{ py: 2 }}>
                <Stack direction='row' spacing={1}>
                    <Image src="/toppers.png" width={36} height={36} alt='Logo' className='select-none' />
                    <Typography
                        variant="h5"
                        noWrap
                        fontFamily='Montserrat Variable'
                        color='white' 
                        className='select-none'
                    >
                        SkyTopper
                    </Typography>
                </Stack>
            </Container>
        </AppBar>
    );
}
export default AppHeader;