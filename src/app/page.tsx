'use client'

import { Container, Stack, } from '@mui/material'
import SearchForm from '../../components/SearchForm';
import { useEffect, useState } from 'react';
import { getFlights, getFlightsMock } from './api/actions';
import { QuerySchemaType } from '../../utils/airscrapper-schemas';
import FlightsDisplay from '../../components/FlightsDisplay';
import { ItinerariesEntity } from '../../utils/airscrapper-types';
import Image from 'next/image';

export default function Home() {
  const [search, setSearch] = useState<QuerySchemaType | null>(null);
  const [error, setError] = useState('')
  const [itineraries, setItineraries] = useState<ItinerariesEntity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasNoFlightsFound, setNoFlightsFound] = useState(false);


  useEffect(() => {
    // src/app/page.tsx
    async function fetchFlights() {
      if (search) {
        setIsLoading(true);
        try {
          const res = await getFlights(search);
          if (res.flights && res.flights.itineraries) {
            setItineraries(res.flights.itineraries);
            if (res.flights.itineraries.length === 0) {
              setNoFlightsFound(true);
            } else {
              setNoFlightsFound(false);
            }
          }
        } catch (error) {
          console.error('Error fetching flights:', error);
          setError('Failed to fetch flights. Please try again later.');
        } finally {
          setIsLoading(false);
        }
      }
    }

    fetchFlights()
  }, [search])

  return (
    <Container sx={{
      py: 2, px: {
        xs: 1,
        md: 4,
      }
    }}>
      <Image src='/splash.png' width={1720} height={800} alt="AirScrapper" className='hidden lg:block absolute top-0 left-0 w-full -z-10 select-none' />
      <Image src='/splash-tablet.png' width={750} height={1334} alt="AirScrapper" className='hidden sm:block lg:hidden absolute top-0 left-0 w-full -z-10 select-none' />
      <Image src='/splash-mobile.png' width={750} height={1334} alt="AirScrapper" className='block sm:hidden absolute top-0 left-0 w-full -z-10 select-none' />
      <Stack spacing={2}>
        <SearchForm onSubmit={(data) => setSearch(data)} />
        <FlightsDisplay itineraries={itineraries} isLoading={isLoading} hasNoFlightsFound={hasNoFlightsFound} />
      </Stack>
    </Container>
  );
}
