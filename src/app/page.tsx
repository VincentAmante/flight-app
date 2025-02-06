'use client'

import { Container, } from '@mui/material'
import SearchForm from '../../components/SearchForm';
import { useEffect, useState } from 'react';
import { getFlights } from './api/actions';
import { QuerySchemaType } from '../../utils/airscrapper-schemas';

export default function Home() {
  const [search, setSearch] = useState<QuerySchemaType | null>(null);

  useEffect(() => {
    async function fetchFlights() {
      if (search)
        await getFlights(search).then((res) => {
          console.log(res);
        })
    }

    fetchFlights();
  }, [search])

  return (
    <Container>
      <SearchForm onSubmit={(data) => setSearch(data)} />
    </Container>
  );
}
