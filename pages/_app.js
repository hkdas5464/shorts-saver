// pages/_app.js
import '../styles/globals.css';
import MyNavbar from '../components/MyNavbar';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <MyNavbar />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
