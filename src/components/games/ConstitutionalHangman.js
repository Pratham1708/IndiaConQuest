import React, { useState, useEffect } from 'react';

const ConstitutionalHangman = ({ onBackToHub }) => {
  const [gameState, setGameState] = useState({
    currentWord: '',
    guessedLetters: [],
    wrongGuesses: 0,
    maxWrongGuesses: 10,
    gameStatus: 'playing', // playing, won, lost
    score: 0,
    level: 'easy',
    hint: '',
    category: ''
  });

  const [showHelp, setShowHelp] = useState(false);

  const getMaxWrongGuesses = (level) => {
    switch (level) {
      case 'easy': return 10;
      case 'medium': return 8;
      case 'hard': return 6;
      default: return 10;
    }
  };

  const WORD_LISTS = {
    easy: [
      { word: 'JUSTICE', hint: 'One of the main ideals in the Preamble', category: 'Preamble' },
      { word: 'LIBERTY', hint: 'Freedom mentioned in the Preamble', category: 'Preamble' },
      { word: 'EQUALITY', hint: 'Equal treatment for all citizens', category: 'Preamble' },
      { word: 'VOTE', hint: 'Democratic right of every citizen', category: 'Rights' },
      { word: 'REPUBLIC', hint: 'Type of government India chose', category: 'Government' },
      { word: 'SECULAR', hint: 'No official state religion', category: 'Principles' },
      { word: 'CITIZEN', hint: 'Member of a country', category: 'Basic Terms' },
      { word: 'RIGHTS', hint: 'What the Constitution guarantees', category: 'Basic Terms' },
      { word: 'DUTIES', hint: 'Responsibilities of citizens', category: 'Basic Terms' },
      { word: 'PARLIAMENT', hint: 'Legislative body of India', category: 'Government' }
    ],
    medium: [
      { word: 'FUNDAMENTAL', hint: 'Type of rights in Part III', category: 'Rights' },
      { word: 'DIRECTIVE', hint: 'Type of principles for state policy', category: 'Principles' },
      { word: 'AMENDMENT', hint: 'Changes made to Constitution', category: 'Process' },
      { word: 'SOVEREIGNTY', hint: 'Supreme power of the state', category: 'Concepts' },
      { word: 'FRATERNITY', hint: 'Brotherhood among citizens', category: 'Preamble' },
      { word: 'DEMOCRATIC', hint: 'Government by the people', category: 'Government' },
      { word: 'SOCIALIST', hint: 'Economic system mentioned in Preamble', category: 'Principles' },
      { word: 'JUDICIARY', hint: 'Branch that interprets laws', category: 'Government' },
      { word: 'EXECUTIVE', hint: 'Branch that implements laws', category: 'Government' },
      { word: 'LEGISLATURE', hint: 'Branch that makes laws', category: 'Government' },
      { word: 'PREAMBLE', hint: 'Introduction to the Constitution', category: 'Structure' },
      { word: 'SCHEDULE', hint: 'Appendix to the Constitution', category: 'Structure' }
    ],
    hard: [
      { word: 'CONSTITUENT', hint: 'Type of assembly that drafted Constitution', category: 'History' },
      { word: 'AMBEDKAR', hint: 'Chairman of Constitution Drafting Committee', category: 'Personalities' },
      { word: 'RAJENDRA', hint: 'First name of first President of Constituent Assembly', category: 'Personalities' },
      { word: 'FEDERALISM', hint: 'Division of power between center and states', category: 'Concepts' },
      { word: 'SECULARISM', hint: 'Separation of religion from state affairs', category: 'Concepts' },
      { word: 'UNICAMERAL', hint: 'Single house legislature (some states)', category: 'Government' },
      { word: 'BICAMERAL', hint: 'Two house legislature (Parliament)', category: 'Government' },
      { word: 'RAJYASABHA', hint: 'Upper house of Parliament', category: 'Parliament' },
      { word: 'LOKSABHA', hint: 'Lower house of Parliament', category: 'Parliament' },
      { word: 'IMPEACHMENT', hint: 'Process to remove President/Judge', category: 'Process' },
      { word: 'ORDINANCE', hint: 'Law made by President when Parliament not in session', category: 'Legal Terms' },
      { word: 'PROCLAMATION', hint: 'Declaration of emergency', category: 'Emergency' }
    ]
  };

  const renderHangman = () => {
    const wrongGuesses = gameState.wrongGuesses;
    const maxGuesses = gameState.maxWrongGuesses;
    
    // Calculate which stage to show based on level
    const getStageThreshold = (stage) => {
      if (maxGuesses === 10) {
        // Easy: 10 guesses - original progression
        return stage;
      } else if (maxGuesses === 8) {
        // Medium: 8 guesses - compress stages
        const stages = [0, 1, 2, 3, 4, 5, 6, 7, 8];
        return stages[stage] || stage;
      } else if (maxGuesses === 6) {
        // Hard: 6 guesses - more compressed
        const stages = [0, 1, 2, 3, 4, 5, 6];
        return stages[stage] || stage;
      }
      return stage;
    };
    
    return (
      <svg width="200" height="250" viewBox="0 0 200 250" style={{ margin: '20px auto' }}>
        {/* Base - always visible */}
        <rect x="10" y="230" width="120" height="10" fill="#8B4513" />
        
        {/* Pole */}
        {wrongGuesses >= getStageThreshold(1) && <rect x="30" y="20" width="8" height="220" fill="#8B4513" />}
        
        {/* Top beam */}
        {wrongGuesses >= getStageThreshold(2) && <rect x="30" y="20" width="100" height="8" fill="#8B4513" />}
        
        {/* Noose */}
        {wrongGuesses >= getStageThreshold(3) && <rect x="120" y="20" width="4" height="30" fill="#654321" />}
        
        {/* Head */}
        {wrongGuesses >= getStageThreshold(4) && (
          <circle 
            cx="122" 
            cy="65" 
            r="15" 
            fill="#FFDBAC" 
            stroke="#8B4513" 
            strokeWidth="2"
          />
        )}
        
        {/* Face */}
        {wrongGuesses >= getStageThreshold(4) && (
          <>
            {/* Eyes */}
            <circle cx="118" cy="62" r="2" fill="#000" />
            <circle cx="126" cy="62" r="2" fill="#000" />
            {/* Mouth - sad face when close to end */}
            {wrongGuesses >= Math.floor(maxGuesses * 0.8) ? (
              <path d="M 118 70 Q 122 74 126 70" stroke="#000" strokeWidth="1.5" fill="none" />
            ) : (
              <circle cx="122" cy="68" r="1" fill="#000" />
            )}
          </>
        )}
        
        {/* Body */}
        {wrongGuesses >= getStageThreshold(5) && (
          <rect x="118" y="80" width="8" height="60" fill="#4169E1" rx="4" />
        )}
        
        {/* Arms - both appear together for hard mode, separately for easy/medium */}
        {maxGuesses === 6 ? (
          // Hard mode: both arms at once
          wrongGuesses >= getStageThreshold(6) && (
            <>
              <rect 
                x="95" 
                y="95" 
                width="30" 
                height="6" 
                fill="#FFDBAC" 
                rx="3"
                transform="rotate(-20 110 98)"
              />
              <rect 
                x="119" 
                y="95" 
                width="30" 
                height="6" 
                fill="#FFDBAC" 
                rx="3"
                transform="rotate(20 134 98)"
              />
            </>
          )
        ) : (
          // Easy/Medium mode: arms separately
          <>
            {/* Left arm */}
            {wrongGuesses >= getStageThreshold(6) && (
              <rect 
                x="95" 
                y="95" 
                width="30" 
                height="6" 
                fill="#FFDBAC" 
                rx="3"
                transform="rotate(-20 110 98)"
              />
            )}
            
            {/* Right arm */}
            {wrongGuesses >= getStageThreshold(7) && (
              <rect 
                x="119" 
                y="95" 
                width="30" 
                height="6" 
                fill="#FFDBAC" 
                rx="3"
                transform="rotate(20 134 98)"
              />
            )}
          </>
        )}
        
        {/* Legs - both appear together for hard mode, separately for easy/medium */}
        {maxGuesses === 6 ? (
          // Hard mode: game over at 6, no legs needed
          null
        ) : maxGuesses === 8 ? (
          // Medium mode: both legs at once
          wrongGuesses >= getStageThreshold(8) && (
            <>
              <rect 
                x="105" 
                y="135" 
                width="6" 
                height="35" 
                fill="#654321" 
                rx="3"
                transform="rotate(-15 108 152)"
              />
              <rect 
                x="133" 
                y="135" 
                width="6" 
                height="35" 
                fill="#654321" 
                rx="3"
                transform="rotate(15 136 152)"
              />
            </>
          )
        ) : (
          // Easy mode: legs separately
          <>
            {/* Left leg */}
            {wrongGuesses >= getStageThreshold(8) && (
              <rect 
                x="105" 
                y="135" 
                width="6" 
                height="35" 
                fill="#654321" 
                rx="3"
                transform="rotate(-15 108 152)"
              />
            )}
            
            {/* Right leg */}
            {wrongGuesses >= getStageThreshold(9) && (
              <rect 
                x="133" 
                y="135" 
                width="6" 
                height="35" 
                fill="#654321" 
                rx="3"
                transform="rotate(15 136 152)"
              />
            )}
            
            {/* Hat (final touch for easy mode) */}
            {wrongGuesses >= getStageThreshold(10) && (
              <>
                <rect x="110" y="45" width="24" height="8" fill="#8B0000" rx="2" />
                <rect x="115" y="40" width="14" height="10" fill="#8B0000" rx="2" />
              </>
            )}
          </>
        )}
      </svg>
    );
  };

  useEffect(() => {
    startNewGame();
  }, [gameState.level]);

  const startNewGame = () => {
    const wordList = WORD_LISTS[gameState.level];
    const randomWord = wordList[Math.floor(Math.random() * wordList.length)];
    const maxGuesses = getMaxWrongGuesses(gameState.level);
    
    setGameState(prev => ({
      ...prev,
      currentWord: randomWord.word,
      hint: randomWord.hint,
      category: randomWord.category,
      guessedLetters: [],
      wrongGuesses: 0,
      maxWrongGuesses: maxGuesses,
      gameStatus: 'playing'
    }));
  };

  const guessLetter = (letter) => {
    if (gameState.guessedLetters.includes(letter) || gameState.gameStatus !== 'playing') {
      return;
    }

    const newGuessedLetters = [...gameState.guessedLetters, letter];
    let newWrongGuesses = gameState.wrongGuesses;
    let newScore = gameState.score;

    if (!gameState.currentWord.includes(letter)) {
      newWrongGuesses++;
    } else {
      // Correct guess - add points based on difficulty (only small points for correct letters)
      const points = gameState.level === 'easy' ? 5 : gameState.level === 'medium' ? 8 : 12;
      newScore += points;
    }

    // Check if word is complete
    const isWordComplete = gameState.currentWord.split('').every(char => 
      newGuessedLetters.includes(char)
    );

    let newGameStatus = gameState.gameStatus;
    if (isWordComplete) {
      newGameStatus = 'won';
      // Major bonus points for completing word - significantly different by level
      const baseBonus = gameState.level === 'easy' ? 100 : gameState.level === 'medium' ? 200 : 350;
      
      // Additional bonus based on how many wrong guesses were avoided
      const wrongGuessesAvoided = gameState.maxWrongGuesses - newWrongGuesses;
      const efficiencyBonus = wrongGuessesAvoided * (gameState.level === 'easy' ? 10 : gameState.level === 'medium' ? 20 : 35);
      
      newScore += baseBonus + efficiencyBonus;
    } else if (newWrongGuesses >= gameState.maxWrongGuesses) {
      newGameStatus = 'lost';
      // No score penalty for losing, just don't add any points
    }

    setGameState(prev => ({
      ...prev,
      guessedLetters: newGuessedLetters,
      wrongGuesses: newWrongGuesses,
      gameStatus: newGameStatus,
      score: newScore
    }));
  };

  const changeLevel = (newLevel) => {
    setGameState(prev => ({
      ...prev,
      level: newLevel,
      score: 0
    }));
  };

  const resetGame = () => {
    setGameState(prev => ({
      ...prev,
      score: 0
    }));
    startNewGame();
  };

  const renderWord = () => {
    return gameState.currentWord.split('').map((letter, index) => (
      <span
        key={index}
        style={{
          display: 'inline-block',
          width: '40px',
          height: '50px',
          margin: '0 5px',
          borderBottom: '3px solid var(--navy-blue)',
          textAlign: 'center',
          fontSize: '2rem',
          fontWeight: 'bold',
          color: 'var(--navy-blue)',
          lineHeight: '50px'
        }}
      >
        {gameState.guessedLetters.includes(letter) ? letter : ''}
      </span>
    ));
  };

  const renderAlphabet = () => {
    const qwertyRows = [
      ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
      ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
      ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
    ];
    
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        maxWidth: '700px',
        margin: '0 auto'
      }}>
        {qwertyRows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '8px',
              marginLeft: rowIndex === 1 ? '20px' : rowIndex === 2 ? '40px' : '0'
            }}
          >
            {row.map(letter => (
              <button
                key={letter}
                onClick={() => guessLetter(letter)}
                disabled={gameState.guessedLetters.includes(letter) || gameState.gameStatus !== 'playing'}
                style={{
                  padding: '12px 16px',
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  border: '2px solid var(--gold)',
                  borderRadius: '8px',
                  minWidth: '45px',
                  cursor: gameState.guessedLetters.includes(letter) ? 'not-allowed' : 'pointer',
                  background: gameState.guessedLetters.includes(letter) ? 
                    (gameState.currentWord.includes(letter) ? '#90EE90' : '#FFB6C1') : 
                    'var(--white)',
                  color: gameState.guessedLetters.includes(letter) ? 'var(--dark-brown)' : 'var(--navy-blue)',
                  opacity: gameState.guessedLetters.includes(letter) ? 0.6 : 1,
                  transition: 'all 0.3s ease',
                  boxShadow: gameState.guessedLetters.includes(letter) ? 'inset 0 2px 4px rgba(0,0,0,0.2)' : '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                {letter}
              </button>
            ))}
          </div>
        ))}
      </div>
    );
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'easy': return '#90EE90';
      case 'medium': return '#FFD700';
      case 'hard': return '#FF6B6B';
      default: return 'var(--gold)';
    }
  };

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
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
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
          <button
            onClick={() => setShowHelp(true)}
            style={{
              background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              color: 'var(--white)',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '25px',
              fontFamily: 'Cinzel, serif',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            ❓ Help
          </button>
        </div>
        <h2 style={{
          fontSize: '2.5rem',
          color: 'var(--navy-blue)',
          margin: '0',
          textAlign: 'center'
        }}>
          Constitutional Hangman 🎯
        </h2>
        <div style={{ color: 'var(--saffron)', fontWeight: '600', fontSize: '1.2rem' }}>
          Score: {gameState.score}
        </div>
      </div>

      {/* Level Selection */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '15px',
        marginBottom: '30px'
      }}>
        {['easy', 'medium', 'hard'].map(level => (
          <button
            key={level}
            onClick={() => changeLevel(level)}
            style={{
              padding: '10px 20px',
              fontSize: '1rem',
              fontWeight: '600',
              border: `3px solid ${getLevelColor(level)}`,
              borderRadius: '20px',
              background: gameState.level === level ? getLevelColor(level) : 'var(--white)',
              color: gameState.level === level ? 'var(--white)' : 'var(--navy-blue)',
              cursor: 'pointer',
              textTransform: 'uppercase',
              transition: 'all 0.3s ease'
            }}
          >
            {level}
          </button>
        ))}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '40px',
        marginBottom: '30px'
      }}>
        {/* Hangman Drawing */}
        <div style={{
          background: 'var(--white)',
          border: '3px solid var(--gold)',
          borderRadius: '20px',
          padding: '30px',
          textAlign: 'center'
        }}>
          <h3 style={{ color: 'var(--navy-blue)', marginBottom: '20px' }}>
            Wrong Guesses: {gameState.wrongGuesses}/{gameState.maxWrongGuesses}
          </h3>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            {renderHangman()}
          </div>
        </div>

        {/* Game Info */}
        <div style={{
          background: 'var(--white)',
          border: '3px solid var(--gold)',
          borderRadius: '20px',
          padding: '30px'
        }}>
          <h3 style={{ color: 'var(--navy-blue)', marginBottom: '15px' }}>
            Category: {gameState.category}
          </h3>
          <p style={{
            color: 'var(--dark-brown)',
            fontSize: '1.1rem',
            marginBottom: '20px',
            fontStyle: 'italic'
          }}>
            💡 Hint: {gameState.hint}
          </p>
          <div style={{
            background: 'var(--parchment)',
            padding: '15px',
            borderRadius: '10px',
            border: '2px solid var(--gold)'
          }}>
            <h4 style={{ color: 'var(--navy-blue)', marginBottom: '10px' }}>
              Level: {gameState.level.toUpperCase()}
            </h4>
            <p style={{ color: 'var(--dark-brown)', fontSize: '0.9rem', margin: '0' }}>
              {gameState.level === 'easy' && 'Basic constitutional terms and concepts'}
              {gameState.level === 'medium' && 'Intermediate constitutional knowledge'}
              {gameState.level === 'hard' && 'Advanced constitutional terms and personalities'}
            </p>
          </div>
        </div>
      </div>

      {/* Word Display */}
      <div style={{
        background: 'var(--white)',
        border: '3px solid var(--gold)',
        borderRadius: '20px',
        padding: '40px',
        marginBottom: '30px',
        textAlign: 'center'
      }}>
        <h3 style={{ color: 'var(--navy-blue)', marginBottom: '30px' }}>
          Guess the Constitutional Term:
        </h3>
        <div style={{ marginBottom: '30px' }}>
          {renderWord()}
        </div>
        {renderAlphabet()}
      </div>

      {/* Game Over Modal */}
      {gameState.gameStatus !== 'playing' && (
        <div style={{
          position: 'fixed',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'var(--white)',
            padding: '50px',
            borderRadius: '20px',
            border: '3px solid var(--gold)',
            textAlign: 'center',
            maxWidth: '600px'
          }}>
            <h3 style={{
              fontSize: '3rem',
              marginBottom: '20px',
              color: gameState.gameStatus === 'won' ? '#90EE90' : '#FF6B6B'
            }}>
              {gameState.gameStatus === 'won' ? '🎉 Congratulations!' : '💀 Game Over!'}
            </h3>
            
            <div style={{
              fontSize: '1.5rem',
              marginBottom: '20px',
              color: 'var(--dark-brown)'
            }}>
              The word was: <span style={{ 
                color: 'var(--navy-blue)', 
                fontWeight: '700',
                fontSize: '2rem'
              }}>
                {gameState.currentWord}
              </span>
            </div>
            
            <p style={{
              fontSize: '1.2rem',
              color: 'var(--dark-brown)',
              marginBottom: '20px'
            }}>
              {gameState.hint}
            </p>
            
            <div style={{
              fontSize: '1.3rem',
              marginBottom: '30px',
              color: 'var(--saffron)',
              fontWeight: '600'
            }}>
              Final Score: {gameState.score}
            </div>
            
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
              <button
                onClick={startNewGame}
                style={{
                  background: 'linear-gradient(135deg, var(--saffron), var(--gold))',
                  color: 'var(--white)',
                  border: 'none',
                  padding: '15px 30px',
                  borderRadius: '25px',
                  fontFamily: 'Cinzel, serif',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '1.1rem'
                }}
              >
                New Word
              </button>
              <button
                onClick={resetGame}
                style={{
                  background: 'var(--navy-blue)',
                  color: 'var(--white)',
                  border: 'none',
                  padding: '15px 30px',
                  borderRadius: '25px',
                  fontFamily: 'Cinzel, serif',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '1.1rem'
                }}
              >
                Reset Score
              </button>
              <button
                onClick={onBackToHub}
                style={{
                  background: 'var(--dark-brown)',
                  color: 'var(--white)',
                  border: 'none',
                  padding: '15px 30px',
                  borderRadius: '25px',
                  fontFamily: 'Cinzel, serif',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '1.1rem'
                }}
              >
                Back to Hub
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Help Modal */}
      {showHelp && (
        <div style={{
          position: 'fixed',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          background: 'rgba(0,0,0,0.9)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: 'var(--white)',
            padding: '40px',
            borderRadius: '20px',
            border: '3px solid var(--gold)',
            maxWidth: '900px',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '30px',
              paddingBottom: '20px',
              borderBottom: '2px solid var(--gold)'
            }}>
              <h2 style={{
                fontSize: '2.5rem',
                color: 'var(--navy-blue)',
                margin: '0',
                display: 'flex',
                alignItems: 'center',
                gap: '15px'
              }}>
                🎯 Constitutional Hangman Help
              </h2>
              <button
                onClick={() => setShowHelp(false)}
                style={{
                  background: 'var(--navy-blue)',
                  color: 'var(--white)',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '20px',
                  fontFamily: 'Cinzel, serif',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                ✕ Close
              </button>
            </div>

            {/* Educational Goals */}
            <div style={{ marginBottom: '25px' }}>
              <h3 style={{
                fontSize: '1.3rem',
                color: 'var(--navy-blue)',
                marginBottom: '15px'
              }}>
                🎯 Educational Goals
              </h3>
              <div style={{
                background: 'var(--parchment)',
                padding: '15px 20px',
                borderRadius: '12px',
                border: '2px solid var(--gold)',
                paddingLeft: '10px'
              }}>
                <p style={{ color: 'var(--dark-brown)', lineHeight: '1.6', margin: '10px 0' }}>
                  Constitutional Hangman aims to:
                </p>
                <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
                  <li style={{ color: 'var(--dark-brown)', lineHeight: '1.6' }}>Build vocabulary of important constitutional terms and concepts</li>
                  <li style={{ color: 'var(--dark-brown)', lineHeight: '1.6' }}>Teach the spelling and recognition of key personalities who shaped the Indian Constitution</li>
                  <li style={{ color: 'var(--dark-brown)', lineHeight: '1.6' }}>Explain constitutional processes and legal terminology</li>
                  <li style={{ color: 'var(--dark-brown)', lineHeight: '1.6' }}>Reinforce learning through repetition and visual memory</li>
                  <li style={{ color: 'var(--dark-brown)', lineHeight: '1.6' }}>Make constitutional education engaging and interactive</li>
                </ul>
              </div>
            </div>

            {/* How to Play */}
            <div style={{ marginBottom: '25px' }}>
              <h3 style={{
                fontSize: '1.3rem',
                color: 'var(--navy-blue)',
                marginBottom: '15px'
              }}>
                🎮 How to Play
              </h3>
              <div style={{
                background: 'var(--parchment)',
                padding: '15px 20px',
                borderRadius: '12px',
                border: '2px solid var(--gold)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
                  <div style={{ fontSize: '1.5rem' }}>🎯</div>
                  <div style={{ color: 'var(--dark-brown)', lineHeight: '1.6' }}>
                    <strong style={{ color: 'var(--navy-blue)' }}>Objective:</strong> Guess the constitutional word or term before the hangman drawing is completed
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
                  <div style={{ fontSize: '1.5rem' }}>⌨️</div>
                  <div style={{ color: 'var(--dark-brown)', lineHeight: '1.6' }}>
                    <strong style={{ color: 'var(--navy-blue)' }}>Guessing:</strong> Click letters on the keyboard to make guesses
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
                  <div style={{ fontSize: '1.5rem' }}>💡</div>
                  <div style={{ color: 'var(--dark-brown)', lineHeight: '1.6' }}>
                    <strong style={{ color: 'var(--navy-blue)' }}>Hints:</strong> Use the hint and category to guide your guesses
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ fontSize: '1.5rem' }}>⚠️</div>
                  <div style={{ color: 'var(--dark-brown)', lineHeight: '1.6' }}>
                    <strong style={{ color: 'var(--navy-blue)' }}>Wrong Guesses:</strong> Each incorrect letter adds a part to the hangman drawing
                  </div>
                </div>
              </div>
            </div>

            {/* Difficulty Levels */}
            <div style={{ marginBottom: '25px' }}>
              <h3 style={{
                fontSize: '1.3rem',
                color: 'var(--navy-blue)',
                marginBottom: '15px'
              }}>
                📊 Difficulty Levels
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                <div style={{
                  background: '#90EE90',
                  padding: '15px',
                  borderRadius: '12px',
                  border: '2px solid var(--gold)',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '10px' }}>🟢</div>
                  <h4 style={{ color: 'var(--white)', margin: '0 0 10px 0', fontSize: '1.1rem' }}>EASY</h4>
                  <p style={{ color: 'var(--white)', fontSize: '0.9rem', margin: '0', lineHeight: '1.4' }}>
                    10 wrong guesses allowed<br/>
                    Basic constitutional terms<br/>
                    5 points per correct letter<br/>
                    100 base completion bonus
                  </p>
                </div>
                <div style={{
                  background: '#FFD700',
                  padding: '15px',
                  borderRadius: '12px',
                  border: '2px solid var(--gold)',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '10px' }}>🟡</div>
                  <h4 style={{ color: 'var(--white)', margin: '0 0 10px 0', fontSize: '1.1rem' }}>MEDIUM</h4>
                  <p style={{ color: 'var(--white)', fontSize: '0.9rem', margin: '0', lineHeight: '1.4' }}>
                    8 wrong guesses allowed<br/>
                    Intermediate concepts<br/>
                    8 points per correct letter<br/>
                    200 base completion bonus
                  </p>
                </div>
                <div style={{
                  background: '#FF6B6B',
                  padding: '15px',
                  borderRadius: '12px',
                  border: '2px solid var(--gold)',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '10px' }}>🔴</div>
                  <h4 style={{ color: 'var(--white)', margin: '0 0 10px 0', fontSize: '1.1rem' }}>HARD</h4>
                  <p style={{ color: 'var(--white)', fontSize: '0.9rem', margin: '0', lineHeight: '1.4' }}>
                    6 wrong guesses allowed<br/>
                    Advanced terms & names<br/>
                    12 points per correct letter<br/>
                    350 base completion bonus
                  </p>
                </div>
              </div>
            </div>

            {/* Scoring System */}
            <div style={{ marginBottom: '25px' }}>
              <h3 style={{
                fontSize: '1.3rem',
                color: 'var(--navy-blue)',
                marginBottom: '15px'
              }}>
                🏆 Scoring System
              </h3>
              <div style={{
                background: 'var(--parchment)',
                padding: '15px 20px',
                borderRadius: '12px',
                border: '2px solid var(--gold)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <div style={{ fontSize: '1.5rem' }}>✅</div>
                  <div style={{ color: 'var(--dark-brown)', lineHeight: '1.6' }}>
                    <strong style={{ color: 'var(--navy-blue)' }}>Correct Letters:</strong> Earn points for each correct guess (5/8/12 based on difficulty)
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <div style={{ fontSize: '1.5rem' }}>🎯</div>
                  <div style={{ color: 'var(--dark-brown)', lineHeight: '1.6' }}>
                    <strong style={{ color: 'var(--navy-blue)' }}>Word Completion:</strong> Major bonus for completing words (100/200/350 based on difficulty)
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <div style={{ fontSize: '1.5rem' }}>⚡</div>
                  <div style={{ color: 'var(--dark-brown)', lineHeight: '1.6' }}>
                    <strong style={{ color: 'var(--navy-blue)' }}>Efficiency Bonus:</strong> Extra points for avoiding wrong guesses (10/20/35 per guess saved)
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ fontSize: '1.5rem' }}>📈</div>
                  <div style={{ color: 'var(--dark-brown)', lineHeight: '1.6' }}>
                    <strong style={{ color: 'var(--navy-blue)' }}>Cumulative Score:</strong> Your score accumulates across multiple words
                  </div>
                </div>
              </div>
            </div>

            {/* Tips for Success */}
            <div style={{ marginBottom: '25px' }}>
              <h3 style={{
                fontSize: '1.3rem',
                color: 'var(--navy-blue)',
                marginBottom: '15px'
              }}>
                💡 Tips for Success
              </h3>
              <div style={{
                background: 'var(--parchment)',
                padding: '15px 20px',
                borderRadius: '12px',
                border: '2px solid var(--gold)',
                paddingLeft: '10px'
              }}>
                <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
                  <li style={{ color: 'var(--dark-brown)', lineHeight: '1.6' }}><strong>Start with Vowels:</strong> A, E, I, O, U are common in constitutional terms</li>
                  <li style={{ color: 'var(--dark-brown)', lineHeight: '1.6' }}><strong>Common Consonants:</strong> T, R, S, N, L appear frequently</li>
                  <li style={{ color: 'var(--dark-brown)', lineHeight: '1.6' }}><strong>Think Constitutional:</strong> Consider common constitutional prefixes and suffixes</li>
                  <li style={{ color: 'var(--dark-brown)', lineHeight: '1.6' }}><strong>Use the Hint:</strong> The hint and category provide valuable clues about the word</li>
                  <li style={{ color: 'var(--dark-brown)', lineHeight: '1.6' }}><strong>Learn from Mistakes:</strong> Wrong guesses teach you about word patterns</li>
                  <li style={{ color: 'var(--dark-brown)', lineHeight: '1.6' }}><strong>Progressive Difficulty:</strong> Start with Easy to build confidence and knowledge</li>
                </ul>
              </div>
            </div>

            {/* Word Categories */}
            <div style={{ marginBottom: '25px' }}>
              <h3 style={{
                fontSize: '1.3rem',
                color: 'var(--navy-blue)',
                marginBottom: '15px'
              }}>
                📚 Word Categories & Educational Content
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div style={{
                  background: 'var(--parchment)',
                  padding: '15px',
                  borderRadius: '12px',
                  border: '2px solid var(--gold)'
                }}>
                  <h4 style={{ color: 'var(--navy-blue)', margin: '0 0 10px 0' }}>🏛️ Government Structure</h4>
                  <p style={{ color: 'var(--dark-brown)', fontSize: '0.9rem', margin: '0', lineHeight: '1.4' }}>
                    Learn about Parliament, Executive, Judiciary, and the three branches of government that form India's democratic structure.
                  </p>
                </div>
                <div style={{
                  background: 'var(--parchment)',
                  padding: '15px',
                  borderRadius: '12px',
                  border: '2px solid var(--gold)'
                }}>
                  <h4 style={{ color: 'var(--navy-blue)', margin: '0 0 10px 0' }}>⚖️ Rights & Duties</h4>
                  <p style={{ color: 'var(--dark-brown)', fontSize: '0.9rem', margin: '0', lineHeight: '1.4' }}>
                    Discover Fundamental Rights, Directive Principles, and the duties that balance freedom with responsibility.
                  </p>
                </div>
                <div style={{
                  background: 'var(--parchment)',
                  padding: '15px',
                  borderRadius: '12px',
                  border: '2px solid var(--gold)'
                }}>
                  <h4 style={{ color: 'var(--navy-blue)', margin: '0 0 10px 0' }}>👥 Key Personalities</h4>
                  <p style={{ color: 'var(--dark-brown)', fontSize: '0.9rem', margin: '0', lineHeight: '1.4' }}>
                    Meet the architects of our Constitution like Dr. Ambedkar, Rajendra Prasad, and other founding fathers.
                  </p>
                </div>
                <div style={{
                  background: 'var(--parchment)',
                  padding: '15px',
                  borderRadius: '12px',
                  border: '2px solid var(--gold)'
                }}>
                  <h4 style={{ color: 'var(--navy-blue)', margin: '0 0 10px 0' }}>🏛️ Constitutional Principles</h4>
                  <p style={{ color: 'var(--dark-brown)', fontSize: '0.9rem', margin: '0', lineHeight: '1.4' }}>
                    Understand concepts like Secularism, Federalism, Democracy, and the values that guide our nation.
                  </p>
                </div>
              </div>
            </div>

            {/* Learning Benefits */}
            <div style={{ marginBottom: '25px' }}>
              <h3 style={{
                fontSize: '1.3rem',
                color: 'var(--navy-blue)',
                marginBottom: '15px'
              }}>
                🎓 Learning Benefits
              </h3>
              <div style={{
                background: 'var(--parchment)',
                padding: '15px 20px',
                borderRadius: '12px',
                border: '2px solid var(--gold)',
                paddingLeft: '10px'
              }}>
                <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
                  <li style={{ color: 'var(--dark-brown)', lineHeight: '1.6' }}>Improve spelling and recognition of constitutional terminology</li>
                  <li style={{ color: 'var(--dark-brown)', lineHeight: '1.6' }}>Build confidence in civic knowledge through progressive difficulty</li>
                  <li style={{ color: 'var(--dark-brown)', lineHeight: '1.6' }}>Develop pattern recognition skills for legal and governmental terms</li>
                  <li style={{ color: 'var(--dark-brown)', lineHeight: '1.6' }}>Reinforce learning through visual memory and repetition</li>
                  <li style={{ color: 'var(--dark-brown)', lineHeight: '1.6' }}>Connect constitutional concepts with their practical applications</li>
                  <li style={{ color: 'var(--dark-brown)', lineHeight: '1.6' }}>Prepare for civic exams and citizenship tests</li>
                </ul>
              </div>
            </div>

            {/* Close Button */}
            <div style={{ textAlign: 'center', marginTop: '30px' }}>
              <button
                onClick={() => setShowHelp(false)}
                style={{
                  background: 'linear-gradient(135deg, var(--saffron), var(--gold))',
                  color: 'var(--white)',
                  border: 'none',
                  padding: '15px 30px',
                  borderRadius: '25px',
                  fontFamily: 'Cinzel, serif',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '1.1rem',
                  transition: 'all 0.3s ease'
                }}
              >
                Start Playing! 🎯
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ConstitutionalHangman;                
