import React from 'react';

const SimpleGame = ({ onBackToHub, gameTitle, gameDescription }) => {
  return (
    <div style={{
      padding: '20px',
      maxWidth: '1200px',
      margin: '0 auto',
      minHeight: '100vh',
      background: 'var(--parchment)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        paddingBottom: '20px',
        borderBottom: '3px solid var(--gold)'
      }}>
        <button 
          onClick={onBackToHub}
          style={{
            background: 'var(--navy-blue)',
            color: 'var(--white)',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '25px',
            fontFamily: 'Cinzel, serif',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          ← Back to Hub
        </button>
        <h2 style={{
          fontSize: '2.5rem',
          color: 'var(--navy-blue)',
          margin: '0',
          textAlign: 'center'
        }}>
          {gameTitle}
        </h2>
        <div></div>
      </div>

      <div style={{
        background: 'var(--white)',
        border: '3px solid var(--gold)',
        borderRadius: '20px',
        padding: '40px',
        marginBottom: '30px',
        minHeight: '400px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center'
      }}>
        <h3 style={{
          fontSize: '2rem',
          color: 'var(--navy-blue)',
          marginBottom: '20px'
        }}>
          🎮 {gameTitle}
        </h3>
        
        <p style={{
          fontSize: '1.2rem',
          color: 'var(--dark-brown)',
          marginBottom: '30px',
          lineHeight: '1.6',
          maxWidth: '600px'
        }}>
          {gameDescription}
        </p>

        <div style={{
          background: 'var(--parchment)',
          border: '2px solid var(--gold)',
          borderRadius: '15px',
          padding: '30px',
          marginBottom: '30px'
        }}>
          <h4 style={{ color: 'var(--navy-blue)', marginBottom: '15px' }}>
            🏛️ Constitutional Learning Experience
          </h4>
          <p style={{ color: 'var(--dark-brown)', lineHeight: '1.6' }}>
            This game teaches important concepts from the Indian Constitution through interactive gameplay. 
            Each game is designed to make learning about democracy, rights, and civic duties engaging and memorable.
          </p>
        </div>

        <button 
          onClick={() => alert('Game functionality coming soon! This is a demo version.')}
          style={{
            background: 'linear-gradient(135deg, var(--saffron), var(--gold))',
            color: 'var(--white)',
            border: 'none',
            padding: '20px 40px',
            borderRadius: '25px',
            fontFamily: 'Cinzel, serif',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '1.3rem',
            transition: 'all 0.3s ease'
          }}
        >
          Start Playing
        </button>
      </div>

      <div style={{
        background: 'var(--white)',
        padding: '20px',
        borderRadius: '10px',
        border: '2px solid var(--gold)',
        textAlign: 'left'
      }}>
        <h3 style={{ color: 'var(--navy-blue)', marginBottom: '15px' }}>
          About This Game:
        </h3>
        <ul style={{ color: 'var(--dark-brown)', lineHeight: '1.6' }}>
          <li><strong>Educational Focus:</strong> Learn constitutional concepts through gameplay</li>
          <li><strong>Interactive Learning:</strong> Engage with democratic principles</li>
          <li><strong>Constitutional Themes:</strong> Based on real articles and provisions</li>
          <li><strong>Civic Education:</strong> Understand your rights and duties as a citizen</li>
        </ul>
      </div>
    </div>
  );
};

export default SimpleGame;
