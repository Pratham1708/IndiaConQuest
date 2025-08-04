import React, { useState, useEffect } from "react";

const AshokaVault = ({ onBackToHub }) => {
  const [gameState, setGameState] = useState({
    unlockedGames: 0,
    totalGames: 6,
    vaultOpen: false,
    currentPuzzle: 0,
    puzzlesSolved: 0,
    score: 0,
    achievements: [],
    phase: "entry", // entry, puzzles, vault, complete
  });

  const [selectedTreasure, setSelectedTreasure] = useState(null);
  const [showHelp, setShowHelp] = useState(false);
  const [randomizedPuzzles, setRandomizedPuzzles] = useState([]);

  // Base puzzle templates for randomization
  const PUZZLE_TEMPLATES = [
    {
      id: 1,
      title: "Constitutional Chronology",
      question:
        "Arrange these constitutional milestones in chronological order:",
      type: "sequence",
      variants: [
        [
          { text: "Government of India Act 1935", year: 1935 },
          { text: "Constituent Assembly Formation", year: 1946 },
          { text: "Constitution Adoption", year: 1949 },
          { text: "Constitution Enforcement", year: 1950 },
        ],
        [
          { text: "Quit India Movement", year: 1942 },
          { text: "Cabinet Mission Plan", year: 1946 },
          { text: "Independence Day", year: 1947 },
          { text: "Republic Day", year: 1950 },
        ],
        [
          { text: "Simon Commission", year: 1928 },
          { text: "Round Table Conferences", year: 1930 },
          { text: "Government of India Act", year: 1935 },
          { text: "Mountbatten Plan", year: 1947 },
        ],
      ],
    },
    {
      id: 2,
      title: "Fundamental Rights Cipher",
      question: "Decode this constitutional principle:",
      type: "cipher",
      variants: [
        {
          cipher: "HTGIR OT YTILAUQE",
          answer: "right to equality",
          hint: "Read backwards",
        },
        {
          cipher: "ECITSUJ LAICOS",
          answer: "social justice",
          hint: "Read backwards",
        },
        {
          cipher: "MODEERF FO HCEEPS",
          answer: "freedom of speech",
          hint: "Read backwards",
        },
        {
          cipher: "YTINRETARF DNA YTINU",
          answer: "unity and fraternity",
          hint: "Read backwards",
        },
        {
          cipher: "ECAR DNA DEERC",
          answer: "creed and race",
          hint: "Read backwards",
        },
      ],
    },
    {
      id: 3,
      title: "Article Assembly",
      type: "multiple-choice",
      variants: [
        {
          question:
            "Which articles form the 'Golden Triangle' of the Constitution?",
          options: [
            "Articles 14, 19, 21",
            "Articles 32, 226, 136",
            "Articles 1, 2, 3",
            "Articles 52, 53, 54",
          ],
          correct: "Articles 14, 19, 21",
          explanation:
            "Articles 14 (Equality), 19 (Freedom), and 21 (Life) form the Golden Triangle",
        },
        {
          question:
            "Which article is known as the 'Heart and Soul' of the Constitution?",
          options: [
            "Article 32 - Right to Constitutional Remedies",
            "Article 21 - Right to Life and Liberty",
            "Article 14 - Right to Equality",
            "Article 19 - Freedom of Speech",
          ],
          correct: "Article 32 - Right to Constitutional Remedies",
          explanation:
            "Dr. Ambedkar called Article 32 the 'Heart and Soul' of the Constitution",
        },
        {
          question:
            "Which part of the Constitution deals with Fundamental Rights?",
          options: [
            "Part III (Articles 12-35)",
            "Part IV (Articles 36-51)",
            "Part II (Articles 5-11)",
            "Part V (Articles 52-151)",
          ],
          correct: "Part III (Articles 12-35)",
          explanation:
            "Part III contains Fundamental Rights from Articles 12 to 35",
        },
      ],
    },
    {
      id: 4,
      title: "Constitutional Mathematics",
      type: "calculation",
      variants: [
        {
          question:
            "How many articles were added to the Constitution through amendments? (Original: 395 articles, Current: 448 articles)",
          answer: 53,
        },
        {
          question:
            "How many amendments have been made to the Constitution as of 2023?",
          answer: 105,
        },
        {
          question: "How many schedules does the Constitution currently have?",
          answer: 12,
        },
      ],
    },
    {
      id: 5,
      title: "Preamble Pattern",
      question: "Complete the pattern from the Preamble:",
      type: "pattern",
      variants: [
        {
          text: "WE, THE PEOPLE OF INDIA, having solemnly resolved to constitute India into a _____ REPUBLIC",
          words: ["SOVEREIGN", "SOCIALIST", "SECULAR", "DEMOCRATIC"],
        },
        {
          text: "to secure to all its citizens: JUSTICE, social, economic and _____",
          words: ["POLITICAL", "CULTURAL", "RELIGIOUS", "EDUCATIONAL"],
        },
        {
          text: "LIBERTY of thought, expression, belief, faith and _____",
          words: ["WORSHIP", "SPEECH", "MOVEMENT", "ASSEMBLY"],
        },
      ],
    },
  ];

  // Generate randomized puzzles
  const generateRandomizedPuzzles = () => {
    return PUZZLE_TEMPLATES.map((template) => {
      const variant =
        template.variants[Math.floor(Math.random() * template.variants.length)];

      switch (template.type) {
        case "sequence":
          return {
            ...template,
            items: shuffleArray([...variant]),
          };
        case "cipher":
          return {
            ...template,
            question: `${template.question} '${variant.cipher}'`,
            answer: variant.answer,
            hint: variant.hint,
          };
        case "multiple-choice":
          const correctAnswer = variant.correct;
          const shuffledOptions = shuffleArray([...variant.options]);
          const newCorrectIndex = shuffledOptions.indexOf(correctAnswer);
          return {
            ...template,
            question: variant.question,
            options: shuffledOptions,
            correct: newCorrectIndex,
            explanation: variant.explanation,
          };
        case "calculation":
          return {
            ...template,
            question: variant.question,
            answer: variant.answer,
          };
        case "pattern":
          return {
            ...template,
            question: variant.text,
            words: shuffleArray([...variant.words]),
          };
        default:
          return template;
      }
    });
  };

  // Utility function to shuffle array
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Get current puzzles (randomized or default)
  const VAULT_PUZZLES =
    randomizedPuzzles.length > 0
      ? randomizedPuzzles
      : PUZZLE_TEMPLATES.map((t) =>
          t.variants ? { ...t, ...t.variants[0] } : t
        );

  const VAULT_TREASURES = [
    {
      title: "Constituent Assembly Debates",
      description: "Access to digitized debates that shaped our Constitution",
      content:
        "Dr. Ambedkar: 'The Constitution is not a mere lawyers' document, it is a vehicle of Life, and its spirit is always the spirit of Age.'",
      type: "historical",
    },
    {
      title: "Rare Constitutional Facts",
      description: "Lesser-known facts about the Constitution",
      content:
        "The Constitution was handwritten in both Hindi and English. No printing or typewriting was used. It took 2 years, 11 months and 18 days to complete.",
      type: "facts",
    },

    {
      title: "Constitutional Art Gallery",
      description: "Artistic representations of constitutional values",
      content:
        "Explore the visual heritage of India's Constitution through these artistic masterpieces.",
      type: "art",
      images: [
        {
          src: "/c1.png",
          title: "Constitutional Preamble Artwork",
          description:
            "This artistic representation showcases the opening words of our Constitution - 'WE, THE PEOPLE OF INDIA'. The calligraphic design emphasizes the democratic foundation where sovereignty lies with the people. The ornate styling reflects the solemnity and importance of the constitutional commitment made by the nation's founders in 1950.",
        },
        {
          src: "/c2.png",
          title: "Fundamental Rights Illustration",
          description:
            "A visual depiction of the Fundamental Rights enshrined in Part III of the Constitution (Articles 12-35). This artwork symbolically represents the six fundamental rights: Right to Equality, Right to Freedom, Right against Exploitation, Right to Freedom of Religion, Cultural and Educational Rights, and Right to Constitutional Remedies. The artistic elements highlight how these rights form the cornerstone of Indian democracy.",
        },
        {
          src: "/c3.png",
          title: "Directive Principles Visualization",
          description:
            "This piece illustrates the Directive Principles of State Policy from Part IV (Articles 36-51) of the Constitution. Though not legally enforceable, these principles guide governance and policy-making. The artwork captures the vision of social and economic democracy, emphasizing the state's duty to promote welfare, justice, and the common good of all citizens.",
        },
        {
          src: "/c4.png",
          title: "Constitutional Assembly Heritage",
          description:
            "A tribute to the Constituent Assembly and the founding fathers of the Constitution. This artwork honors the 299 members who deliberated for 2 years, 11 months, and 18 days to craft the world's longest written constitution. The visual elements represent the diversity of voices, the democratic process, and the collective wisdom that shaped modern India's constitutional framework.",
        },
      ],
    },
    {
      title: "Interactive Constitution Map",
      description: "Visual journey through constitutional provisions",
      content:
        "Navigate through the interconnected structure of India's Constitution",
      type: "interactive",
      mapData: {
        sections: [
          {
            id: "preamble",
            title: "Preamble",
            description: "The soul of the Constitution",
            details:
              "WE, THE PEOPLE OF INDIA, having solemnly resolved to constitute India into a SOVEREIGN SOCIALIST SECULAR DEMOCRATIC REPUBLIC...",
            color: "#FFD700",
            position: { x: 50, y: 10 },
            connections: ["part1", "part3", "part4"],
            keyPoints: [
              "Source of authority: 'We, the People'",
              "Four pillars: Sovereign, Socialist, Secular, Democratic",
              "Objectives: Justice, Liberty, Equality, Fraternity",
              "Added 'Socialist' and 'Secular' in 42nd Amendment (1976)",
            ],
          },
          {
            id: "part1",
            title: "Part I: The Union and its Territory",
            description: "Articles 1-4: Defines India as a Union of States",
            details:
              "Establishes India as 'Union of States' rather than 'Federation'",
            color: "#FF6B6B",
            position: { x: 20, y: 25 },
            connections: ["part2", "part5"],
            keyPoints: [
              "Article 1: India as Union of States",
              "Article 2: Admission of new states",
              "Article 3: Formation of new states",
              "Article 4: Laws for admission and formation",
            ],
          },
          {
            id: "part2",
            title: "Part II: Citizenship",
            description: "Articles 5-11: Who is an Indian citizen",
            details:
              "Defines citizenship at commencement and acquisition/termination",
            color: "#4ECDC4",
            position: { x: 10, y: 40 },
            connections: ["part3"],
            keyPoints: [
              "Citizenship at commencement (1950)",
              "Rights of migration between India-Pakistan",
              "Parliament's power to regulate citizenship",
              "Single citizenship (unlike USA's dual citizenship)",
            ],
          },
          {
            id: "part3",
            title: "Part III: Fundamental Rights",
            description: "Articles 12-35: The Golden Charter",
            details:
              "Six categories of fundamental rights - the cornerstone of democracy",
            color: "#45B7D1",
            position: { x: 30, y: 35 },
            connections: ["part4", "part18"],
            keyPoints: [
              "Right to Equality (Articles 14-18)",
              "Right to Freedom (Articles 19-22)",
              "Right against Exploitation (Articles 23-24)",
              "Right to Freedom of Religion (Articles 25-28)",
              "Cultural and Educational Rights (Articles 29-30)",
              "Right to Constitutional Remedies (Article 32)",
            ],
            subSections: [
              {
                name: "Article 14",
                desc: "Equality before law",
                importance: "high",
              },
              { name: "Article 19", desc: "Six freedoms", importance: "high" },
              {
                name: "Article 21",
                desc: "Right to life and liberty",
                importance: "high",
              },
              {
                name: "Article 32",
                desc: "Heart and soul of Constitution",
                importance: "critical",
              },
            ],
          },
          {
            id: "part4",
            title: "Part IV: Directive Principles",
            description: "Articles 36-51: Guidelines for governance",
            details: "Non-justiciable principles to guide state policy",
            color: "#96CEB4",
            position: { x: 70, y: 35 },
            connections: ["part4a", "part5"],
            keyPoints: [
              "Social and economic democracy",
              "Not enforceable in courts",
              "Inspired by Irish Constitution",
              "Balance between individual rights and social welfare",
            ],
            subSections: [
              {
                name: "Article 39",
                desc: "Adequate livelihood",
                importance: "high",
              },
              {
                name: "Article 44",
                desc: "Uniform Civil Code",
                importance: "high",
              },
              {
                name: "Article 48",
                desc: "Agriculture and animal husbandry",
                importance: "medium",
              },
            ],
          },
          {
            id: "part4a",
            title: "Part IVA: Fundamental Duties",
            description: "Article 51A: Duties of citizens",
            details: "11 fundamental duties added by 42nd Amendment",
            color: "#FFEAA7",
            position: { x: 80, y: 50 },
            connections: ["part5"],
            keyPoints: [
              "Added in 1976 by 42nd Amendment",
              "Inspired by Soviet Constitution",
              "11 duties including respect for Constitution",
              "Not legally enforceable",
            ],
          },
          {
            id: "part5",
            title: "Part V: The Union Government",
            description: "Articles 52-151: Executive, Legislature, Judiciary",
            details: "Structure and powers of central government",
            color: "#DDA0DD",
            position: { x: 40, y: 55 },
            connections: ["part6", "part11"],
            keyPoints: [
              "President: Head of State (Articles 52-62)",
              "Parliament: Lok Sabha & Rajya Sabha (Articles 79-122)",
              "Council of Ministers (Articles 74-75)",
              "Supreme Court (Articles 124-147)",
            ],
            subSections: [
              {
                name: "President",
                desc: "Nominal executive head",
                importance: "high",
              },
              {
                name: "Prime Minister",
                desc: "Real executive head",
                importance: "critical",
              },
              {
                name: "Parliament",
                desc: "Legislative body",
                importance: "critical",
              },
              {
                name: "Supreme Court",
                desc: "Highest judicial authority",
                importance: "critical",
              },
            ],
          },
          {
            id: "part6",
            title: "Part VI: State Governments",
            description:
              "Articles 152-237: State executive, legislature, judiciary",
            details: "Structure and powers of state governments",
            color: "#FFB6C1",
            position: { x: 60, y: 70 },
            connections: ["part7", "part8"],
            keyPoints: [
              "Governor: Constitutional head of state",
              "Chief Minister: Real executive head",
              "State Legislature: Assembly & Council",
              "High Courts: State level judiciary",
            ],
          },
          {
            id: "part7",
            title: "Part VII: States in B Schedule",
            description: "Repealed by Constitution 7th Amendment Act, 1956",
            details: "Originally dealt with Part B states",
            color: "#D3D3D3",
            position: { x: 20, y: 70 },
            connections: [],
            keyPoints: [
              "Dealt with former princely states",
              "Repealed in 1956",
              "Part of constitutional history",
              "Reorganization of states",
            ],
          },
          {
            id: "part8",
            title: "Part VIII: Union Territories",
            description: "Articles 239-241: Administration of UTs",
            details: "Special provisions for Union Territories",
            color: "#F0E68C",
            position: { x: 80, y: 75 },
            connections: ["part9"],
            keyPoints: [
              "Direct central government control",
              "Administrator/Lt. Governor as head",
              "Special status territories",
              "Delhi and Puducherry have assemblies",
            ],
          },
          {
            id: "part9",
            title: "Part IX: Panchayats",
            description: "Articles 243-243O: Local self-government (rural)",
            details: "73rd Amendment: Constitutional status to Panchayati Raj",
            color: "#98FB98",
            position: { x: 25, y: 85 },
            connections: ["part9a"],
            keyPoints: [
              "Added by 73rd Amendment (1992)",
              "Three-tier system: Village, Block, District",
              "33% reservation for women",
              "Grassroots democracy",
            ],
          },
          {
            id: "part9a",
            title: "Part IXA: Municipalities",
            description: "Articles 243P-243ZG: Local self-government (urban)",
            details:
              "74th Amendment: Constitutional status to urban local bodies",
            color: "#87CEEB",
            position: { x: 75, y: 85 },
            connections: ["part11"],
            keyPoints: [
              "Added by 74th Amendment (1992)",
              "Municipal Corporations, Councils, Nagar Panchayats",
              "Urban planning and development",
              "Democratic decentralization",
            ],
          },
          {
            id: "part11",
            title: "Part XI: Relations between Union and States",
            description: "Articles 245-263: Federal structure",
            details: "Distribution of powers and coordination mechanisms",
            color: "#DEB887",
            position: { x: 50, y: 75 },
            connections: ["part12"],
            keyPoints: [
              "Legislative relations (Articles 245-255)",
              "Administrative relations (Articles 256-263)",
              "Three lists: Union, State, Concurrent",
              "Inter-state councils and disputes",
            ],
          },
          {
            id: "part12",
            title: "Part XII: Finance, Property, Contracts",
            description: "Articles 264-300A: Financial provisions",
            details: "Distribution of revenues and financial relations",
            color: "#F4A460",
            position: { x: 30, y: 90 },
            connections: ["part13", "part14"],
            keyPoints: [
              "Distribution of tax revenues",
              "Finance Commission (Article 280)",
              "Borrowing powers",
              "Property rights and contracts",
            ],
          },
          {
            id: "part18",
            title: "Part XVIII: Emergency Provisions",
            description: "Articles 352-360: Three types of emergencies",
            details: "National, State, and Financial emergencies",
            color: "#FF4500",
            position: { x: 10, y: 60 },
            connections: ["part19"],
            keyPoints: [
              "National Emergency (Article 352)",
              "President's Rule (Article 356)",
              "Financial Emergency (Article 360)",
              "Suspension of fundamental rights",
            ],
          },
          {
            id: "part20",
            title: "Part XX: Amendment",
            description: "Article 368: Constitutional amendment procedure",
            details: "How the Constitution can be changed",
            color: "#8A2BE2",
            position: { x: 90, y: 30 },
            connections: [],
            keyPoints: [
              "Three types of amendments",
              "Simple majority, Special majority, Ratification",
              "105 amendments so far (as of 2023)",
              "Basic structure doctrine limits",
            ],
          },
        ],
        timeline: [
          {
            year: 1946,
            event: "Constituent Assembly formed",
            importance: "high",
          },
          {
            year: 1947,
            event: "Independence and Partition",
            importance: "critical",
          },
          {
            year: 1949,
            event: "Constitution adopted (Nov 26)",
            importance: "critical",
          },
          {
            year: 1950,
            event: "Constitution enforced (Jan 26)",
            importance: "critical",
          },
          {
            year: 1976,
            event: "42nd Amendment - Major changes",
            importance: "high",
          },
          {
            year: 1992,
            event: "73rd & 74th Amendments - Local governance",
            importance: "high",
          },
        ],
        statistics: {
          totalArticles: 448,
          totalParts: 25,
          totalSchedules: 12,
          amendments: 105,
          words: "145,000+",
          pages: "395 (original)",
        },
      },
    },
  ];

  const ACHIEVEMENTS = [
    {
      id: "speed_solver",
      name: "Speed Solver",
      description: "Solved all puzzles in under 5 minutes",
      icon: "⚡",
    },
    {
      id: "perfect_score",
      name: "Perfect Score",
      description: "Achieved maximum points",
      icon: "💯",
    },
    {
      id: "vault_master",
      name: "Vault Master",
      description: "Unlocked all treasures",
      icon: "🔓",
    },
    {
      id: "constitutional_scholar",
      name: "Constitutional Scholar",
      description: "Demonstrated deep knowledge",
      icon: "🎓",
    },
    {
      id: "persistence",
      name: "Persistent Learner",
      description: "Never gave up on difficult puzzles",
      icon: "💪",
    },
  ];

  useEffect(() => {
    // Initialize randomized puzzles
    setRandomizedPuzzles(generateRandomizedPuzzles());

    // Vault opens when user starts the puzzles, not based on completed games
    setGameState((prev) => ({
      ...prev,
      unlockedGames: 15, // Show as if all games are completed
      vaultOpen: true, // Always allow entry to puzzles
    }));
  }, []);

  const startPuzzles = () => {
    setGameState((prev) => ({ ...prev, phase: "puzzles" }));
  };

  const solvePuzzle = (isCorrect, points = 20) => {
    if (isCorrect) {
      const newPuzzlesSolved = gameState.puzzlesSolved + 1;
      const newScore = gameState.score + points;

      setGameState((prev) => ({
        ...prev,
        puzzlesSolved: newPuzzlesSolved,
        score: newScore,
        currentPuzzle: prev.currentPuzzle + 1,
      }));

      if (newPuzzlesSolved >= VAULT_PUZZLES.length) {
        setTimeout(() => {
          setGameState((prev) => ({ ...prev, phase: "vault" }));
        }, 1500);
      }
    }
  };

  const unlockAchievement = (achievementId) => {
    if (!gameState.achievements.includes(achievementId)) {
      setGameState((prev) => ({
        ...prev,
        achievements: [...prev.achievements, achievementId],
      }));
    }
  };

  const restartVault = () => {
    setGameState((prev) => ({
      ...prev,
      currentPuzzle: 0,
      puzzlesSolved: 0,
      score: 0,
      achievements: [],
      phase: "entry",
    }));
  };

  const renderPuzzle = () => {
    const puzzle = VAULT_PUZZLES[gameState.currentPuzzle];
    if (!puzzle) return null;

    switch (puzzle.type) {
      case "sequence":
        return <SequencePuzzle puzzle={puzzle} onSolve={solvePuzzle} />;
      case "cipher":
        return <CipherPuzzle puzzle={puzzle} onSolve={solvePuzzle} />;
      case "multiple-choice":
        return <MultipleChoicePuzzle puzzle={puzzle} onSolve={solvePuzzle} />;
      case "calculation":
        return <CalculationPuzzle puzzle={puzzle} onSolve={solvePuzzle} />;
      case "pattern":
        return <PatternPuzzle puzzle={puzzle} onSolve={solvePuzzle} />;
      default:
        return null;
    }
  };

  return (
    <div className="ashoka-vault">
      <style jsx>{`
        .ashoka-vault {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
          min-height: 100vh;
          background: linear-gradient(135deg, #1a1a2e, #16213e, #0f3460);
          color: var(--white);
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
          color: var(--gold);
          margin: 0;
          text-align: center;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        }

        .progress-display {
          font-size: 1.3rem;
          color: var(--gold);
          font-weight: 600;
        }

        .vault-entry {
          text-align: center;
          padding: 50px;
          background: rgba(255, 215, 0, 0.1);
          border: 3px solid var(--gold);
          border-radius: 20px;
          margin-bottom: 30px;
        }

        .vault-title {
          font-size: 3rem;
          color: var(--gold);
          margin-bottom: 20px;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        }

        .vault-description {
          font-size: 1.3rem;
          color: var(--white);
          margin-bottom: 30px;
          line-height: 1.6;
        }

        .progress-bar {
          width: 100%;
          height: 20px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 10px;
          overflow: hidden;
          margin: 20px 0;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--saffron), var(--gold));
          transition: width 0.3s ease;
        }

        .entry-button {
          background: linear-gradient(135deg, var(--gold), var(--saffron));
          color: var(--navy-blue);
          border: none;
          padding: 20px 40px;
          border-radius: 25px;
          font-family: "Cinzel", serif;
          font-weight: 700;
          cursor: pointer;
          font-size: 1.3rem;
          transition: all 0.3s ease;
          text-transform: uppercase;
        }

        .entry-button:hover {
          transform: scale(1.05);
          box-shadow: 0 8px 20px rgba(255, 215, 0, 0.3);
        }

        .entry-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .puzzle-area {
          background: rgba(255, 255, 255, 0.1);
          border: 3px solid var(--gold);
          border-radius: 20px;
          padding: 40px;
          margin-bottom: 30px;
          backdrop-filter: blur(10px);
        }

        .puzzle-title {
          font-size: 2rem;
          color: var(--gold);
          margin-bottom: 20px;
          text-align: center;
        }

        .puzzle-question {
          font-size: 1.3rem;
          color: var(--white);
          margin-bottom: 30px;
          text-align: center;
          line-height: 1.6;
        }

        .vault-treasures {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 30px;
          margin-bottom: 30px;
        }

        .treasure-card {
          background: rgba(255, 215, 0, 0.1);
          border: 2px solid var(--gold);
          border-radius: 15px;
          padding: 30px;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .treasure-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 20px rgba(255, 215, 0, 0.2);
          background: rgba(255, 215, 0, 0.2);
        }

        .treasure-title {
          font-size: 1.5rem;
          color: var(--gold);
          margin-bottom: 15px;
          font-weight: 600;
        }

        .treasure-description {
          font-size: 1rem;
          color: var(--white);
          margin-bottom: 15px;
          opacity: 0.9;
        }

        .treasure-content {
          font-size: 0.9rem;
          color: var(--gold);
          font-style: italic;
          line-height: 1.5;
        }

        .achievements-panel {
          background: rgba(0, 0, 0, 0.3);
          border: 2px solid var(--gold);
          border-radius: 15px;
          padding: 25px;
          margin-bottom: 20px;
        }

        .achievements-title {
          font-size: 1.5rem;
          color: var(--gold);
          margin-bottom: 20px;
          text-align: center;
        }

        .achievements-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
        }

        .achievement-item {
          background: rgba(255, 215, 0, 0.1);
          border: 1px solid var(--gold);
          border-radius: 10px;
          padding: 15px;
          text-align: center;
        }

        .achievement-icon {
          font-size: 2rem;
          margin-bottom: 10px;
        }

        .achievement-name {
          font-size: 1rem;
          color: var(--gold);
          font-weight: 600;
          margin-bottom: 5px;
        }

        .achievement-description {
          font-size: 0.8rem;
          color: var(--white);
          opacity: 0.8;
        }

        .final-stats {
          background: rgba(255, 215, 0, 0.1);
          border: 2px solid var(--gold);
          border-radius: 15px;
          padding: 30px;
          text-align: center;
          margin-bottom: 30px;
        }

        .stats-title {
          font-size: 2rem;
          color: var(--gold);
          margin-bottom: 20px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 20px;
          margin-bottom: 20px;
        }

        .stat-item {
          text-align: center;
        }

        .stat-value {
          font-size: 2rem;
          color: var(--gold);
          font-weight: 700;
        }

        .stat-label {
          font-size: 1rem;
          color: var(--white);
          opacity: 0.8;
        }

        .action-buttons {
          display: flex;
          gap: 20px;
          justify-content: center;
          margin-top: 30px;
        }

        .action-button {
          background: linear-gradient(135deg, var(--gold), var(--saffron));
          color: var(--navy-blue);
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
        <h2 className="game-title">🔓 Ashoka Vault - Knowledge Unlock</h2>
        <div className="progress-display">
          {gameState.unlockedGames}/{gameState.totalGames} Games
        </div>
      </div>

      {gameState.phase === "entry" && (
        <div className="vault-entry">
          <h3 className="vault-title">🏛️ The Constitutional Vault</h3>
          <p className="vault-description">
            Welcome to the ultimate repository of constitutional knowledge. This
            vault contains rare facts, historical documents, and exclusive
            content about the Indian Constitution and its makers.
          </p>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${
                  (gameState.unlockedGames / gameState.totalGames) * 100
                }%`,
              }}
            ></div>
          </div>

          <p style={{ margin: "20px 0", fontSize: "1.1rem" }}>
            {gameState.vaultOpen
              ? "Vault is ready to unlock! Solve the constitutional puzzles to access the treasures."
              : `Complete ${
                  10 - gameState.unlockedGames
                } more games to unlock the vault.`}
          </p>

          <button
            className="entry-button"
            onClick={startPuzzles}
            disabled={!gameState.vaultOpen}
          >
            {gameState.vaultOpen ? "Enter Vault" : "Vault Locked"}
          </button>
        </div>
      )}

      {gameState.phase === "puzzles" && (
        <div className="puzzle-area">
          <div style={{ textAlign: "center", marginBottom: "30px" }}>
            <h3 style={{ color: "var(--gold)", fontSize: "1.5rem" }}>
              Puzzle {gameState.currentPuzzle + 1} of {VAULT_PUZZLES.length}
            </h3>
            <p style={{ color: "var(--white)", fontSize: "1.1rem" }}>
              Score: {gameState.score} | Solved: {gameState.puzzlesSolved}
            </p>
          </div>
          {renderPuzzle()}
        </div>
      )}

      {gameState.phase === "vault" && (
        <>
          <div className="final-stats">
            <h3 className="stats-title">🎉 Vault Unlocked!</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-value">{gameState.score}</div>
                <div className="stat-label">Final Score</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{gameState.puzzlesSolved}</div>
                <div className="stat-label">Puzzles Solved</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">
                  {gameState.achievements.length}
                </div>
                <div className="stat-label">Achievements</div>
              </div>
            </div>
          </div>

          <div className="vault-treasures">
            {VAULT_TREASURES.map((treasure, index) => (
              <div
                key={index}
                className="treasure-card"
                onClick={() => setSelectedTreasure(treasure)}
              >
                <h4 className="treasure-title">{treasure.title}</h4>
                <p className="treasure-description">{treasure.description}</p>
                <div
                  style={{
                    background: "rgba(255, 215, 0, 0.2)",
                    padding: "15px",
                    borderRadius: "10px",
                    border: "1px solid var(--gold)",
                    marginTop: "15px",
                  }}
                >
                  <p
                    style={{
                      color: "var(--gold)",
                      fontSize: "0.9rem",
                      fontWeight: "600",
                      margin: "0",
                    }}
                  >
                    🔓 Click to Open Vault
                  </p>
                </div>
              </div>
            ))}
          </div>

          {gameState.achievements.length > 0 && (
            <div className="achievements-panel">
              <h3 className="achievements-title">🏆 Achievements Unlocked</h3>
              <div className="achievements-grid">
                {ACHIEVEMENTS.filter((ach) =>
                  gameState.achievements.includes(ach.id)
                ).map((achievement) => (
                  <div key={achievement.id} className="achievement-item">
                    <div className="achievement-icon">{achievement.icon}</div>
                    <div className="achievement-name">{achievement.name}</div>
                    <div className="achievement-description">
                      {achievement.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="action-buttons">
            <button className="action-button" onClick={restartVault}>
              Retry Puzzles
            </button>
            <button className="action-button" onClick={onBackToHub}>
              Back to Hub
            </button>
          </div>
        </>
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
              background: "linear-gradient(135deg, #1a1a2e, #16213e)",
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
                borderBottom: "2px solid rgba(255, 215, 0, 0.3)",
                background: "rgba(255, 215, 0, 0.1)",
              }}
            >
              <h2
                style={{
                  fontSize: "1.8rem",
                  color: "var(--gold)",
                  margin: "0",
                  textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
                }}
              >
                🔓 Ashoka Vault Guide
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
                    color: "var(--gold)",
                    marginBottom: "15px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  🎮 How to Play
                </h3>
                <div style={{ color: "var(--white)", lineHeight: "1.6" }}>
                  <p>
                    <strong>Objective:</strong> Solve 5 constitutional puzzles
                    to unlock the Ashoka Vault treasures!
                  </p>
                  <ul style={{ margin: "10px 0", paddingLeft: "20px" }}>
                    <li>
                      <strong>🧩 Solve Puzzles:</strong> Complete each puzzle to
                      earn points and progress
                    </li>
                    <li>
                      <strong>🏆 Unlock Treasures:</strong> Access rare
                      constitutional knowledge and artifacts
                    </li>
                    <li>
                      <strong>🎯 Earn Achievements:</strong> Demonstrate your
                      constitutional expertise
                    </li>
                    <li>
                      <strong>📚 Learn:</strong> Discover fascinating facts
                      about the Indian Constitution
                    </li>
                  </ul>
                </div>
              </div>

              {/* Puzzle Types Section */}
              <div style={{ marginBottom: "25px" }}>
                <h3
                  style={{
                    fontSize: "1.3rem",
                    color: "var(--gold)",
                    marginBottom: "15px",
                  }}
                >
                  🧩 Puzzle Types
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
                      background: "rgba(255, 215, 0, 0.1)",
                      padding: "15px",
                      borderRadius: "12px",
                      border: "1px solid rgba(255, 215, 0, 0.3)",
                    }}
                  >
                    <div style={{ fontSize: "1.5rem", marginBottom: "8px" }}>
                      📅
                    </div>
                    <strong style={{ color: "var(--gold)" }}>
                      Constitutional Chronology
                    </strong>
                    <p
                      style={{
                        color: "var(--white)",
                        fontSize: "0.9rem",
                        margin: "5px 0 0 0",
                      }}
                    >
                      Arrange historical events in correct chronological order
                    </p>
                  </div>
                  <div
                    style={{
                      background: "rgba(255, 215, 0, 0.1)",
                      padding: "15px",
                      borderRadius: "12px",
                      border: "1px solid rgba(255, 215, 0, 0.3)",
                    }}
                  >
                    <div style={{ fontSize: "1.5rem", marginBottom: "8px" }}>
                      🔐
                    </div>
                    <strong style={{ color: "var(--gold)" }}>
                      Cipher Decoding
                    </strong>
                    <p
                      style={{
                        color: "var(--white)",
                        fontSize: "0.9rem",
                        margin: "5px 0 0 0",
                      }}
                    >
                      Decode encrypted constitutional principles and terms
                    </p>
                  </div>
                  <div
                    style={{
                      background: "rgba(255, 215, 0, 0.1)",
                      padding: "15px",
                      borderRadius: "12px",
                      border: "1px solid rgba(255, 215, 0, 0.3)",
                    }}
                  >
                    <div style={{ fontSize: "1.5rem", marginBottom: "8px" }}>
                      📝
                    </div>
                    <strong style={{ color: "var(--gold)" }}>
                      Multiple Choice
                    </strong>
                    <p
                      style={{
                        color: "var(--white)",
                        fontSize: "0.9rem",
                        margin: "5px 0 0 0",
                      }}
                    >
                      Answer questions about constitutional articles and
                      provisions
                    </p>
                  </div>
                  <div
                    style={{
                      background: "rgba(255, 215, 0, 0.1)",
                      padding: "15px",
                      borderRadius: "12px",
                      border: "1px solid rgba(255, 215, 0, 0.3)",
                    }}
                  >
                    <div style={{ fontSize: "1.5rem", marginBottom: "8px" }}>
                      🔢
                    </div>
                    <strong style={{ color: "var(--gold)" }}>
                      Mathematical Puzzles
                    </strong>
                    <p
                      style={{
                        color: "var(--white)",
                        fontSize: "0.9rem",
                        margin: "5px 0 0 0",
                      }}
                    >
                      Calculate constitutional facts and numerical data
                    </p>
                  </div>
                  <div
                    style={{
                      background: "rgba(255, 215, 0, 0.1)",
                      padding: "15px",
                      borderRadius: "12px",
                      border: "1px solid rgba(255, 215, 0, 0.3)",
                    }}
                  >
                    <div style={{ fontSize: "1.5rem", marginBottom: "8px" }}>
                      🧩
                    </div>
                    <strong style={{ color: "var(--gold)" }}>
                      Pattern Completion
                    </strong>
                    <p
                      style={{
                        color: "var(--white)",
                        fontSize: "0.9rem",
                        margin: "5px 0 0 0",
                      }}
                    >
                      Complete patterns from the Preamble and constitutional
                      text
                    </p>
                  </div>
                </div>
              </div>

              {/* About Constitution Section */}
              <div style={{ marginBottom: "25px" }}>
                <h3
                  style={{
                    fontSize: "1.3rem",
                    color: "var(--gold)",
                    marginBottom: "15px",
                  }}
                >
                  🇮🇳 About the Indian Constitution
                </h3>
                <div style={{ color: "var(--white)", lineHeight: "1.6" }}>
                  <p>
                    The Constitution of India is the supreme law of India,
                    adopted on 26th January 1950.
                  </p>
                  <ul style={{ margin: "10px 0", paddingLeft: "20px" }}>
                    <li>
                      <strong>📜 World's Longest:</strong> Contains 448 articles
                      in 25 parts and 12 schedules
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
                      <strong>👨‍⚖️ Dr. B.R. Ambedkar:</strong> Chairman of
                      Drafting Committee, "Father of Constitution"
                    </li>
                    <li>
                      <strong>✍️ Handwritten:</strong> Original Constitution was
                      handwritten in Hindi and English
                    </li>
                  </ul>
                </div>
              </div>

              {/* Vault Treasures Section */}
              <div style={{ marginBottom: "25px" }}>
                <h3
                  style={{
                    fontSize: "1.3rem",
                    color: "var(--gold)",
                    marginBottom: "15px",
                  }}
                >
                  💎 Vault Treasures
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
                      background: "rgba(255, 215, 0, 0.1)",
                      padding: "15px",
                      borderRadius: "12px",
                      border: "1px solid rgba(255, 215, 0, 0.3)",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: "2rem", marginBottom: "8px" }}>
                      📜
                    </div>
                    <strong style={{ color: "var(--gold)" }}>
                      Assembly Debates
                    </strong>
                    <p
                      style={{
                        color: "var(--white)",
                        fontSize: "0.9rem",
                        margin: "5px 0 0 0",
                      }}
                    >
                      Historic constitutional discussions
                    </p>
                  </div>
                  <div
                    style={{
                      background: "rgba(255, 215, 0, 0.1)",
                      padding: "15px",
                      borderRadius: "12px",
                      border: "1px solid rgba(255, 215, 0, 0.3)",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: "2rem", marginBottom: "8px" }}>
                      💎
                    </div>
                    <strong style={{ color: "var(--gold)" }}>Rare Facts</strong>
                    <p
                      style={{
                        color: "var(--white)",
                        fontSize: "0.9rem",
                        margin: "5px 0 0 0",
                      }}
                    >
                      Lesser-known constitutional trivia
                    </p>
                  </div>
                  <div
                    style={{
                      background: "rgba(255, 215, 0, 0.1)",
                      padding: "15px",
                      borderRadius: "12px",
                      border: "1px solid rgba(255, 215, 0, 0.3)",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: "2rem", marginBottom: "8px" }}>
                      🎵
                    </div>
                    <strong style={{ color: "var(--gold)" }}>
                      Landmark Audio
                    </strong>
                    <p
                      style={{
                        color: "var(--white)",
                        fontSize: "0.9rem",
                        margin: "5px 0 0 0",
                      }}
                    >
                      Supreme Court judgment excerpts
                    </p>
                  </div>
                  <div
                    style={{
                      background: "rgba(255, 215, 0, 0.1)",
                      padding: "15px",
                      borderRadius: "12px",
                      border: "1px solid rgba(255, 215, 0, 0.3)",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: "2rem", marginBottom: "8px" }}>
                      🎨
                    </div>
                    <strong style={{ color: "var(--gold)" }}>
                      Art Gallery
                    </strong>
                    <p
                      style={{
                        color: "var(--white)",
                        fontSize: "0.9rem",
                        margin: "5px 0 0 0",
                      }}
                    >
                      Constitutional art and calligraphy
                    </p>
                  </div>
                  <div
                    style={{
                      background: "rgba(255, 215, 0, 0.1)",
                      padding: "15px",
                      borderRadius: "12px",
                      border: "1px solid rgba(255, 215, 0, 0.3)",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: "2rem", marginBottom: "8px" }}>
                      🗺️
                    </div>
                    <strong style={{ color: "var(--gold)" }}>
                      Interactive Map
                    </strong>
                    <p
                      style={{
                        color: "var(--white)",
                        fontSize: "0.9rem",
                        margin: "5px 0 0 0",
                      }}
                    >
                      Visual constitutional journey
                    </p>
                  </div>
                </div>
              </div>

              {/* Achievements Section */}
              <div style={{ marginBottom: "25px" }}>
                <h3
                  style={{
                    fontSize: "1.3rem",
                    color: "var(--gold)",
                    marginBottom: "15px",
                  }}
                >
                  🏆 Achievements
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
                      background: "rgba(255, 215, 0, 0.1)",
                      padding: "15px",
                      borderRadius: "12px",
                      border: "1px solid rgba(255, 215, 0, 0.3)",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: "1.5rem", marginBottom: "8px" }}>
                      ⚡
                    </div>
                    <strong style={{ color: "var(--gold)" }}>
                      Speed Solver
                    </strong>
                    <p
                      style={{
                        color: "var(--white)",
                        fontSize: "0.9rem",
                        margin: "5px 0 0 0",
                      }}
                    >
                      Complete all puzzles quickly
                    </p>
                  </div>
                  <div
                    style={{
                      background: "rgba(255, 215, 0, 0.1)",
                      padding: "15px",
                      borderRadius: "12px",
                      border: "1px solid rgba(255, 215, 0, 0.3)",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: "1.5rem", marginBottom: "8px" }}>
                      💯
                    </div>
                    <strong style={{ color: "var(--gold)" }}>
                      Perfect Score
                    </strong>
                    <p
                      style={{
                        color: "var(--white)",
                        fontSize: "0.9rem",
                        margin: "5px 0 0 0",
                      }}
                    >
                      Achieve maximum points
                    </p>
                  </div>
                  <div
                    style={{
                      background: "rgba(255, 215, 0, 0.1)",
                      padding: "15px",
                      borderRadius: "12px",
                      border: "1px solid rgba(255, 215, 0, 0.3)",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: "1.5rem", marginBottom: "8px" }}>
                      🔓
                    </div>
                    <strong style={{ color: "var(--gold)" }}>
                      Vault Master
                    </strong>
                    <p
                      style={{
                        color: "var(--white)",
                        fontSize: "0.9rem",
                        margin: "5px 0 0 0",
                      }}
                    >
                      Unlock all treasures
                    </p>
                  </div>
                  <div
                    style={{
                      background: "rgba(255, 215, 0, 0.1)",
                      padding: "15px",
                      borderRadius: "12px",
                      border: "1px solid rgba(255, 215, 0, 0.3)",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: "1.5rem", marginBottom: "8px" }}>
                      🎓
                    </div>
                    <strong style={{ color: "var(--gold)" }}>Scholar</strong>
                    <p
                      style={{
                        color: "var(--white)",
                        fontSize: "0.9rem",
                        margin: "5px 0 0 0",
                      }}
                    >
                      Demonstrate deep knowledge
                    </p>
                  </div>
                </div>
              </div>

              {/* Tips Section */}
              <div style={{ marginBottom: "25px" }}>
                <h3
                  style={{
                    fontSize: "1.3rem",
                    color: "var(--gold)",
                    marginBottom: "15px",
                  }}
                >
                  💡 Tips for Success
                </h3>
                <div style={{ color: "var(--white)", lineHeight: "1.6" }}>
                  <ul style={{ margin: "10px 0", paddingLeft: "20px" }}>
                    <li>
                      <strong>Read Carefully:</strong> Each puzzle has unique
                      instructions and hints
                    </li>
                    <li>
                      <strong>Think Chronologically:</strong> For sequence
                      puzzles, consider historical timeline
                    </li>
                    <li>
                      <strong>Use Hints:</strong> Cipher puzzles often provide
                      decoding hints
                    </li>
                    <li>
                      <strong>Constitutional Knowledge:</strong> Familiarity
                      with basic constitutional facts helps
                    </li>
                    <li>
                      <strong>Take Your Time:</strong> No time pressure - focus
                      on accuracy
                    </li>
                    <li>
                      <strong>Learn from Mistakes:</strong> Each attempt teaches
                      something new
                    </li>
                  </ul>
                </div>
              </div>

              {/* Educational Goals */}
              <div style={{ marginBottom: "25px" }}>
                <h3
                  style={{
                    fontSize: "1.3rem",
                    color: "var(--gold)",
                    marginBottom: "15px",
                  }}
                >
                  🎯 Educational Goals
                </h3>
                <div style={{ color: "var(--white)", lineHeight: "1.6" }}>
                  <p>The Ashoka Vault aims to:</p>
                  <ul style={{ margin: "10px 0", paddingLeft: "20px" }}>
                    <li>
                      Deepen understanding of constitutional history and
                      principles
                    </li>
                    <li>
                      Make constitutional learning engaging through gamification
                    </li>
                    <li>
                      Provide access to rare constitutional knowledge and
                      artifacts
                    </li>
                    <li>
                      Encourage exploration of India's constitutional heritage
                    </li>
                    <li>
                      Foster appreciation for constitutional values and
                      democratic principles
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Help Footer */}
            <div
              style={{
                padding: "20px 30px",
                borderTop: "2px solid rgba(255, 215, 0, 0.3)",
                background: "rgba(255, 215, 0, 0.05)",
                textAlign: "center",
              }}
            >
              <button
                onClick={() => setShowHelp(false)}
                style={{
                  background:
                    "linear-gradient(135deg, var(--gold), var(--saffron))",
                  color: "var(--navy-blue)",
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
                Ready to Unlock the Vault! 🔓
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Treasure Modal */}
      {selectedTreasure && (
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
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #1a1a2e, #16213e)",
              padding: "40px",
              borderRadius: "20px",
              border: "3px solid var(--gold)",
              textAlign: "center",
              maxWidth: "800px",
              maxHeight: "80vh",
              overflowY: "auto",
              position: "relative",
            }}
          >
            <button
              onClick={() => setSelectedTreasure(null)}
              style={{
                position: "absolute",
                top: "15px",
                right: "15px",
                background: "var(--saffron)",
                color: "var(--white)",
                border: "none",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                cursor: "pointer",
                fontSize: "1.5rem",
                fontWeight: "bold",
              }}
            >
              ×
            </button>

            <div
              style={{
                fontSize: "4rem",
                marginBottom: "20px",
              }}
            >
              {selectedTreasure.type === "historical" && "📜"}
              {selectedTreasure.type === "facts" && "💎"}
              {selectedTreasure.type === "art" && "�"}
              {selectedTreasure.type === "interactive" && "🗺️"}
            </div>

            <h3
              style={{
                fontSize: "2.5rem",
                color: "var(--gold)",
                marginBottom: "20px",
                textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
              }}
            >
              {selectedTreasure.title}
            </h3>

            <p
              style={{
                fontSize: "1.3rem",
                color: "var(--white)",
                marginBottom: "30px",
                opacity: 0.9,
              }}
            >
              {selectedTreasure.description}
            </p>

            {/* Art Gallery Images */}
            {selectedTreasure.type === "art" && selectedTreasure.images ? (
              <div style={{ marginBottom: "30px" }}>
                <p
                  style={{
                    fontSize: "1.2rem",
                    color: "var(--gold)",
                    marginBottom: "25px",
                    fontStyle: "italic",
                  }}
                >
                  {selectedTreasure.content}
                </p>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
                    gap: "25px",
                    marginTop: "20px",
                  }}
                >
                  {selectedTreasure.images.map((image, index) => (
                    <div
                      key={index}
                      style={{
                        background: "rgba(255, 215, 0, 0.1)",
                        border: "2px solid var(--gold)",
                        borderRadius: "15px",
                        padding: "20px",
                        textAlign: "center",
                      }}
                    >
                      <img
                        src={image.src}
                        alt={image.title}
                        style={{
                          width: "100%",
                          maxWidth: "300px",
                          height: "200px",
                          objectFit: "cover",
                          borderRadius: "10px",
                          border: "2px solid var(--gold)",
                          marginBottom: "15px",
                          boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
                        }}
                      />
                      <h4
                        style={{
                          color: "var(--gold)",
                          fontSize: "1.3rem",
                          marginBottom: "10px",
                          fontWeight: "bold",
                        }}
                      >
                        {image.title}
                      </h4>
                      <p
                        style={{
                          color: "var(--white)",
                          fontSize: "0.95rem",
                          lineHeight: "1.5",
                          textAlign: "left",
                          margin: "0",
                        }}
                      >
                        {image.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div
                style={{
                  background: "rgba(255, 215, 0, 0.1)",
                  border: "2px solid var(--gold)",
                  borderRadius: "15px",
                  padding: "30px",
                  marginBottom: "30px",
                }}
              >
                <p
                  style={{
                    fontSize: "1.2rem",
                    color: "var(--gold)",
                    lineHeight: "1.6",
                    fontStyle: "italic",
                    margin: "0",
                  }}
                >
                  "{selectedTreasure.content}"
                </p>
              </div>
            )}

            {/* Interactive Constitution Map */}
            {selectedTreasure.type === "interactive" &&
              selectedTreasure.mapData && (
                <div style={{ marginBottom: "30px" }}>
                  {/* Constitution Statistics */}
                  <div
                    style={{
                      background: "rgba(255, 215, 0, 0.1)",
                      border: "2px solid var(--gold)",
                      borderRadius: "15px",
                      padding: "20px",
                      marginBottom: "25px",
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(150px, 1fr))",
                      gap: "15px",
                      textAlign: "center",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: "2rem",
                          color: "var(--gold)",
                          fontWeight: "bold",
                        }}
                      >
                        {selectedTreasure.mapData.statistics.totalArticles}
                      </div>
                      <div
                        style={{ color: "var(--white)", fontSize: "0.9rem" }}
                      >
                        Articles
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: "2rem",
                          color: "var(--gold)",
                          fontWeight: "bold",
                        }}
                      >
                        {selectedTreasure.mapData.statistics.totalParts}
                      </div>
                      <div
                        style={{ color: "var(--white)", fontSize: "0.9rem" }}
                      >
                        Parts
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: "2rem",
                          color: "var(--gold)",
                          fontWeight: "bold",
                        }}
                      >
                        {selectedTreasure.mapData.statistics.totalSchedules}
                      </div>
                      <div
                        style={{ color: "var(--white)", fontSize: "0.9rem" }}
                      >
                        Schedules
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: "2rem",
                          color: "var(--gold)",
                          fontWeight: "bold",
                        }}
                      >
                        {selectedTreasure.mapData.statistics.amendments}
                      </div>
                      <div
                        style={{ color: "var(--white)", fontSize: "0.9rem" }}
                      >
                        Amendments
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: "2rem",
                          color: "var(--gold)",
                          fontWeight: "bold",
                        }}
                      >
                        {selectedTreasure.mapData.statistics.words}
                      </div>
                      <div
                        style={{ color: "var(--white)", fontSize: "0.9rem" }}
                      >
                        Words
                      </div>
                    </div>
                  </div>

                  {/* Constitutional Timeline */}
                  <div
                    style={{
                      background: "rgba(255, 215, 0, 0.1)",
                      border: "2px solid var(--gold)",
                      borderRadius: "15px",
                      padding: "20px",
                      marginBottom: "25px",
                    }}
                  >
                    <h4
                      style={{
                        color: "var(--gold)",
                        marginBottom: "15px",
                        textAlign: "center",
                      }}
                    >
                      📅 Constitutional Timeline
                    </h4>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(200px, 1fr))",
                        gap: "15px",
                      }}
                    >
                      {selectedTreasure.mapData.timeline.map((item, index) => (
                        <div
                          key={index}
                          style={{
                            background:
                              item.importance === "critical"
                                ? "rgba(255, 69, 0, 0.2)"
                                : "rgba(255, 255, 255, 0.1)",
                            padding: "15px",
                            borderRadius: "10px",
                            border: `2px solid ${
                              item.importance === "critical"
                                ? "#FF4500"
                                : "var(--gold)"
                            }`,
                            textAlign: "center",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "1.5rem",
                              color: "var(--gold)",
                              fontWeight: "bold",
                            }}
                          >
                            {item.year}
                          </div>
                          <div
                            style={{
                              color: "var(--white)",
                              fontSize: "0.9rem",
                              marginTop: "5px",
                            }}
                          >
                            {item.event}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Interactive Map Sections */}
                  <div
                    style={{
                      background: "rgba(255, 215, 0, 0.1)",
                      border: "2px solid var(--gold)",
                      borderRadius: "15px",
                      padding: "20px",
                      marginBottom: "25px",
                    }}
                  >
                    <h4
                      style={{
                        color: "var(--gold)",
                        marginBottom: "20px",
                        textAlign: "center",
                      }}
                    >
                      🗺️ Constitutional Structure Map
                    </h4>

                    {/* Key Sections Grid */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(300px, 1fr))",
                        gap: "20px",
                        marginBottom: "25px",
                      }}
                    >
                      {selectedTreasure.mapData.sections
                        .slice(0, 8)
                        .map((section) => (
                          <div
                            key={section.id}
                            style={{
                              background: `${section.color}20`,
                              border: `2px solid ${section.color}`,
                              borderRadius: "12px",
                              padding: "20px",
                              transition: "all 0.3s ease",
                              cursor: "pointer",
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.transform = "scale(1.02)";
                              e.target.style.boxShadow = `0 8px 25px ${section.color}40`;
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.transform = "scale(1)";
                              e.target.style.boxShadow = "none";
                            }}
                          >
                            <h5
                              style={{
                                color: section.color,
                                fontSize: "1.2rem",
                                fontWeight: "bold",
                                marginBottom: "10px",
                              }}
                            >
                              {section.title}
                            </h5>
                            <p
                              style={{
                                color: "var(--white)",
                                fontSize: "0.9rem",
                                marginBottom: "15px",
                                lineHeight: "1.4",
                              }}
                            >
                              {section.description}
                            </p>
                            <div style={{ marginBottom: "15px" }}>
                              <div
                                style={{
                                  color: "var(--white)",
                                  fontSize: "0.85rem",
                                  fontStyle: "italic",
                                  opacity: 0.9,
                                }}
                              >
                                {section.details}
                              </div>
                            </div>

                            {/* Key Points */}
                            <div>
                              <div
                                style={{
                                  color: section.color,
                                  fontSize: "0.8rem",
                                  fontWeight: "bold",
                                  marginBottom: "8px",
                                }}
                              >
                                Key Points:
                              </div>
                              <ul
                                style={{
                                  color: "var(--white)",
                                  fontSize: "0.75rem",
                                  lineHeight: "1.3",
                                  paddingLeft: "15px",
                                  margin: "0",
                                }}
                              >
                                {section.keyPoints
                                  .slice(0, 3)
                                  .map((point, idx) => (
                                    <li
                                      key={idx}
                                      style={{ marginBottom: "3px" }}
                                    >
                                      {point}
                                    </li>
                                  ))}
                              </ul>
                            </div>

                            {/* Sub-sections for important parts */}
                            {section.subSections && (
                              <div style={{ marginTop: "15px" }}>
                                <div
                                  style={{
                                    color: section.color,
                                    fontSize: "0.8rem",
                                    fontWeight: "bold",
                                    marginBottom: "8px",
                                  }}
                                >
                                  Important Articles:
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: "5px",
                                  }}
                                >
                                  {section.subSections.map((sub, idx) => (
                                    <span
                                      key={idx}
                                      style={{
                                        background:
                                          sub.importance === "critical"
                                            ? "#FF4500"
                                            : section.color,
                                        color: "white",
                                        padding: "3px 8px",
                                        borderRadius: "12px",
                                        fontSize: "0.7rem",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      {sub.name}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                    </div>

                    {/* Connections Visualization */}
                    <div
                      style={{
                        background: "rgba(0, 0, 0, 0.3)",
                        borderRadius: "10px",
                        padding: "20px",
                        textAlign: "center",
                      }}
                    >
                      <h5
                        style={{ color: "var(--gold)", marginBottom: "15px" }}
                      >
                        🔗 Constitutional Interconnections
                      </h5>
                      <p
                        style={{
                          color: "var(--white)",
                          fontSize: "0.9rem",
                          lineHeight: "1.5",
                        }}
                      >
                        The Constitution is a living document where each part
                        connects to others. The{" "}
                        <strong style={{ color: "#FFD700" }}>Preamble</strong>{" "}
                        guides the
                        <strong style={{ color: "#45B7D1" }}>
                          {" "}
                          Fundamental Rights
                        </strong>
                        , which are balanced by
                        <strong style={{ color: "#96CEB4" }}>
                          {" "}
                          Directive Principles
                        </strong>{" "}
                        and supported by
                        <strong style={{ color: "#FFEAA7" }}>
                          {" "}
                          Fundamental Duties
                        </strong>
                        . The{" "}
                        <strong style={{ color: "#DDA0DD" }}>Union</strong> and
                        <strong style={{ color: "#FFB6C1" }}>
                          {" "}
                          State
                        </strong>{" "}
                        governments work together through
                        <strong style={{ color: "#DEB887" }}>
                          {" "}
                          federal relations
                        </strong>
                        , while
                        <strong style={{ color: "#98FB98" }}>
                          local governance
                        </strong>{" "}
                        ensures grassroots democracy.
                      </p>
                    </div>
                  </div>

                  {/* Interactive Features */}
                  <div
                    style={{
                      background: "rgba(255, 215, 0, 0.1)",
                      border: "2px solid var(--gold)",
                      borderRadius: "15px",
                      padding: "20px",
                      textAlign: "center",
                    }}
                  >
                    <h4 style={{ color: "var(--gold)", marginBottom: "15px" }}>
                      🎯 Explore Further
                    </h4>
                    <p
                      style={{
                        color: "var(--white)",
                        fontSize: "1rem",
                        marginBottom: "20px",
                      }}
                    >
                      This interactive map shows the interconnected nature of
                      India's Constitution. Each section builds upon others to
                      create a comprehensive framework for governance and
                      rights.
                    </p>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(200px, 1fr))",
                        gap: "15px",
                      }}
                    >
                      <div
                        style={{
                          background: "rgba(255, 255, 255, 0.1)",
                          padding: "15px",
                          borderRadius: "10px",
                          border: "1px solid var(--gold)",
                        }}
                      >
                        <div
                          style={{ fontSize: "1.5rem", marginBottom: "8px" }}
                        >
                          📚
                        </div>
                        <strong style={{ color: "var(--gold)" }}>
                          Study Guide
                        </strong>
                        <p
                          style={{
                            color: "var(--white)",
                            fontSize: "0.8rem",
                            margin: "5px 0 0 0",
                          }}
                        >
                          Use this map to understand constitutional structure
                        </p>
                      </div>
                      <div
                        style={{
                          background: "rgba(255, 255, 255, 0.1)",
                          padding: "15px",
                          borderRadius: "10px",
                          border: "1px solid var(--gold)",
                        }}
                      >
                        <div
                          style={{ fontSize: "1.5rem", marginBottom: "8px" }}
                        >
                          🔍
                        </div>
                        <strong style={{ color: "var(--gold)" }}>
                          Deep Dive
                        </strong>
                        <p
                          style={{
                            color: "var(--white)",
                            fontSize: "0.8rem",
                            margin: "5px 0 0 0",
                          }}
                        >
                          Click sections to explore detailed provisions
                        </p>
                      </div>
                      <div
                        style={{
                          background: "rgba(255, 255, 255, 0.1)",
                          padding: "15px",
                          borderRadius: "10px",
                          border: "1px solid var(--gold)",
                        }}
                      >
                        <div
                          style={{ fontSize: "1.5rem", marginBottom: "8px" }}
                        >
                          🎓
                        </div>
                        <strong style={{ color: "var(--gold)" }}>
                          Learn More
                        </strong>
                        <p
                          style={{
                            color: "var(--white)",
                            fontSize: "0.8rem",
                            margin: "5px 0 0 0",
                          }}
                        >
                          Discover connections between different parts
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            {/* Interactive content based on treasure type */}
            {selectedTreasure.type === "historical" && (
              <div
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  borderRadius: "10px",
                  padding: "20px",
                  marginBottom: "20px",
                }}
              >
                <h4 style={{ color: "var(--saffron)", marginBottom: "15px" }}>
                  🏛️ Historical Context
                </h4>
                <p
                  style={{
                    color: "var(--white)",
                    fontSize: "1rem",
                    lineHeight: "1.5",
                  }}
                >
                  The Constituent Assembly debates were crucial in shaping
                  India's Constitution. Dr. B.R. Ambedkar, as the Chairman of
                  the Drafting Committee, played a pivotal role in ensuring the
                  Constitution reflected the aspirations of all Indians.
                </p>
              </div>
            )}

            {selectedTreasure.type === "facts" && (
              <div
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  borderRadius: "10px",
                  padding: "20px",
                  marginBottom: "20px",
                }}
              >
                <h4 style={{ color: "var(--saffron)", marginBottom: "15px" }}>
                  💡 Did You Know?
                </h4>
                <ul
                  style={{
                    color: "var(--white)",
                    fontSize: "1rem",
                    textAlign: "left",
                    lineHeight: "1.5",
                  }}
                >
                  <li>
                    The Constitution has 448 articles in 25 parts and 12
                    schedules
                  </li>
                  <li>It's the longest written constitution in the world</li>
                  <li>
                    The original copies are preserved in helium-filled cases
                  </li>
                  <li>It took 2 years, 11 months, and 18 days to complete</li>
                </ul>
              </div>
            )}

            {selectedTreasure.type === "art" && (
              <div
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  borderRadius: "10px",
                  padding: "20px",
                  marginBottom: "20px",
                }}
              >
                <h4 style={{ color: "var(--saffron)", marginBottom: "15px" }}>
                  🖼️ Artistic Heritage
                </h4>
                <p
                  style={{
                    color: "var(--white)",
                    fontSize: "1rem",
                    lineHeight: "1.5",
                  }}
                >
                  The Constitution's calligraphy was done by Prem Behari Narain
                  Raizada. Each page was decorated with beautiful artwork
                  representing India's cultural heritage, including motifs from
                  Ajanta, Ellora, and other historical sites.
                </p>
              </div>
            )}

            {selectedTreasure.type === "interactive" && (
              <div
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  borderRadius: "10px",
                  padding: "20px",
                  marginBottom: "20px",
                }}
              >
                <h4 style={{ color: "var(--saffron)", marginBottom: "15px" }}>
                  🗺️ Constitutional Structure
                </h4>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                    gap: "10px",
                    color: "var(--white)",
                    fontSize: "0.9rem",
                  }}
                >
                  <div
                    style={{
                      background: "rgba(255, 215, 0, 0.2)",
                      padding: "10px",
                      borderRadius: "5px",
                    }}
                  >
                    <strong>Part I:</strong> Union & Territory
                  </div>
                  <div
                    style={{
                      background: "rgba(255, 215, 0, 0.2)",
                      padding: "10px",
                      borderRadius: "5px",
                    }}
                  >
                    <strong>Part III:</strong> Fundamental Rights
                  </div>
                  <div
                    style={{
                      background: "rgba(255, 215, 0, 0.2)",
                      padding: "10px",
                      borderRadius: "5px",
                    }}
                  >
                    <strong>Part IV:</strong> Directive Principles
                  </div>
                  <div
                    style={{
                      background: "rgba(255, 215, 0, 0.2)",
                      padding: "10px",
                      borderRadius: "5px",
                    }}
                  >
                    <strong>Part V:</strong> The Union
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => setSelectedTreasure(null)}
              style={{
                background:
                  "linear-gradient(135deg, var(--gold), var(--saffron))",
                color: "var(--navy-blue)",
                border: "none",
                padding: "15px 30px",
                borderRadius: "25px",
                fontFamily: "Cinzel, serif",
                fontWeight: "600",
                cursor: "pointer",
                fontSize: "1.1rem",
                transition: "all 0.3s ease",
              }}
            >
              Close Vault
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Interactive puzzle components that require actual answers
const SequencePuzzle = ({ puzzle, onSolve }) => {
  const [userOrder, setUserOrder] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);

  const handleDrop = (droppedItem) => {
    if (!userOrder.includes(droppedItem)) {
      setUserOrder([...userOrder, droppedItem]);
    }
  };

  const removeItem = (item) => {
    setUserOrder(userOrder.filter((i) => i !== item));
  };

  const checkAnswer = () => {
    const correctOrder = puzzle.items.sort((a, b) => a.year - b.year);
    const isCorrect =
      userOrder.length === correctOrder.length &&
      userOrder.every((item, index) => item.year === correctOrder[index].year);
    onSolve(isCorrect, isCorrect ? 25 : 0);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h4
        style={{
          color: "var(--gold)",
          fontSize: "1.5rem",
          marginBottom: "20px",
        }}
      >
        {puzzle.title}
      </h4>
      <p
        style={{
          color: "var(--white)",
          fontSize: "1.2rem",
          marginBottom: "30px",
        }}
      >
        {puzzle.question}
      </p>

      <div style={{ marginBottom: "30px" }}>
        <h5 style={{ color: "var(--gold)", marginBottom: "15px" }}>
          Available Items:
        </h5>
        <div
          style={{
            display: "flex",
            gap: "10px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {puzzle.items
            .filter((item) => !userOrder.includes(item))
            .map((item, index) => (
              <button
                key={index}
                onClick={() => handleDrop(item)}
                style={{
                  padding: "10px 15px",
                  background: "var(--gold)",
                  color: "var(--navy-blue)",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                {item.text}
              </button>
            ))}
        </div>
      </div>

      <div style={{ marginBottom: "30px" }}>
        <h5 style={{ color: "var(--gold)", marginBottom: "15px" }}>
          Your Order:
        </h5>
        <div
          style={{
            display: "flex",
            gap: "10px",
            justifyContent: "center",
            flexWrap: "wrap",
            minHeight: "50px",
          }}
        >
          {userOrder.map((item, index) => (
            <div
              key={index}
              onClick={() => removeItem(item)}
              style={{
                padding: "10px 15px",
                background: "var(--saffron)",
                color: "var(--white)",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600",
                border: "2px solid var(--gold)",
              }}
            >
              {index + 1}. {item.text}
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={checkAnswer}
        disabled={userOrder.length !== puzzle.items.length}
        style={{
          padding: "15px 30px",
          background:
            userOrder.length === puzzle.items.length ? "var(--gold)" : "#ccc",
          color: "var(--navy-blue)",
          border: "none",
          borderRadius: "25px",
          cursor:
            userOrder.length === puzzle.items.length
              ? "pointer"
              : "not-allowed",
          fontWeight: "700",
          fontSize: "1.1rem",
        }}
      >
        Submit Answer
      </button>
    </div>
  );
};

const CipherPuzzle = ({ puzzle, onSolve }) => {
  const [userAnswer, setUserAnswer] = useState("");

  const checkAnswer = () => {
    const isCorrect =
      userAnswer.toLowerCase().trim() === puzzle.answer.toLowerCase();
    onSolve(isCorrect, isCorrect ? 30 : 0);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h4
        style={{
          color: "var(--gold)",
          fontSize: "1.5rem",
          marginBottom: "20px",
        }}
      >
        {puzzle.title}
      </h4>
      <p
        style={{
          color: "var(--white)",
          fontSize: "1.2rem",
          marginBottom: "20px",
        }}
      >
        {puzzle.question}
      </p>
      <p
        style={{
          color: "var(--gold)",
          fontStyle: "italic",
          marginBottom: "30px",
        }}
      >
        Hint: {puzzle.hint}
      </p>

      <input
        type="text"
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
        placeholder="Enter your answer..."
        style={{
          padding: "15px",
          fontSize: "1.1rem",
          borderRadius: "10px",
          border: "2px solid var(--gold)",
          marginBottom: "20px",
          width: "300px",
          textAlign: "center",
        }}
      />

      <br />

      <button
        onClick={checkAnswer}
        disabled={!userAnswer.trim()}
        style={{
          padding: "15px 30px",
          background: userAnswer.trim() ? "var(--gold)" : "#ccc",
          color: "var(--navy-blue)",
          border: "none",
          borderRadius: "25px",
          cursor: userAnswer.trim() ? "pointer" : "not-allowed",
          fontWeight: "700",
          fontSize: "1.1rem",
        }}
      >
        Submit Answer
      </button>
    </div>
  );
};

const MultipleChoicePuzzle = ({ puzzle, onSolve }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showSubmit, setShowSubmit] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleAnswer = (index) => {
    setSelectedAnswer(index);
    setShowSubmit(true);
    setSubmitted(false);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setShowSubmit(false);
    const isCorrect = selectedAnswer === puzzle.correct;
    setTimeout(
      () => {
        onSolve(isCorrect, isCorrect ? 20 : 0);
      },
      isCorrect ? 1000 : 2000
    ); // Shorter delay for correct answers
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h4
        style={{
          color: "var(--gold)",
          fontSize: "1.5rem",
          marginBottom: "20px",
        }}
      >
        {puzzle.title}
      </h4>
      <p
        style={{
          color: "var(--white)",
          fontSize: "1.2rem",
          marginBottom: "30px",
        }}
      >
        {puzzle.question}
      </p>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          maxWidth: "600px",
          margin: "0 auto",
        }}
      >
        {puzzle.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(index)}
            disabled={showSubmit && selectedAnswer !== null}
            style={{
              padding: "15px 20px",
              background:
                selectedAnswer === index
                  ? showSubmit && selectedAnswer === puzzle.correct
                    ? "#90EE90"
                    : showSubmit && selectedAnswer !== puzzle.correct
                    ? "#FFB6C1"
                    : "var(--gold)"
                  : "var(--white)",
              color:
                selectedAnswer === index ? "var(--white)" : "var(--navy-blue)",
              border: "2px solid var(--gold)",
              borderRadius: "10px",
              cursor:
                showSubmit && selectedAnswer !== null
                  ? "not-allowed"
                  : "pointer",
              fontWeight: "600",
              fontSize: "1rem",
              opacity:
                selectedAnswer !== null && selectedAnswer !== index ? 0.6 : 1,
              transition: "all 0.3s ease",
            }}
          >
            {option}
          </button>
        ))}
      </div>

      {showSubmit && selectedAnswer !== null && (
        <div style={{ marginTop: "30px", textAlign: "center" }}>
          <button
            onClick={handleSubmit}
            style={{
              background:
                "linear-gradient(135deg, var(--gold), var(--saffron))",
              color: "var(--navy-blue)",
              border: "none",
              padding: "15px 30px",
              borderRadius: "25px",
              fontFamily: "Cinzel, serif",
              fontWeight: "700",
              fontSize: "1.2rem",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 15px rgba(255, 215, 0, 0.3)",
            }}
          >
            Submit Answer
          </button>
        </div>
      )}

      {submitted && (
        <p
          style={{
            color: selectedAnswer === puzzle.correct ? "#90EE90" : "#FFB6C1",
            marginTop: "20px",
            fontSize: "1.1rem",
            fontWeight: "600",
          }}
        >
          {selectedAnswer === puzzle.correct ? "✅ Correct!" : "❌ Incorrect!"}
          <br />
          <span style={{ color: "var(--gold)", fontSize: "0.9rem" }}>
            {puzzle.explanation}
          </span>
        </p>
      )}
    </div>
  );
};

