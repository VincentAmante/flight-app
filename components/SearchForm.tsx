'use client'

import {
    TextField,
    Button,
    Grid2,
    Paper,
    Container,
    Box
} from '@mui/material'

import { Search as SearchIcon } from '@mui/icons-material'

import {
    SubmitHandler,
    useForm
} from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'

import { QuerySchema, QuerySchemaType } from '../utils/airscrapper-schemas'
import { useState } from 'react'
interface SearchFormProps {
    onSubmit?: (data: QuerySchemaType) => void
}

export default function SearchForm(props: SearchFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<QuerySchemaType>({
        resolver: zodResolver(QuerySchema)
    })

    const onSubmit: SubmitHandler<QuerySchemaType> = (data) => {
        return props.onSubmit && props.onSubmit(data)
    }
    const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0])

    return (
        <Paper elevation={2}>
            <Container sx={{ p: 1 }}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid2 container rowSpacing={2} columnSpacing={1}
                        columns={{
                            xs: 2,
                            md: 4
                        }}
                    >
                        <Grid2 size={1}>
                            <TextField
                                {...register('origin')}
                                label="Origin" variant="outlined"
                                error={!!errors.origin}
                                helperText={errors.origin?.message || ''}
                                fullWidth
                            />
                        </Grid2>
                        <Grid2 size={1}>
                            <TextField
                                {...register('destination')}
                                label="Destination" variant="outlined"
                                error={!!errors.destination}
                                helperText={errors.destination?.message || ''}
                                fullWidth
                            />
                        </Grid2>
                        <Grid2 size={1}>
                            <TextField
                                {...register('dateRange.from')}
                                type="date"
                                label="Departure"
                                slotProps={{
                                    inputLabel: {
                                        shrink: true,
                                    },
                                    htmlInput: {
                                        // Format the date to match the ISO format
                                        min: new Date().toISOString().split('T')[0]
                                    }
                                }}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    setFromDate(e.target.value);
                                }}
                                fullWidth
                                error={!!errors.dateRange?.from}
                                helperText={(errors.dateRange?.from) ? errors.dateRange.from.message : ''}
                            >
                            </TextField>
                        </Grid2>
                        <Grid2 size={1}
                            direction='column'
                        >
                            <TextField
                                {...register('dateRange.to')}
                                type="date"
                                label="Return"
                                slotProps={{
                                    inputLabel: {
                                        shrink: true,
                                    },
                                    htmlInput: {
                                        // Musn't be before the from date
                                        min: fromDate
                                    }
                                }}
                                fullWidth
                                error={!!errors.dateRange?.to}
                                helperText={(errors.dateRange?.to) ? errors.dateRange.to.message : ''}
                            ></TextField>
                        </Grid2>
                    </Grid2>
                    <Grid2 size={4} sx={{ pt: 1 }} display='flex' justifyContent='center'>
                        <Button
                            onClick={handleSubmit(onSubmit)}
                            startIcon={<SearchIcon />} size='large' variant='contained' color='primary'>
                            Search
                        </Button>
                    </Grid2>
                </form>
            </Container>
        </Paper>
    )
}