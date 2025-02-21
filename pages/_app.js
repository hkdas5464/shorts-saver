// pages/_app.js
import '../styles/globals.css';
import MyNavbar from '../components/MyNavbar';

// pages/_app.js
// import {HeroUIProvider} from "@heroui/react";
// import {ThemeProvider as NextThemesProvider} from "next-themes";

// function MyApp({ Component, pageProps }) {
//   return (
//     <HeroUIProvider>
//       <MyNavbar />
//       <main className="light text-foreground bg-background">

//       <NextThemesProvider attribute="class" defaultTheme="dark">

//         <Component {...pageProps} />
//       </NextThemesProvider>
//       </main>
//     </HeroUIProvider>
//   )
// }

// export default MyApp;

// pages/_app.js
import { HeroUIProvider } from '@heroui/react';
import { ThemeProvider } from 'next-themes';

function MyApp({ Component, pageProps }) {
  return (
    <HeroUIProvider>
      <MyNavbar/>
      <ThemeProvider attribute="class" defaultTheme="dark">
        <Component {...pageProps} />
      </ThemeProvider>
    </HeroUIProvider>
  );
}

export default MyApp;
