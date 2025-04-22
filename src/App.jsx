import React from 'react';
import StellarFusion from './components/StellarFusion'
import styled from 'styled-components';

const AppContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f5f5f5;  // Light gray, off-white background
`;

function App() {
  return (
    <AppContainer>
      <StellarFusion />
    </AppContainer>
  );
}

export default App;