import React, { useState, useEffect } from "react";

const CivicScorekeeper = ({ onBackToHub }) => {
  const [gameState, setGameState] = useState({
    civicScore: 50,
    day: 1,
    totalDays: 30,
    currentAction: null,
    gameComplete: false,
    achievements: [],
  });
  const [showHelp, setShowHelp] = useState(false);

  const CIVIC_ACTIONS = [
    {
      id: "vote",
      title: "Vote in Elections 🗳️",
      description: "Exercise your democratic right to vote",
      scoreChange: +15,
      dutyArticle: "51A(a) - Abide by Constitution and respect ideals",
    },
    {
      id: "flag_respect",
      title: "Respect National Flag 🇮🇳",
      description: "Show respect during national anthem",
      scoreChange: +10,
      dutyArticle: "51A(a) - Respect national symbols",
    },
    {
      id: "environment",
      title: "Plant a Tree 🌱",
      description: "Contribute to environmental protection",
      scoreChange: +12,
      dutyArticle: "51A(g) - Protect environment and wildlife",
    },
    {
      id: "education",
      title: "Promote Education 📚",
      description: "Help someone learn to read",
      scoreChange: +8,
      dutyArticle: "51A(k) - Strive towards excellence in education",
    },
    {
      id: "unity",
      title: "Promote Harmony 🤝",
      description: "Bridge differences between communities",
      scoreChange: +14,
      dutyArticle: "51A(e) - Promote harmony and brotherhood",
    },
    {
      id: "heritage",
      title: "Preserve Heritage 🏛️",
      description: "Protect historical monuments",
      scoreChange: +11,
      dutyArticle: "51A(f) - Value and preserve rich heritage",
    },
  ];

  const NEGATIVE_ACTIONS = [
    {
      id: "litter",
      title: "Litter in Public 🗑️",
      description: "Throw garbage on the street",
      scoreChange: -8,
      consequence: "Violates duty to keep environment clean",
    },
    {
      id: "skip_vote",
      title: "Skip Voting 🚫",
      description: "Choose not to participate in elections",
      scoreChange: -12,
      consequence: "Weakens democratic participation",
    },
    {
      id: "spread_hate",
      title: "Spread Division 😠",
      description: "Share divisive content on social media",
      scoreChange: -15,
      consequence: "Goes against promoting harmony",
    },
  ];

  useEffect(() => {
    if (gameState.day <= gameState.totalDays && !gameState.gameComplete) {
      const timer = setTimeout(() => {
        // Present random action choice
        const allActions = [...CIVIC_ACTIONS, ...NEGATIVE_ACTIONS];
        const randomAction =
          allActions[Math.floor(Math.random() * allActions.length)];

        setGameState((prev) => ({
          ...prev,
          currentAction: randomAction,
        }));
      }, 2000);

      return () => clearTimeout(timer);
    } else if (gameState.day > gameState.totalDays) {
      setGameState((prev) => ({ ...prev, gameComplete: true }));
    }
  }, [gameState.day, gameState.gameComplete]);

  const handleAction = (takeAction) => {
    if (!gameState.currentAction) return;

    let scoreChange = 0;
    let newAchievements = [...gameState.achievements];

    if (takeAction) {
      scoreChange = gameState.currentAction.scoreChange;
    } else {
      // Choosing not to do positive action has small negative impact
      scoreChange = gameState.currentAction.scoreChange > 0 ? -3 : 0;
    }

    const newScore = Math.max(
      0,
      Math.min(100, gameState.civicScore + scoreChange)
    );

    // Check for achievements
    if (newScore >= 80 && !newAchievements.includes("high_civic")) {
      newAchievements.push("high_civic");
    }
    if (
      gameState.day >= 15 &&
      newScore >= 60 &&
      !newAchievements.includes("consistent")
    ) {
      newAchievements.push("consistent");
    }

    setGameState((prev) => ({
      ...prev,
      civicScore: newScore,
      day: prev.day + 1,
      currentAction: null,
      achievements: newAchievements,
    }));
  };

  const restartGame = () => {
    setGameState({
      civicScore: 50,
      day: 1,
      totalDays: 30,
      currentAction: null,
      gameComplete: false,
      achievements: [],
    });
  };

  const getScoreColor = () => {
    if (gameState.civicScore >= 80) return "#138808"; // Green
    if (gameState.civicScore >= 60) return "#FFD700"; // Gold
    if (gameState.civicScore >= 40) return "#FF9933"; // Orange
    return "#8B0000"; // Red
  };

  const getScoreLabel = () => {
    if (gameState.civicScore >= 80) return "Exemplary Citizen";
    if (gameState.civicScore >= 60) return "Good Citizen";
    if (gameState.civicScore >= 40) return "Average Citizen";
    return "Needs Improvement";
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
          Civic Scorekeeper 👥
        </h2>
        <div
          style={{
            color: "var(--saffron)",
            fontWeight: "600",
            fontSize: "1.2rem",
          }}
        >
          Day {gameState.day}/{gameState.totalDays}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <div
          style={{
            background: "var(--white)",
            border: "2px solid var(--gold)",
            borderRadius: "15px",
            padding: "20px",
            textAlign: "center",
          }}
        >
          <h3 style={{ color: "var(--navy-blue)", marginBottom: "10px" }}>
            Civic Score
          </h3>
          <div
            style={{
              fontSize: "3rem",
              fontWeight: "700",
              color: getScoreColor(),
              marginBottom: "10px",
            }}
          >
            {gameState.civicScore}
          </div>
          <div style={{ color: getScoreColor(), fontWeight: "600" }}>
            {getScoreLabel()}
          </div>
          <div
            style={{
              width: "100%",
              height: "10px",
              background: "#E0E0E0",
              borderRadius: "5px",
              overflow: "hidden",
              marginTop: "15px",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${gameState.civicScore}%`,
                background: getScoreColor(),
                transition: "width 0.3s ease",
              }}
            />
          </div>
        </div>

        <div
          style={{
            background: "var(--white)",
            border: "2px solid var(--gold)",
            borderRadius: "15px",
            padding: "20px",
            textAlign: "center",
          }}
        >
          <h3 style={{ color: "var(--navy-blue)", marginBottom: "10px" }}>
            Progress
          </h3>
          <div
            style={{
              fontSize: "2rem",
              color: "var(--saffron)",
              marginBottom: "10px",
            }}
          >
            {Math.round((gameState.day / gameState.totalDays) * 100)}%
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
                width: `${(gameState.day / gameState.totalDays) * 100}%`,
                background: "var(--saffron)",
                transition: "width 0.3s ease",
              }}
            />
          </div>
        </div>

        <div
          style={{
            background: "var(--white)",
            border: "2px solid var(--gold)",
            borderRadius: "15px",
            padding: "20px",
            textAlign: "center",
          }}
        >
          <h3 style={{ color: "var(--navy-blue)", marginBottom: "10px" }}>
            Achievements
          </h3>
          <div
            style={{
              fontSize: "2rem",
              color: "var(--gold)",
              marginBottom: "10px",
            }}
          >
            {gameState.achievements.length}
          </div>
          <div style={{ color: "var(--dark-brown)" }}>Unlocked</div>
        </div>
      </div>

      {gameState.currentAction && !gameState.gameComplete ? (
        <div
          style={{
            background: "var(--white)",
            border: "3px solid var(--gold)",
            borderRadius: "20px",
            padding: "40px",
            marginBottom: "30px",
            textAlign: "center",
          }}
        >
          <h3
            style={{
              fontSize: "2rem",
              color: "var(--navy-blue)",
              marginBottom: "20px",
            }}
          >
            Daily Choice
          </h3>

          <div
            style={{
              background: "var(--parchment)",
              border: "2px solid var(--gold)",
              borderRadius: "15px",
              padding: "30px",
              marginBottom: "30px",
            }}
          >
            <h4
              style={{
                fontSize: "1.5rem",
                color: "var(--navy-blue)",
                marginBottom: "15px",
              }}
            >
              {gameState.currentAction.title}
            </h4>
            <p
              style={{
                fontSize: "1.2rem",
                color: "var(--dark-brown)",
                marginBottom: "15px",
              }}
            >
              {gameState.currentAction.description}
            </p>
            {gameState.currentAction.dutyArticle && (
              <p
                style={{
                  fontSize: "1rem",
                  color: "var(--saffron)",
                  fontStyle: "italic",
                }}
              >
                Constitutional Duty: {gameState.currentAction.dutyArticle}
              </p>
            )}
            {gameState.currentAction.consequence && (
              <p
                style={{
                  fontSize: "1rem",
                  color: "#8B0000",
                  fontStyle: "italic",
                }}
              >
                Consequence: {gameState.currentAction.consequence}
              </p>
            )}
          </div>

          <div
            style={{ display: "flex", gap: "20px", justifyContent: "center" }}
          >
            <button
              onClick={() => handleAction(true)}
              style={{
                background:
                  gameState.currentAction.scoreChange > 0
                    ? "linear-gradient(135deg, var(--green), var(--saffron))"
                    : "linear-gradient(135deg, #8B0000, #A0522D)",
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
              {gameState.currentAction.scoreChange > 0
                ? "Do It"
                : "Do It Anyway"}
              <br />
              <small>
                ({gameState.currentAction.scoreChange > 0 ? "+" : ""}
                {gameState.currentAction.scoreChange} points)
              </small>
            </button>

            <button
              onClick={() => handleAction(false)}
              style={{
                background: "var(--dark-brown)",
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
              Skip
              <br />
              <small>
                ({gameState.currentAction.scoreChange > 0 ? "-3" : "0"} points)
              </small>
            </button>
          </div>
        </div>
      ) : !gameState.gameComplete ? (
        <div
          style={{
            background: "var(--white)",
            border: "3px solid var(--gold)",
            borderRadius: "20px",
            padding: "40px",
            textAlign: "center",
          }}
        >
          <h3 style={{ color: "var(--navy-blue)", marginBottom: "20px" }}>
            🏛️ Living as a Constitutional Citizen
          </h3>
          <p style={{ color: "var(--dark-brown)", fontSize: "1.2rem" }}>
            Your daily choices shape your civic character...
          </p>
        </div>
      ) : null}

      {gameState.gameComplete && (
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
                color: getScoreColor(),
              }}
            >
              🏆 Civic Journey Complete!
            </h3>
            <div
              style={{
                fontSize: "1.5rem",
                marginBottom: "20px",
                color: "var(--dark-brown)",
              }}
            >
              Final Civic Score:{" "}
              <span style={{ color: getScoreColor(), fontWeight: "700" }}>
                {gameState.civicScore}
              </span>
            </div>
            <p
              style={{
                fontSize: "1.2rem",
                color: "var(--dark-brown)",
                marginBottom: "20px",
              }}
            >
              Status: {getScoreLabel()}
            </p>
            <p
              style={{
                fontSize: "1rem",
                color: "var(--saffron)",
                fontStyle: "italic",
                marginBottom: "30px",
              }}
            >
              "The price of freedom is eternal vigilance in our civic duties."
            </p>

            {gameState.achievements.length > 0 && (
              <div style={{ marginBottom: "30px" }}>
                <h4 style={{ color: "var(--navy-blue)" }}>
                  Achievements Unlocked:
                </h4>
                <div style={{ color: "var(--gold)" }}>
                  {gameState.achievements.includes("high_civic") &&
                    "🏆 High Civic Score "}
                  {gameState.achievements.includes("consistent") &&
                    "⭐ Consistent Citizen "}
                </div>
              </div>
            )}

            <div
              style={{ display: "flex", gap: "20px", justifyContent: "center" }}
            >
              <button
                onClick={restartGame}
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
                New Life
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
                👥 Civic Scorekeeper Guide
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
                    <strong>Objective:</strong> Live as a responsible citizen
                    for 30 days and maintain a high civic score!
                  </p>
                  <ul style={{ margin: "10px 0", paddingLeft: "20px" }}>
                    <li>
                      <strong>Daily Choices:</strong> Each day presents a civic
                      situation requiring your decision
                    </li>
                    <li>
                      <strong>Score Impact:</strong> Your choices affect your
                      civic score (0-100)
                    </li>
                    <li>
                      <strong>Constitutional Connection:</strong> Actions relate
                      to fundamental duties in Article 51A
                    </li>
                    <li>
                      <strong>Achievement System:</strong> Unlock achievements
                      for exemplary citizenship
                    </li>
                  </ul>
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
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "1.5rem",
                        marginBottom: "8px",
                        color: "#138808",
                      }}
                    >
                      80-100
                    </div>
                    <strong style={{ color: "#138808" }}>
                      Exemplary Citizen
                    </strong>
                    <p
                      style={{
                        color: "var(--dark-brown)",
                        fontSize: "0.9rem",
                        margin: "5px 0 0 0",
                      }}
                    >
                      Outstanding civic responsibility
                    </p>
                  </div>
                  <div
                    style={{
                      background: "var(--parchment)",
                      padding: "15px",
                      borderRadius: "12px",
                      border: "2px solid #FFD700",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "1.5rem",
                        marginBottom: "8px",
                        color: "#FFD700",
                      }}
                    >
                      60-79
                    </div>
                    <strong style={{ color: "#FFD700" }}>Good Citizen</strong>
                    <p
                      style={{
                        color: "var(--dark-brown)",
                        fontSize: "0.9rem",
                        margin: "5px 0 0 0",
                      }}
                    >
                      Solid civic engagement
                    </p>
                  </div>
                  <div
                    style={{
                      background: "var(--parchment)",
                      padding: "15px",
                      borderRadius: "12px",
                      border: "2px solid #FF9933",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "1.5rem",
                        marginBottom: "8px",
                        color: "#FF9933",
                      }}
                    >
                      40-59
                    </div>
                    <strong style={{ color: "#FF9933" }}>
                      Average Citizen
                    </strong>
                    <p
                      style={{
                        color: "var(--dark-brown)",
                        fontSize: "0.9rem",
                        margin: "5px 0 0 0",
                      }}
                    >
                      Room for improvement
                    </p>
                  </div>
                  <div
                    style={{
                      background: "var(--parchment)",
                      padding: "15px",
                      borderRadius: "12px",
                      border: "2px solid #8B0000",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "1.5rem",
                        marginBottom: "8px",
                        color: "#8B0000",
                      }}
                    >
                      0-39
                    </div>
                    <strong style={{ color: "#8B0000" }}>
                      Needs Improvement
                    </strong>
                    <p
                      style={{
                        color: "var(--dark-brown)",
                        fontSize: "0.9rem",
                        margin: "5px 0 0 0",
                      }}
                    >
                      Focus on civic duties
                    </p>
                  </div>
                </div>
              </div>

              {/* Positive Actions */}
              <div style={{ marginBottom: "25px" }}>
                <h3
                  style={{
                    fontSize: "1.3rem",
                    color: "var(--navy-blue)",
                    marginBottom: "15px",
                  }}
                >
                  ✅ Positive Civic Actions
                </h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                    gap: "15px",
                  }}
                >
                  {CIVIC_ACTIONS.map((action, index) => (
                    <div
                      key={index}
                      style={{
                        background: "var(--parchment)",
                        padding: "15px",
                        borderRadius: "12px",
                        border: "2px solid var(--green)",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "12px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "1.5rem",
                          background: "var(--green)",
                          color: "white",
                          padding: "8px 12px",
                          borderRadius: "8px",
                          fontWeight: "bold",
                          minWidth: "50px",
                          textAlign: "center",
                        }}
                      >
                        +{action.scoreChange}
                      </div>
                      <div style={{ flex: 1 }}>
                        <strong style={{ color: "var(--navy-blue)" }}>
                          {action.title}
                        </strong>
                        <p
                          style={{
                            color: "var(--dark-brown)",
                            fontSize: "0.9rem",
                            margin: "5px 0",
                          }}
                        >
                          {action.description}
                        </p>
                        <p
                          style={{
                            color: "var(--saffron)",
                            fontSize: "0.8rem",
                            fontStyle: "italic",
                            margin: "0",
                          }}
                        >
                          {action.dutyArticle}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Negative Actions */}
              <div style={{ marginBottom: "25px" }}>
                <h3
                  style={{
                    fontSize: "1.3rem",
                    color: "var(--navy-blue)",
                    marginBottom: "15px",
                  }}
                >
                  ❌ Actions to Avoid
                </h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                    gap: "15px",
                  }}
                >
                  {NEGATIVE_ACTIONS.map((action, index) => (
                    <div
                      key={index}
                      style={{
                        background: "var(--parchment)",
                        padding: "15px",
                        borderRadius: "12px",
                        border: "2px solid #8B0000",
                        display: "flex",
                        alignItems: "flex-start",
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
                        {action.scoreChange}
                      </div>
                      <div style={{ flex: 1 }}>
                        <strong style={{ color: "var(--navy-blue)" }}>
                          {action.title}
                        </strong>
                        <p
                          style={{
                            color: "var(--dark-brown)",
                            fontSize: "0.9rem",
                            margin: "5px 0",
                          }}
                        >
                          {action.description}
                        </p>
                        <p
                          style={{
                            color: "#8B0000",
                            fontSize: "0.8rem",
                            fontStyle: "italic",
                            margin: "0",
                          }}
                        >
                          {action.consequence}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Constitutional Context */}
              <div style={{ marginBottom: "25px" }}>
                <h3
                  style={{
                    fontSize: "1.3rem",
                    color: "var(--navy-blue)",
                    marginBottom: "15px",
                  }}
                >
                  🇮🇳 Constitutional Foundation
                </h3>
                <div style={{ color: "var(--dark-brown)", lineHeight: "1.6" }}>
                  <p>
                    This game is based on <strong>Article 51A</strong> of the
                    Indian Constitution - Fundamental Duties of Citizens:
                  </p>
                  <ul style={{ margin: "10px 0", paddingLeft: "20px" }}>
                    <li>
                      <strong>51A(a):</strong> Abide by Constitution and respect
                      its ideals, institutions, National Flag and National
                      Anthem
                    </li>
                    <li>
                      <strong>51A(e):</strong> Promote harmony and spirit of
                      common brotherhood among all people
                    </li>
                    <li>
                      <strong>51A(f):</strong> Value and preserve the rich
                      heritage of our composite culture
                    </li>
                    <li>
                      <strong>51A(g):</strong> Protect and improve natural
                      environment including forests and wildlife
                    </li>
                    <li>
                      <strong>51A(k):</strong> Strive towards excellence in all
                      spheres of individual and collective activity
                    </li>
                  </ul>
                </div>
              </div>

              {/* Achievements */}
              <div style={{ marginBottom: "25px" }}>
                <h3
                  style={{
                    fontSize: "1.3rem",
                    color: "var(--navy-blue)",
                    marginBottom: "15px",
                  }}
                >
                  🏆 Achievements
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
                      🏆
                    </div>
                    <strong style={{ color: "var(--gold)" }}>
                      High Civic Score
                    </strong>
                    <p
                      style={{
                        color: "var(--dark-brown)",
                        fontSize: "0.9rem",
                        margin: "5px 0 0 0",
                      }}
                    >
                      Achieve a civic score of 80 or higher
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
                      ⭐
                    </div>
                    <strong style={{ color: "var(--gold)" }}>
                      Consistent Citizen
                    </strong>
                    <p
                      style={{
                        color: "var(--dark-brown)",
                        fontSize: "0.9rem",
                        margin: "5px 0 0 0",
                      }}
                    >
                      Maintain score above 60 for 15+ days
                    </p>
                  </div>
                </div>
              </div>

              {/* Tips */}
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
                      <strong>Think Long-term:</strong> Consider the cumulative
                      impact of your choices
                    </li>
                    <li>
                      <strong>Constitutional Awareness:</strong> Connect actions
                      to fundamental duties
                    </li>
                    <li>
                      <strong>Community Impact:</strong> Consider how your
                      actions affect society
                    </li>
                    <li>
                      <strong>Consistency Matters:</strong> Regular positive
                      actions build civic character
                    </li>
                    <li>
                      <strong>Learn from Choices:</strong> Each decision teaches
                      about civic responsibility
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
                  <p>The Civic Scorekeeper aims to:</p>
                  <ul style={{ margin: "10px 0", paddingLeft: "20px" }}>
                    <li>Teach fundamental duties as outlined in Article 51A</li>
                    <li>
                      Demonstrate the impact of individual choices on civic life
                    </li>
                    <li>
                      Encourage responsible citizenship and community engagement
                    </li>
                    <li>Connect daily actions to constitutional principles</li>
                    <li>
                      Foster awareness of civic responsibilities in democracy
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
                Start Your Civic Journey! 👥
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CivicScorekeeper;
