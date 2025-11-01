// Pokemon contestants with comprehensive stats and personality traits
export const pokemonContestants = [
  {
    id: 1,
    name: "Gardevoir",
    dexId: 282,
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/282.png",
    stats: {
      acting: 9,
      improv: 7,
      comedy: 5,
      dance: 8,
      design: 9,
      runway: 10,
      lipsync: 8,
      makeover: 9,
      rusical: 8,
      rumix: 7
    },
    personality: "Elegant, graceful, and emotionally intelligent",
    archetype: "Pageant Queen",
    storylines: ["Perfectionist struggle", "Emotional vulnerability"],
    relationships: {
      allies: ["Lopunny", "Milotic"],
      rivals: ["Tsareena"],
      drama: ["Primarina"]
    }
  },
  {
    id: 2,
    name: "Lopunny",
    dexId: 428,
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/428.png",
    stats: {
      acting: 7,
      improv: 8,
      comedy: 9,
      dance: 10,
      design: 6,
      runway: 9,
      lipsync: 10,
      makeover: 7,
      rusical: 9,
      rumix: 10
    },
    personality: "Bubbly, charismatic, dance diva",
    archetype: "Dancing Queen",
    storylines: ["Proves she's more than looks", "Dance floor domination"],
    relationships: {
      allies: ["Gardevoir", "Jigglypuff"],
      rivals: ["Tsareena"],
      drama: ["Salazzle"]
    }
  },
  {
    id: 3,
    name: "Milotic",
    dexId: 350,
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/350.png",
    stats: {
      acting: 8,
      improv: 6,
      comedy: 4,
      dance: 7,
      design: 8,
      runway: 10,
      lipsync: 7,
      makeover: 9,
      rusical: 7,
      rumix: 6
    },
    personality: "Serene, beautiful, but aloof",
    archetype: "Fashion Queen",
    storylines: ["Coming out of shell", "Ugly duckling to swan narrative"],
    relationships: {
      allies: ["Gardevoir", "Primarina"],
      rivals: ["Salazzle"],
      drama: ["Tsareena"]
    }
  },
  {
    id: 4,
    name: "Tsareena",
    dexId: 763,
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/763.png",
    stats: {
      acting: 8,
      improv: 9,
      comedy: 8,
      dance: 9,
      design: 7,
      runway: 9,
      lipsync: 8,
      makeover: 6,
      rusical: 8,
      rumix: 9
    },
    personality: "Fierce, confident, competitive",
    archetype: "Villain/Competitor",
    storylines: ["Rivalry drama", "Fierce competitor who stirs the pot"],
    relationships: {
      allies: ["Salazzle"],
      rivals: ["Gardevoir", "Lopunny"],
      drama: ["Milotic", "Florges"]
    }
  },
  {
    id: 5,
    name: "Primarina",
    dexId: 730,
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/730.png",
    stats: {
      acting: 9,
      improv: 7,
      comedy: 6,
      dance: 7,
      design: 7,
      runway: 8,
      lipsync: 10,
      makeover: 8,
      rusical: 10,
      rumix: 9
    },
    personality: "Theatrical, dramatic, vocal powerhouse",
    archetype: "Theater Queen",
    storylines: ["Broadway dreams", "Vocal dominance"],
    relationships: {
      allies: ["Milotic", "Delphox"],
      rivals: ["Lopunny"],
      drama: ["Gardevoir"]
    }
  },
  {
    id: 6,
    name: "Salazzle",
    dexId: 758,
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/758.png",
    stats: {
      acting: 9,
      improv: 10,
      comedy: 9,
      dance: 8,
      design: 6,
      runway: 7,
      lipsync: 9,
      makeover: 5,
      rusical: 7,
      rumix: 8
    },
    personality: "Sassy, cunning, reads for filth",
    archetype: "Comedy/Shady Queen",
    storylines: ["Confessional gold", "Strategic gameplay"],
    relationships: {
      allies: ["Tsareena", "Zoroark"],
      rivals: ["Milotic"],
      drama: ["Lopunny", "Jigglypuff"]
    }
  },
  {
    id: 7,
    name: "Florges",
    dexId: 671,
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/671.png",
    stats: {
      acting: 7,
      improv: 6,
      comedy: 5,
      dance: 6,
      design: 10,
      runway: 9,
      lipsync: 6,
      makeover: 10,
      rusical: 6,
      rumix: 5
    },
    personality: "Creative, artistic, perfectionist",
    archetype: "Design Queen",
    storylines: ["Artistic vision", "Design challenge domination"],
    relationships: {
      allies: ["Lilligant", "Bellossom"],
      rivals: ["Tsareena"],
      drama: ["Salazzle"]
    }
  },
  {
    id: 8,
    name: "Jigglypuff",
    dexId: 39,
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/39.png",
    stats: {
      acting: 6,
      improv: 9,
      comedy: 10,
      dance: 7,
      design: 5,
      runway: 6,
      lipsync: 8,
      makeover: 6,
      rusical: 7,
      rumix: 7
    },
    personality: "Quirky, funny, underestimated underdog",
    archetype: "Comedy Relief/Underdog",
    storylines: ["Comic relief becomes contender", "Unexpected talent"],
    relationships: {
      allies: ["Lopunny", "Mawile"],
      rivals: ["None - lovable"],
      drama: ["Salazzle"]
    }
  },
  {
    id: 9,
    name: "Delphox",
    dexId: 655,
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/655.png",
    stats: {
      acting: 10,
      improv: 8,
      comedy: 7,
      dance: 7,
      design: 8,
      runway: 8,
      lipsync: 7,
      makeover: 7,
      rusical: 8,
      rumix: 8
    },
    personality: "Mysterious, wise, method actor",
    archetype: "Actor/Dark Horse",
    storylines: ["Method acting commitment", "Mysterious past"],
    relationships: {
      allies: ["Primarina", "Zoroark"],
      rivals: ["Gothitelle"],
      drama: []
    }
  },
  {
    id: 10,
    name: "Zoroark",
    dexId: 571,
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/571.png",
    stats: {
      acting: 10,
      improv: 10,
      comedy: 8,
      dance: 7,
      design: 7,
      runway: 8,
      lipsync: 8,
      makeover: 8,
      rusical: 8,
      rumix: 8
    },
    personality: "Chameleon, unpredictable, versatile",
    archetype: "Chameleon Queen",
    storylines: ["Identity and authenticity", "Versatility showcase"],
    relationships: {
      allies: ["Salazzle", "Delphox"],
      rivals: ["Gardevoir"],
      drama: ["Tsareena"]
    }
  },
  {
    id: 11,
    name: "Lilligant",
    dexId: 549,
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/549.png",
    stats: {
      acting: 6,
      improv: 7,
      comedy: 6,
      dance: 9,
      design: 8,
      runway: 9,
      lipsync: 7,
      makeover: 8,
      rusical: 8,
      rumix: 7
    },
    personality: "Sweet, graceful, southern charm",
    archetype: "Southern Belle",
    storylines: ["Southern hospitality", "Growth journey"],
    relationships: {
      allies: ["Florges", "Bellossom"],
      rivals: [],
      drama: []
    }
  },
  {
    id: 12,
    name: "Gothitelle",
    dexId: 576,
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/576.png",
    stats: {
      acting: 8,
      improv: 7,
      comedy: 5,
      dance: 6,
      design: 9,
      runway: 10,
      lipsync: 7,
      makeover: 8,
      rusical: 6,
      rumix: 6
    },
    personality: "Gothic, dramatic, fashion-forward",
    archetype: "Alternative Fashion Queen",
    storylines: ["Breaking fashion boundaries", "Misunderstood artist"],
    relationships: {
      allies: ["Mismagius"],
      rivals: ["Delphox", "Gardevoir"],
      drama: ["Tsareena"]
    }
  },
  {
    id: 13,
    name: "Bellossom",
    dexId: 182,
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/182.png",
    stats: {
      acting: 6,
      improv: 7,
      comedy: 8,
      dance: 10,
      design: 7,
      runway: 7,
      lipsync: 9,
      makeover: 7,
      rusical: 9,
      rumix: 9
    },
    personality: "Joyful, energetic, sunshine personified",
    archetype: "Miss Congeniality",
    storylines: ["Spreading positivity", "Hidden depth"],
    relationships: {
      allies: ["Florges", "Lilligant", "Everyone"],
      rivals: [],
      drama: []
    }
  },
  {
    id: 14,
    name: "Mismagius",
    dexId: 429,
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/429.png",
    stats: {
      acting: 9,
      improv: 8,
      comedy: 7,
      dance: 8,
      design: 8,
      runway: 9,
      lipsync: 8,
      makeover: 7,
      rusical: 8,
      rumix: 8
    },
    personality: "Witchy, enchanting, spooky glamour",
    archetype: "Spooky Queen",
    storylines: ["Spooky season excellence", "Mystical presence"],
    relationships: {
      allies: ["Gothitelle", "Delphox"],
      rivals: [],
      drama: []
    }
  },
  {
    id: 15,
    name: "Mawile",
    dexId: 303,
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/303.png",
    stats: {
      acting: 7,
      improv: 8,
      comedy: 9,
      dance: 7,
      design: 7,
      runway: 8,
      lipsync: 8,
      makeover: 7,
      rusical: 7,
      rumix: 7
    },
    personality: "Deceptively fierce, cute but deadly",
    archetype: "Deceptive Queen",
    storylines: ["Don't judge a book by its cover", "Hidden fierceness"],
    relationships: {
      allies: ["Jigglypuff", "Alcremie"],
      rivals: [],
      drama: ["Tsareena"]
    }
  },
  {
    id: 16,
    name: "Alcremie",
    dexId: 869,
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/869.png",
    stats: {
      acting: 5,
      improv: 6,
      comedy: 7,
      dance: 6,
      design: 9,
      runway: 8,
      lipsync: 6,
      makeover: 9,
      rusical: 7,
      rumix: 6
    },
    personality: "Sweet, crafty, dessert enthusiast",
    archetype: "Crafty Queen",
    storylines: ["Sweetness and skill", "Design prowess"],
    relationships: {
      allies: ["Mawile", "Sylveon"],
      rivals: [],
      drama: []
    }
  },
  {
    id: 17,
    name: "Sylveon",
    dexId: 700,
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/700.png",
    stats: {
      acting: 7,
      improv: 8,
      comedy: 8,
      dance: 8,
      design: 8,
      runway: 9,
      lipsync: 9,
      makeover: 8,
      rusical: 8,
      rumix: 8
    },
    personality: "Charming, balanced, fan favorite",
    archetype: "Well-Rounded Queen",
    storylines: ["Consistent excellence", "Fan favorite journey"],
    relationships: {
      allies: ["Alcremie", "Gardevoir"],
      rivals: [],
      drama: []
    }
  },
  {
    id: 18,
    name: "Meloetta",
    dexId: 648,
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/648.png",
    stats: {
      acting: 8,
      improv: 9,
      comedy: 7,
      dance: 10,
      design: 7,
      runway: 8,
      lipsync: 10,
      makeover: 7,
      rusical: 10,
      rumix: 10
    },
    personality: "Musical prodigy, dual personality",
    archetype: "Performance Queen",
    storylines: ["Musical excellence", "Balancing two sides"],
    relationships: {
      allies: ["Primarina", "Bellossom"],
      rivals: ["Lopunny"],
      drama: []
    }
  },
  {
    id: 19,
    name: "Cinccino",
    dexId: 573,
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/573.png",
    stats: {
      acting: 6,
      improv: 7,
      comedy: 7,
      dance: 8,
      design: 8,
      runway: 9,
      lipsync: 7,
      makeover: 9,
      rusical: 7,
      rumix: 7
    },
    personality: "Polished, refined, attention to detail",
    archetype: "Perfectionist",
    storylines: ["Perfectionism as obstacle", "Learning to let go"],
    relationships: {
      allies: ["Gardevoir", "Florges"],
      rivals: [],
      drama: ["Salazzle"]
    }
  },
  {
    id: 20,
    name: "Vespiquen",
    dexId: 416,
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/416.png",
    stats: {
      acting: 8,
      improv: 8,
      comedy: 7,
      dance: 7,
      design: 8,
      runway: 10,
      lipsync: 7,
      makeover: 8,
      rusical: 7,
      rumix: 7
    },
    personality: "Regal, commanding, natural leader",
    archetype: "Royalty Queen",
    storylines: ["Leadership qualities", "Queen bee mentality"],
    relationships: {
      allies: ["Tsareena", "Gothitelle"],
      rivals: ["Gardevoir"],
      drama: ["Salazzle"]
    }
  }
];

