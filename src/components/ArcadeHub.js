import React from 'react';
import { GAMES_DATA } from '../data/gamesData';

const ArcadeHub = ({ onGameSelect }) => {
  const preambleText = `WE, THE PEOPLE OF INDIA, having solemnly resolved to constitute India into a SOVEREIGN SOCIALIST SECULAR DEMOCRATIC REPUBLIC and to secure to all its citizens: JUSTICE, social, economic and political; LIBERTY of thought, expression, belief, faith and worship; EQUALITY of status and of opportunity; and to promote among them all FRATERNITY assuring the dignity of the individual and the unity and integrity of the Nation; IN OUR CONSTITUENT ASSEMBLY this twenty-sixth day of November, 1949, do HEREBY ADOPT, ENACT AND GIVE TO OURSELVES THIS CONSTITUTION.`;

  return (
    <div>
      {/* Header */}
      <header className="constitution-header">
        <div className="ashoka-chakra"></div>
        <h1 className="main-title">IndiaCon Quest</h1>
        <p className="subtitle">6 Legal-Themed Mini Games • Learn Democracy Through Play</p>
      </header>

      {/* Main Hub */}
      <div className="arcade-hub">
        {/* Preamble Sidebar */}
        <aside className="preamble-sidebar">
          <h2 className="preamble-title">The Preamble</h2>
          <p className="preamble-text">{preambleText}</p>
        </aside>

        {/* Games Grid */}
        <main className="games-grid">
          {GAMES_DATA.map((game, index) => (
            <div key={game.id} className="game-card" onClick={() => onGameSelect(game.id)}>
              <div className="game-number">{index + 1}</div>
              <h3 className="game-title">{game.title}</h3>
              <p className="game-inspiration">Inspired by: {game.inspiration}</p>
              <p className="game-description">{game.description}</p>
              <button className="play-button">Play Now</button>
            </div>
          ))}
        </main>
      </div>
    </div>
  );
};

export default ArcadeHub;