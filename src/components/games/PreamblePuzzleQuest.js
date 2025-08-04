import React, { useState, useEffect } from "react";

const PreamblePuzzleQuest = ({ onBackToHub }) => {
  const PREAMBLE_WORDS = [
    "WE",
    "THE",
    "PEOPLE",
    "of",
    "India",
    "having",
    "solemnly",
    "resolved",
    "to",
    "constitute",
    "India",
    "into",
    "a",
    "SOVEREIGN",
    "SOCIALIST",
    "SECULAR",
    "DEMOCRATIC",
    "REPUBLIC",
    "and",
    "to",
    "secure",
    "to",
    "all",
    "its",
    "citizens",
    "JUSTICE",
    "social",
    "economic",
    "and",
    "political",
    "LIBERTY",
    "of",
    "thought",
    "expression",
    "belief",
    "faith",
    "and",
    "worship",
    "EQUALITY",
    "of",
    "status",
    "and",
    "of",
    "opportunity",
    "and",
    "to",
    "promote",
    "among",
    "them",
    "all",
    "FRATERNITY",
  ];

  const [shuffledWords, setShuffledWords] = useState([]);
  const [placedWords, setPlacedWords] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes
  const [gameComplete, setGameComplete] = useState(false);
  const [gameMode, setGameMode] = useState("normal"); // normal, timeAttack
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    resetGame();
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && !gameComplete && gameMode === "timeAttack") {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, gameComplete, gameMode]);

  const resetGame = () => {
    // Create a shuffled copy of the words
    const shuffled = [...PREAMBLE_WORDS].sort(() => Math.random() - 0.5);
    setShuffledWords(shuffled);
    setPlacedWords(new Array(PREAMBLE_WORDS.length).fill(null));
    setScore(0);
    setTimeLeft(180);
    setGameComplete(false);
    setHintsUsed(0);
  };

  const useHint = () => {
    const nextSlotIndex = getNextSlotIndex();
    if (nextSlotIndex === -1) return; // No more slots to fill

    const correctWord = PREAMBLE_WORDS[nextSlotIndex];
    const wordIndex = shuffledWords.findIndex((word) => word === correctWord);

    if (wordIndex !== -1) {
      // Deduct points for using hint
      setScore((prevScore) => Math.max(0, prevScore - 5));
      setHintsUsed((prev) => prev + 1);

      // Place the correct word using hint (no additional scoring in handleWordClick)
      handleWordClick(correctWord, wordIndex, true); // Pass true to indicate hint usage
    }
  };

  const handleWordClick = (word, index, isHint = false) => {
    if (!word) return; // Skip if word is null (already used)

    const newPlacedWords = [...placedWords];
    const newShuffledWords = [...shuffledWords];

    // Find the next empty slot in order
    const nextEmptySlot = newPlacedWords.findIndex((slot) => slot === null);

    if (nextEmptySlot !== -1) {
      // Place the word in the next available slot
      newPlacedWords[nextEmptySlot] = word;
      newShuffledWords[index] = null;

      // Apply scoring based on new requirements (only if not using hint)
      if (!isHint) {
        if (word === PREAMBLE_WORDS[nextEmptySlot]) {
          // Correct answer without hint: +10 points
          setScore((prevScore) => prevScore + 10);
        } else {
          // Wrong answer: -2.5 points
          setScore((prevScore) => Math.max(0, prevScore - 2.5));
        }
      }
      // Note: If hint is used, 5 points are already deducted in useHint function

      setPlacedWords(newPlacedWords);
      setShuffledWords(newShuffledWords);

      // Check if game complete
      const isComplete = newPlacedWords.every(
        (placedWord, idx) => placedWord === PREAMBLE_WORDS[idx]
      );
      if (isComplete) {
        setGameComplete(true);
        const bonusPoints = gameMode === "timeAttack" ? timeLeft * 3 : 100;
        setScore((prevScore) => prevScore + bonusPoints);
      }
    }
  };

  const handlePlacedWordClick = (word, slotIndex) => {
    const newPlacedWords = [...placedWords];
    const newShuffledWords = [...shuffledWords];

    // Find first empty spot in shuffled area
    const emptyIndex = newShuffledWords.findIndex((w) => w === null);
    if (emptyIndex !== -1) {
      newShuffledWords[emptyIndex] = word;
      newPlacedWords[slotIndex] = null;

      setPlacedWords(newPlacedWords);
      setShuffledWords(newShuffledWords);

      // Deduct points for removing a word
      setScore((prevScore) => Math.max(0, prevScore - 3));
    }
  };

  const getWordColor = (word, index) => {
    if (placedWords[index] === PREAMBLE_WORDS[index]) {
      return "#138808"; // Correct - Green
    } else if (
      placedWords[index] &&
      placedWords[index] !== PREAMBLE_WORDS[index]
    ) {
      return "#8B0000"; // Incorrect - Red
    }
    return "#000080"; // Default - Navy
  };

  const getNextSlotIndex = () => {
    return placedWords.findIndex((slot) => slot === null);
  };

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "1200px",
        margin: "0 auto",
        minHeight: "100vh",
        background: "var(--parchment)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
          paddingBottom: "20px",
          borderBottom: "3px solid var(--gold)",
        }}
      >
        <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
          <button
            onClick={onBackToHub}
            style={{
              background: "var(--navy-blue)",
              color: "var(--white)",
              border: "none",
              padding: "12px 24px",
              borderRadius: "25px",
              fontFamily: "Cinzel, serif",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            ← Back to Hub
          </button>
          <button
            onClick={() => setShowHelp(true)}
            style={{
              background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
              color: "var(--white)",
              border: "none",
              padding: "12px 24px",
              borderRadius: "25px",
              fontFamily: "Cinzel, serif",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            ❓ Help
          </button>
        </div>
        <h2
          style={{
            fontSize: "2.5rem",
            color: "var(--navy-blue)",
            margin: "0",
            textAlign: "center",
          }}
        >
          Preamble Puzzle Quest 🧩
        </h2>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: "5px",
          }}
        >
          <div
            style={{
              color: "var(--saffron)",
              fontWeight: "600",
              fontSize: "1.2rem",
            }}
          >
            Score: {score}
          </div>
          {gameMode === "timeAttack" && (
            <div style={{ color: "var(--navy-blue)", fontWeight: "600" }}>
              Time: {Math.floor(timeLeft / 60)}:
              {(timeLeft % 60).toString().padStart(2, "0")}
            </div>
          )}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "15px",
          marginBottom: "30px",
        }}
      >
        <button
          onClick={() => {
            setGameMode("normal");
            resetGame();
          }}
          style={{
            padding: "10px 20px",
            fontSize: "1rem",
            fontWeight: "600",
            border: `3px solid var(--gold)`,
            borderRadius: "20px",
            background: gameMode === "normal" ? "var(--gold)" : "var(--white)",
            color: gameMode === "normal" ? "var(--white)" : "var(--navy-blue)",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
        >
          Normal Mode
        </button>
        <button
          onClick={() => {
            setGameMode("timeAttack");
            resetGame();
          }}
          style={{
            padding: "10px 20px",
            fontSize: "1rem",
            fontWeight: "600",
            border: `3px solid var(--saffron)`,
            borderRadius: "20px",
            background:
              gameMode === "timeAttack" ? "var(--saffron)" : "var(--white)",
            color:
              gameMode === "timeAttack" ? "var(--white)" : "var(--navy-blue)",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
        >
          Time Attack
        </button>
      </div>

      {/* Progress and Hint Section */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "20px",
          marginBottom: "20px",
        }}
      >
        {/* Progress Indicator */}
        <div
          style={{
            background: "var(--white)",
            border: "2px solid var(--gold)",
            borderRadius: "15px",
            padding: "15px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              color: "var(--navy-blue)",
              marginBottom: "10px",
              fontWeight: "600",
            }}
          >
            Progress: {placedWords.filter((word) => word !== null).length} /{" "}
            {PREAMBLE_WORDS.length} words placed
          </div>
          <div
            style={{
              width: "100%",
              height: "10px",
              background: "#E0E0E0",
              borderRadius: "5px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${
                  (placedWords.filter((word) => word !== null).length /
                    PREAMBLE_WORDS.length) *
                  100
                }%`,
                background:
                  "linear-gradient(90deg, var(--saffron), var(--gold))",
                transition: "width 0.3s ease",
              }}
            />
          </div>
          {getNextSlotIndex() !== -1 && (
            <div
              style={{
                color: "var(--saffron)",
                marginTop: "10px",
                fontSize: "0.9rem",
                fontStyle: "italic",
              }}
            >
              Next word goes to position {getNextSlotIndex() + 1}
            </div>
          )}
        </div>

        {/* Hint Section */}
        <div
          style={{
            background: "var(--white)",
            border: "2px solid var(--saffron)",
            borderRadius: "15px",
            padding: "15px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              color: "var(--navy-blue)",
              marginBottom: "10px",
              fontWeight: "600",
              fontSize: "0.9rem",
            }}
          >
            💡 Need Help?
          </div>
          <button
            onClick={useHint}
            disabled={getNextSlotIndex() === -1}
            style={{
              background:
                getNextSlotIndex() === -1
                  ? "#ccc"
                  : "linear-gradient(135deg, var(--saffron), var(--gold))",
              color: "var(--white)",
              border: "none",
              padding: "10px 15px",
              borderRadius: "20px",
              fontFamily: "Cinzel, serif",
              fontWeight: "600",
              cursor: getNextSlotIndex() === -1 ? "not-allowed" : "pointer",
              fontSize: "0.9rem",
              marginBottom: "8px",
              opacity: getNextSlotIndex() === -1 ? 0.5 : 1,
              transition: "all 0.3s ease",
            }}
          >
            Use Hint (-5 pts)
          </button>
          <div
            style={{
              color: "var(--dark-brown)",
              fontSize: "0.8rem",
              fontStyle: "italic",
            }}
          >
            Hints used: {hintsUsed}
          </div>
        </div>
      </div>

      {/* Preamble Text Boxes */}
      <div
        style={{
          background: "var(--white)",
          border: "3px solid var(--gold)",
          borderRadius: "20px",
          padding: "30px",
          marginBottom: "30px",
        }}
      >
        <h3
          style={{
            color: "var(--navy-blue)",
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          Tap words below to fill the Preamble in order:
        </h3>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
            lineHeight: "2.5",
            fontSize: "1.1rem",
            justifyContent: "center",
          }}
        >
          {PREAMBLE_WORDS.map((correctWord, index) => (
            <div
              key={index}
              style={{
                minWidth: "80px",
                minHeight: "40px",
                padding: "8px 12px",
                border: `3px solid ${
                  index === getNextSlotIndex()
                    ? "#FF6B6B"
                    : placedWords[index]
                    ? getWordColor(placedWords[index], index)
                    : "#FFD700"
                }`,
                borderRadius: "8px",
                background: placedWords[index]
                  ? "#F0F8FF"
                  : index === getNextSlotIndex()
                  ? "#FFE4E1"
                  : "#FFFACD",
                color: getWordColor(placedWords[index], index),
                textAlign: "center",
                cursor: placedWords[index] ? "pointer" : "default",
                transition: "all 0.3s ease",
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: placedWords[index] ? "600" : "normal",
                boxShadow:
                  index === getNextSlotIndex()
                    ? "0 0 10px rgba(255, 107, 107, 0.5)"
                    : "none",
              }}
              onClick={() =>
                placedWords[index] &&
                handlePlacedWordClick(placedWords[index], index)
              }
            >
              {placedWords[index] ? (
                <span style={{ cursor: "pointer" }}>{placedWords[index]}</span>
              ) : (
                <span
                  style={{
                    opacity: index === getNextSlotIndex() ? 0.8 : 0.5,
                    fontSize: "0.9rem",
                    color: index === getNextSlotIndex() ? "#FF6B6B" : "inherit",
                  }}
                >
                  {index === getNextSlotIndex() ? "NEXT" : index + 1}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Available Words */}
      <div
        style={{
          background: "var(--white)",
          border: "3px solid var(--gold)",
          borderRadius: "20px",
          padding: "30px",
        }}
      >
        <h3
          style={{
            color: "var(--navy-blue)",
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          Available Words (Tap to place in order):
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
            gap: "8px",
            justifyContent: "center",
            alignItems: "center",
            padding: "15px",
            background: "var(--parchment)",
            borderRadius: "15px",
            border: "2px solid var(--gold)",
            maxHeight: "300px",
            overflowY: "auto",
          }}
        >
          {shuffledWords.map((word, index) => (
            <div key={index}>
              {word && (
                <div
                  onClick={() => handleWordClick(word, index)}
                  style={{
                    padding: "12px 16px",
                    background: "var(--white)",
                    border: "2px solid var(--navy-blue)",
                    borderRadius: "10px",
                    textAlign: "center",
                    cursor: "pointer",
                    fontWeight: "600",
                    color: "var(--navy-blue)",
                    transition: "all 0.3s ease",
                    userSelect: "none",
                    minWidth: "100px",
                    fontSize: "1rem",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "translateY(-3px) scale(1.05)";
                    e.target.style.boxShadow = "0 6px 12px rgba(0,0,0,0.2)";
                    e.target.style.background = "var(--saffron)";
                    e.target.style.color = "var(--white)";
                    e.target.style.borderColor = "var(--gold)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "translateY(0) scale(1)";
                    e.target.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
                    e.target.style.background = "var(--white)";
                    e.target.style.color = "var(--navy-blue)";
                    e.target.style.borderColor = "var(--navy-blue)";
                  }}
                >
                  {word}
                </div>
              )}
            </div>
          ))}
          {shuffledWords.filter((word) => word !== null).length === 0 && (
            <div
              style={{
                color: "var(--dark-brown)",
                fontSize: "1.2rem",
                fontStyle: "italic",
                textAlign: "center",
                padding: "40px",
              }}
            >
              🎉 All words have been placed!
            </div>
          )}
        </div>
      </div>

      {gameComplete && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "var(--white)",
              padding: "50px",
              borderRadius: "20px",
              border: "3px solid var(--gold)",
              textAlign: "center",
              maxWidth: "600px",
            }}
          >
            <h3
              style={{
                fontSize: "3rem",
                marginBottom: "20px",
                color: "var(--gold)",
              }}
            >
              🎉 Preamble Mastered!
            </h3>
            <div
              style={{
                fontSize: "1.5rem",
                marginBottom: "20px",
                color: "var(--saffron)",
                fontWeight: "600",
              }}
            >
              Final Score: {score}
            </div>
            <p
              style={{
                fontSize: "1.2rem",
                color: "var(--dark-brown)",
                marginBottom: "20px",
              }}
            >
              You've successfully reconstructed the Preamble of the Indian
              Constitution!
            </p>
            <p
              style={{
                fontSize: "1rem",
                color: "var(--navy-blue)",
                fontStyle: "italic",
                marginBottom: "30px",
              }}
            >
              "The foundation of our democracy lies in these powerful words."
            </p>
            <div
              style={{ display: "flex", gap: "20px", justifyContent: "center" }}
            >
              <button
                onClick={resetGame}
                style={{
                  background:
                    "linear-gradient(135deg, var(--saffron), var(--gold))",
                  color: "var(--white)",
                  border: "none",
                  padding: "15px 30px",
                  borderRadius: "25px",
                  fontFamily: "Cinzel, serif",
                  fontWeight: "600",
                  cursor: "pointer",
                  fontSize: "1.1rem",
                }}
              >
                Play Again
              </button>
              <button
                onClick={onBackToHub}
                style={{
                  background: "var(--navy-blue)",
                  color: "var(--white)",
                  border: "none",
                  padding: "15px 30px",
                  borderRadius: "25px",
                  fontFamily: "Cinzel, serif",
                  fontWeight: "600",
                  cursor: "pointer",
                  fontSize: "1.1rem",
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
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.9)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "var(--white)",
              borderRadius: "20px",
              border: "3px solid var(--gold)",
              maxWidth: "900px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              position: "relative",
            }}
          >
            {/* Help Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "20px 30px",
                borderBottom: "2px solid var(--gold)",
                background: "var(--parchment)",
              }}
            >
              <h2
                style={{
                  fontSize: "1.8rem",
                  color: "var(--navy-blue)",
                  margin: "0",
                }}
              >
                🧩 Preamble Puzzle Quest Guide
              </h2>
              <button
                onClick={() => setShowHelp(false)}
                style={{
                  background: "#dc3545",
                  color: "white",
                  border: "none",
                  width: "35px",
                  height: "35px",
                  borderRadius: "50%",
                  fontSize: "18px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
              >
                ✕
              </button>
            </div>

            {/* Help Content */}
            <div style={{ padding: "20px 30px" }}>
              {/* How to Play Section */}
              <div style={{ marginBottom: "25px" }}>
                <h3
                  style={{
                    fontSize: "1.3rem",
                    color: "var(--navy-blue)",
                    marginBottom: "15px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  🎮 How to Play
                </h3>
                <div style={{ color: "var(--dark-brown)", lineHeight: "1.6" }}>
                  <p>
                    <strong>Objective:</strong> Reconstruct the Preamble of the
                    Indian Constitution by placing words in the correct order!
                  </p>
                  <ul style={{ margin: "10px 0", paddingLeft: "20px" }}>
                    <li>
                      <strong>🔤 Word Placement:</strong> Click words from the
                      bottom section to place them in order
                    </li>
                    <li>
                      <strong>📍 Sequential Order:</strong> Words must be placed
                      in the exact sequence of the Preamble
                    </li>
                    <li>
                      <strong>🎯 Color Coding:</strong> Green = Correct, Red =
                      Wrong position, Blue = Empty slot
                    </li>
                    <li>
                      <strong>💡 Hint System:</strong> Use hints to get the next
                      correct word (costs 5 points)
                    </li>
                    <li>
                      <strong>🔄 Corrections:</strong> Click placed words to
                      remove them and try again
                    </li>
                  </ul>
                </div>
              </div>

              {/* Game Modes Section */}
              <div style={{ marginBottom: "25px" }}>
                <h3
                  style={{
                    fontSize: "1.3rem",
                    color: "var(--navy-blue)",
                    marginBottom: "15px",
                  }}
                >
                  🎯 Game Modes
                </h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                    gap: "15px",
                  }}
                >
                  <div
                    style={{
                      background: "var(--parchment)",
                      padding: "15px",
                      borderRadius: "12px",
                      border: "2px solid var(--gold)",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: "1.5rem", marginBottom: "8px" }}>
                      🧘
                    </div>
                    <strong style={{ color: "var(--navy-blue)" }}>
                      Normal Mode
                    </strong>
                    <p
                      style={{
                        color: "var(--dark-brown)",
                        fontSize: "0.9rem",
                        margin: "5px 0 0 0",
                      }}
                    >
                      Take your time to learn and understand the Preamble
                    </p>
                  </div>
                  <div
                    style={{
                      background: "var(--parchment)",
                      padding: "15px",
                      borderRadius: "12px",
                      border: "2px solid var(--saffron)",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: "1.5rem", marginBottom: "8px" }}>
                      ⚡
                    </div>
                    <strong style={{ color: "var(--saffron)" }}>
                      Time Attack
                    </strong>
                    <p
                      style={{
                        color: "var(--dark-brown)",
                        fontSize: "0.9rem",
                        margin: "5px 0 0 0",
                      }}
                    >
                      3-minute challenge with bonus points for remaining time
                    </p>
                  </div>
                </div>
              </div>

              {/* Scoring System */}
              <div style={{ marginBottom: "25px" }}>
                <h3
                  style={{
                    fontSize: "1.3rem",
                    color: "var(--navy-blue)",
                    marginBottom: "15px",
                  }}
                >
                  📊 Scoring System
                </h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "15px",
                  }}
                >
                  <div
                    style={{
                      background: "var(--parchment)",
                      padding: "15px",
                      borderRadius: "12px",
                      border: "2px solid #138808",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "1.5rem",
                        background: "#138808",
                        color: "white",
                        padding: "8px 12px",
                        borderRadius: "8px",
                        fontWeight: "bold",
                        minWidth: "50px",
                        textAlign: "center",
                      }}
                    >
                      +10
                    </div>
                    <div>
                      <strong style={{ color: "var(--navy-blue)" }}>
                        Correct Answer (No Hint)
                      </strong>
                      <p
                        style={{
                          color: "var(--dark-brown)",
                          fontSize: "0.9rem",
                          margin: "0",
                        }}
                      >
                        Word placed correctly without using hint
                      </p>
                    </div>
                  </div>
                  <div
                    style={{
                      background: "var(--parchment)",
                      padding: "15px",
                      borderRadius: "12px",
                      border: "2px solid #8B0000",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "1.5rem",
                        background: "#8B0000",
                        color: "white",
                        padding: "8px 12px",
                        borderRadius: "8px",
                        fontWeight: "bold",
                        minWidth: "50px",
                        textAlign: "center",
                      }}
                    >
                      -5
                    </div>
                    <div>
                      <strong style={{ color: "var(--navy-blue)" }}>
                        Hint Usage
                      </strong>
                      <p
                        style={{
                          color: "var(--dark-brown)",
                          fontSize: "0.9rem",
                          margin: "0",
                        }}
                      >
                        Cost for using hint system
                      </p>
                    </div>
                  </div>
                  <div
                    style={{
                      background: "var(--parchment)",
                      padding: "15px",
                      borderRadius: "12px",
                      border: "2px solid #FF6B6B",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "1.5rem",
                        background: "#FF6B6B",
                        color: "white",
                        padding: "8px 12px",
                        borderRadius: "8px",
                        fontWeight: "bold",
                        minWidth: "50px",
                        textAlign: "center",
                      }}
                    >
                      -2.5
                    </div>
                    <div>
                      <strong style={{ color: "var(--navy-blue)" }}>
                        Wrong Answer
                      </strong>
                      <p
                        style={{
                          color: "var(--dark-brown)",
                          fontSize: "0.9rem",
                          margin: "0",
                        }}
                      >
                        Word placed in wrong position
                      </p>
                    </div>
                  </div>
                  <div
                    style={{
                      background: "var(--parchment)",
                      padding: "15px",
                      borderRadius: "12px",
                      border: "2px solid #FFA500",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "1.5rem",
                        background: "#FFA500",
                        color: "white",
                        padding: "8px 12px",
                        borderRadius: "8px",
                        fontWeight: "bold",
                        minWidth: "50px",
                        textAlign: "center",
                      }}
                    >
                      -3
                    </div>
                    <div>
                      <strong style={{ color: "var(--navy-blue)" }}>
                        Word Removal
                      </strong>
                      <p
                        style={{
                          color: "var(--dark-brown)",
                          fontSize: "0.9rem",
                          margin: "0",
                        }}
                      >
                        Cost for removing placed words
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Preamble Education */}
              <div style={{ marginBottom: "25px" }}>
                <h3
                  style={{
                    fontSize: "1.3rem",
                    color: "var(--navy-blue)",
                    marginBottom: "15px",
                  }}
                >
                  🇮🇳 About the Preamble
                </h3>
                <div style={{ color: "var(--dark-brown)", lineHeight: "1.6" }}>
                  <p>
                    The Preamble is the introductory statement of the Indian
                    Constitution that outlines the guiding principles and
                    philosophy of our nation.
                  </p>
                  <div
                    style={{
                      background: "var(--parchment)",
                      border: "2px solid var(--gold)",
                      borderRadius: "12px",
                      padding: "20px",
                      margin: "15px 0",
                      fontStyle: "italic",
                      fontSize: "1.1rem",
                      textAlign: "center",
                      color: "var(--navy-blue)",
                    }}
                  >
                    "WE, THE PEOPLE OF INDIA, having solemnly resolved to
                    constitute India into a SOVEREIGN SOCIALIST SECULAR
                    DEMOCRATIC REPUBLIC..."
                  </div>
                  <ul style={{ margin: "10px 0", paddingLeft: "20px" }}>
                    <li>
                      <strong>SOVEREIGN:</strong> India is free to conduct its
                      own affairs
                    </li>
                    <li>
                      <strong>SOCIALIST:</strong> Commitment to social and
                      economic equality
                    </li>
                    <li>
                      <strong>SECULAR:</strong> No official religion, equal
                      respect for all faiths
                    </li>
                    <li>
                      <strong>DEMOCRATIC:</strong> Government by the people, for
                      the people
                    </li>
                    <li>
                      <strong>REPUBLIC:</strong> Head of state is elected, not
                      hereditary
                    </li>
                  </ul>
                </div>
              </div>

              {/* Key Features */}
              <div style={{ marginBottom: "25px" }}>
                <h3
                  style={{
                    fontSize: "1.3rem",
                    color: "var(--navy-blue)",
                    marginBottom: "15px",
                  }}
                >
                  🔑 Key Features
                </h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                    gap: "15px",
                  }}
                >
                  <div
                    style={{
                      background: "var(--parchment)",
                      padding: "15px",
                      borderRadius: "12px",
                      border: "2px solid var(--gold)",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: "1.5rem", marginBottom: "8px" }}>
                      🎯
                    </div>
                    <strong style={{ color: "var(--navy-blue)" }}>
                      Sequential Learning
                    </strong>
                    <p
                      style={{
                        color: "var(--dark-brown)",
                        fontSize: "0.9rem",
                        margin: "5px 0 0 0",
                      }}
                    >
                      Learn the exact order and flow of constitutional text
                    </p>
                  </div>
                  <div
                    style={{
                      background: "var(--parchment)",
                      padding: "15px",
                      borderRadius: "12px",
                      border: "2px solid var(--gold)",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: "1.5rem", marginBottom: "8px" }}>
                      🧠
                    </div>
                    <strong style={{ color: "var(--navy-blue)" }}>
                      Memory Building
                    </strong>
                    <p
                      style={{
                        color: "var(--dark-brown)",
                        fontSize: "0.9rem",
                        margin: "5px 0 0 0",
                      }}
                    >
                      Strengthen recall of constitutional principles
                    </p>
                  </div>
                  <div
                    style={{
                      background: "var(--parchment)",
                      padding: "15px",
                      borderRadius: "12px",
                      border: "2px solid var(--gold)",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: "1.5rem", marginBottom: "8px" }}>
                      📚
                    </div>
                    <strong style={{ color: "var(--navy-blue)" }}>
                      Constitutional Literacy
                    </strong>
                    <p
                      style={{
                        color: "var(--dark-brown)",
                        fontSize: "0.9rem",
                        margin: "5px 0 0 0",
                      }}
                    >
                      Understand the foundation of Indian democracy
                    </p>
                  </div>
                </div>
              </div>

              {/* Tips for Success */}
              <div style={{ marginBottom: "25px" }}>
                <h3
                  style={{
                    fontSize: "1.3rem",
                    color: "var(--navy-blue)",
                    marginBottom: "15px",
                  }}
                >
                  💡 Tips for Success
                </h3>
                <div style={{ color: "var(--dark-brown)", lineHeight: "1.6" }}>
                  <ul style={{ margin: "10px 0", paddingLeft: "20px" }}>
                    <li>
                      <strong>Start with Familiar Words:</strong> Look for words
                      you recognize from the Preamble
                    </li>
                    <li>
                      <strong>Follow the Flow:</strong> The Preamble has a
                      logical progression of ideas
                    </li>
                    <li>
                      <strong>Use Visual Cues:</strong> The "NEXT" indicator
                      shows where the next word goes
                    </li>
                    <li>
                      <strong>Learn from Mistakes:</strong> Red words indicate
                      wrong placement - learn the correct order
                    </li>
                    <li>
                      <strong>Practice Regularly:</strong> Repetition helps
                      memorize the constitutional text
                    </li>
                    <li>
                      <strong>Understand Meaning:</strong> Knowing what each
                      word means helps with placement
                    </li>
                  </ul>
                </div>
              </div>

              {/* Educational Goals */}
              <div style={{ marginBottom: "25px" }}>
                <h3
                  style={{
                    fontSize: "1.3rem",
                    color: "var(--navy-blue)",
                    marginBottom: "15px",
                  }}
                >
                  🎯 Educational Goals
                </h3>
                <div style={{ color: "var(--dark-brown)", lineHeight: "1.6" }}>
                  <p>The Preamble Puzzle Quest aims to:</p>
                  <ul style={{ margin: "10px 0", paddingLeft: "20px" }}>
                    <li>
                      Help memorize the complete text of the Indian
                      Constitution's Preamble
                    </li>
                    <li>
                      Understand the significance and meaning of each
                      constitutional principle
                    </li>
                    <li>
                      Appreciate the careful word choice and structure of our
                      founding document
                    </li>
                    <li>
                      Build familiarity with constitutional language and
                      terminology
                    </li>
                    <li>
                      Foster deeper connection with India's democratic
                      foundations
                    </li>
                    <li>
                      Encourage civic engagement through constitutional literacy
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Help Footer */}
            <div
              style={{
                padding: "20px 30px",
                borderTop: "2px solid var(--gold)",
                background: "var(--parchment)",
                textAlign: "center",
              }}
            >
              <button
                onClick={() => setShowHelp(false)}
                style={{
                  background:
                    "linear-gradient(135deg, var(--saffron), var(--gold))",
                  color: "var(--white)",
                  border: "none",
                  padding: "15px 30px",
                  borderRadius: "25px",
                  fontFamily: "Cinzel, serif",
                  fontWeight: "600",
                  fontSize: "1.1rem",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
              >
                Start Puzzle Quest! 🧩
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PreamblePuzzleQuest;
