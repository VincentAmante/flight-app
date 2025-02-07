'use client'

import { Container, Stack, } from '@mui/material'
import SearchForm from '../../components/SearchForm';
import { useEffect, useState } from 'react';
import { getFlights, getFlightsMock } from './api/actions';
import { QuerySchemaType } from '../../utils/airscrapper-schemas';
import FlightsDisplay from '../../components/FlightsDisplay';
import { ItinerariesEntity } from '../../utils/airscrapper-types';

export default function Home() {
  const [search, setSearch] = useState<QuerySchemaType | null>(null);
  const [itineraries, setItineraries] = useState<ItinerariesEntity[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchFlights() {
      if (search){
        setIsLoading(true);
        await getFlightsMock(search).then((res) => {
          console.log(res);

          if (res.flights && res.flights.itineraries)
            setItineraries(res.flights.itineraries)
        }).then(() => setIsLoading(false));
      }
    }

    fetchFlights();
  }, [search])

  return (
    <Container sx={{ py: 2 }}>
      <Stack spacing={2}>
        <SearchForm onSubmit={(data) => setSearch(data)} />
        <FlightsDisplay itineraries={itineraries} isLoading={isLoading} />
      </Stack>
    </Container>
  );
}
