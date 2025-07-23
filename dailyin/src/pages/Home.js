import React from 'react';
import Header from '../components/Header'; // Adjust path if needed

const Home = () => {
  return (
    <>
      <Header />
      <div style={{ textAlign: 'center', paddingTop: '50px' }}>
        <h1>Welcome to the Daily Inventory Dashboard!</h1>
      </div>
    </>
  );
};

export default Home;
