This is a sample Google Flights clone using [Sky Scrapper API](https://rapidapi.com/apiheya/api/sky-scrapper), [MUI](https://mui.com) and [NextJS](https://nextjs.org)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

### Connecting to the API

Get a key from [here](https://rapidapi.com/apiheya/api/sky-scrapper) and add it to your `.env` file,
see the `.env.example` for an example.

### Testing the API

The server actions to fetch flight data is in `src/app/actions.tsx`.
For users utilising the free plan, you may save up on costs by using the `getFlightsMock` function instead.

### Disclaimers

Given the scope of this app, a full implementation would require more than the current codebase.
The primary purpose is to showcase a responsive frontend application that can successfully connect to an API.