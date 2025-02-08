'use client'

import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    TablePagination,
    Typography,
    Paper,
    IconButton,
    Collapse,
    Stack,
    Divider,
    Toolbar,
    Menu,
    MenuItem,
    Popover,
    Box,
    FormGroup,
    FormControlLabel,
    Checkbox,
    Slider,
    Skeleton,
    Avatar,
} from "@mui/material";

import {
    Timeline,
    TimelineItem,
    TimelineSeparator,
    TimelineConnector,
    TimelineDot,
    TimelineContent,
} from "@mui/lab";

import { timelineItemClasses } from '@mui/lab/TimelineItem'

import { useState, useMemo, Fragment, useEffect } from "react";
import { ItinerariesEntity, SegmentsEntity } from "../utils/airscrapper-types";
import {
    FilterList as FilterListIcon,
    KeyboardArrowDown as KeyboardArrowDownIcon,
    KeyboardArrowUp as KeyboardArrowUpIcon,
    SwapVert as SortIcon,
} from "@mui/icons-material";

function descendingComparator<T>(a: T, b: T) {
    if (b < a) {
        return -1;
    }
    if (b > a) {
        return 1;
    }
    return 0;
}

function filterByRange(val: number, maxValue: number, minValue: number = Number.NEGATIVE_INFINITY): boolean {
    return val >= minValue && val <= maxValue;
}

// function filterByArray(val: string, arr: string[], exclude: boolean = false) {
//     return exclude ? !arr.includes(val) : arr.includes(val);
// }

interface FlightFilters {
    priceFilter?: number,
    airlinesFilters?: {
        includes: boolean,
        airlines: string[],
    },
    departureDurationFilter?: number,
    returnDurationFilter?: number,
}
function runFilters(
    flight: ItinerariesEntity,
    filters: FlightFilters
): boolean {
    const { priceFilter, departureDurationFilter, returnDurationFilter } = filters;

    if (priceFilter && !filterByRange(flight.price?.raw || 0, priceFilter)) {
        return false;
    }
    if (departureDurationFilter && flight.legs
        && !filterByRange((flight.legs[0].durationInMinutes / 60), departureDurationFilter)) {
        return false;
    }
    if (returnDurationFilter
        && flight.legs && flight.legs.length > 1
        && !filterByRange((flight.legs[1].durationInMinutes), returnDurationFilter)) {
        return false;
    }

    return true;
}


type Order = 'asc' | 'desc'
type OrderByType = 'duration' | 'price'

function getComparator(
    order: Order,
    orderBy: OrderByType,
): (
    a: ItinerariesEntity,
    b: ItinerariesEntity,
) => number {
    if (orderBy === 'price') {
        if (order === 'desc') {
            return (a, b) => descendingComparator(a.price?.raw, b.price?.raw)
        } else {
            return (a, b) => descendingComparator(b.price?.raw, a.price?.raw)
        }
    } else if (orderBy === 'duration') {
        if (order === 'desc') {
            return (a, b) => descendingComparator((a.legs || [])[0].durationInMinutes, (b.legs || [])[0].durationInMinutes)
        } else {
            return (a, b) => descendingComparator((b.legs || [])[0].durationInMinutes, (a.legs || [])[0].durationInMinutes)
        }
    }

    return () => 0;
}

interface SegmentTimelineProps {
    segment: SegmentsEntity
}

function SegmentTimeline(props: SegmentTimelineProps) {
    const { segment } = props;

    return <Timeline sx={{
        [`& .${timelineItemClasses.root}:before`]: {
            flex: 0,
            padding: 0,
        },
    }}>
        <TimelineItem sx={{
            minHeight: 48
        }}>
            <TimelineSeparator>
                <TimelineDot />
                <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
                <Typography variant="body2">
                    <FormattedTime time={segment.departure} />
                    &nbsp;-&nbsp;
                    {segment.origin.name} ({segment.origin.flightPlaceId})
                </Typography>
                <Typography variant="caption">
                    <FormattedDate date={segment.departure} />
                </Typography>
            </TimelineContent>
        </TimelineItem>
        <TimelineItem sx={{
            minHeight: 48
        }}>
            <TimelineSeparator>
                <TimelineDot />
                <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
                <Typography variant="caption">
                    Travel Time: &nbsp;
                    <MinutesToHoursAndMins minutes={segment.durationInMinutes} />
                </Typography>
            </TimelineContent>
        </TimelineItem>
        <TimelineItem sx={{
            minHeight: 48
        }}>
            <TimelineSeparator>
                <TimelineDot />
            </TimelineSeparator>
            <TimelineContent>
                <Typography variant="body2">
                    <FormattedTime time={segment.arrival} />
                    &nbsp;-&nbsp;
                    {segment.destination.name} ({segment.destination.flightPlaceId})
                </Typography>
                <Typography variant="caption">
                    <FormattedDate date={segment.arrival} />
                </Typography>
            </TimelineContent>
        </TimelineItem>
    </Timeline>
}

