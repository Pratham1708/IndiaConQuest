import React from 'react';
import { GAMES_DATA } from '../data/gamesData';

// Import game components
import ConstitutionalHangman from './games/ConstitutionalHangman';
import PreamblePuzzleQuest from './games/PreamblePuzzleQuest';
import CivicScorekeeper from './games/CivicScorekeeper';
import ElectionTrail from './games/ElectionTrail';
import ConstitutionalSnakesLadders from './games/ConstitutionalSnakesLadders';
import AshokaVault from './games/AshokaVault';

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
      {renderGame()}
    </div>
  );
};

export default GameEngine;