import React, { useState, useEffect } from "react";

const ElectionTrail = ({ onBackToHub }) => {
  const [gameState, setGameState] = useState({
    position: 0,
    funds: 1000,
    popularity: 50,
    ethics: 100,
    day: 1,
    totalDays: 30,
    events: [],
    gameOver: false,
    won: false,
  });

  const [showHelp, setShowHelp] = useState(false);

  const EVENTS = [
    {
      title: "Media Interview Opportunity",
      description:
        "A major news channel wants to interview you about your policies.",
      choices: [
        {
          text: "Accept and speak honestly",
          funds: -50,
          popularity: +15,
          ethics: +5,
        },
        {
          text: "Accept but give vague answers",
          funds: -30,
          popularity: +5,
          ethics: -5,
        },
        {
          text: "Decline the interview",
          funds: 0,
          popularity: -10,
          ethics: +2,
        },
      ],
    },
    {
      title: "Corporate Donation Offer",
      description:
        "A large corporation offers substantial funding for your campaign.",
      choices: [
        {
          text: "Accept with transparency",
          funds: +500,
          popularity: +5,
          ethics: -10,
        },
        { text: "Accept secretly", funds: +800, popularity: +2, ethics: -20 },
        {
          text: "Decline the donation",
          funds: 0,
          popularity: +10,
          ethics: +15,
        },
      ],
    },
    {
      title: "Opposition Scandal",
      description: "You discover damaging information about your opponent.",
      choices: [
        {
          text: "Use it in your campaign",
          funds: -100,
          popularity: +20,
          ethics: -15,
        },
        {
          text: "Report it to authorities",
          funds: -50,
          popularity: +5,
          ethics: +10,
        },
        {
          text: "Ignore the information",
          funds: 0,
          popularity: -5,
          ethics: +20,
        },
      ],
    },
    {
      title: "Rally Organization",
      description: "Time to organize a public rally to connect with voters.",
      choices: [
        {
          text: "Large expensive rally",
          funds: -300,
          popularity: +25,
          ethics: 0,
        },
        {
          text: "Modest community meeting",
          funds: -100,
          popularity: +15,
          ethics: +5,
        },
        {
          text: "Digital campaign only",
          funds: -50,
          popularity: +5,
          ethics: +2,
        },
      ],
    },
    {
      title: "Vote Bank Politics",
      description:
        "Advisors suggest targeting specific communities with promises.",
      choices: [
        {
          text: "Make community-specific promises",
          funds: -200,
          popularity: +30,
          ethics: -25,
        },
        {
          text: "Focus on universal policies",
          funds: -150,
          popularity: +10,
          ethics: +15,
        },
        {
          text: "Avoid divisive politics",
          funds: -100,
          popularity: +5,
          ethics: +25,
        },
      ],
    },
  ];

  useEffect(() => {
    if (gameState.day <= gameState.totalDays && !gameState.gameOver) {
      const timer = setTimeout(() => {
        // Random event every few days
        if (gameState.day % 3 === 0) {
          const randomEvent = EVENTS[Math.floor(Math.random() * EVENTS.length)];
          setGameState((prev) => ({
            ...prev,
            events: [...prev.events, { ...randomEvent, day: prev.day }],
          }));
        } else {
          // Regular campaign day
          setGameState((prev) => ({
            ...prev,
            day: prev.day + 1,
            funds: Math.max(0, prev.funds - 50), // Daily expenses
            popularity: Math.max(
              0,
              Math.min(100, prev.popularity + (Math.random() - 0.5) * 10)
            ),
          }));
        }
      }, 2000);

      return () => clearTimeout(timer);
    } else if (gameState.day > gameState.totalDays) {
      // Election day
      const finalScore = gameState.popularity + gameState.ethics / 2;
      setGameState((prev) => ({
        ...prev,
        gameOver: true,
        won: finalScore > 70 && prev.ethics > 30,
      }));
    }
  }, [gameState.day, gameState.gameOver]);

  const handleChoice = (eventIndex, choiceIndex) => {
    const event = gameState.events[eventIndex];
    const choice = event.choices[choiceIndex];

    setGameState((prev) => ({
      ...prev,
      funds: Math.max(0, prev.funds + choice.funds),
      popularity: Math.max(
        0,
        Math.min(100, prev.popularity + choice.popularity)
      ),
      ethics: Math.max(0, Math.min(100, prev.ethics + choice.ethics)),
      events: prev.events.filter((_, i) => i !== eventIndex),
      day: prev.day + 1,
    }));
  };

  const restartGame = () => {
    setGameState({
      position: 0,
      funds: 1000,
      popularity: 50,
      ethics: 100,
      day: 1,
      totalDays: 30,
      events: [],
      gameOver: false,
      won: false,
    });
  };

  const currentEvent = gameState.events[0];

  return (
    <div className="election-trail">
      <style jsx>{`
        .election-trail {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
          min-height: 100vh;
          background: var(--parchment);
        }

        .game-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 3px solid var(--gold);
        }

        .header-left {
          display: flex;
          gap: 15px;
          align-items: center;
        }

        .back-button,
        .help-button {
          background: var(--navy-blue);
          color: var(--white);
          border: none;
          padding: 12px 24px;
          border-radius: 25px;
          font-family: "Cinzel", serif;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .help-button {
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
        }

        .back-button:hover,
        .help-button:hover {
          background: var(--saffron);
          transform: scale(1.05);
        }

        .game-title {
          font-size: 2.5rem;
          color: var(--navy-blue);
          margin: 0;
          text-align: center;
        }

        .day-counter {
          font-size: 1.3rem;
          color: var(--saffron);
          font-weight: 600;
        }

        .stats-panel {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .stat-card {
          background: var(--white);
          border: 2px solid var(--gold);
          border-radius: 15px;
          padding: 20px;
          text-align: center;
        }

        .stat-title {
          font-size: 1.1rem;
          color: var(--navy-blue);
          margin-bottom: 10px;
          font-weight: 600;
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 10px;
        }

        .funds {
          color: var(--green);
        }
        .popularity {
          color: var(--saffron);
        }
        .ethics {
          color: var(--navy-blue);
        }

        .stat-bar {
          width: 100%;
          height: 10px;
          background: #e0e0e0;
          border-radius: 5px;
          overflow: hidden;
        }

        .stat-fill {
          height: 100%;
          transition: width 0.3s ease;
        }

        .popularity-fill {
          background: var(--saffron);
        }
        .ethics-fill {
          background: var(--navy-blue);
        }

        .event-area {
          background: var(--white);
          border: 3px solid var(--gold);
          border-radius: 20px;
          padding: 40px;
          margin-bottom: 30px;
          text-align: center;
        }

        .event-title {
          font-size: 1.8rem;
          color: var(--navy-blue);
          margin-bottom: 20px;
        }

        .event-description {
          font-size: 1.2rem;
          color: var(--dark-brown);
          margin-bottom: 30px;
          line-height: 1.6;
        }

        .choices-grid {
          display: grid;
          gap: 15px;
          max-width: 800px;
          margin: 0 auto;
        }

        .choice-button {
          background: var(--parchment);
          border: 2px solid var(--gold);
          border-radius: 15px;
          padding: 20px;
          font-family: "Cinzel", serif;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: left;
        }

        .choice-button:hover {
          background: var(--saffron);
          color: var(--white);
          transform: scale(1.02);
        }

        .choice-effects {
          font-size: 0.9rem;
          margin-top: 10px;
          opacity: 0.8;
        }

        .campaign-progress {
          text-align: center;
          font-size: 1.3rem;
          color: var(--navy-blue);
          padding: 30px;
        }

        .progress-bar {
          width: 100%;
          height: 20px;
          background: #e0e0e0;
          border-radius: 10px;
          overflow: hidden;
          margin: 20px 0;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--saffron), var(--gold));
          transition: width 0.3s ease;
        }

        .game-over-modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .modal-content {
          background: var(--white);
          padding: 50px;
          border-radius: 20px;
          border: 3px solid var(--gold);
          text-align: center;
          max-width: 600px;
        }

        .modal-title {
          font-size: 3rem;
          margin-bottom: 20px;
        }

        .winner .modal-title {
          color: var(--green);
        }
        .loser .modal-title {
          color: var(--saffron);
        }

        .final-stats {
          font-size: 1.2rem;
          margin-bottom: 30px;
          color: var(--dark-brown);
        }

        .action-buttons {
          display: flex;
          gap: 20px;
          justify-content: center;
        }

        .action-button {
          background: linear-gradient(135deg, var(--saffron), var(--gold));
          color: var(--white);
          border: none;
          padding: 15px 30px;
          border-radius: 25px;
          font-family: "Cinzel", serif;
          font-weight: 600;
          cursor: pointer;
          font-size: 1.1rem;
          transition: all 0.3s ease;
        }

        .action-button:hover {
          transform: scale(1.05);
        }

        /* Help Modal Styles */
        .help-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(5px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .help-modal {
          background: var(--white);
          backdrop-filter: blur(15px);
          border-radius: 20px;
          max-width: 900px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          border: 3px solid var(--gold);
        }

        .help-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 30px;
          border-bottom: 2px solid rgba(212, 175, 55, 0.3);
          background: linear-gradient(
            135deg,
            rgba(255, 153, 51, 0.1),
            rgba(19, 136, 8, 0.1)
          );
        }

        .help-title {
          font-size: 1.8rem;
          font-weight: 700;
          color: var(--navy-blue);
          margin: 0;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
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
          color: var(--navy-blue);
          margin-bottom: 15px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .help-text {
          color: var(--dark-brown);
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
          color: var(--navy-blue);
          font-weight: 600;
        }

        .help-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
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
          background: var(--saffron);
          color: white;
          padding: 8px 12px;
          border-radius: 8px;
          font-weight: bold;
          min-width: 50px;
          text-align: center;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }

        .help-emoji.funds {
          background: var(--green);
        }

        .help-emoji.popularity {
          background: var(--saffron);
        }

        .help-emoji.ethics {
          background: var(--navy-blue);
        }

        .help-item div {
          flex: 1;
        }

        .help-item strong {
          display: block;
          color: var(--navy-blue);
          font-weight: 700;
          margin-bottom: 5px;
        }

        .help-item p {
          color: var(--dark-brown);
          font-size: 0.9rem;
          margin: 0;
        }

        .event-examples {
          margin-top: 15px;
        }

        .event-example {
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: 10px;
          padding: 15px;
          margin-bottom: 15px;
        }

        .event-example h4 {
          color: var(--navy-blue);
          font-size: 1.1rem;
          margin-bottom: 8px;
          font-weight: 600;
        }

        .event-example p {
          color: var(--dark-brown);
          font-size: 0.9rem;
          margin: 0;
          line-height: 1.4;
        }

        .victory-requirements {
          margin: 15px 0;
        }

        .requirement {
          display: flex;
          align-items: center;
          gap: 15px;
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: 10px;
          padding: 15px;
          margin-bottom: 10px;
        }

        .req-icon {
          font-size: 1.5rem;
          background: var(--saffron);
          color: white;
          padding: 8px;
          border-radius: 50%;
          min-width: 40px;
          text-align: center;
        }

        .requirement div {
          flex: 1;
        }

        .requirement strong {
          display: block;
          color: var(--navy-blue);
          font-weight: 700;
          margin-bottom: 5px;
        }

        .requirement p {
          color: var(--dark-brown);
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
          background: linear-gradient(135deg, var(--saffron), var(--gold));
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
      `}</style>

      <div className="game-header">
        <div className="header-left">
          <button className="back-button" onClick={onBackToHub}>
            ← Back to Hub
          </button>
          <button className="help-button" onClick={() => setShowHelp(true)}>
            ❓ Help
          </button>
        </div>
        <h2 className="game-title">Election Trail</h2>
        <div className="day-counter">
          Day {gameState.day}/{gameState.totalDays}
        </div>
      </div>

      <div className="stats-panel">
        <div className="stat-card">
          <div className="stat-title">Campaign Funds</div>
          <div className="stat-value funds">₹{gameState.funds}</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Popularity</div>
          <div className="stat-value popularity">{gameState.popularity}%</div>
          <div className="stat-bar">
            <div
              className="stat-fill popularity-fill"
              style={{ width: `${gameState.popularity}%` }}
            ></div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Ethics Score</div>
          <div className="stat-value ethics">{gameState.ethics}%</div>
          <div className="stat-bar">
            <div
              className="stat-fill ethics-fill"
              style={{ width: `${gameState.ethics}%` }}
            ></div>
          </div>
        </div>
      </div>

      {currentEvent ? (
        <div className="event-area">
          <h3 className="event-title">{currentEvent.title}</h3>
          <p className="event-description">{currentEvent.description}</p>
          <div className="choices-grid">
            {currentEvent.choices.map((choice, index) => (
              <button
                key={index}
                className="choice-button"
                onClick={() => handleChoice(0, index)}
              >
                <div>{choice.text}</div>
                <div className="choice-effects">
                  {choice.funds !== 0 &&
                    `Funds: ${choice.funds > 0 ? "+" : ""}${choice.funds} `}
                  {choice.popularity !== 0 &&
                    `Popularity: ${choice.popularity > 0 ? "+" : ""}${
                      choice.popularity
                    }% `}
                  {choice.ethics !== 0 &&
                    `Ethics: ${choice.ethics > 0 ? "+" : ""}${choice.ethics}%`}
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : !gameState.gameOver ? (
        <div className="campaign-progress">
          <h3>🗳️ Campaign in Progress</h3>
          <p>Building support across constituencies...</p>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${(gameState.day / gameState.totalDays) * 100}%`,
              }}
            ></div>
          </div>
          <p>Election Day Approaches!</p>
        </div>
      ) : null}

      {gameState.gameOver && (
        <div className="game-over-modal">
          <div
            className={`modal-content ${gameState.won ? "winner" : "loser"}`}
          >
            <h3 className="modal-title">
              {gameState.won ? "🏆 Election Victory!" : "📊 Election Results"}
            </h3>
            <div className="final-stats">
              <p>
                <strong>Final Popularity:</strong> {gameState.popularity}%
              </p>
              <p>
                <strong>Ethics Score:</strong> {gameState.ethics}%
              </p>
              <p>
                <strong>Remaining Funds:</strong> ₹{gameState.funds}
              </p>
              <p>
                <strong>Result:</strong>{" "}
                {gameState.won
                  ? "Congratulations! You won with integrity!"
                  : "Campaign ended. Democracy requires both popularity and ethics."}
              </p>
            </div>
            <p>
              <em>
                "In a democracy, the highest office is the office of citizen." -
                Felix Frankfurter
              </em>
            </p>
            <div className="action-buttons">
              <button className="action-button" onClick={restartGame}>
                New Campaign
              </button>
              <button className="action-button" onClick={onBackToHub}>
                Back to Hub
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Help Modal */}
      {showHelp && (
        <div className="help-overlay">
          <div className="help-modal">
            <div className="help-header">
              <h2 className="help-title">🗳️ Election Trail Guide</h2>
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
                    <strong>Objective:</strong> Run a successful election
                    campaign over 30 days while maintaining ethical standards!
                  </p>
                  <ul>
                    <li>
                      <strong>🗓️ Campaign Duration:</strong> You have 30 days to
                      build support
                    </li>
                    <li>
                      <strong>💰 Manage Resources:</strong> Balance funds,
                      popularity, and ethics
                    </li>
                    <li>
                      <strong>📊 Make Decisions:</strong> Choose wisely during
                      campaign events
                    </li>
                    <li>
                      <strong>🏆 Win Conditions:</strong> Achieve 70+ popularity
                      AND 30+ ethics to win
                    </li>
                    <li>
                      <strong>⚖️ Ethical Campaigning:</strong> Maintain
                      integrity while gaining support
                    </li>
                  </ul>
                </div>
              </div>

              <div className="help-section">
                <h3 className="help-section-title">📊 Game Metrics</h3>
                <div className="help-grid">
                  <div className="help-item">
                    <span className="help-emoji funds">💰</span>
                    <div>
                      <strong>Campaign Funds</strong>
                      <p>
                        Money available for campaign activities. Starts at
                        ₹1000. Daily expenses: ₹50
                      </p>
                    </div>
                  </div>
                  <div className="help-item">
                    <span className="help-emoji popularity">📈</span>
                    <div>
                      <strong>Popularity (0-100%)</strong>
                      <p>
                        Public support level. Higher popularity increases
                        election chances. Starts at 50%
                      </p>
                    </div>
                  </div>
                  <div className="help-item">
                    <span className="help-emoji ethics">⚖️</span>
                    <div>
                      <strong>Ethics Score (0-100%)</strong>
                      <p>
                        Moral integrity level. Essential for legitimate victory.
                        Starts at 100%
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="help-section">
                <h3 className="help-section-title">🎯 Campaign Events</h3>
                <div className="help-text">
                  <p>
                    Every 3 days, you'll face campaign events that test your
                    decision-making:
                  </p>
                  <div className="event-examples">
                    <div className="event-example">
                      <h4>📺 Media Interview Opportunity</h4>
                      <p>
                        Choose how to handle media interactions - honesty vs.
                        political maneuvering
                      </p>
                    </div>
                    <div className="event-example">
                      <h4>💼 Corporate Donation Offer</h4>
                      <p>
                        Decide whether to accept funding and how transparently
                        to handle it
                      </p>
                    </div>
                    <div className="event-example">
                      <h4>📰 Opposition Scandal</h4>
                      <p>
                        Choose how to respond to damaging information about
                        opponents
                      </p>
                    </div>
                    <div className="event-example">
                      <h4>🎤 Rally Organization</h4>
                      <p>
                        Select campaign event scale and approach to voter
                        outreach
                      </p>
                    </div>
                    <div className="event-example">
                      <h4>🗳️ Vote Bank Politics</h4>
                      <p>
                        Decide on campaign messaging strategy and target
                        demographics
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="help-section">
                <h3 className="help-section-title">🇮🇳 Democratic Principles</h3>
                <div className="help-text">
                  <p>
                    This game teaches important aspects of Indian democracy:
                  </p>
                  <ul>
                    <li>
                      <strong>🗳️ Electoral Process:</strong> Understanding
                      campaign dynamics and voter engagement
                    </li>
                    <li>
                      <strong>💰 Campaign Finance:</strong> Learning about
                      funding sources and transparency
                    </li>
                    <li>
                      <strong>📺 Media Relations:</strong> Importance of
                      communication in democracy
                    </li>
                    <li>
                      <strong>⚖️ Ethical Leadership:</strong> Balancing winning
                      with maintaining integrity
                    </li>
                    <li>
                      <strong>🤝 Public Service:</strong> Democracy as service
                      to the people
                    </li>
                    <li>
                      <strong>🏛️ Constitutional Values:</strong> Upholding
                      democratic principles
                    </li>
                  </ul>
                </div>
              </div>

              <div className="help-section">
                <h3 className="help-section-title">🎯 Strategy Tips</h3>
                <div className="help-grid">
                  <div className="help-item">
                    <span className="help-emoji">💡</span>
                    <div>
                      <strong>Balance is Key</strong>
                      <p>
                        Don't focus only on popularity - ethics matter for
                        legitimate victory
                      </p>
                    </div>
                  </div>
                  <div className="help-item">
                    <span className="help-emoji">💰</span>
                    <div>
                      <strong>Manage Funds Wisely</strong>
                      <p>
                        Budget for daily expenses (₹50/day) and strategic
                        investments
                      </p>
                    </div>
                  </div>
                  <div className="help-item">
                    <span className="help-emoji">🤔</span>
                    <div>
                      <strong>Think Long-term</strong>
                      <p>Short-term gains might hurt long-term credibility</p>
                    </div>
                  </div>
                  <div className="help-item">
                    <span className="help-emoji">📊</span>
                    <div>
                      <strong>Monitor All Metrics</strong>
                      <p>
                        Keep track of funds, popularity, and ethics
                        simultaneously
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="help-section">
                <h3 className="help-section-title">🏆 Victory Conditions</h3>
                <div className="help-text">
                  <p>To win the election, you must achieve:</p>
                  <div className="victory-requirements">
                    <div className="requirement">
                      <span className="req-icon">📈</span>
                      <strong>Popularity: 70% or higher</strong>
                      <p>Demonstrate strong public support</p>
                    </div>
                    <div className="requirement">
                      <span className="req-icon">⚖️</span>
                      <strong>Ethics: 30% or higher</strong>
                      <p>Maintain minimum ethical standards</p>
                    </div>
                  </div>
                  <p>
                    <em>
                      Remember: A victory without ethics is not a true
                      democratic victory!
                    </em>
                  </p>
                </div>
              </div>

              <div className="help-section">
                <h3 className="help-section-title">📚 Educational Goals</h3>
                <div className="help-text">
                  <p>The Election Trail aims to:</p>
                  <ul>
                    <li>Teach the complexities of democratic campaigning</li>
                    <li>Highlight the importance of ethical leadership</li>
                    <li>
                      Demonstrate the balance between popularity and integrity
                    </li>
                    <li>Show how campaign decisions affect public trust</li>
                    <li>
                      Encourage civic engagement and responsible citizenship
                    </li>
                    <li>
                      Illustrate the challenges faced by democratic leaders
                    </li>
                  </ul>
                </div>
              </div>

              <div className="help-section">
                <h3 className="help-section-title">🎲 Game Mechanics</h3>
                <div className="help-text">
                  <ul>
                    <li>
                      <strong>⏰ Time Progression:</strong> Each decision
                      advances the campaign by 1 day
                    </li>
                    <li>
                      <strong>📅 Event Frequency:</strong> Major events occur
                      every 3 days
                    </li>
                    <li>
                      <strong>💸 Daily Costs:</strong> ₹50 daily campaign
                      expenses
                    </li>
                    <li>
                      <strong>📊 Random Fluctuations:</strong> Popularity may
                      vary slightly each day
                    </li>
                    <li>
                      <strong>🎯 Final Scoring:</strong> Popularity + (Ethics ÷
                      2) determines success
                    </li>
                    <li>
                      <strong>🔄 Replayability:</strong> Random events ensure
                      different experiences
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
                Ready to Campaign! 🗳️
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ElectionTrail;
