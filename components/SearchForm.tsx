'use client'

import {
    TextField,
    Button,
    Grid2,
    Paper,
    Container,
    Autocomplete,
} from '@mui/material';

import { Search as SearchIcon } from '@mui/icons-material';

import {
    FieldError,
    FieldErrors,
    SubmitHandler,
    useForm
} from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { QuerySchema, QuerySchemaType } from '../utils/airscrapper-schemas';
import { useState } from 'react';

interface SearchFormProps {
    onSubmit?: (data: QuerySchemaType) => void
}

const locationOptions = ['Dubai', 'Manila', 'London', 'New York', 'Tokyo'];

export default function SearchForm(props: SearchFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<QuerySchemaType>({
        resolver: zodResolver(QuerySchema)
    });

    const onSubmit: SubmitHandler<QuerySchemaType> = (data) => {
        return props.onSubmit && props.onSubmit(data);
    };
    const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0]);

    return (
        <Paper elevation={2} sx={{
            borderRadius: 2,
            padding: 2
        }}>
            <Container sx={{ py: 2 }}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid2 container rowSpacing={2} columnSpacing={1}
                        columns={{
                            xs: 2,
                            md: 4
                        }}
                    >
                        <Grid2 size={1}>
                            <AutocompleteField
                                label="Origin"
                                name="origin"
                                register={register}
                                errors={errors}
                                options={locationOptions}
                            />
                        </Grid2>
                        <Grid2 size={1}>
                            <AutocompleteField
                                label="Destination"
                                name="destination"
                                register={register}
                                errors={errors}
                                options={locationOptions}
                            />
                        </Grid2>
                        <Grid2 size={1}>
                            <DateField
                                label="Departure"
                                name="dateRange.from"
                                register={register}
                                errors={errors}
                                minDate={new Date().toISOString().split('T')[0]}
                            />
                        </Grid2>
                        <Grid2 size={1}>
                            <DateField
                                label="Return"
                                name="dateRange.to"
                                register={register}
                                errors={errors}
                                minDate={fromDate}
                            />
                        </Grid2>
                    </Grid2>
                    <Grid2 size={4} sx={{ pt: 1 }} display='flex' justifyContent='center'>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            startIcon={<SearchIcon />}
                            sx={{
                                borderRadius: 12,
                                fontWeight: 'light',
                                paddingY: 1.5,
                                paddingX: 3
                            }}
                        >
                            Search
                        </Button>
                    </Grid2>
                </form>
            </Container>
        </Paper>
    );
}

interface AutocompleteFieldProps {
    label: string;
    name: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    register: any;
    errors: FieldErrors;
    options: string[];
}

const AutocompleteField = ({ label, name, register, errors, options }: AutocompleteFieldProps) => (
    <Autocomplete
        freeSolo
        disableClearable
        options={options}
        renderInput={(params) => (
            <TextField
                {...params}
                {...register(name)}
                label={label} variant="outlined"
                error={!!errors[name]}
                helperText={errors[name]?.message || ''}
            />
        )}
    />
);

interface DateFieldProps {
    label: string;
    name: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    register: any;
    errors: FieldErrors;
    minDate?: string;
}

const DateField = ({ label, name, register, errors, minDate }: DateFieldProps) => (
    <TextField
        {...register(name)}
        type="date"
        label={label}
        slotProps={{
            inputLabel: {
                shrink: true,
            },
            htmlInput: {
                min: minDate || new Date().toISOString().split('T')[0]
            }
        }}
        fullWidth
        error={!!errors[name]}
        helperText={(errors[name]) ? errors[name].message : ''}
    />
);