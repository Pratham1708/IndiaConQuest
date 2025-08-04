import React, { useState, useEffect, useCallback } from "react";

const ConstitutionalSnakesLadders = ({ onBackToHub }) => {
  // Game State
  const [playerPosition, setPlayerPosition] = useState(1);
  const [diceValue, setDiceValue] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const [gameMessage, setGameMessage] = useState(
    "🇮🇳 Welcome to Constitutional Journey! Roll the Chakra to begin."
  );
  const [showPopup, setShowPopup] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [articlesEncountered, setArticlesEncountered] = useState([]);
  const [rightsUsed, setRightsUsed] = useState(0);
  const [dutiesMissed, setDutiesMissed] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showHelp, setShowHelp] = useState(false);

  // Constitutional Snakes and Ladders configuration
  const SNAKES_AND_LADDERS = [
    // Ladders (Constitutional Values)
    {
      start: 4,
      end: 14,
      type: "ladder",
      title: "Article 21: Right to Life",
      description: "Right to Life empowers you! Climb up! 🌟",
    },
    {
      start: 9,
      end: 31,
      type: "ladder",
      title: "Article 19: Freedom of Speech",
      description: "Freedom of Speech lifts you higher! 🗣️",
    },
    {
      start: 16,
      end: 26,
      type: "ladder",
      title: "Article 15: Right to Equality",
      description: "Equality before law advances you! ⚖️",
    },
    {
      start: 21,
      end: 42,
      type: "ladder",
      title: "Article 32: Constitutional Remedies",
      description: "Dr. Ambedkar's heart and soul of Constitution! 💖",
    },
    {
      start: 28,
      end: 84,
      type: "ladder",
      title: "Fundamental Duties Followed",
      description: "Following your duties as a citizen! 🇮🇳",
    },
    {
      start: 36,
      end: 44,
      type: "ladder",
      title: "Article 51A(g): Protect Environment",
      description: "Protecting environment is our duty! �",
    },
    {
      start: 51,
      end: 67,
      type: "ladder",
      title: "Article 326: Universal Suffrage",
      description: "Voting in election - democracy in action! 🗳️",
    },
    {
      start: 71,
      end: 91,
      type: "ladder",
      title: "Article 51A(a): Respect Constitution",
      description: "Respecting Constitution and its ideals! �",
    },
    {
      start: 78,
      end: 98,
      type: "ladder",
      title: "Article 51A(b): National Symbols",
      description: "Cherishing noble ideals of freedom struggle! 🏛️",
    },

    // Snakes (Constitutional Violations)
    {
      start: 17,
      end: 7,
      type: "snake",
      title: "Article 14 Violated",
      description: "Equality violated! Slid down the ladder of justice! ⚖️",
    },
    {
      start: 54,
      end: 34,
      type: "snake",
      title: "Disrespecting National Flag",
      description: "Disrespecting national symbols brings you down! 🚩",
    },
    {
      start: 62,
      end: 19,
      type: "snake",
      title: "Breaking Rule of Law",
      description: "Rule of law broken - justice delayed! ⚖️",
    },
    {
      start: 64,
      end: 60,
      type: "snake",
      title: "Article 51A(h) Violated",
      description: "Not developing scientific temper! 🔬",
    },
    {
      start: 87,
      end: 24,
      type: "snake",
      title: "Spreading Misinformation",
      description: "Spreading false information harms democracy! 📰",
    },
    {
      start: 92,
      end: 73,
      type: "snake",
      title: "Article 51A(f) Violated",
      description: "Not valuing composite culture of India! 🎭",
    },
    {
      start: 95,
      end: 75,
      type: "snake",
      title: "Article 51A(i) Violated",
      description: "Not safeguarding public property! 🏛️",
    },
    {
      start: 99,
      end: 80,
      type: "snake",
      title: "Article 51A(j) Violated",
      description: "Not striving for excellence in all spheres! 🎯",
    },
  ];

  // Square colors for alternating pattern
  const SQUARE_COLORS = [
    "#FFF8DC",
    "#FFEBCD",
    "#FFF8DC",
    "#FFEBCD",
    "#FFF8DC",
    "#FFEBCD",
    "#FFF8DC",
    "#FFEBCD",
    "#FFF8DC",
    "#FFEBCD",
  ];

  // Constitutional facts for each square
  const constitutionalFacts = {
    1: {
      title: "Journey Begins",
      description:
        "Start your constitutional journey through the Republic of India!",
      article: "Preamble",
    },
    10: {
      title: "Article 1",
      description: "India, that is Bharat, shall be a Union of States",
      article: "Article 1",
    },
    20: {
      title: "Article 12",
      description: "Definition of State for fundamental rights",
      article: "Article 12",
    },
    30: {
      title: "Article 25",
      description: "Freedom of conscience and religion",
      article: "Article 25",
    },
    40: {
      title: "Article 39",
      description: "Directive Principles - adequate livelihood",
      article: "Article 39",
    },
    50: {
      title: "Article 44",
      description: "Uniform Civil Code for citizens",
      article: "Article 44",
    },
    60: {
      title: "Article 72",
      description: "Power of President to grant pardons",
      article: "Article 72",
    },
    70: {
      title: "Article 110",
      description: "Definition of Money Bills",
      article: "Article 110",
    },
    80: {
      title: "Article 124",
      description: "Establishment of Supreme Court",
      article: "Article 124",
    },
    90: {
      title: "Article 356",
      description: "President's Rule in states",
      article: "Article 356",
    },
    100: {
      title: "Constitutional Victory!",
      description: "You've mastered the Constitution of India! 🏆",
      article: "Complete Journey",
    },
  };

  // Sound effects
  const playSound = useCallback(
    (type) => {
      if (!soundEnabled) return;

      try {
        let frequency, duration;
        switch (type) {
          case "dice":
            frequency = 800;
            duration = 200;
            break;
          case "ladder":
            frequency = 1200;
            duration = 500;
            break;
          case "snake":
            frequency = 300;
            duration = 800;
            break;
          case "victory":
            frequency = 1500;
            duration = 1000;
            break;
          default:
            return;
        }

        const audioContext = new (window.AudioContext ||
          window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = "sine";

        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + duration / 1000
        );

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration / 1000);
      } catch (e) {
        // Audio not supported, continue silently
      }
    },
    [soundEnabled]
  );

  // Get pixel position for snakes and ladders - direct calculation
  const getPixelPosition = (square) => {
    // Calculate which row this square is in (1-10, bottom to top)
    const row = Math.ceil(square / 10);

    // Calculate position within the row (1-10)
    const positionInRow = ((square - 1) % 10) + 1;

    // For snakes and ladders pattern: odd rows go left-to-right, even rows go right-to-left
    const col = row % 2 === 1 ? positionInRow : 11 - positionInRow;

    // CSS Grid position (1-based, from top)
    const gridRow = 11 - row; // Invert so square 1 is at bottom
    const gridCol = col;

    // Direct pixel calculation matching the CSS grid
    const squareSize = 60;
    const gap = 2;
    const boardPadding = 20;
    const borderWidth = 3;

    return {
      x:
        boardPadding +
        borderWidth +
        (gridCol - 1) * (squareSize + gap) +
        squareSize / 2,
      y:
        boardPadding +
        borderWidth +
        (gridRow - 1) * (squareSize + gap) +
        squareSize / 2,
    };
  };

  // Get grid position for a square
  const getGridPosition = (square) => {
    const row = Math.ceil(square / 10);
    const positionInRow = ((square - 1) % 10) + 1;
    const col = row % 2 === 1 ? positionInRow : 11 - positionInRow;
    const gridRow = 11 - row;
    const gridCol = col;
    return { gridRow, gridCol };
  };

  // Render snake or ladder as simple thick lines using CSS grid positioning
  const renderSnakeOrLadder = (item) => {
    const startGrid = getGridPosition(item.start);
    const endGrid = getGridPosition(item.end);

    // Calculate the line properties
    const deltaCol = endGrid.gridCol - startGrid.gridCol;
    const deltaRow = endGrid.gridRow - startGrid.gridRow;
    const length = Math.sqrt(deltaCol * deltaCol + deltaRow * deltaRow) * 62; // 60px square + 2px gap
    const angle = Math.atan2(deltaRow, deltaCol) * (180 / Math.PI);

    return (
      <div
        key={`${item.type}-${item.start}-${item.end}`}
        className="snake-ladder-line"
        style={{
          gridRow: startGrid.gridRow,
          gridColumn: startGrid.gridCol,
          width: `${length}px`,
          height: "6px",
          background: item.type === "ladder" ? "#22c55e" : "#ef4444",
          transform: `rotate(${angle}deg)`,
          transformOrigin: "0 50%",
          zIndex: 15,
          position: "relative",
          borderRadius: "3px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
        }}
      >
        {/* Label */}
        <div
          className="absolute text-white px-1 py-0.5 rounded font-bold shadow-lg"
          style={{
            top: "-20px",
            left: `${length / 2 - 10}px`,
            fontSize: "10px",
            background: item.type === "ladder" ? "#16a34a" : "#dc2626",
            transform: `rotate(${-angle}deg)`,
            transformOrigin: "center",
          }}
        >
          {item.type === "ladder" ? "🪜" : "🐍"}
        </div>
      </div>
    );
  };
  // Define fixed snake and ladder positions with diagonal support
  const getSnakeLadderEmoji = (square) => {
    const positions = {
      // GREEN LADDERS (Constitutional Rights) - Start positions
      4: { type: "ladder", position: "start", number: 1, emoji: "🪜", end: 14 },
      9: { type: "ladder", position: "start", number: 2, emoji: "🪜", end: 31 },
      16: {
        type: "ladder",
        position: "start",
        number: 3,
        emoji: "🪜",
        end: 26,
      },
      21: {
        type: "ladder",
        position: "start",
        number: 4,
        emoji: "🪜",
        end: 42,
      },
      28: {
        type: "ladder",
        position: "start",
        number: 5,
        emoji: "🪜",
        end: 84,
      },
      36: {
        type: "ladder",
        position: "start",
        number: 6,
        emoji: "🪜",
        end: 44,
      },
      51: {
        type: "ladder",
        position: "start",
        number: 7,
        emoji: "🪜",
        end: 67,
      },
      71: {
        type: "ladder",
        position: "start",
        number: 8,
        emoji: "🪜",
        end: 91,
      },
      78: {
        type: "ladder",
        position: "start",
        number: 9,
        emoji: "🪜",
        end: 98,
      },

      // GREEN LADDERS - End positions
      14: { type: "ladder", position: "end", number: 1, emoji: "🪜" },
      31: { type: "ladder", position: "end", number: 2, emoji: "🪜" },
      26: { type: "ladder", position: "end", number: 3, emoji: "🪜" },
      42: { type: "ladder", position: "end", number: 4, emoji: "🪜" },
      84: { type: "ladder", position: "end", number: 5, emoji: "🪜" },
      44: { type: "ladder", position: "end", number: 6, emoji: "🪜" },
      67: { type: "ladder", position: "end", number: 7, emoji: "🪜" },
      91: { type: "ladder", position: "end", number: 8, emoji: "🪜" },
      98: { type: "ladder", position: "end", number: 9, emoji: "🪜" },

      // RED SNAKES (Constitutional Violations) - Start positions
      17: { type: "snake", position: "start", number: 1, emoji: "🐍", end: 7 },
      54: { type: "snake", position: "start", number: 2, emoji: "🐍", end: 34 },
      62: { type: "snake", position: "start", number: 3, emoji: "🐍", end: 19 },
      64: { type: "snake", position: "start", number: 4, emoji: "🐍", end: 60 },
      87: { type: "snake", position: "start", number: 5, emoji: "🐍", end: 24 },
      92: { type: "snake", position: "start", number: 6, emoji: "🐍", end: 73 },
      95: { type: "snake", position: "start", number: 7, emoji: "🐍", end: 75 },
      99: { type: "snake", position: "start", number: 8, emoji: "🐍", end: 80 },

      // RED SNAKES - End positions
      7: { type: "snake", position: "end", number: 1, emoji: "🐍" },
      34: { type: "snake", position: "end", number: 2, emoji: "🐍" },
      19: { type: "snake", position: "end", number: 3, emoji: "🐍" },
      60: { type: "snake", position: "end", number: 4, emoji: "🐍" },
      24: { type: "snake", position: "end", number: 5, emoji: "🐍" },
      73: { type: "snake", position: "end", number: 6, emoji: "🐍" },
      75: { type: "snake", position: "end", number: 7, emoji: "🐍" },
      80: { type: "snake", position: "end", number: 8, emoji: "🐍" },
    };
    return positions[square];
  };

  // Render the 10x10 board with fixed snakes and ladders
  const renderBoard = () => {
    const squares = [];

    // Create all 100 squares with proper snakes and ladders numbering
    for (let square = 1; square <= 100; square++) {
      // Calculate which row this square is in (1-10, bottom to top)
      const row = Math.ceil(square / 10);

      // Calculate position within the row (1-10)
      const positionInRow = ((square - 1) % 10) + 1;

      // For snakes and ladders pattern: odd rows go left-to-right, even rows go right-to-left
      const col = row % 2 === 1 ? positionInRow : 11 - positionInRow;

      // CSS Grid position (1-based, from top)
      const gridRow = 11 - row; // Invert so square 1 is at bottom
      const gridCol = col;

      const isPlayer = playerPosition === square;
      const snakeOrLadder = SNAKES_AND_LADDERS.find(
        (sl) => sl.start === square
      );
      const hasFact = constitutionalFacts[square];
      const emojiData = getSnakeLadderEmoji(square);

      squares.push(
        <div
          key={square}
          className="board-square"
          style={{
            gridRow: gridRow,
            gridColumn: gridCol,
            backgroundColor: SQUARE_COLORS[square % 10],
            position: "relative",
            overflow: "visible",
          }}
          onClick={() => {
            if (hasFact) {
              setCurrentEvent(hasFact);
              setShowPopup(true);
            }
          }}
        >
          {/* Snake or Ladder Emoji with Number */}
          {emojiData && (
            <div
              className="emoji-indicator"
              style={{
                position: "absolute",
                top: "2px",
                left: "2px",
                background: emojiData.type === "ladder" ? "#22c55e" : "#ef4444",
                color: "white",
                padding: "2px 4px",
                borderRadius: "6px",
                fontSize: "10px",
                fontWeight: "bold",
                zIndex: 10,
                display: "flex",
                alignItems: "center",
                gap: "2px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
              }}
            >
              <span>{emojiData.emoji}</span>
              <span>{emojiData.number}</span>
              {emojiData.position === "start" && (
                <span style={{ fontSize: "8px" }}>→{emojiData.end}</span>
              )}
            </div>
          )}

          {/* Square number */}
          <span className="square-number">{square}</span>

          {/* Special square indicators */}
          {square === 1 && (
            <div className="square-label start-label">START</div>
          )}
          {square === 100 && <div className="square-label win-label">WIN</div>}

          {/* Constitutional fact indicator */}
          {hasFact && <div className="fact-indicator">📜</div>}

          {/* Snake or Ladder start indicators */}
          {snakeOrLadder && (
            <div className="snake-ladder-indicator">
              {snakeOrLadder.type === "snake" ? (
                <div className="snake-indicator">
                  <span>↓</span>
                </div>
              ) : (
                <div className="ladder-indicator">
                  <span>↑</span>
                </div>
              )}
            </div>
          )}

          {/* Player token */}
          {isPlayer && (
            <div className="player-token">
              <div className="player-avatar">🇮🇳</div>
            </div>
          )}
        </div>
      );
    }

    return squares;
  };

  // Game functions
  const rollDice = useCallback(() => {
    if (isRolling || gameCompleted) return;

    setIsRolling(true);
    setGameMessage("🎲 Rolling the Constitutional Chakra...");
    playSound("dice");

    // Simulate dice roll animation
    const rollAnimation = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1);
    }, 100);

    setTimeout(() => {
      clearInterval(rollAnimation);
      const finalDiceValue = Math.floor(Math.random() * 6) + 1;
      setDiceValue(finalDiceValue);
      movePlayer(finalDiceValue);
      setIsRolling(false);
    }, 1000);
  }, [isRolling, gameCompleted, playSound]);

  const movePlayer = (steps) => {
    const newPosition = Math.min(playerPosition + steps, 100);
    setPlayerPosition(newPosition);

    setTimeout(() => {
      checkForEvents(newPosition);
    }, 500);
  };

  const checkForEvents = (position) => {
    // Check for snakes and ladders
    const snakeOrLadder = SNAKES_AND_LADDERS.find(
      (sl) => sl.start === position
    );

    if (snakeOrLadder) {
      setCurrentEvent(snakeOrLadder);
      setShowPopup(true);

      if (snakeOrLadder.type === "snake") {
        setDutiesMissed((prev) => prev + 1);
        playSound("snake");
      } else {
        setRightsUsed((prev) => prev + 1);
        playSound("ladder");
      }

      setTimeout(() => {
        setPlayerPosition(snakeOrLadder.end);
        setGameMessage(
          `${snakeOrLadder.description} Moved to square ${snakeOrLadder.end}`
        );
        setArticlesEncountered((prev) => [...prev, snakeOrLadder.title]);
      }, 2000);
    }
    // Regular square
    else {
      const fact = constitutionalFacts[position];
      if (fact) {
        setCurrentEvent(fact);
        setShowPopup(true);
        setArticlesEncountered((prev) => [...prev, fact.article]);
      }
      setGameMessage(`📍 Landed on square ${position}`);
    }

    // Check for game completion
    if (position === 100) {
      setGameCompleted(true);
      setGameMessage(
        "🎉 Congratulations! You've completed your Constitutional Journey! 🇮🇳"
      );
      playSound("victory");
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    setCurrentEvent(null);
  };

  const resetGame = () => {
    setPlayerPosition(1);
    setDiceValue(1);
    setGameMessage(
      "🇮🇳 Welcome to Constitutional Journey! Roll the Chakra to begin."
    );
    setGameCompleted(false);
    setArticlesEncountered([]);
    setRightsUsed(0);
    setDutiesMissed(0);
    setShowPopup(false);
    setCurrentEvent(null);
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.code === "Space" || event.key === " ") {
        event.preventDefault();
        rollDice();
      }
      if (event.key === "Escape") {
        closePopup();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [rollDice]);

  return (
    <div className="constitutional-snakes-ladders">
      {/* Header */}
      <div className="game-container">
        <div className="game-header">
          <h1 className="game-title">
            🐍🪜 Snakes & Ladders of the Constitution 🇮🇳
          </h1>
          <p className="game-subtitle">
            Learn the Constitution through your journey from 1 to 100!
          </p>
          <div className="header-controls">
            <button onClick={onBackToHub} className="back-button">
              ← Back to Arcade
            </button>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`sound-button ${
                soundEnabled ? "sound-on" : "sound-off"
              }`}
            >
              {soundEnabled ? "🔊" : "🔇"} Sound
            </button>
            <button onClick={() => setShowHelp(true)} className="help-button">
              ❓ Help
            </button>
          </div>
        </div>

        <div className="game-layout">
          {/* Game Board */}
          <div className="board-section">
            <div className="board-container">
              <div className="board-title">Constitutional Journey Board</div>
              <div className="board-legend">
                🟢 Ladders = Constitutional Values | 🔴 Snakes = Violations | 📜
                Articles = Knowledge
              </div>
              <div className="keyboard-hint">
                💡 Press SPACEBAR to roll dice | ESC to close popups
              </div>

              <div className="board-wrapper">
                <div className="relative">
                  {/* Board grid */}
                  <div className="board-grid">{renderBoard()}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Game Controls */}
          <div className="controls-section">
            <div className="controls-panel">
              <h3 className="controls-title">Game Controls</h3>

              {/* Dice */}
              <div className="dice-container">
                <div className={`dice ${isRolling ? "rolling" : ""}`}>
                  {isRolling ? "⚡" : diceValue}
                </div>

                <button
                  onClick={rollDice}
                  disabled={isRolling || gameCompleted}
                  className="dice-button"
                >
                  {isRolling ? "Rolling..." : "Roll Chakra 🎲"}
                </button>
              </div>

              {/* Game Status */}
              <div className="game-stats">
                <div className="stat-row">
                  <span className="stat-label">🎯 Position:</span>
                  <span className="stat-value">{playerPosition}/100</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">✅ Rights Used:</span>
                  <span className="stat-value">{rightsUsed}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">❌ Duties Missed:</span>
                  <span className="stat-value">{dutiesMissed}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">📚 Articles Learned:</span>
                  <span className="stat-value">
                    {articlesEncountered.length}
                  </span>
                </div>
              </div>

              {/* Game Message */}
              <div className="game-message">
                <p className="message-text">{gameMessage}</p>
              </div>

              {/* Reset Button */}
              <button onClick={resetGame} className="reset-button">
                🔄 Reset Game
              </button>
            </div>

            {/* Progress */}
            <div className="progress-panel">
              <h4 className="progress-title">Progress</h4>
              <div className="progress-bar-container">
                <div
                  className="progress-bar"
                  style={{ width: `${playerPosition}%` }}
                ></div>
              </div>
              <p className="progress-text">{playerPosition}% Complete</p>
            </div>
          </div>
        </div>
      </div>
      {/* Event Popup */}
      {showPopup && currentEvent && (
        <div className="popup-overlay">
          <div className="popup-content">
            <div className="popup-title">📜 {currentEvent.title}</div>
            <p className="popup-description">{currentEvent.description}</p>

            {currentEvent.article && (
              <div className="popup-article">
                <p>
                  <strong>Article:</strong> {currentEvent.article}
                </p>
              </div>
            )}

            <button onClick={closePopup} className="popup-button">
              Continue Journey
            </button>
          </div>
        </div>
      )}

      {/* Game Completion Modal */}
      {gameCompleted && (
        <div className="popup-overlay">
          <div className="completion-modal">
            <h2 className="completion-title">
              🏆 Constitutional Journey Complete! 🇮🇳
            </h2>
            <p className="completion-subtitle">
              Congratulations! You've mastered the Constitution of India!
            </p>

            <div className="summary-panel">
              <h3 className="summary-title">Journey Summary:</h3>
              <div className="summary-stats">
                <div className="summary-stat">✅ Rights Used: {rightsUsed}</div>
                <div className="summary-stat">
                  ❌ Duties Missed: {dutiesMissed}
                </div>
                <div className="summary-stat">
                  📚 Articles Learned: {articlesEncountered.length}
                </div>
                <div className="summary-stat">
                  🎯 Constitutional Knowledge:{" "}
                  {Math.round(
                    (rightsUsed / (rightsUsed + dutiesMissed)) * 100
                  ) || 100}
                  %
                </div>
              </div>
            </div>

            <div className="completion-buttons">
              <button
                onClick={resetGame}
                className="completion-button play-again-button"
              >
                🔄 Play Again
              </button>
              <button
                onClick={onBackToHub}
                className="completion-button back-to-arcade-button"
              >
                🏠 Back to Arcade
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Help Modal */}
      {showHelp && (
        <div className="popup-overlay">
          <div className="help-modal">
            <div className="help-header">
              <h2 className="help-title">
                🎓 Constitutional Snakes & Ladders Guide
              </h2>
              <button
                onClick={() => setShowHelp(false)}
                className="help-close-button"
              >
                ✕
              </button>
            </div>

            <div className="help-content">
              <div className="help-section">
                <h3 className="help-section-title">🎮 How to Play</h3>
                <div className="help-text">
                  <p>
                    <strong>Objective:</strong> Navigate from square 1 to 100
                    while learning about the Indian Constitution!
                  </p>
                  <ul>
                    <li>
                      <strong>🎲 Roll the Dice:</strong> Click "Roll Chakra" or
                      press SPACEBAR to move
                    </li>
                    <li>
                      <strong>🪜 Green Ladders:</strong> Constitutional rights
                      and values that help you advance
                    </li>
                    <li>
                      <strong>🐍 Red Snakes:</strong> Constitutional violations
                      that set you back
                    </li>
                    <li>
                      <strong>📜 Knowledge Squares:</strong> Click squares with
                      scroll icons to learn constitutional facts
                    </li>
                    <li>
                      <strong>🏆 Victory:</strong> Reach square 100 to complete
                      your constitutional journey!
                    </li>
                  </ul>
                </div>
              </div>

              <div className="help-section">
                <h3 className="help-section-title">
                  🔢 Understanding the Numbered Emojis
                </h3>
                <div className="help-text">
                  <p>
                    Each snake and ladder has matching numbers to show
                    connections:
                  </p>
                  <ul>
                    <li>
                      <strong>🪜1 →14:</strong> Ladder 1 starts at square 4 and
                      ends at square 14
                    </li>
                    <li>
                      <strong>🐍3 →19:</strong> Snake 3 starts at square 62 and
                      ends at square 19
                    </li>
                    <li>
                      <strong>Start squares</strong> show: Emoji + Number +
                      Arrow + Destination
                    </li>
                    <li>
                      <strong>End squares</strong> show: Emoji + Number only
                    </li>
                  </ul>
                </div>
              </div>

              <div className="help-section">
                <h3 className="help-section-title">
                  🇮🇳 About the Indian Constitution
                </h3>
                <div className="help-text">
                  <p>
                    The Constitution of India is the supreme law of India,
                    adopted on 26th January 1950.
                  </p>
                  <ul>
                    <li>
                      <strong>📜 World's Longest:</strong> Contains 395 articles
                      in 22 parts and 12 schedules
                    </li>
                    <li>
                      <strong>⚖️ Fundamental Rights:</strong> Articles 12-35
                      guarantee basic human rights
                    </li>
                    <li>
                      <strong>🏛️ Fundamental Duties:</strong> Article 51A lists
                      11 duties of citizens
                    </li>
                    <li>
                      <strong>🎯 Directive Principles:</strong> Articles 36-51
                      guide government policy
                    </li>
                    <li>
                      <strong>👨‍⚖️ Dr. B.R. Ambedkar:</strong> Chairman of the
                      Drafting Committee, "Father of Indian Constitution"
                    </li>
                  </ul>
                </div>
              </div>

              <div className="help-section">
                <h3 className="help-section-title">
                  🪜 Constitutional Ladders (Rights & Values)
                </h3>
                <div className="help-grid">
                  <div className="help-item">
                    <span className="help-emoji">🪜1</span>
                    <div>
                      <strong>Article 21: Right to Life</strong>
                      <p>Most fundamental right - right to live with dignity</p>
                    </div>
                  </div>
                  <div className="help-item">
                    <span className="help-emoji">🪜2</span>
                    <div>
                      <strong>Article 19: Freedom of Speech</strong>
                      <p>Freedom of speech and expression</p>
                    </div>
                  </div>
                  <div className="help-item">
                    <span className="help-emoji">🪜3</span>
                    <div>
                      <strong>Article 15: Right to Equality</strong>
                      <p>Prohibition of discrimination</p>
                    </div>
                  </div>
                  <div className="help-item">
                    <span className="help-emoji">🪜4</span>
                    <div>
                      <strong>Article 32: Constitutional Remedies</strong>
                      <p>Right to constitutional remedies - "Heart and Soul"</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="help-section">
                <h3 className="help-section-title">
                  🐍 Constitutional Snakes (Violations)
                </h3>
                <div className="help-grid">
                  <div className="help-item">
                    <span className="help-emoji">🐍1</span>
                    <div>
                      <strong>Article 14 Violated</strong>
                      <p>Equality before law violated</p>
                    </div>
                  </div>
                  <div className="help-item">
                    <span className="help-emoji">🐍2</span>
                    <div>
                      <strong>Disrespecting National Flag</strong>
                      <p>Violation of national symbols</p>
                    </div>
                  </div>
                  <div className="help-item">
                    <span className="help-emoji">🐍3</span>
                    <div>
                      <strong>Breaking Rule of Law</strong>
                      <p>Justice delayed is justice denied</p>
                    </div>
                  </div>
                  <div className="help-item">
                    <span className="help-emoji">🐍5</span>
                    <div>
                      <strong>Spreading Misinformation</strong>
                      <p>False information harms democracy</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="help-section">
                <h3 className="help-section-title">⌨️ Keyboard Controls</h3>
                <div className="help-text">
                  <ul>
                    <li>
                      <strong>SPACEBAR:</strong> Roll the dice
                    </li>
                    <li>
                      <strong>ESC:</strong> Close popups and help
                    </li>
                    <li>
                      <strong>Click squares:</strong> Learn constitutional facts
                    </li>
                  </ul>
                </div>
              </div>

              <div className="help-section">
                <h3 className="help-section-title">🎯 Educational Goals</h3>
                <div className="help-text">
                  <p>This game aims to:</p>
                  <ul>
                    <li>Make constitutional learning fun and interactive</li>
                    <li>Teach fundamental rights and duties</li>
                    <li>Promote constitutional awareness among citizens</li>
                    <li>
                      Encourage civic responsibility and democratic values
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="help-footer">
              <button
                onClick={() => setShowHelp(false)}
                className="help-got-it-button"
              >
                Got it! Let's Play 🎮
              </button>
            </div>
          </div>
        </div>
      )}
      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Tiro+Devanagari+Hindi:wght@400;700&family=Hind:wght@400;600;700&display=swap");

        .constitutional-snakes-ladders {
          min-height: 100vh;
          background: linear-gradient(135deg, #fff8dc, #f5e6d3);
          background-image: radial-gradient(
              circle at 25% 25%,
              rgba(255, 153, 51, 0.1) 0%,
              transparent 50%
            ),
            radial-gradient(
              circle at 75% 75%,
              rgba(19, 136, 8, 0.1) 0%,
              transparent 50%
            ),
            url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4af37' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
          font-family: "Cinzel", serif;
          padding: 20px;
        }

        .game-container {
          max-width: 1400px;
          margin: 0 auto;
        }

        .game-header {
          text-align: center;
          margin-bottom: 30px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 30px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          border: 3px solid #d4af37;
        }

        .game-title {
          font-size: 3rem;
          font-weight: 700;
          color: #8b4513;
          margin-bottom: 15px;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
          background: linear-gradient(135deg, #ff9933, #138808);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .game-subtitle {
          font-size: 1.3rem;
          color: #654321;
          margin-bottom: 20px;
          font-weight: 500;
        }

        .header-controls {
          display: flex;
          gap: 15px;
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;
        }

        .back-button,
        .sound-button,
        .help-button {
          background: linear-gradient(135deg, #8b4513, #654321);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 25px;
          font-family: "Cinzel", serif;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        .help-button {
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
        }

        .sound-button.sound-off {
          background: linear-gradient(135deg, #666, #444);
        }

        .back-button:hover,
        .sound-button:hover,
        .help-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
        }

        /* Help Modal Styles */
        .help-modal {
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(15px);
          border-radius: 20px;
          max-width: 800px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          border: 3px solid #d4af37;
        }

        .help-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 30px;
          border-bottom: 2px solid rgba(212, 175, 55, 0.3);
          background: linear-gradient(135deg, rgba(255, 153, 51, 0.1), rgba(19, 136, 8, 0.1));
        }

        .help-title {
          font-size: 1.8rem;
          font-weight: 700;
          color: #8b4513;
          margin: 0;
          background: linear-gradient(135deg, #ff9933, #138808);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .help-close-button {
          background: #dc3545;
          color: white;
          border: none;
          width: 35px;
          height: 35px;
          border-radius: 50%;
          font-size: 18px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .help-close-button:hover {
          background: #c82333;
          transform: scale(1.1);
        }

        .help-content {
          padding: 20px 30px;
          max-height: 60vh;
          overflow-y: auto;
        }

        .help-section {
          margin-bottom: 25px;
          padding-bottom: 20px;
          border-bottom: 1px solid rgba(212, 175, 55, 0.2);
        }

        .help-section:last-child {
          border-bottom: none;
        }

        .help-section-title {
          font-size: 1.3rem;
          font-weight: 700;
          color: #8b4513;
          margin-bottom: 15px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .help-text {
          color: #654321;
          line-height: 1.6;
        }

        .help-text p {
          margin-bottom: 12px;
        }

        .help-text ul {
          margin: 10px 0;
          padding-left: 20px;
        }

        .help-text li {
          margin-bottom: 8px;
        }

        .help-text strong {
          color: #8b4513;
          font-weight: 600;
        }

        .help-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 15px;
          margin-top: 15px;
        }

        .help-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 15px;
          background: rgba(212, 175, 55, 0.1);
          border-radius: 12px;
          border: 1px solid rgba(212, 175, 55, 0.3);
        }

        .help-emoji {
          font-size: 1.5rem;
          background: #22c55e;
          color: white;
          padding: 8px 12px;
          border-radius: 8px;
          font-weight: bold;
          min-width: 50px;
          text-align: center;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }

        .help-item .help-emoji {
          background: #22c55e;
        }

        .help-item:nth-child(n+5) .help-emoji {
          background: #ef4444;
        }

        .help-item div {
          flex: 1;
        }

        .help-item strong {
          display: block;
          color: #8b4513;
          font-weight: 700;
          margin-bottom: 5px;
        }

        .help-item p {
          color: #654321;
          font-size: 0.9rem;
          margin: 0;
        }

        .help-footer {
          padding: 20px 30px;
          border-top: 2px solid rgba(212, 175, 55, 0.3);
          background: rgba(212, 175, 55, 0.05);
          text-align: center;
        }

        .help-got-it-button {
          background: linear-gradient(135deg, #ff9933, #138808);
          color: white;
          border: none;
          padding: 15px 30px;
          border-radius: 25px;
          font-family: "Cinzel", serif;
          font-weight: 600;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        .help-got-it-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
        }

        /* Responsive Help Modal */
        @media (max-width: 768px) {
          .help-modal {
            width: 95%;
            max-height: 95vh;
          }

          .help-header {
            padding: 15px 20px;
          }

          .help-title {
            font-size: 1.4rem;
          }

          .help-content {
            padding: 15px 20px;
          }

          .help-section-title {
            font-size: 1.1rem;
          }

          .help-grid {
            grid-template-columns: 1fr;
          }

          .help-footer {
            padding: 15px 20px;
          }
        }

        .keyboard-hint {
          text-align: center;
          font-size: 0.8rem;
          color: #8b4513;
          margin-bottom: 15px;
          padding: 8px;
          background: rgba(255, 193, 7, 0.1);
          border-radius: 8px;
          border: 1px solid rgba(255, 193, 7, 0.3);
        }

        .game-layout {
          display: flex;
          gap: 30px;
          align-items: flex-start;
        }

        .board-section {
          flex: 1;
        }

        .board-container {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(15px);
          border-radius: 20px;
          padding: 30px;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
          border: 3px solid #d4af37;
        }

        .board-title {
          font-size: 2rem;
          font-weight: 700;
          color: #8b4513;
          text-align: center;
          margin-bottom: 15px;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
        }

        .board-legend {
          text-align: center;
          font-size: 0.9rem;
          color: #654321;
          margin-bottom: 15px;
          padding: 10px;
          background: rgba(212, 175, 55, 0.1);
          border-radius: 10px;
          border: 1px solid rgba(212, 175, 55, 0.3);
        }

        .board-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden; /* Clip lines that extend beyond board */
        }

        /* Board Grid */
        .board-grid {
          display: grid;
          grid-template-columns: repeat(10, 60px);
          grid-template-rows: repeat(10, 60px);
          gap: 2px;
          padding: 20px;
          background: linear-gradient(135deg, #fff8dc, #f5e6d3);
          border-radius: 15px;
          border: 3px solid #d4af37;
          box-shadow: inset 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        /* Board Square Styles */
        .board-square {
          position: relative;
          width: 60px;
          height: 60px;
          border: 2px solid #d4af37;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          transition: all 0.3s ease;
          cursor: pointer;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          background-image: radial-gradient(circle at 20% 20%, rgba(212, 175, 55, 0.1) 0%, transparent 50%);
        }

        .board-square:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .square-number {
          z-index: 20;
          color: #8b4513;
          font-weight: bold;
          font-size: 14px;
          text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.8);
        }

        .square-label {
          position: absolute;
          top: 2px;
          left: 2px;
          font-size: 8px;
          font-weight: bold;
          padding: 2px 4px;
          border-radius: 4px;
          z-index: 25;
        }

        .start-label {
          background: #28a745;
          color: white;
        }

        .win-label {
          background: #ffc107;
          color: #212529;
        }

        .fact-indicator {
          position: absolute;
          top: 2px;
          right: 2px;
          font-size: 10px;
          z-index: 25;
        }

        .snake-ladder-indicator {
          position: absolute;
          bottom: 2px;
          right: 2px;
          z-index: 25;
        }

        .snake-indicator {
          width: 16px;
          height: 16px;
          background: #dc3545;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .snake-indicator span {
          color: white;
          font-size: 10px;
          font-weight: bold;
        }

        .ladder-indicator {
          width: 16px;
          height: 16px;
          background: #28a745;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ladder-indicator span {
          color: white;
          font-size: 10px;
          font-weight: bold;
        }

        .player-token {
          position: absolute;
          top: -8px;
          right: -8px;
          z-index: 30;
        }

        .player-avatar {
          width: 32px;
          height: 32px;
          background: #ff9933;
          border: 2px solid white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          animation: bounce 2s infinite;
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
          }
        }

        .controls-section {
          width: 350px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .controls-panel {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 25px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          border: 2px solid #d4af37;
        }

        .controls-title {
          font-size: 1.3rem;
          font-weight: 700;
          color: #8b4513;
          text-align: center;
          margin-bottom: 20px;
        }

        .dice-container {
          text-align: center;
          margin-bottom: 25px;
        }

        .dice {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #ff9933, #138808);
          border: 4px solid #d4af37;
          border-radius: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          font-weight: bold;
          color: white;
          margin: 0 auto 15px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
          transition: all 0.3s ease;
        }

        .dice.rolling {
          animation: roll 0.1s infinite;
        }

        @keyframes roll {
          0% { transform: rotate(0deg); }
          25% { transform: rotate(90deg); }
          50% { transform: rotate(180deg); }
          75% { transform: rotate(270deg); }
          100% { transform: rotate(360deg); }
        }

        .dice-button {
          background: linear-gradient(135deg, #ff9933, #138808);
          color: white;
          border: none;
          padding: 15px 30px;
          border-radius: 25px;
          font-family: "Cinzel", serif;
          font-weight: 600;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
          width: 100%;
        }

        .dice-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
        }

        .dice-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .game-stats {
          margin-bottom: 20px;
        }

        .stat-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid rgba(212, 175, 55, 0.2);
        }

        .stat-label {
          font-weight: 600;
          color: #654321;
        }

        .stat-value {
          font-weight: 700;
          color: #8b4513;
          background: rgba(212, 175, 55, 0.2);
          padding: 4px 8px;
          border-radius: 8px;
        }

        .game-message {
          background: rgba(255, 193, 7, 0.1);
          border: 2px solid rgba(255, 193, 7, 0.3);
          border-radius: 12px;
          padding: 15px;
          margin-bottom: 20px;
        }

        .message-text {
          color: #8b4513;
          font-weight: 600;
          text-align: center;
          margin: 0;
        }

        .reset-button {
          background: linear-gradient(135deg, #dc3545, #c82333);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 25px;
          font-family: "Cinzel", serif;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
          width: 100%;
        }

        .reset-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
        }

        .progress-panel {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          border: 2px solid #d4af37;
        }

        .progress-title {
          font-size: 1.2rem;
          font-weight: 700;
          color: #8b4513;
          text-align: center;
          margin-bottom: 15px;
        }

        .progress-bar-container {
          background: rgba(212, 175, 55, 0.2);
          border-radius: 25px;
          height: 20px;
          overflow: hidden;
          margin-bottom: 10px;
        }

        .progress-bar {
          background: linear-gradient(135deg, #ff9933, #138808);
          height: 100%;
          border-radius: 25px;
          transition: width 0.5s ease;
        }

        .progress-text {
          text-align: center;
          color: #654321;
          font-weight: 600;
          margin: 0;
        }

        .popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(5px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .popup-content {
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(15px);
          border-radius: 20px;
          padding: 30px;
          max-width: 500px;
          width: 100%;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          border: 3px solid #d4af37;
          text-align: center;
        }

        .popup-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #8b4513;
          margin-bottom: 15px;
        }

        .popup-description {
          font-size: 1.1rem;
          color: #654321;
          margin-bottom: 20px;
          line-height: 1.6;
        }

        .popup-article {
          background: rgba(212, 175, 55, 0.1);
          border: 2px solid rgba(212, 175, 55, 0.3);
          border-radius: 12px;
          padding: 15px;
          margin-bottom: 20px;
        }

        .popup-button {
          background: linear-gradient(135deg, #ff9933, #138808);
          color: white;
          border: none;
          padding: 15px 30px;
          border-radius: 25px;
          font-family: "Cinzel", serif;
          font-weight: 600;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        .popup-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
        }

        .completion-modal {
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(15px);
          border-radius: 20px;
          padding: 40px;
          max-width: 600px;
          width: 100%;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          border: 3px solid #d4af37;
          text-align: center;
        }

        .completion-title {
          font-size: 2rem;
          font-weight: 700;
          color: #8b4513;
          margin-bottom: 15px;
          background: linear-gradient(135deg, #ff9933, #138808);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .completion-subtitle {
          font-size: 1.2rem;
          color: #654321;
          margin-bottom: 25px;
        }

        .summary-panel {
          background: rgba(212, 175, 55, 0.1);
          border: 2px solid rgba(212, 175, 55, 0.3);
          border-radius: 15px;
          padding: 20px;
          margin-bottom: 25px;
        }

        .summary-title {
          font-size: 1.3rem;
          font-weight: 700;
          color: #8b4513;
          margin-bottom: 15px;
        }

        .summary-stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .summary-stat {
          background: rgba(255, 255, 255, 0.8);
          padding: 10px;
          border-radius: 8px;
          font-weight: 600;
          color: #654321;
        }

        .completion-buttons {
          display: flex;
          gap: 15px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .completion-button {
          border: none;
          padding: 15px 25px;
          border-radius: 25px;
          font-family: "Cinzel", serif;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        .play-again-button {
          background: linear-gradient(135deg, #ff9933, #138808);
          color: white;
        }

        .back-to-arcade-button {
          background: linear-gradient(135deg, #8b4513, #654321);
          color: white;
        }

        .completion-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
        }

        @media (max-width: 1200px) {
          .game-layout {
            flex-direction: column;
            gap: 20px;
          }

          .controls-section {
            width: 100%;
          }
        }

        @media (max-width: 768px) {
          .game-title {
            font-size: 2rem;
          }

          .game-subtitle {
            font-size: 1rem;
          }

          .header-controls {
            flex-direction: column;
          }

          .board-grid {
            grid-template-columns: repeat(10, 50px);
            grid-template-rows: repeat(10, 50px);
            padding: 15px;
          }

          .board-square {
            width: 50px;
            height: 50px;
          }

          .square-number {
            font-size: 12px;
          }

          .dice {
            width: 60px;
            height: 60px;
            font-size: 1.5rem;
          }
        }
          justify-content: center;
        }

        .controls-section {
          width: 350px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        /* Board Grid */
        .board-grid {
          display: grid;
          grid-template-columns: repeat(10, 60px);
          grid-template-rows: repeat(10, 60px);
          gap: 2px;
          padding: 20px;
          background: linear-gradient(135deg, #fff8dc, #f5e6d3);
          border-radius: 15px;
          border: 3px solid #d4af37;
          box-shadow: inset 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        /* Board Square Styles */
        .board-square {
          position: relative;
          width: 60px;
          height: 60px;
          border: 2px solid #d4af37;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          transition: all 0.3s ease;
          cursor: pointer;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          background-image: radial-gradient(circle at 20% 20%, rgba(212, 175, 55, 0.1) 0%, transparent 50%);
        }

        .board-square:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .square-number {
          z-index: 20;
          color: #8b4513;
          font-weight: bold;
          font-size: 14px;
          text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.8);
        }

        .square-label {
          position: absolute;
          top: 2px;
          left: 2px;
          font-size: 8px;
          font-weight: bold;
          padding: 2px 4px;
          border-radius: 4px;
          z-index: 25;
        }

        .start-label {
          background: #28a745;
          color: white;
        }

        .win-label {
          background: #ffc107;
          color: #212529;
        }

        .fact-indicator {
          position: absolute;
          top: 2px;
          right: 2px;
          font-size: 10px;
          z-index: 25;
        }

        .snake-ladder-indicator {
          position: absolute;
          bottom: 2px;
          right: 2px;
          z-index: 25;
        }

        .snake-indicator {
          width: 16px;
          height: 16px;
          background: #dc3545;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .snake-indicator span {
          color: white;
          font-size: 10px;
          font-weight: bold;
        }

        .ladder-indicator {
          width: 16px;
          height: 16px;
          background: #28a745;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ladder-indicator span {
          color: white;
          font-size: 10px;
          font-weight: bold;
        }

        .player-token {
          position: absolute;
          top: -8px;
          right: -8px;
          z-index: 30;
        }

        .player-avatar {
          width: 32px;
          height: 32px;
          background: #ff9933;
          border: 2px solid white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          animation: bounce 2s infinite;
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
          }
        }
          justify-content: center;
          font-weight: bold;
          transition: all 0.3s ease;
          cursor: pointer;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          background-image: radial-gradient(circle at 20% 20%, rgba(212, 175, 55, 0.1) 0%, transparent 50%);
        }

        .board-square:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .square-number {
          z-index: 20;
          color: #8b4513;
          font-weight: bold;
          font-size: 14px;
          text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.8);
        }

        .square-label {
          position: absolute;
          top: 2px;
          left: 2px;
          font-size: 8px;
          font-weight: bold;
          padding: 2px 4px;
          border-radius: 4px;
          z-index: 25;
        }

        .start-label {
          background: #28a745;
          color: white;
        }

        .win-label {
          background: #ffc107;
          color: #212529;
        }

        .fact-indicator {
          position: absolute;
          top: 2px;
          right: 2px;
          font-size: 10px;
          z-index: 25;
        }

        .snake-ladder-indicator {
          position: absolute;
          bottom: 2px;
          right: 2px;
          z-index: 25;
        }

        .snake-indicator {
          width: 16px;
          height: 16px;
          background: #dc3545;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .snake-indicator span {
          color: white;
          font-size: 10px;
          font-weight: bold;
        }

        .ladder-indicator {
          width: 16px;
          height: 16px;
          background: #28a745;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ladder-indicator span {
          color: white;
          font-size: 10px;
          font-weight: bold;
        }

        .player-token {
          position: absolute;
          top: -8px;
          right: -8px;
          z-index: 30;
        }

        .player-avatar {
          width: 32px;
          height: 32px;
          background: #ff9933;
          border: 2px solid white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          animation: bounce 2s infinite;
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
          }
        }
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .controls-panel {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(15px);
          border-radius: 20px;
          padding: 25px;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
          border: 3px solid #d4af37;
        }

        .controls-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #8b4513;
          margin-bottom: 20px;
          text-align: center;
        }

        .dice-container {
          text-align: center;
          margin-bottom: 25px;
        }

        .dice {
          width: 80px;
          height: 80px;
          margin: 0 auto 20px;
          background: linear-gradient(135deg, #1e40af, #1e3a8a);
          border-radius: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 2rem;
          font-weight: bold;
          box-shadow: 0 8px 25px rgba(30, 64, 175, 0.4);
          transition: all 0.3s ease;
          border: 3px solid #3b82f6;
        }

        .dice.rolling {
          animation: spin 1s linear infinite;
        }

        .dice-button {
          background: linear-gradient(135deg, #ff9933, #138808);
          color: white;
          border: none;
          padding: 15px 30px;
          border-radius: 25px;
          font-family: "Cinzel", serif;
          font-weight: 700;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
        }

        .dice-button:hover:not(:disabled) {
          transform: translateY(-3px) scale(1.05);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .dice-button:disabled {
          background: #cccccc;
          cursor: not-allowed;
          transform: none;
        }

        .game-stats {
          display: grid;
          gap: 12px;
          margin-bottom: 20px;
        }

        .stat-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 12px;
          background: rgba(212, 175, 55, 0.1);
          border-radius: 8px;
          border: 1px solid rgba(212, 175, 55, 0.3);
        }

        .stat-label {
          font-weight: 600;
          color: #654321;
        }

        .stat-value {
          font-weight: bold;
          color: #8b4513;
        }

        .game-message {
          background: linear-gradient(135deg, #fff8dc, #f5e6d3);
          border: 2px solid #d4af37;
          border-radius: 12px;
          padding: 15px;
          text-align: center;
          margin-bottom: 20px;
          box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.1);
        }

        .message-text {
          color: #8b4513;
          font-weight: 600;
          font-size: 0.95rem;
        }

        .reset-button {
          width: 100%;
          background: linear-gradient(135deg, #dc2626, #b91c1c);
          color: white;
          border: none;
          padding: 12px;
          border-radius: 12px;
          font-family: "Cinzel", serif;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(220, 38, 38, 0.3);
        }

        .reset-button:hover {
          background: linear-gradient(135deg, #b91c1c, #991b1b);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(220, 38, 38, 0.4);
        }

        .progress-panel {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(15px);
          border-radius: 20px;
          padding: 20px;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
          border: 3px solid #d4af37;
        }

        .progress-title {
          font-weight: 700;
          color: #8b4513;
          margin-bottom: 15px;
          text-align: center;
        }

        .progress-bar-container {
          width: 100%;
          height: 12px;
          background: #e5e7eb;
          border-radius: 6px;
          margin-bottom: 10px;
          overflow: hidden;
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #ff9933, #138808);
          border-radius: 6px;
          transition: width 0.5s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }

        .progress-text {
          text-align: center;
          font-size: 0.85rem;
          color: #654321;
          font-weight: 600;
        }

        .popup-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
          backdrop-filter: blur(5px);
        }

        .popup-content {
          background: white;
          border-radius: 20px;
          padding: 30px;
          max-width: 500px;
          width: 100%;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
          border: 3px solid #d4af37;
          text-align: center;
          animation: popup-enter 0.3s ease-out;
        }

        .popup-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #8b4513;
          margin-bottom: 15px;
        }

        .popup-description {
          color: #654321;
          margin-bottom: 20px;
          line-height: 1.6;
        }

        .popup-article {
          background: rgba(212, 175, 55, 0.1);
          padding: 15px;
          border-radius: 12px;
          border: 1px solid rgba(212, 175, 55, 0.3);
          margin-bottom: 20px;
        }

        .popup-button {
          background: linear-gradient(135deg, #8b4513, #654321);
          color: white;
          border: none;
          padding: 12px 25px;
          border-radius: 25px;
          font-family: "Cinzel", serif;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        .popup-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
        }

        .completion-modal {
          background: white;
          border-radius: 25px;
          padding: 40px;
          max-width: 600px;
          width: 100%;
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.3);
          border: 4px solid #ffd700;
          text-align: center;
          animation: celebration 0.5s ease-out;
        }

        .completion-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #daa520;
          margin-bottom: 20px;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }

        .completion-subtitle {
          font-size: 1.3rem;
          color: #8b4513;
          margin-bottom: 30px;
        }

        .summary-panel {
          background: rgba(212, 175, 55, 0.1);
          padding: 20px;
          border-radius: 15px;
          border: 2px solid rgba(212, 175, 55, 0.3);
          margin-bottom: 30px;
        }

        .summary-title {
          font-weight: 700;
          color: #8b4513;
          margin-bottom: 15px;
        }

        .summary-stats {
          display: grid;
          gap: 8px;
          text-align: left;
        }

        .summary-stat {
          color: #654321;
          font-size: 0.95rem;
        }

        .completion-buttons {
          display: flex;
          gap: 15px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .completion-button {
          padding: 12px 25px;
          border: none;
          border-radius: 25px;
          font-family: "Cinzel", serif;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        .play-again-button {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
        }

        .back-to-arcade-button {
          background: linear-gradient(135deg, #8b4513, #654321);
          color: white;
        }

        .completion-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
        }

        @keyframes bounce {
          0%,
          20%,
          50%,
          80%,
          100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-5px);
          }
          60% {
            transform: translateY(-3px);
          }
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes popup-enter {
          from {
            opacity: 0;
            transform: scale(0.8) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes celebration {
          from {
            opacity: 0;
            transform: scale(0.5) rotate(-10deg);
          }
          to {
            opacity: 1;
            transform: scale(1) rotate(0deg);
          }
        }

        @media (max-width: 1200px) {
          .game-layout {
            flex-direction: column;
          }

          .controls-section {
            width: 100%;
          }
        }

        @media (max-width: 768px) {
          .game-title {
            font-size: 2rem;
          }

          .dice {
            width: 60px;
            height: 60px;
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ConstitutionalSnakesLadders;
