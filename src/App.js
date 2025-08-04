import React, { useState, Suspense } from 'react';

// Lazy load main components
const ConstitutionArcadeLanding = React.lazy(() => import('./components/ConstitutionArcadeLanding'));
const GameEngine = React.lazy(() => import('./components/GameEngine'));

const App = () => {
  const [currentGame, setCurrentGame] = useState(null);

  const handleGameSelect = (gameId) => {
    setCurrentGame(gameId);
  };

  const handleBackToHub = () => {
    setCurrentGame(null);
  };

  return (
    <div className="app">
      <Suspense fallback={
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          fontSize: '20px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }}>
          Loading Constitution Arcade...
        </div>
      }>
        {currentGame ? (
          <GameEngine 
            gameId={currentGame} 
            onBackToHub={handleBackToHub}
          />
        ) : (
          <ConstitutionArcadeLanding onStartGame={handleGameSelect} />
        )}
      </Suspense>
    </div>
  );
};

export default App;