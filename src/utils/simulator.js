// Simulation engine for Pokemon Drag Race

// Calculate performance score for a challenge
export const calculatePerformanceScore = (queen, challenge, randomFactor = true) => {
  let score = 0;
  const stats = queen.stats;

  // Calculate base score from relevant stats
  challenge.relevantStats.forEach(stat => {
    score += stats[stat] || 0;
  });

  // Average the score
  score = score / challenge.relevantStats.length;

  // Add random variance (±20%) for unpredictability
  if (randomFactor) {
    const variance = (Math.random() - 0.5) * 4; // -2 to +2
    score += variance;
  }

  // Ensure score is between 0 and 10
  return Math.max(0, Math.min(10, score));
};

// Generate placements for an episode
export const generatePlacements = (contestants, challenge) => {
  const performances = contestants.map(queen => ({
    queen,
    score: calculatePerformanceScore(queen, challenge),
    baseScore: calculatePerformanceScore(queen, challenge, false)
  }));

  // Sort by score descending
  performances.sort((a, b) => b.score - a.score);

  const remainingCount = contestants.length;
  let placements = {};

  if (remainingCount <= 4) {
    // Finale - everyone gets a placement
    placements.WIN = [performances[0].queen];
    placements.RUNNER_UP = performances.slice(1, 4).map(p => p.queen);
    return placements;
  }

  if (remainingCount === 5) {
    // Top 5: 1 WIN, 2 HIGH, 2 BTM2
    placements.WIN = [performances[0].queen];
    placements.HIGH = [performances[1].queen, performances[2].queen];
    placements.BTM2 = [performances[3].queen, performances[4].queen];
  } else {
    // Regular episode: 1 WIN, 2 HIGH, 1 LOW, 2 BTM2, rest SAFE
    placements.WIN = [performances[0].queen];
    placements.HIGH = [performances[1].queen, performances[2].queen];

    const bottomCount = Math.min(3, remainingCount - 3);
    const safeCount = remainingCount - 3 - bottomCount;

    placements.SAFE = performances.slice(3, 3 + safeCount).map(p => p.queen);
    placements.LOW = [performances[remainingCount - 3].queen];
    placements.BTM2 = [
      performances[remainingCount - 2].queen,
      performances[remainingCount - 1].queen
    ];
  }

  return placements;
};

// Generate lipsync outcome
export const generateLipsyncOutcome = (queen1, queen2) => {
  const score1 = queen1.stats.lipsync + (Math.random() * 2);
  const score2 = queen2.stats.lipsync + (Math.random() * 2);

  const diff = Math.abs(score1 - score2);

  if (diff < 0.3) {
    // Very close - double shantay chance
    if (Math.random() < 0.15) {
      return { outcome: 'DOUBLE_SHANTAY', eliminated: null };
    }
  }

  const winner = score1 > score2 ? queen1 : queen2;
  const eliminated = score1 > score2 ? queen2 : queen1;

  return { outcome: 'SINGLE_ELIM', winner, eliminated };
};

// Generate performance descriptions
export const generatePerformanceDescription = (queen, challenge, placement) => {
  const descriptions = {
    WIN: [
      `${queen.name} absolutely DOMINATED this challenge! Flawless execution from start to finish.`,
      `Living legend! ${queen.name} proved why she's here to win with this stunning performance.`,
      `${queen.name} ate and left NO crumbs! This is what we call perfection, hunty.`,
      `Condragulations ${queen.name}! You are the winner of this week's challenge!`,
      `${queen.name} just secured her spot in the competition with this WIN-worthy performance!`
    ],
    HIGH: [
      `${queen.name} delivered a strong performance that had the judges gagging.`,
      `So close to the win! ${queen.name} showed versatility and talent tonight.`,
      `${queen.name} proved she's a force to be reckoned with. Safe? More like SLAYING.`,
      `The judges were impressed with ${queen.name}'s attention to detail and commitment.`
    ],
    SAFE: [
      `${queen.name} gave a solid performance but didn't quite stand out this week.`,
      `${queen.name} played it safe tonight. Safe is fine, but we want to see MORE.`,
      `${queen.name}, you're safe this week, but we need to see you step it up next time.`,
      `A middle-of-the-road performance from ${queen.name}. Good, but not great.`
    ],
    LOW: [
      `${queen.name} struggled this week and the judges took notice.`,
      `This wasn't ${queen.name}'s best showing. The concept was there but the execution fell flat.`,
      `${queen.name}, you're safe tonight, but you were dangerously close to the bottom.`,
      `The judges had concerns about ${queen.name}'s performance tonight.`
    ],
    BTM2: [
      `${queen.name} stumbled badly in this challenge and now must fight for her life.`,
      `This was a rough week for ${queen.name}. The judges were NOT amused.`,
      `${queen.name}, tonight you missed the mark completely. We need to see you LIPSYNC!`,
      `${queen.name}'s performance left a lot to be desired. Time to prove you belong here.`
    ]
  };

  const options = descriptions[placement] || descriptions.SAFE;
  return options[Math.floor(Math.random() * options.length)];
};