interface RowProps {
    itinerary: ItinerariesEntity
}

function FlightRow(props: RowProps) {
    const { itinerary } = props;
    const carriers: {
        name: string,
        logoUrl?: string
    }[] = []

    const [open, setOpen] = useState(false);

    if (!itinerary.legs) return <></>

    const departingFlight = itinerary.legs[0];

    if (departingFlight.carriers.marketing) {
        carriers.push(departingFlight.carriers.marketing[0])
    }

    // // TODO: Change this to 'Operated by'
    // else if (departingFlight.carriers.operating) {
    //     carriers.push(departingFlight.carriers.operating[0])
    // }

    let durationInMinutes = 0
    let lastSegmentArrival = 0
    const layovers: number[] = []

    if (departingFlight.segments)
        for (const segment of departingFlight.segments) {
            if (durationInMinutes > 0) {
                const currentSegmentDeparture = Date.parse(segment.departure)
                const differenceInMilliseconds = currentSegmentDeparture - lastSegmentArrival
                const differenceInMinutes = differenceInMilliseconds / (1000 * 60)
                layovers.push(differenceInMinutes)
            }
            durationInMinutes += segment.durationInMinutes
            lastSegmentArrival = Date.parse(segment.arrival)
        }


    return <>
        <TableRow>
            <TableCell sx={{ px: { xs: 1 } }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} display='flex'>
                    <Avatar variant="rounded" src={carriers[0].logoUrl || ''} sx={{
                        width: {
                            xs: 24,
                            sm: 36,
                        },
                        height: {
                            xs: 24,
                            sm: 36
                        },
                    }} />
                    {itinerary.legs &&
                        <Stack>
                            <Typography sx={{
                                typography: {
                                    xs: 'body2',
                                    md: 'body1'
                                }
                            }}>
                                {new Date(departingFlight.departure).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                &nbsp;—&nbsp;
                                {new Date(departingFlight.arrival).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </Typography>
                            <Typography variant="caption">
                                {carriers.map((carrier) => {
                                    return carrier.name
                                }).join(', ')}
                            </Typography>
                        </Stack>
                    }
                </Stack>
            </TableCell>
            <TableCell sx={{ px: { xs: 1, } }}>
                <Stack spacing={1}>
                    <Stack>
                        <Typography sx={{
                            typography: {
                                xs: 'body2',
                                sm: 'body1'
                            }
                        }}>
                            <MinutesToHoursAndMins minutes={durationInMinutes} />
                        </Typography>
                        <Typography variant="caption">
                            {departingFlight.origin.displayCode}—{departingFlight.destination.displayCode}
                        </Typography>
                    </Stack>

                    {itinerary.price && <Stack sx={{
                        display: {
                            xs: 'flex',
                            sm: 'none'
                        }
                    }}>
                        <Typography variant="body2">
                            {itinerary.price.formatted}
                        </Typography>
                        <Typography variant="caption">
                            {itinerary.legs!.length > 1 ? 'Round Trip' : 'One Way'}
                        </Typography>
                    </Stack>
                    }
                </Stack>
            </TableCell>
            <TableCell sx={{
                display: {
                    xs: 'none',
                    sm: 'table-cell'
                }
            }}>
                {itinerary.price && <Stack>
                    <Typography>
                        {itinerary.price.formatted}
                    </Typography>
                    <Typography variant="caption">
                        {itinerary.legs!.length > 1 ? 'Round Trip' : 'One Way'}
                    </Typography>
                </Stack>
                }
            </TableCell>
            <TableCell align="right" sx={{ p: { xs: 0, sm: 1 } }}>
                <IconButton
                    aria-label="expand row"
                    size="small"
                    onClick={() => setOpen(!open)}
                >
                    {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
            </TableCell>
        </TableRow >
        <TableRow>
            <TableCell sx={{ p: 0 }} colSpan={2}>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <Stack sx={{ py: 1 }}>
                        {departingFlight.segments!.map((segment, index) => (
                            <Fragment key={segment.id}>
                                <SegmentTimeline segment={segment} />
                                {index === departingFlight.segments!.length - 1 ? null
                                    :
                                    <>
                                        <Divider textAlign="left">
                                            <MinutesToHoursAndMins minutes={layovers[index]} />
                                            &nbsp;Layover
                                        </Divider>
                                    </>
                                }
                            </Fragment>
                        ))}
                    </Stack>
                </Collapse>
            </TableCell>
        </TableRow>
    </>
}

function SkeletonRows(props: { rows: number }) {
    const height = 36
    return (
        <>
            {Array.from({ length: props.rows }).map((_, index) => {
                return (
                    <TableRow key={index} sx={{ py: 1 }}>
                        <TableCell colSpan={1}>
                            <Skeleton variant='text' animation='pulse' height={height} />
                        </TableCell>
                        <TableCell colSpan={1}>
                            <Skeleton variant='text' animation='pulse' height={height} />
                        </TableCell>
                        <TableCell colSpan={1} sx={{
                            display: {
                                xs: 'none',
                                sm: 'table-cell'
                            }
                        }}>
                            <Skeleton variant='text' animation='pulse' height={height} />
                        </TableCell>
                    </TableRow>
                );
            })}
        </>
    )
}

function MinutesToHoursAndMins(props: { minutes: number }) {
    const minutes = props.minutes;

    const hours = Math.floor(minutes / 60)
    const minutesLeft = Math.floor(minutes % 60);
    return <>
        {(hours) && <>{hours} hr </>}
        {(minutesLeft >= 0) && <>{minutesLeft} min</>}
    </>;
}

function FormattedTime(props: { time: string }) {
    return <>{new Date(props.time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</>
}

function FormattedDate(props: { date: string }) {
    return <>{new Date(props.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</>
}


interface SortMenuProps {
    setOrder: (order: Order) => void;
    setOrderBy: (orderBy: OrderByType) => void;
    selected: OrderByType;
}

function SortMenu(props: SortMenuProps) {
    const { setOrder, setOrderBy, selected } = props;

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <IconButton id="sort-menu-button" aria-controls={open ? 'sort-menu' : undefined} aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined} onClick={handleClick}>
                <SortIcon />
            </IconButton>

            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem selected={selected === 'price'} onClick={() => { setOrderBy('price'); setOrder('asc'); handleClose() }}>Cheapest</MenuItem>
                <MenuItem selected={selected === 'duration'} onClick={() => { setOrderBy('duration'); setOrder('asc'); handleClose() }}>Fastest</MenuItem>
            </Menu>
        </div>
    );
}

interface FilterMenuProps {
    children?: React.ReactNode;
}

function FilterMenu(props: FilterMenuProps) {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'filter-menu' : undefined;

    return (
        <div>
            <IconButton aria-describedby={id} onClick={handleClick}>
                <FilterListIcon />
            </IconButton>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                {props.children}
            </Popover>
        </div>
    );
}

function TableToolbar(props: { children?: React.ReactNode }) {
    const { children } = props;
    return <Toolbar>
        <Stack direction="row" spacing={2} justifyContent='space-between' sx={{ pt: 1, width: '100%' }}>
            <Typography variant="h5">
                Flights
            </Typography>
            <Stack direction='row' spacing={2}>
                {children}
            </Stack>
        </Stack>
    </Toolbar>
}

interface FlightsDisplayProps {
    itineraries: ItinerariesEntity[]
    isLoading: boolean;
    hasNoFlightsFound: boolean;
}


export default function FlightsDisplay(props: FlightsDisplayProps) {
    const { itineraries, isLoading, hasNoFlightsFound } = props;
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(6);

    // Sort
    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<OrderByType>('price');

    // Filter
    const [maxPrice, setMaxPrice] = useState(5000);
    const [filterByPrice, setFilterByPrice] = useState(true);
    const [maxDepartureDurationHours, setMaxDepartureDurationHours] = useState(52);
    const [filterByDepartureDuration, setFilterByDepartureDuration] = useState(false);

    // Load sort and filter from local storage on mount
    useMemo(() => {
        if (typeof localStorage === 'undefined') return

        if (!localStorage.getItem('sort')) return;
        const sortData = JSON.parse(localStorage.getItem('sort') || '{}');
        setOrder(sortData.order ?? 'asc');
        setOrderBy(sortData.orderBy ?? 'price');

        if (!localStorage.getItem('filters')) return;
        const filtersData = JSON.parse(localStorage.getItem('filters') || '{}');
        setFilterByPrice(filtersData.filterByPrice ?? true);
        setMaxPrice(filtersData.maxPrice ?? 5000);
        setFilterByDepartureDuration(filtersData.filterByDepartureDuration ?? false);
        setMaxDepartureDurationHours(filtersData.maxDepartureDurationHours ?? 52);
    }, []);


    // Save sort and filter to local storage on change
    useEffect(() => {
        localStorage.setItem('sort', JSON.stringify({ order, orderBy }));
        localStorage.setItem('filters', JSON.stringify({
            filterByPrice, filterByDepartureDuration, maxPrice, maxDepartureDurationHours
        }));
    }, [order, orderBy, filterByPrice, filterByDepartureDuration, maxPrice, maxDepartureDurationHours]);

    const handleChangePage = (_e: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const filteredRows = useMemo(() => {
        return [...itineraries].filter(
            itinerary => runFilters(itinerary,
                {
                    priceFilter: (filterByPrice) ? maxPrice : undefined,
                    departureDurationFilter: (filterByDepartureDuration) ? maxDepartureDurationHours : undefined
                }
            ))
    },
        [filterByDepartureDuration, filterByPrice, itineraries, maxDepartureDurationHours, maxPrice]);

    const visibleRows = useMemo(() =>
        [...filteredRows]
            .sort(getComparator(order, orderBy))
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
        [filteredRows, page, rowsPerPage, order, orderBy]
    );

    const emptyRows = useMemo(() =>
        visibleRows.length !== 0 ? rowsPerPage - visibleRows.length : 0,
        [rowsPerPage, visibleRows]
    );


    return (
        <Paper elevation={2} sx={{
            borderRadius: 2
        }}>
            <TableToolbar>
                <SortMenu
                    setOrder={setOrder}
                    setOrderBy={setOrderBy}
                    selected={orderBy}
                />
                <FilterMenu>
                    <Box sx={{ p: 1 }}>
                        <FormGroup>
                            <FormControlLabel label='Max Price' control={
                                <Checkbox value={filterByPrice} checked={filterByPrice} onChange={(e) => setFilterByPrice(e.target.checked)} />
                            }></FormControlLabel>
                            <Collapse in={filterByPrice}>
                                <Box sx={{ px: 1 }}>
                                    <Slider
                                        value={maxPrice}
                                        min={200}
                                        max={3000}
                                        shiftStep={50}
                                        valueLabelDisplay="auto"
                                        onChange={(e, newValue) => {
                                            if (typeof newValue === "number") {
                                                setMaxPrice(newValue);
                                            }
                                        }}
                                    />
                                </Box>
                            </Collapse>
                            <FormControlLabel label='Max Departure Duration Hours' control={
                                <Checkbox checked={filterByDepartureDuration} value={filterByDepartureDuration} onChange={(e) => setFilterByDepartureDuration(e.target.checked)} />
                            }></FormControlLabel>
                            <Collapse in={filterByDepartureDuration}>
                                <Box sx={{ px: 1 }}>
                                    <Slider
                                        value={maxDepartureDurationHours}
                                        min={1}
                                        max={52}
                                        shiftStep={1}
                                        valueLabelDisplay="auto"
                                        onChange={(e, newValue) => {
                                            if (typeof newValue === "number") {
                                                setMaxDepartureDurationHours(newValue);
                                            }
                                        }}
                                    />
                                </Box>
                            </Collapse>
                        </FormGroup>
                    </Box>
                </FilterMenu>

            </TableToolbar>
            <Divider /><Divider />
            <TableContainer sx={{ p: 2, pt: 0 }}>
                <Table size="small">
                    <TableBody>
                        {!isLoading && visibleRows.map((itinerary) => <FlightRow key={itinerary.id}
                            itinerary={itinerary} />)}
                        {emptyRows > 0 && (
                            <TableRow style={{ height: 56 * emptyRows }}>
                                <TableCell colSpan={4} />
                            </TableRow>
                        )}

                        {(isLoading) && <SkeletonRows rows={rowsPerPage} />}

                        {(filteredRows.length === 0) && <TableRow>
                            <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                                <Typography variant='h6' fontWeight='light' color={'text.secondary'}>
                                    {(hasNoFlightsFound || (itineraries.length > 0) ? 'No flights found'
                                        : (!isLoading) ? 'Awaiting your search!' : '')}
                                </Typography>
                            </TableCell>
                        </TableRow>}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[6, 12, 18]}
                component={'div'}
                count={filteredRows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
}