const CalculationPuzzle = ({ puzzle, onSolve }) => {
  const [userAnswer, setUserAnswer] = useState("");

  const checkAnswer = () => {
    const isCorrect = parseInt(userAnswer) === puzzle.answer;
    onSolve(isCorrect, isCorrect ? 35 : 0);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h4
        style={{
          color: "var(--gold)",
          fontSize: "1.5rem",
          marginBottom: "20px",
        }}
      >
        {puzzle.title}
      </h4>
      <p
        style={{
          color: "var(--white)",
          fontSize: "1.2rem",
          marginBottom: "20px",
        }}
      >
        {puzzle.question}
      </p>
      <p
        style={{
          color: "var(--gold)",
          fontStyle: "italic",
          marginBottom: "30px",
        }}
      >
        {puzzle.calculation}
      </p>

      <input
        type="number"
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
        placeholder="Enter your answer..."
        style={{
          padding: "15px",
          fontSize: "1.1rem",
          borderRadius: "10px",
          border: "2px solid var(--gold)",
          marginBottom: "20px",
          width: "200px",
          textAlign: "center",
        }}
      />

      <br />

      <button
        onClick={checkAnswer}
        disabled={!userAnswer}
        style={{
          padding: "15px 30px",
          background: userAnswer ? "var(--gold)" : "#ccc",
          color: "var(--navy-blue)",
          border: "none",
          borderRadius: "25px",
          cursor: userAnswer ? "pointer" : "not-allowed",
          fontWeight: "700",
          fontSize: "1.1rem",
        }}
      >
        Submit Answer
      </button>
    </div>
  );
};

