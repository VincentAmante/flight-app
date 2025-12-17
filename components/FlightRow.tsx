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
    Grid,
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


function MinutesToHoursAndMins(props: { minutes: number }) {
    const minutes = props.minutes;

    const hours = Math.floor(minutes / 60)
    const minutesLeft = Math.floor(minutes % 60);
    return <>
        {(hours) && <>{hours} hr </>}
        {(minutesLeft >= 0) && <>{minutesLeft} min</>}
    </>
}

function FormattedTime(props: { time: string }) {
    return <>{new Date(props.time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</>
}

function FormattedDate(props: { date: string }) {
    return <>{new Date(props.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</>
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
    const [showReturnFlight, setShowReturnFlight] = useState(false);

    if (!itinerary.legs) return <></>

    const departingFlight = itinerary.legs[0];

    if (departingFlight.carriers.marketing) {
        carriers.push(departingFlight.carriers.marketing[0])
    }

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
                        <Grid container spacing={2}>
                            <Grid size={6}>
                                <Typography>Departure</Typography>
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
                            </Grid>
                            <Grid size={6}>

                                <Typography>Return</Typography>
                                {itinerary.legs.length > 1 && itinerary.legs[1].segments!.map((segment, index) => (
                                    <Fragment key={segment.id}>
                                        <SegmentTimeline segment={segment} />
                                        {itinerary.legs && index === itinerary.legs[1].segments!.length - 1 ? null
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
                            </Grid>

                        </Grid>
                    </Stack>
                </Collapse>
            </TableCell>
        </TableRow>

    </>
}

export function SkeletonRows(props: { rows: number }) {
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

export default FlightRow;
