import React from 'react';
import Head from 'next/head';
import LandingPage from './landing';

export default function Home() {
  return (
    <>
      <Head>
        <title>Home Page</title>
      </Head>
      <LandingPage />
    </>
  );
}