const PatternPuzzle = ({ puzzle, onSolve }) => {
  const [selectedWord, setSelectedWord] = useState(null);

  const handleWordClick = (word) => {
    setSelectedWord(word);
    const isCorrect = puzzle.words.includes(word);
    setTimeout(() => {
      onSolve(isCorrect, isCorrect ? 15 : 0);
    }, 1000);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h4
        style={{
          color: "var(--gold)",
          fontSize: "1.5rem",
          marginBottom: "20px",
        }}
      >
        {puzzle.title}
      </h4>
      <p
        style={{
          color: "var(--white)",
          fontSize: "1.2rem",
          marginBottom: "30px",
        }}
      >
        {puzzle.question}
      </p>

      <div
        style={{
          display: "flex",
          gap: "15px",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        {puzzle.words.map((word, index) => (
          <button
            key={index}
            onClick={() => handleWordClick(word)}
            disabled={selectedWord !== null}
            style={{
              padding: "15px 20px",
              background:
                selectedWord === word ? "var(--saffron)" : "var(--gold)",
              color: "var(--navy-blue)",
              border: "none",
              borderRadius: "10px",
              cursor: selectedWord !== null ? "not-allowed" : "pointer",
              fontWeight: "700",
              fontSize: "1.1rem",
              opacity: selectedWord !== null && selectedWord !== word ? 0.6 : 1,
            }}
          >
            {word}
          </button>
        ))}
      </div>

      {selectedWord && (
        <p
          style={{
            color: "var(--gold)",
            marginTop: "20px",
            fontSize: "1.1rem",
            fontWeight: "600",
          }}
        >
          ✅ Good choice! All words complete the pattern correctly.
        </p>
      )}
    </div>
  );
};

export default AshokaVault;