// Generate entrance quotes
export const generateEntranceQuote = (queen) => {
  const quotes = {
    Gardevoir: "Grace, elegance, and a touch of psychic power - I'm here to SLAY!",
    Lopunny: "They said I'm just a pretty face, but wait till you see these moves!",
    Milotic: "From the depths of beauty, I emerge to claim my crown!",
    Tsareena: "Bow down! The Queen has arrived and she's here to DOMINATE!",
    Primarina: "The stage is my ocean, and I'm about to make waves!",
    Salazzle: "Things are about to get TOXIC up in here!",
    Florges: "I'm blooming with talent and ready to flourish!",
    Jigglypuff: "Don't let the cute face fool you - I'm here to fight!",
    Delphox: "I've seen the future, and spoiler alert: I'm in the finale!",
    Zoroark: "You'll never know what's coming next, and that's exactly how I like it!",
    Lilligant: "Southern charm meets drag excellence, y'all!",
    Gothitelle: "I'm here to show you that dark can be beautiful!",
    Bellossom: "Spreading sunshine and sickening looks!",
    Mismagius: "I'll put a spell on you... and these judges!",
    Mawile: "Sweet on the outside, FIERCE on the inside!",
    Alcremie: "I'm the sweetest treat you'll ever meet!",
    Sylveon: "Ribbons, bows, and fierce flows - let's go!",
    Meloetta: "My performance will be music to your ears!",
    Cinccino: "Perfection is my standard, excellence is my baseline!",
    Vespiquen: "Every kingdom needs a queen, and I'm here to rule!"
  };

  return quotes[queen.name] || `${queen.name} is in the house!`;
};

// Generate drama/tea for episodes
export const generateDrama = (contestants, episode) => {
  const dramas = [
    {
      type: "WORKROOM_TENSION",
      templates: [
        (q1, q2) => `Tension is brewing between ${q1.name} and ${q2.name} in the workroom!`,
        (q1, q2) => `${q1.name} threw shade at ${q2.name}'s look. It's getting HEATED!`,
        (q1, q2) => `${q1.name} and ${q2.name} got into a heated debate about drag aesthetics.`
      ]
    },
    {
      type: "ALLIANCE",
      templates: [
        (q1, q2) => `${q1.name} and ${q2.name} formed a powerful alliance!`,
        (q1, q2) => `${q1.name} and ${q2.name} are working together - strategic or genuine?`
      ]
    },
    {
      type: "BREAKDOWN",
      templates: [
        (q) => `${q.name} had an emotional breakdown in the workroom. The pressure is real!`,
        (q) => `${q.name} is feeling the weight of the competition and broke down in Untucked.`
      ]
    },
    {
      type: "SHADY_CONFESSIONAL",
      templates: [
        (q1, q2) => `${q1.name} in confessional: "${q2.name}? More like ${q2.name.toUpperCase()} DISASTER!" 💀`,
        (q1, q2) => `${q1.name} is NOT holding back about ${q2.name}'s performance. THE SHADE!`
      ]
    },
    {
      type: "SURPRISE_TALENT",
      templates: [
        (q) => `${q.name} revealed a hidden talent that shocked everyone!`,
        (q) => `Nobody saw THIS coming from ${q.name}! She's full of surprises!`
      ]
    }
  ];

  const selectedDramas = [];
  const dramaCount = Math.floor(Math.random() * 3) + 2; // 2-4 drama moments

  for (let i = 0; i < dramaCount; i++) {
    const dramaType = dramas[Math.floor(Math.random() * dramas.length)];
    const template = dramaType.templates[Math.floor(Math.random() * dramaType.templates.length)];

    if (dramaType.type === "BREAKDOWN" || dramaType.type === "SURPRISE_TALENT") {
      const queen = contestants[Math.floor(Math.random() * contestants.length)];
      selectedDramas.push({
        type: dramaType.type,
        text: template(queen)
      });
    } else {
      const queen1 = contestants[Math.floor(Math.random() * contestants.length)];
      let queen2 = contestants[Math.floor(Math.random() * contestants.length)];
      while (queen2.id === queen1.id) {
        queen2 = contestants[Math.floor(Math.random() * contestants.length)];
      }

      selectedDramas.push({
        type: dramaType.type,
        text: template(queen1, queen2)
      });
    }
  }

  return selectedDramas;
};

// Generate lipsync commentary
export const generateLipsyncCommentary = (queen1, queen2, winner) => {
  const commentaries = [
    `Both queens gave it their ALL, but ${winner.name} had that extra spark tonight!`,
    `What a BATTLE! ${winner.name} proved she wants to stay in this competition!`,
    `${winner.name} turned it OUT on that stage! That's how you fight for your life!`,
    `This lipsync was FIERCE, but ${winner.name} brought the passion we needed to see!`,
    `${winner.name} just gave us one of the best lipsyncs of the season!`
  ];

  return commentaries[Math.floor(Math.random() * commentaries.length)];
};

// Track record helpers
export const getPlacementPoints = (placement) => {
  const points = {
    WIN: 4,
    HIGH: 2,
    SAFE: 0,
    LOW: -1,
    BTM2: -2,
    ELIM: -5
  };
  return points[placement] || 0;
};

// Get placement text for display
export const getPlacementText = (placement) => {
  return placement || "—";
};

// Generate double shantay commentary
export const generateDoubleShantayCommentary = (queen1, queen2) => {
  const commentaries = [
    `This lipsync was TOO good! Both ${queen1.name} and ${queen2.name} - SHANTAY YOU BOTH STAY!`,
    `We can't send either of you home after that performance! ${queen1.name}, ${queen2.name} - you both stay!`,
    `That was incredible! ${queen1.name}, ${queen2.name} - neither of you are going anywhere!`,
    `Two queens entered, and two queens are staying! ${queen1.name} and ${queen2.name}, shantay you BOTH stay!`
  ];

  return commentaries[Math.floor(Math.random() * commentaries.length)];
};
