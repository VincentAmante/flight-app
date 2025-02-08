import type { Metadata } from "next";
import "./globals.css";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import '@fontsource-variable/montserrat';
import CustomThemeProvider from "../../components/providers/CustomThemeProvider";
import AppHeader from "../../components/AppHeader";
import '@fontsource-variable/dm-sans';

export const metadata: Metadata = {
  title: "SkyTopper",
  description: "Google Flights Clone",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <CustomThemeProvider>
            <AppHeader />
            {children}
          </CustomThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
