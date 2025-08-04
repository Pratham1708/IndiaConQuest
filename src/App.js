import React, { useState } from 'react';
import ConstitutionArcadeLanding from './components/ConstitutionArcadeLanding';
import GameEngine from './components/GameEngine';

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
      {currentGame ? (
        <GameEngine 
          gameId={currentGame} 
          onBackToHub={handleBackToHub}
        />
      ) : (
        <ConstitutionArcadeLanding onStartGame={handleGameSelect} />
      )}
    </div>
  );
};

export default App;