// Challenge types with relevant stats
export const challengeTypes = [
  {
    name: "Acting Challenge",
    description: "Queens must act in a dramatic scene",
    relevantStats: ["acting", "improv"],
    icon: "🎭"
  },
  {
    name: "Snatch Game",
    description: "Celebrity impersonation game show",
    relevantStats: ["improv", "comedy", "acting"],
    icon: "🎤"
  },
  {
    name: "Dance Challenge",
    description: "Choreographed dance performance",
    relevantStats: ["dance", "rumix"],
    icon: "💃"
  },
  {
    name: "Design Challenge",
    description: "Create an outfit from unconventional materials",
    relevantStats: ["design", "runway"],
    icon: "✂️"
  },
  {
    name: "Rusical",
    description: "Musical theater performance",
    relevantStats: ["rusical", "acting", "dance"],
    icon: "🎵"
  },
  {
    name: "Makeover Challenge",
    description: "Transform a guest into drag excellence",
    relevantStats: ["makeover", "runway"],
    icon: "💄"
  },
  {
    name: "Stand-Up Comedy",
    description: "Perform stand-up comedy routine",
    relevantStats: ["comedy", "improv"],
    icon: "😂"
  },
  {
    name: "Ball Challenge",
    description: "Three runway looks in different categories",
    relevantStats: ["runway", "design"],
    icon: "👗"
  },
  {
    name: "Girl Groups",
    description: "Form girl groups and perform original songs",
    relevantStats: ["rumix", "dance", "lipsync"],
    icon: "🎶"
  },
  {
    name: "Roast",
    description: "Roast the judges and each other",
    relevantStats: ["comedy", "improv"],
    icon: "🔥"
  }
];
