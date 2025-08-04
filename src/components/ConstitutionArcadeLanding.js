import React, { useState, useEffect } from "react";

const ConstitutionArcadeLanding = ({ onStartGame }) => {
  const [scrollY, setScrollY] = useState(0);
  const [showPDF, setShowPDF] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);

    window.addEventListener("scroll", handleScroll);

    // Comprehensive MetaMask error suppression
    if (typeof window !== "undefined") {
      // Suppress all MetaMask-related errors
      const originalConsoleError = console.error;
      console.error = (...args) => {
        const message = args.join(" ");
        if (
          message.includes("MetaMask") ||
          message.includes("ethereum") ||
          message.includes(
            "chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn"
          )
        ) {
          return; // Suppress MetaMask errors
        }
        originalConsoleError.apply(console, args);
      };

      // Handle window errors
      const handleError = (e) => {
        if (
          e.message &&
          (e.message.includes("MetaMask") ||
            e.message.includes("ethereum") ||
            e.filename?.includes("chrome-extension"))
        ) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
      };

      // Handle unhandled promise rejections
      const handleRejection = (e) => {
        if (
          e.reason &&
          (e.reason.message?.includes("MetaMask") ||
            e.reason.message?.includes("ethereum"))
        ) {
          e.preventDefault();
          return false;
        }
      };

      window.addEventListener("error", handleError);
      window.addEventListener("unhandledrejection", handleRejection);

      // Disable MetaMask auto-detection
      if (window.ethereum) {
        window.ethereum.autoRefreshOnNetworkChange = false;
      }

      return () => {
        window.removeEventListener("scroll", handleScroll);
        window.removeEventListener("error", handleError);
        window.removeEventListener("unhandledrejection", handleRejection);
        console.error = originalConsoleError;
      };
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const constitutionText =
    "WE, THE PEOPLE OF INDIA, having solemnly resolved to constitute India into a SOVEREIGN SOCIALIST SECULAR DEMOCRATIC REPUBLIC and to secure to all its citizens: JUSTICE, social, economic and political; LIBERTY of thought, expression, belief, faith and worship; EQUALITY of status and of opportunity; and to promote among them all FRATERNITY assuring the dignity of the individual and the unity and integrity of the Nation; IN OUR CONSTITUENT ASSEMBLY this twenty-sixth day of November, 1949, do HEREBY ADOPT, ENACT AND GIVE TO OURSELVES THIS CONSTITUTION.";

  const games = [
    {
      id: "constitutional-hangman",
      title: "Constitutional Hangman 🎯",
      inspiredBy: "Constitutional Vocabulary & All Articles",
      description:
        "Classic hangman with constitutional keywords. Features easy, medium, and hard difficulty levels with hints and categories.",
      difficulty: "Variable",
      articles: "All",
      color: "#FF6B6B",
    },
    {
      id: "preamble-puzzle-quest",
      title: "Preamble Puzzle Quest 🧩",
      inspiredBy: "The Preamble - Foundation of Constitution",
      description:
        "Tap words to rebuild the Preamble in order. Features time-attack mode and hint system.",
      difficulty: "Easy",
      articles: "Preamble",
      color: "#4ECDC4",
    },
    {
      id: "civic-scorekeeper",
      title: "Civic Scorekeeper 👥",
      inspiredBy: "Article 51A - Fundamental Duties",
      description:
        "Life simulation where daily civic choices affect your constitutional duty score.",
      difficulty: "Easy",
      articles: "Article 51A",
      color: "#45B7D1",
    },
    {
      id: "election-trail",
      title: "Election Trail 🗳️",
      inspiredBy: "Articles 324–329 - Electoral Process",
      description:
        "Campaign manager simulation navigating ethical and legal challenges in elections.",
      difficulty: "Hard",
      articles: "324–329",
      color: "#96CEB4",
    },
    {
      id: "constitutional-snakes-ladders",
      title: "Snakes & Ladders of the Constitution 🇮🇳",
      inspiredBy: "Complete Constitutional Journey",
      description:
        "2D board game where players learn Constitution by progressing through themed 10×10 grid. Ladders reward constitutional values, snakes penalize violations.",
      difficulty: "Medium",
      articles: "All",
      color: "#9B59B6",
    },
    {
      id: "ashoka-vault-knowledge-unlock",
      title: "Ashoka Vault - Knowledge Unlock 🔓",
      inspiredBy: "Complete Constitutional Knowledge",
      description:
        "Expert-level puzzle game unlocking rare constitutional facts, historical clips, and artifacts.",
      difficulty: "Expert",
      articles: "All",
      color: "#FECA57",
    },
  ];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "#90EE90";
      case "Variable":
        return "#FFD700";
      case "Medium":
        return "#87CEEB";
      case "Hard":
        return "#FF6B6B";
      case "Expert":
        return "#8A2BE2";
      default:
        return "#FFD700";
    }
  };

  const scrollToGames = () => {
    const gamesSection = document.getElementById("games-section");
    const gameCards = gamesSection.querySelectorAll(
      '[style*="grid-template-columns"]'
    )[0];

    // Calculate the position to show all games
    const sectionTop = gamesSection.offsetTop;
    const sectionHeight = gamesSection.offsetHeight;
    const viewportHeight = window.innerHeight;

    // Scroll to position that shows the entire games section
    const scrollPosition = sectionTop - (viewportHeight - sectionHeight) / 2;

    window.scrollTo({
      top: Math.max(0, scrollPosition),
      behavior: "smooth",
    });
  };

  return (
    <div
      style={{
        fontFamily: "Cinzel, serif",
        background: "linear-gradient(135deg, #F4F1E8, #E8E2D4)",
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated Background Text */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "200%",
          height: "100%",
          opacity: 0.05,
          fontSize: "1.2rem",
          lineHeight: "2",
          color: "#8B4513",
          transform: `translateX(-${scrollY * 0.5}px)`,
          zIndex: 0,
          padding: "50px",
          whiteSpace: "pre-wrap",
        }}
      >
        {constitutionText.repeat(10)}
      </div>

      {/* Hero Section */}
      <section
        style={{
          position: "relative",
          zIndex: 1,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          padding: "20px",
          background: `linear-gradient(rgba(244, 241, 232, 0.9), rgba(232, 226, 212, 0.9))`,
        }}
      >
        {/* Single Maximized Flag Background */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage: "url('/flag.gif')",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            opacity: 0.25,
            zIndex: 1,
            pointerEvents: "none",
          }}
        />

        <h1
          style={{
            fontSize: "4rem",
            color: "#8B4513",
            marginBottom: "20px",
            textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
            fontWeight: "700",
            position: "relative",
            zIndex: 2,
          }}
        >
          Welcome to IndiaCon Quest
        </h1>

        <p
          style={{
            fontSize: "2rem",
            color: "#654321",
            marginBottom: "50px",
            maxWidth: "800px",
            lineHeight: "1.6",
          }}
        >
          Learn India's Constitution through interactive, law-based games!
        </p>

        <button
          onClick={scrollToGames}
          style={{
            background: "linear-gradient(135deg, #FF9933, #138808)",
            color: "white",
            border: "none",
            padding: "20px 40px",
            fontSize: "1.3rem",
            borderRadius: "50px",
            cursor: "pointer",
            fontFamily: "Cinzel, serif",
            fontWeight: "600",
            boxShadow: "0 6px 12px rgba(0,0,0,0.2)",
            transition: "all 0.3s ease",
            textTransform: "uppercase",
            marginBottom: "100px",
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "translateY(-3px)";
            e.target.style.boxShadow = "0 8px 16px rgba(0,0,0,0.3)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "0 6px 12px rgba(0,0,0,0.2)";
          }}
        >
          🎮 View Games
        </button>

        {/* National Emblem of India */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: "20px",
          }}
        >
          <img
            src="/emb.png"
            alt="National Emblem of India"
            style={{
              width: "200px",
              height: "auto",
              filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.8))",
              maxHeight: "300px",
            }}
          />

          {/* Satyameva Jayate */}
          <div
            style={{
              marginTop: "15px",
              fontSize: "2rem",
              fontWeight: "700",
              color: "#8B4513",
              fontFamily: "serif",
              textAlign: "center",
              textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
            }}
          >
            सत्यमेव जयते
          </div>
          <div
            style={{
              fontSize: "1.5rem",
              color: "#654321",
              fontStyle: "italic",
              marginTop: "5px",
            }}
          >
            (Truth Alone Triumphs)
          </div>
        </div>
      </section>

      {/* Constitution Primer */}
      <section
        style={{
          position: "relative",
          zIndex: 1,
          padding: "80px 20px",
          background: "rgba(255, 255, 255, 0.9)",
          borderTop: "5px solid #FFD700",
          borderBottom: "5px solid #FFD700",
        }}
      >
        <div
          style={{ maxWidth: "1200px", margin: "0 auto", textAlign: "center" }}
        >
          <h2
            style={{
              fontSize: "3rem",
              color: "#8B4513",
              marginBottom: "30px",
              fontWeight: "700",
            }}
          >
            What is the Constitution of India?
          </h2>

          <p
            style={{
              fontSize: "1.3rem",
              color: "#654321",
              lineHeight: "1.8",
              marginBottom: "40px",
              maxWidth: "900px",
              margin: "0 auto 40px auto",
            }}
          >
            The Constitution of India is the supreme law that defines the
            fundamental political principles, rights, duties, and powers of
            institutions. It ensures justice, liberty, equality, and fraternity
            for all citizens.
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "60px",
              marginBottom: "40px",
              flexWrap: "wrap",
            }}
          >
            {/* Parliament Silhouette */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                opacity: 0.7,
              }}
            >
              <div
                style={{
                  width: "80px",
                  height: "60px",
                  background: "#8B4513",
                  borderRadius: "10px 10px 0 0",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "-20px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "40px",
                    height: "40px",
                    background: "#8B4513",
                    borderRadius: "50%",
                  }}
                />
              </div>
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "#654321",
                  marginTop: "10px",
                }}
              >
                Parliament
              </p>
            </div>

            {/* Scales of Justice */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                opacity: 0.7,
              }}
            >
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "10px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "2px",
                    height: "40px",
                    background: "#8B4513",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: "10px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "50px",
                    height: "2px",
                    background: "#8B4513",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: "12px",
                    left: "5px",
                    width: "15px",
                    height: "10px",
                    border: "2px solid #8B4513",
                    borderTop: "none",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: "12px",
                    right: "5px",
                    width: "15px",
                    height: "10px",
                    border: "2px solid #8B4513",
                    borderTop: "none",
                  }}
                />
              </div>
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "#654321",
                  marginTop: "10px",
                }}
              >
                Justice
              </p>
            </div>

            {/* Ashoka Chakra */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                opacity: 0.7,
              }}
            >
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  border: "3px solid #000080",
                  borderRadius: "50%",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "40px",
                    height: "40px",
                    background:
                      "conic-gradient(from 0deg, #000080 0deg, transparent 15deg, #000080 30deg, transparent 45deg)",
                    borderRadius: "50%",
                  }}
                />
              </div>
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "#654321",
                  marginTop: "10px",
                }}
              >
                Unity
              </p>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: "20px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <a
              href="https://legislative.gov.in/constitution-of-india/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                background: "linear-gradient(135deg, #8B4513, #654321)",
                color: "white",
                padding: "15px 30px",
                fontSize: "1.1rem",
                borderRadius: "25px",
                textDecoration: "none",
                fontFamily: "Cinzel, serif",
                fontWeight: "600",
                boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 6px 12px rgba(0,0,0,0.3)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
              }}
            >
              📥 Download Constitution (PDF)
            </a>

            <button
              onClick={() => setShowPDF(true)}
              style={{
                background: "linear-gradient(135deg, #FF9933, #138808)",
                color: "white",
                border: "none",
                padding: "15px 30px",
                fontSize: "1.1rem",
                borderRadius: "25px",
                cursor: "pointer",
                fontFamily: "Cinzel, serif",
                fontWeight: "600",
                boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 6px 12px rgba(0,0,0,0.3)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
              }}
            >
              📖 Read Constitution (English)
            </button>
          </div>
        </div>
      </section>

      {/* Game Hub Preview */}
      <section
        id="games-section"
        style={{
          position: "relative",
          zIndex: 1,
          padding: "80px 20px",
          background: "rgba(244, 241, 232, 0.95)",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "3rem",
              color: "#8B4513",
              textAlign: "center",
              marginBottom: "50px",
              fontWeight: "700",
            }}
          >
            🕹️ Featured Constitutional Games
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
              gap: "30px",
            }}
          >
            {games.map((game, index) => (
              <div
                key={game.id}
                style={{
                  background: "white",
                  borderRadius: "20px",
                  padding: "30px",
                  boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                  border: `3px solid ${game.color}`,
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  position: "relative",
                  overflow: "hidden",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow =
                    "0 12px 24px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 16px rgba(0,0,0,0.1)";
                }}
              >
                {/* Difficulty Badge */}
                <div
                  style={{
                    position: "absolute",
                    top: "15px",
                    right: "15px",
                    background: getDifficultyColor(game.difficulty),
                    color: game.difficulty === "Easy" ? "#000" : "#fff",
                    padding: "5px 12px",
                    borderRadius: "15px",
                    fontSize: "0.8rem",
                    fontWeight: "600",
                  }}
                >
                  {game.difficulty}
                </div>

                <h3
                  style={{
                    fontSize: "1.8rem",
                    color: "#8B4513",
                    marginBottom: "15px",
                    fontWeight: "700",
                  }}
                >
                  {game.title}
                </h3>

                <div
                  style={{
                    background: "rgba(139, 69, 19, 0.1)",
                    padding: "10px 15px",
                    borderRadius: "10px",
                    marginBottom: "15px",
                  }}
                >
                  <p
                    style={{
                      fontSize: "0.9rem",
                      color: "#8B4513",
                      margin: "0",
                      fontWeight: "600",
                    }}
                  >
                    📚 Inspired By: {game.inspiredBy}
                  </p>
                </div>

                <p
                  style={{
                    fontSize: "1rem",
                    color: "#654321",
                    lineHeight: "1.6",
                    marginBottom: "20px",
                  }}
                >
                  {game.description}
                </p>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "20px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.9rem",
                      color: "#8B4513",
                      fontWeight: "600",
                    }}
                  >
                    📊 Articles: {game.articles}
                  </span>
                </div>

                <button
                  onClick={() => onStartGame(game.id)}
                  style={{
                    width: "100%",
                    background: `linear-gradient(135deg, ${game.color}, ${game.color}dd)`,
                    color: "white",
                    border: "none",
                    padding: "15px",
                    fontSize: "1.1rem",
                    borderRadius: "15px",
                    cursor: "pointer",
                    fontFamily: "Cinzel, serif",
                    fontWeight: "600",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "scale(1.02)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "scale(1)";
                  }}
                >
                  🔗 Play Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          position: "relative",
          zIndex: 1,
          background: "linear-gradient(135deg, #8B4513, #654321)",
          color: "white",
          padding: "60px 20px 40px 20px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <blockquote
            style={{
              fontSize: "1.5rem",
              fontStyle: "italic",
              marginBottom: "30px",
              lineHeight: "1.6",
              maxWidth: "800px",
              margin: "0 auto 30px auto",
            }}
          >
            "WE, THE PEOPLE OF INDIA, having solemnly resolved to constitute
            India into a SOVEREIGN SOCIALIST SECULAR DEMOCRATIC REPUBLIC..."
          </blockquote>
          <p style={{ fontSize: "0.9rem", opacity: 0.8, marginBottom: "10px" }}>
            — The Preamble
          </p>

          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.3)",
              paddingTop: "30px",
              marginTop: "30px",
            }}
          >
            <p style={{ fontSize: "1.1rem", marginBottom: "15px" }}>
              Built by 🇮🇳 youth, inspired by justice & liberty
            </p>
            <p style={{ fontSize: "0.9rem", opacity: 0.7 }}>
              PDF courtesy Government of India. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* PDF Modal */}
      {showPDF && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            zIndex: 1000,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          onClick={() => setShowPDF(false)}
        >
          <div
            style={{
              width: "90%",
              height: "90%",
              backgroundColor: "white",
              borderRadius: "10px",
              position: "relative",
              display: "flex",
              flexDirection: "column",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: "20px",
                borderBottom: "2px solid #8B4513",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#F4F1E8",
                borderRadius: "10px 10px 0 0",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  color: "#8B4513",
                  fontFamily: "Cinzel, serif",
                  fontSize: "1.5rem",
                  fontWeight: "700",
                }}
              >
                📖 Constitution of India (English)
              </h3>
              <button
                onClick={() => setShowPDF(false)}
                style={{
                  background: "#FF6B6B",
                  color: "white",
                  border: "none",
                  borderRadius: "50%",
                  width: "40px",
                  height: "40px",
                  fontSize: "1.2rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "#FF5252";
                  e.target.style.transform = "scale(1.1)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "#FF6B6B";
                  e.target.style.transform = "scale(1)";
                }}
              >
                ✕
              </button>
            </div>

            {/* PDF Viewer */}
            <div
              style={{
                flex: 1,
                padding: "20px",
                overflow: "hidden",
              }}
            >
              <iframe
                src="/constitution-english.pdf"
                style={{
                  width: "100%",
                  height: "100%",
                  border: "none",
                  borderRadius: "5px",
                }}
                title="Constitution of India (English)"
              />
            </div>

            {/* Modal Footer */}
            <div
              style={{
                padding: "15px 20px",
                borderTop: "1px solid #ddd",
                backgroundColor: "#F9F9F9",
                borderRadius: "0 0 10px 10px",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: "0.9rem",
                  color: "#666",
                  fontStyle: "italic",
                }}
              >
                Constitution of India - Official English Version | Government of
                India
              </p>
            </div>
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @import url("https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&display=swap");
      `}</style>
    </div>
  );
};

export default ConstitutionArcadeLanding;
