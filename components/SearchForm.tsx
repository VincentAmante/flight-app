'use client'

import {
    TextField,
    Button,
    Grid2,
    Paper,
    Container,
    Autocomplete,
    MenuItem,
    Stack
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

interface SearchFormProps {
    onSubmit?: (data: QuerySchemaType) => void;
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
        console.log('Form submitted:', data);

        props.onSubmit?.(data);
    };

    return (
        <Paper elevation={2} sx={{ borderRadius: 2, padding: 2 }}>
            <Container sx={{ py: 2 }}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Stack>
                        <Grid2 size={2} sx={{ padding: 1 }}>
                            <Grid2 container rowSpacing={2} columnSpacing={1} columns={{ xs: 2, md: 4 }}>
                                <Grid2 size={1}>
                                    <AutocompleteField
                                        label="Origin"
                                        name="origin"
                                        register={register}
                                        errors={errors}
                                        options={locationOptions}
                                        required
                                    />
                                </Grid2>
                                <Grid2 size={1}>
                                    <AutocompleteField
                                        label="Destination"
                                        name="destination"
                                        register={register}
                                        errors={errors}
                                        options={locationOptions}
                                        required
                                    />
                                </Grid2>
                                <Grid2 size={1}>
                                    <DateField
                                        label="Departure"
                                        name="dateRange.from"
                                        register={register}
                                        errors={errors}
                                        minDate={new Date().toISOString().split('T')[0]}
                                        required
                                    />
                                </Grid2>
                                <Grid2 size={1}>
                                    <DateField
                                        label="Return"
                                        name="dateRange.to"
                                        register={register}
                                        errors={errors}
                                        minDate={new Date().toISOString().split('T')[0]}
                                        required
                                    />
                                </Grid2>
                            </Grid2>
                        </Grid2>
                        {/* <Grid2 size={4} sx={{ pt: 1 }} display='flex' justifyContent='center'>
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
                        </Grid2> */}
                        <Grid2 size={2} sx={{ padding: 1 }}>
                            <Grid2 container rowSpacing={2} columnSpacing={1} columns={{ xs: 8, md: 8 }}>
                                <Grid2 size={1}>
                                    <TextField
                                        label="Cabin Class"
                                        select
                                        defaultValue="economy"
                                        {...register("cabinClass")}
                                        error={!!errors.cabinClass}
                                        helperText={errors.cabinClass?.message || ''}
                                        slotProps={{
                                            inputLabel: {
                                                shrink: true,
                                            },
                                        }}
                                        size="small"
                                    >
                                        <MenuItem value="economy">Economy</MenuItem>
                                        <MenuItem value="premium_economy">Premium Economy</MenuItem>
                                        <MenuItem value="business">Business</MenuItem>
                                        <MenuItem value="first">First</MenuItem>
                                    </TextField>
                                </Grid2>
                                <Grid2 size={1}>
                                    <TextField
                                        label="Adults"
                                        type="number"
                                        {...register("adults")}
                                        error={!!errors.adults}
                                        helperText={errors.adults?.message || ''}
                                        slotProps={{
                                            inputLabel: {
                                                shrink: true,
                                            },
                                        }}
                                        size="small"
                                    />
                                </Grid2>
                                <Grid2 size={1}>
                                    <TextField
                                        label="Children"
                                        type="number"
                                        {...register("childrens")}
                                        error={!!errors.childrens}
                                        helperText={errors.childrens?.message || ''}
                                        slotProps={{
                                            inputLabel: {
                                                shrink: true,
                                            },
                                        }}
                                        size="small"
                                    />
                                </Grid2>
                                <Grid2 size={1}>
                                    <TextField
                                        label="Infants"
                                        type="number"
                                        {...register("infants")}
                                        error={!!errors.infants}
                                        helperText={errors.infants?.message || ''}
                                        slotProps={{
                                            inputLabel: {
                                                shrink: true,
                                            },
                                        }}
                                        size="small"
                                    />
                                </Grid2>
                                {/* <Grid2 size={1}>
                                    <TextField
                                        label="Sort By"
                                        select
                                        defaultValue="best"
                                        {...register("sortBy")}
                                        error={!!errors.sortBy}
                                        helperText={errors.sortBy?.message || ''}
                                        slotProps={{
                                            inputLabel: {
                                                shrink: true,
                                            },
                                        }}
                                        size="small"
                                    >
                                        <MenuItem value="best">Best</MenuItem>
                                        <MenuItem value="price_high">Price High</MenuItem>
                                        <MenuItem value="cheapest">Cheapest</MenuItem>
                                        <MenuItem value="fastest">Fastest</MenuItem>
                                        <MenuItem value="outbound_take_off_time">Outbound Take Off Time</MenuItem>
                                        <MenuItem value="outbound_landing_time">Outbound Landing Time</MenuItem>
                                        <MenuItem value="return_take_off_time">Return Take Off Time</MenuItem>
                                        <MenuItem value="return_landing_time">Return Landing Time</MenuItem>
                                    </TextField>
                                </Grid2> */}
                                {/* <Grid2 size={1}>
                                    <TextField
                                        label="Limit"
                                        type="number"
                                        defaultValue="0"
                                        {...register("limit")}
                                        error={!!errors.limit}
                                        helperText={errors.limit?.message || ''}
                                        slotProps={{
                                            inputLabel: {
                                                shrink: true,
                                            },
                                        }}
                                        size="small"
                                    />
                                </Grid2> */}
                                {/* <Grid2 size={1}>
                                    <TextField
                                        label="Carriers IDs"
                                        {...register("carriersIds")}
                                        error={!!errors.carriersIds}
                                        helperText={errors.carriersIds?.message || ''}
                                        slotProps={{
                                            inputLabel: {
                                                shrink: true,
                                            },
                                        }}
                                        size="small"
                                    />
                                </Grid2> */}
                                {/* <Grid2 size={1}>
                                    <TextField
                                        label="Currency"
                                        defaultValue="USD"
                                        {...register("currency")}
                                        error={!!errors.currency}
                                        helperText={errors.currency?.message || ''}
                                        slotProps={{
                                            inputLabel: {
                                                shrink: true,
                                            },
                                        }}
                                        size="small"
                                    />
                                </Grid2> */}
                            </Grid2>
                        </Grid2>
                    </Stack>
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
    required?: boolean;
}

const AutocompleteField = ({ label, name, register, errors, options, required }: AutocompleteFieldProps) => (
    <Autocomplete
        freeSolo
        disableClearable
        options={options}
        renderInput={(params) => (
            <TextField
                {...params}
                {...register(name, { required })}
                label={label}
                variant="outlined"
                error={!!errors[name]}
                helperText={errors[name]?.message || ''}
                slotProps={{
                    inputLabel: {
                        shrink: true,
                    },
                }}
                required={required}
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
    required?: boolean;
}

const DateField = ({ label, name, register, errors, minDate, required }: DateFieldProps) => (
    <TextField
        {...register(name, { required })}
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
        required={required}
    />
);
