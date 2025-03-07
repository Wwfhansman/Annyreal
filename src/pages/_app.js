import React from 'react';
import '../styles/globals.css';
import Footer from '../components/Footer';

function MyApp({ Component, pageProps }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Component {...pageProps} />
      <Footer />
    </div>
  );
}

export default MyApp;
