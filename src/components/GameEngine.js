import React, { Suspense } from 'react';
import { GAMES_DATA } from '../data/gamesData';

// Lazy load game components
const ConstitutionalHangman = React.lazy(() => import('./games/ConstitutionalHangman'));
const PreamblePuzzleQuest = React.lazy(() => import('./games/PreamblePuzzleQuest'));
const CivicScorekeeper = React.lazy(() => import('./games/CivicScorekeeper'));
const ElectionTrail = React.lazy(() => import('./games/ElectionTrail'));
const ConstitutionalSnakesLadders = React.lazy(() => import('./games/ConstitutionalSnakesLadders'));
const AshokaVault = React.lazy(() => import('./games/AshokaVault'));

const GameEngine = ({ gameId, onBackToHub }) => {
  const gameData = GAMES_DATA.find(game => game.id === gameId);

  const renderGame = () => {
    switch (gameId) {
      case 'constitutional-hangman':
        return <ConstitutionalHangman onBackToHub={onBackToHub} />;
      case 'preamble-puzzle-quest':
        return <PreamblePuzzleQuest onBackToHub={onBackToHub} />;
      case 'civic-scorekeeper':
        return <CivicScorekeeper onBackToHub={onBackToHub} />;
      case 'election-trail':
        return <ElectionTrail onBackToHub={onBackToHub} />;
      case 'constitutional-snakes-ladders':
        return <ConstitutionalSnakesLadders onBackToHub={onBackToHub} />;
      case 'ashoka-vault-knowledge-unlock':
        return <AshokaVault onBackToHub={onBackToHub} />;
      default:
        return (
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <h2>Game not found</h2>
            <button onClick={onBackToHub}>Back to Hub</button>
          </div>
        );
    }
  };

  return (
    <div className="game-engine">
      <Suspense fallback={
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '50vh',
          fontSize: '18px'
        }}>
          Loading game...
        </div>
      }>
        {renderGame()}
      </Suspense>
    </div>
  );
};

export default GameEngine;