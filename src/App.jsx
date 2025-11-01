import { useState, useEffect } from 'react';
import './App.css';
import { pokemonContestants, challengeTypes } from './data/pokemon';
import {
  generatePlacements,
  generateLipsyncOutcome,
  generatePerformanceDescription,
  generateEntranceQuote,
  generateDrama,
  generateLipsyncCommentary,
  getPlacementPoints,
  getPlacementEmoji
} from './utils/simulator';

function App() {
  // Game state
  const [gamePhase, setGamePhase] = useState('CAST_SELECTION'); // CAST_SELECTION, ENTRANCES, PROMO, EPISODE, RESULTS, LIPSYNC, FINALE
  const [selectedCast, setSelectedCast] = useState([]);
  const [contestants, setContestants] = useState([]);
  const [eliminated, setEliminated] = useState([]);
  const [currentEpisode, setCurrentEpisode] = useState(0);
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [episodePlacements, setEpisodePlacements] = useState({});
  const [trackRecords, setTrackRecords] = useState({});
  const [lipsyncResults, setLipsyncResults] = useState(null);
  const [seasonDrama, setSeasonDrama] = useState([]);
  const [showProducersRoom, setShowProducersRoom] = useState(false);
  const [winner, setWinner] = useState(null);

  // Episode state
  const [episodePhase, setEpisodePhase] = useState('CHALLENGE_SELECT'); // CHALLENGE_SELECT, ANNOUNCEMENT, PERFORMANCES, RESULTS, LIPSYNC, ELIMINATION
  const [performances, setPerformances] = useState([]);
  const [episodeDrama, setEpisodeDrama] = useState([]);

  // Initialize track records when cast is selected
  useEffect(() => {
    if (selectedCast.length > 0) {
      const records = {};
      selectedCast.forEach(queen => {
        records[queen.id] = [];
      });
      setTrackRecords(records);
    }
  }, [selectedCast]);

  // Cast Selection
  const toggleCastMember = (queen) => {
    if (selectedCast.find(q => q.id === queen.id)) {
      setSelectedCast(selectedCast.filter(q => q.id !== queen.id));
    } else {
      if (selectedCast.length < 20) {
        setSelectedCast([...selectedCast, queen]);
      }
    }
  };

  const startSeason = () => {
    if (selectedCast.length < 8) {
      alert('Please select at least 8 queens for the competition!');
      return;
    }
    setContestants([...selectedCast]);
    setGamePhase('ENTRANCES');
  };

  const proceedToPromo = () => {
    setGamePhase('PROMO');
  };

  const startCompetition = () => {
    setCurrentEpisode(1);
    setGamePhase('EPISODE');
    setEpisodePhase('CHALLENGE_SELECT');
  };

  // Episode Flow
  const selectChallenge = (challenge) => {
    setCurrentChallenge(challenge);
    setEpisodePhase('ANNOUNCEMENT');
  };

  const announceChallenge = () => {
    setEpisodePhase('PERFORMANCES');

    // Generate performances
    const placements = generatePlacements(contestants, currentChallenge);
    setEpisodePlacements(placements);

    const performanceDescriptions = {};
    Object.keys(placements).forEach(placement => {
      if (Array.isArray(placements[placement])) {
        placements[placement].forEach(queen => {
          performanceDescriptions[queen.id] = generatePerformanceDescription(queen, currentChallenge, placement);
        });
      }
    });
    setPerformances(performanceDescriptions);

    // Generate drama
    const drama = generateDrama(contestants, currentEpisode);
    setEpisodeDrama(drama);
    setSeasonDrama([...seasonDrama, ...drama]);
  };

  const showResults = () => {
    setEpisodePhase('RESULTS');
  };

  const proceedToLipsync = () => {
    if (contestants.length === 4) {
      // Finale!
      setEpisodePhase('FINALE');
    } else {
      setEpisodePhase('LIPSYNC');
    }
  };

  const performLipsync = (eliminatedQueen) => {
    const btm2 = episodePlacements.BTM2;
    const staying = btm2.find(q => q.id !== eliminatedQueen.id);

    const result = {
      queens: btm2,
      eliminated: eliminatedQueen,
      staying: staying,
      commentary: generateLipsyncCommentary(btm2[0], btm2[1], staying)
    };

    setLipsyncResults(result);
    setEpisodePhase('ELIMINATION');
  };

  const finalizeElimination = () => {
    // Update track records
    const newTrackRecords = { ...trackRecords };

    Object.keys(episodePlacements).forEach(placement => {
      const queens = episodePlacements[placement];
      if (Array.isArray(queens)) {
        queens.forEach(queen => {
          if (queen.id === lipsyncResults.eliminated.id) {
            newTrackRecords[queen.id].push('ELIM');
          } else {
            newTrackRecords[queen.id].push(placement);
          }
        });
      }
    });

    setTrackRecords(newTrackRecords);

    // Remove eliminated queen
    const newContestants = contestants.filter(q => q.id !== lipsyncResults.eliminated.id);
    setContestants(newContestants);
    setEliminated([...eliminated, lipsyncResults.eliminated]);

    // Check if we should go to finale
    if (newContestants.length === 4) {
      setGamePhase('FINALE_READY');
    } else {
      // Next episode
      setCurrentEpisode(currentEpisode + 1);
      setEpisodePhase('CHALLENGE_SELECT');
      setCurrentChallenge(null);
      setEpisodePlacements({});
      setPerformances([]);
      setLipsyncResults(null);
    }
  };

  const crownWinner = (queen) => {
    setWinner(queen);
    setGamePhase('CROWNED');
  };

  // Producers Room - Override placements
  const overridePlacement = (queenId, newPlacement) => {
    const newPlacements = { ...episodePlacements };

    // Remove queen from old placement
    Object.keys(newPlacements).forEach(placement => {
      newPlacements[placement] = newPlacements[placement].filter(q => q.id !== queenId);
    });

    // Add to new placement
    const queen = contestants.find(q => q.id === queenId);
    if (!newPlacements[newPlacement]) {
      newPlacements[newPlacement] = [];
    }
    newPlacements[newPlacement].push(queen);

    setEpisodePlacements(newPlacements);

    // Regenerate performance descriptions
    const performanceDescriptions = {};
    Object.keys(newPlacements).forEach(placement => {
      newPlacements[placement].forEach(queen => {
        performanceDescriptions[queen.id] = generatePerformanceDescription(queen, currentChallenge, placement);
      });
    });
    setPerformances(performanceDescriptions);
  };

  // Calculate season stats
  const getSeasonStats = () => {
    const stats = {
      totalEpisodes: currentEpisode,
      queens: contestants.length + eliminated.length,
      eliminated: eliminated.length,
      dramaCount: seasonDrama.length
    };

    // Win counts
    const winCounts = {};
    Object.keys(trackRecords).forEach(queenId => {
      const record = trackRecords[queenId];
      const wins = record.filter(p => p === 'WIN').length;
      if (wins > 0) {
        const queen = pokemonContestants.find(q => q.id === parseInt(queenId));
        winCounts[queen.name] = wins;
      }
    });

    stats.winCounts = winCounts;
    return stats;
  };

  // Get sorted track record (eliminated queens at bottom, in elimination order)
  const getSortedTrackRecord = () => {
    const remaining = contestants.map(q => ({
      queen: q,
      record: trackRecords[q.id] || [],
      eliminated: false,
      eliminationOrder: -1
    }));

    const elim = eliminated.map((q, index) => ({
      queen: q,
      record: trackRecords[q.id] || [],
      eliminated: true,
      eliminationOrder: index
    }));

    // Sort remaining by wins, then by points
    remaining.sort((a, b) => {
      const winsA = a.record.filter(p => p === 'WIN').length;
      const winsB = b.record.filter(p => p === 'WIN').length;
      if (winsA !== winsB) return winsB - winsA;

      const pointsA = a.record.reduce((sum, p) => sum + getPlacementPoints(p), 0);
      const pointsB = b.record.reduce((sum, p) => sum + getPlacementPoints(p), 0);
      return pointsB - pointsA;
    });

    // Eliminated queens are sorted in reverse order (last eliminated at top of eliminated section)
    elim.sort((a, b) => b.eliminationOrder - a.eliminationOrder);

    return [...remaining, ...elim];
  };

  return (
    <div className="min-h-screen p-8">
      <header className="text-center mb-12">
        <h1 className="text-6xl font-bold mb-4 drag-race-font sparkle text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400">
          POKEMON DRAG RACE
        </h1>
        <p className="text-2xl text-pink-300">Gotta Slay 'Em All! 💅✨</p>
      </header>

      {/* Cast Selection */}
      {gamePhase === 'CAST_SELECTION' && (
        <div className="max-w-7xl mx-auto">
          <div className="drag-card mb-8">
            <h2 className="text-3xl font-bold mb-4 text-center">Select Your Cast</h2>
            <p className="text-center mb-4">Choose at least 8 queens (up to 20) to compete!</p>
            <p className="text-center text-2xl mb-4">Selected: {selectedCast.length}/20</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-8">
            {pokemonContestants.map(queen => (
              <div
                key={queen.id}
                onClick={() => toggleCastMember(queen)}
                className={`queen-card cursor-pointer ${
                  selectedCast.find(q => q.id === queen.id)
                    ? 'border-drag-gold ring-4 ring-drag-gold'
                    : 'border-purple-500/30'
                }`}
              >
                <img
                  src={queen.image}
                  alt={queen.name}
                  className="w-full h-48 object-contain bg-gradient-to-br from-purple-900/50 to-pink-900/50"
                />
                <div className="p-4 bg-gradient-to-br from-purple-800/60 to-pink-800/60">
                  <h3 className="text-xl font-bold text-center">{queen.name}</h3>
                  <p className="text-sm text-center text-pink-200 mt-1">{queen.archetype}</p>
                </div>
              </div>
            ))}
          </div>

          {selectedCast.length >= 8 && (
            <div className="text-center">
              <button
                onClick={startSeason}
                className="drag-button bg-gradient-to-r from-pink-500 to-purple-500 text-3xl px-12 py-6"
              >
                START THE SEASON! 🎬
              </button>
            </div>
          )}
        </div>
      )}

      {/* Entrances */}
      {gamePhase === 'ENTRANCES' && (
        <div className="max-w-4xl mx-auto">
          <div className="drag-card mb-8">
            <h2 className="text-4xl font-bold mb-6 text-center">✨ ENTRANCES ✨</h2>
            <div className="space-y-6">
              {selectedCast.map((queen, index) => (
                <div
                  key={queen.id}
                  className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 p-6 rounded-lg animate-pulse"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={queen.image}
                      alt={queen.name}
                      className="w-24 h-24 object-contain rounded-full border-4 border-drag-gold"
                    />
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-drag-gold">{queen.name}</h3>
                      <p className="text-lg italic text-pink-200">"{generateEntranceQuote(queen)}"</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={proceedToPromo}
              className="drag-button bg-gradient-to-r from-pink-500 to-purple-500 text-2xl"
            >
              See Promo Looks 📸
            </button>
          </div>
        </div>
      )}

      {/* Promo Chart */}
      {gamePhase === 'PROMO' && (
        <div className="max-w-7xl mx-auto">
          <div className="drag-card mb-8">
            <h2 className="text-4xl font-bold mb-6 text-center">📸 MEET THE QUEENS 📸</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {selectedCast.map(queen => (
                <div key={queen.id} className="text-center">
                  <div className="queen-card">
                    <img
                      src={queen.image}
                      alt={queen.name}
                      className="w-full h-48 object-contain bg-gradient-to-br from-purple-900/50 to-pink-900/50"
                    />
                    <div className="p-4 bg-gradient-to-br from-purple-800/60 to-pink-800/60">
                      <h3 className="text-lg font-bold">{queen.name}</h3>
                      <p className="text-sm text-pink-200">{queen.archetype}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={startCompetition}
              className="drag-button bg-gradient-to-r from-pink-500 to-purple-500 text-3xl px-12 py-6"
            >
              LET THE GAMES BEGIN! 🎪
            </button>
          </div>
        </div>
      )}

      {/* Episode - Challenge Selection */}
      {gamePhase === 'EPISODE' && episodePhase === 'CHALLENGE_SELECT' && (
        <div className="max-w-4xl mx-auto">
          <div className="drag-card mb-8">
            <h2 className="text-4xl font-bold mb-4 text-center">Episode {currentEpisode}</h2>
            <p className="text-xl text-center mb-6">{contestants.length} Queens Remain</p>
            <h3 className="text-2xl font-bold mb-6 text-center">Select This Week's Challenge</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {challengeTypes.map((challenge, index) => (
                <button
                  key={index}
                  onClick={() => selectChallenge(challenge)}
                  className="drag-button bg-gradient-to-r from-purple-600 to-pink-600 text-left p-6"
                >
                  <div className="text-4xl mb-2">{challenge.icon}</div>
                  <div className="text-xl font-bold mb-2">{challenge.name}</div>
                  <div className="text-sm">{challenge.description}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Challenge Announcement */}
      {gamePhase === 'EPISODE' && episodePhase === 'ANNOUNCEMENT' && currentChallenge && (
        <div className="max-w-4xl mx-auto">
          <div className="drag-card mb-8 text-center">
            <div className="text-6xl mb-4">{currentChallenge.icon}</div>
            <h2 className="text-4xl font-bold mb-4">{currentChallenge.name}</h2>
            <p className="text-xl mb-6">{currentChallenge.description}</p>
            <p className="text-lg text-pink-300">
              Queens will be judged on: {currentChallenge.relevantStats.join(', ')}
            </p>
          </div>

          <div className="text-center">
            <button
              onClick={announceChallenge}
              className="drag-button bg-gradient-to-r from-pink-500 to-purple-500 text-2xl"
            >
              See Performances 🎭
            </button>
          </div>
        </div>
      )}

      {/* Performances */}
      {gamePhase === 'EPISODE' && episodePhase === 'PERFORMANCES' && (
        <div className="max-w-6xl mx-auto">
          <div className="drag-card mb-8">
            <h2 className="text-4xl font-bold mb-6 text-center">Performances</h2>

            {/* Drama Section */}
            {episodeDrama.length > 0 && (
              <div className="mb-8 p-6 bg-red-900/30 rounded-lg border-2 border-red-500/50">
                <h3 className="text-2xl font-bold mb-4 text-red-300">🍵 THE TEA 🍵</h3>
                <div className="space-y-3">
                  {episodeDrama.map((drama, index) => (
                    <p key={index} className="text-lg">{drama.text}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Performance Descriptions */}
            <div className="space-y-4">
              {contestants.map(queen => (
                <div
                  key={queen.id}
                  className="p-4 bg-gradient-to-r from-purple-900/40 to-pink-900/40 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={queen.image}
                      alt={queen.name}
                      className="w-16 h-16 object-contain rounded-full"
                    />
                    <div className="flex-1">
                      <h4 className="text-xl font-bold">{queen.name}</h4>
                      <p className="text-sm text-pink-200">{performances[queen.id]}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={showResults}
              className="drag-button bg-gradient-to-r from-pink-500 to-purple-500 text-2xl"
            >
              Judging Time! 👨‍⚖️
            </button>
          </div>
        </div>
      )}

      {/* Results */}
      {gamePhase === 'EPISODE' && episodePhase === 'RESULTS' && (
        <div className="max-w-6xl mx-auto">
          <div className="drag-card mb-8">
            <h2 className="text-4xl font-bold mb-6 text-center">📊 RESULTS 📊</h2>

            <div className="space-y-6">
              {/* Winner */}
              {episodePlacements.WIN && (
                <div className="placement-win p-6 rounded-lg">
                  <h3 className="text-2xl font-bold mb-4 flex items-center justify-center gap-2">
                    👑 CHALLENGE WINNER 👑
                  </h3>
                  <div className="flex justify-center gap-4">
                    {episodePlacements.WIN.map(queen => (
                      <div key={queen.id} className="text-center">
                        <img
                          src={queen.image}
                          alt={queen.name}
                          className="w-32 h-32 object-contain mx-auto mb-2 rounded-full border-4 border-yellow-600"
                        />
                        <p className="text-xl font-bold">{queen.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* High */}
              {episodePlacements.HIGH && episodePlacements.HIGH.length > 0 && (
                <div className="placement-high p-6 rounded-lg">
                  <h3 className="text-2xl font-bold mb-4 text-center">⭐ HIGH ⭐</h3>
                  <div className="flex justify-center gap-4">
                    {episodePlacements.HIGH.map(queen => (
                      <div key={queen.id} className="text-center">
                        <img
                          src={queen.image}
                          alt={queen.name}
                          className="w-24 h-24 object-contain mx-auto mb-2 rounded-full"
                        />
                        <p className="font-bold">{queen.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Safe */}
              {episodePlacements.SAFE && episodePlacements.SAFE.length > 0 && (
                <div className="placement-safe p-4 rounded-lg">
                  <h3 className="text-xl font-bold mb-3 text-center">SAFE</h3>
                  <div className="flex justify-center flex-wrap gap-3">
                    {episodePlacements.SAFE.map(queen => (
                      <div key={queen.id} className="text-center">
                        <img
                          src={queen.image}
                          alt={queen.name}
                          className="w-16 h-16 object-contain mx-auto mb-1 rounded-full"
                        />
                        <p className="text-sm">{queen.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Low */}
              {episodePlacements.LOW && episodePlacements.LOW.length > 0 && (
                <div className="placement-low p-6 rounded-lg">
                  <h3 className="text-2xl font-bold mb-4 text-center">😬 LOW 😬</h3>
                  <div className="flex justify-center gap-4">
                    {episodePlacements.LOW.map(queen => (
                      <div key={queen.id} className="text-center">
                        <img
                          src={queen.image}
                          alt={queen.name}
                          className="w-24 h-24 object-contain mx-auto mb-2 rounded-full"
                        />
                        <p className="font-bold">{queen.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bottom 2 */}
              {episodePlacements.BTM2 && episodePlacements.BTM2.length > 0 && (
                <div className="placement-btm2 p-6 rounded-lg">
                  <h3 className="text-2xl font-bold mb-4 text-center">🚨 BOTTOM 2 🚨</h3>
                  <div className="flex justify-center gap-4">
                    {episodePlacements.BTM2.map(queen => (
                      <div key={queen.id} className="text-center">
                        <img
                          src={queen.image}
                          alt={queen.name}
                          className="w-24 h-24 object-contain mx-auto mb-2 rounded-full border-4 border-red-600"
                        />
                        <p className="font-bold">{queen.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="text-center space-x-4">
            <button
              onClick={() => setShowProducersRoom(!showProducersRoom)}
              className="drag-button bg-gradient-to-r from-yellow-600 to-orange-600 text-xl"
            >
              {showProducersRoom ? 'Hide' : 'Show'} Producer's Room 🎬
            </button>
            <button
              onClick={proceedToLipsync}
              className="drag-button bg-gradient-to-r from-pink-500 to-purple-500 text-2xl"
            >
              {contestants.length === 4 ? 'Crown The Winner! 👑' : 'Time to Lipsync! 💋'}
            </button>
          </div>

          {/* Producers Room */}
          {showProducersRoom && (
            <div className="mt-8 drag-card bg-yellow-900/20 border-yellow-500">
              <h3 className="text-3xl font-bold mb-6 text-center text-yellow-400">
                🎬 PRODUCER'S ROOM 🎬
              </h3>
              <p className="text-center mb-6 text-yellow-200">
                Override placements to create your perfect storyline!
              </p>

              <div className="space-y-4">
                {contestants.map(queen => {
                  const currentPlacement = Object.keys(episodePlacements).find(placement =>
                    episodePlacements[placement]?.some(q => q.id === queen.id)
                  );

                  return (
                    <div key={queen.id} className="flex items-center gap-4 bg-black/30 p-4 rounded-lg">
                      <img
                        src={queen.image}
                        alt={queen.name}
                        className="w-16 h-16 object-contain rounded-full"
                      />
                      <div className="flex-1">
                        <p className="font-bold">{queen.name}</p>
                        <p className="text-sm text-gray-300">Current: {currentPlacement}</p>
                      </div>
                      <select
                        value={currentPlacement}
                        onChange={(e) => overridePlacement(queen.id, e.target.value)}
                        className="bg-black/50 border-2 border-yellow-500 rounded px-3 py-2 text-white"
                      >
                        <option value="WIN">WIN</option>
                        <option value="HIGH">HIGH</option>
                        <option value="SAFE">SAFE</option>
                        <option value="LOW">LOW</option>
                        <option value="BTM2">BTM2</option>
                      </select>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Lipsync */}
      {gamePhase === 'EPISODE' && episodePhase === 'LIPSYNC' && episodePlacements.BTM2 && (
        <div className="max-w-4xl mx-auto">
          <div className="drag-card mb-8 text-center">
            <h2 className="text-4xl font-bold mb-6">💋 LIPSYNC FOR YOUR LIFE! 💋</h2>
            <p className="text-2xl mb-8">Who should go home?</p>

            <div className="flex justify-center gap-8 mb-8">
              {episodePlacements.BTM2.map(queen => (
                <div key={queen.id} className="text-center">
                  <img
                    src={queen.image}
                    alt={queen.name}
                    className="w-48 h-48 object-contain mx-auto mb-4 rounded-full border-4 border-red-500"
                  />
                  <p className="text-2xl font-bold mb-4">{queen.name}</p>
                  <p className="text-lg mb-4">Lipsync Stat: {queen.stats.lipsync}/10</p>
                  <button
                    onClick={() => performLipsync(queen)}
                    className="drag-button bg-gradient-to-r from-red-500 to-red-700"
                  >
                    Eliminate {queen.name}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Elimination */}
      {gamePhase === 'EPISODE' && episodePhase === 'ELIMINATION' && lipsyncResults && (
        <div className="max-w-4xl mx-auto">
          <div className="drag-card mb-8 text-center">
            <h2 className="text-4xl font-bold mb-6">Elimination Results</h2>

            <div className="mb-8 p-6 bg-purple-900/50 rounded-lg">
              <p className="text-xl mb-4">{lipsyncResults.commentary}</p>
            </div>

            <div className="mb-8">
              <p className="text-3xl font-bold mb-4 text-green-400">
                {lipsyncResults.staying.name} - Shantay You Stay! 💚
              </p>
              <img
                src={lipsyncResults.staying.image}
                alt={lipsyncResults.staying.name}
                className="w-48 h-48 object-contain mx-auto mb-4"
              />
            </div>

            <div className="mb-8 opacity-50">
              <p className="text-3xl font-bold mb-4 text-red-400">
                {lipsyncResults.eliminated.name} - Sashay Away... 💔
              </p>
              <img
                src={lipsyncResults.eliminated.image}
                alt={lipsyncResults.eliminated.name}
                className="w-48 h-48 object-contain mx-auto mb-4 grayscale"
              />
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={finalizeElimination}
              className="drag-button bg-gradient-to-r from-pink-500 to-purple-500 text-2xl"
            >
              Continue ➡️
            </button>
          </div>
        </div>
      )}

      {/* Finale Ready */}
      {gamePhase === 'FINALE_READY' && (
        <div className="max-w-4xl mx-auto">
          <div className="drag-card mb-8 text-center">
            <h2 className="text-5xl font-bold mb-6 sparkle">✨ TOP 4 FINALE ✨</h2>
            <p className="text-2xl mb-8">The final four queens are ready to compete for the crown!</p>

            <div className="grid grid-cols-2 gap-6 mb-8">
              {contestants.map(queen => (
                <div key={queen.id} className="queen-card">
                  <img
                    src={queen.image}
                    alt={queen.name}
                    className="w-full h-64 object-contain bg-gradient-to-br from-purple-900/50 to-pink-900/50"
                  />
                  <div className="p-6 bg-gradient-to-br from-purple-800/60 to-pink-800/60 text-center">
                    <h3 className="text-2xl font-bold mb-2">{queen.name}</h3>
                    <p className="text-lg">
                      Wins: {trackRecords[queen.id]?.filter(p => p === 'WIN').length || 0}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => setGamePhase('FINALE')}
              className="drag-button bg-gradient-to-r from-pink-500 to-purple-500 text-3xl px-12 py-6"
            >
              Crown the Winner! 👑
            </button>
          </div>
        </div>
      )}

      {/* Finale - Crown Winner */}
      {gamePhase === 'FINALE' && (
        <div className="max-w-6xl mx-auto">
          <div className="drag-card mb-8 text-center">
            <h2 className="text-5xl font-bold mb-6 sparkle">👑 CROWNING MOMENT 👑</h2>
            <p className="text-2xl mb-8">Who will be America's Next Drag Superstar?</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {contestants.map(queen => {
                const wins = trackRecords[queen.id]?.filter(p => p === 'WIN').length || 0;
                const points = trackRecords[queen.id]?.reduce((sum, p) => sum + getPlacementPoints(p), 0) || 0;

                return (
                  <div key={queen.id} className="queen-card" onClick={() => crownWinner(queen)}>
                    <img
                      src={queen.image}
                      alt={queen.name}
                      className="w-full h-48 object-contain bg-gradient-to-br from-purple-900/50 to-pink-900/50"
                    />
                    <div className="p-6 bg-gradient-to-br from-purple-800/60 to-pink-800/60 text-center">
                      <h3 className="text-xl font-bold mb-2">{queen.name}</h3>
                      <p className="text-sm mb-2">👑 {wins} Wins</p>
                      <p className="text-sm mb-4">⭐ {points} Points</p>
                      <button className="drag-button bg-gradient-to-r from-yellow-400 to-yellow-600 text-black text-sm">
                        Crown {queen.name}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Winner Crowned */}
      {gamePhase === 'CROWNED' && winner && (
        <div className="max-w-4xl mx-auto">
          <div className="drag-card mb-8 text-center">
            <h2 className="text-6xl font-bold mb-6 sparkle animate-bounce-slow">
              👑 WINNER 👑
            </h2>
            <img
              src={winner.image}
              alt={winner.name}
              className="w-96 h-96 object-contain mx-auto mb-6"
            />
            <h3 className="text-5xl font-bold mb-4 text-drag-gold">{winner.name}</h3>
            <p className="text-3xl mb-8">America's Next Drag Superstar! 🎉</p>
            <p className="text-xl mb-4">
              Final Stats: {trackRecords[winner.id]?.filter(p => p === 'WIN').length || 0} Wins
            </p>
          </div>

          <div className="text-center">
            <button
              onClick={() => {
                setGamePhase('STATS');
              }}
              className="drag-button bg-gradient-to-r from-pink-500 to-purple-500 text-2xl"
            >
              See Season Recap 📊
            </button>
          </div>
        </div>
      )}

      {/* Season Stats & Track Record */}
      {(gamePhase === 'STATS' || gamePhase === 'EPISODE') && (
        <div className="fixed bottom-4 right-4 z-50">
          <button
            onClick={() => setGamePhase(gamePhase === 'STATS' ? 'EPISODE' : 'STATS')}
            className="drag-button bg-gradient-to-r from-blue-500 to-purple-500"
          >
            {gamePhase === 'STATS' ? 'Back to Show' : 'Season Stats'} 📊
          </button>
        </div>
      )}

      {gamePhase === 'STATS' && (
        <div className="max-w-7xl mx-auto">
          <div className="drag-card mb-8">
            <h2 className="text-4xl font-bold mb-6 text-center">📊 SEASON STATISTICS 📊</h2>

            {/* Overall Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-purple-900/50 p-4 rounded-lg text-center">
                <p className="text-3xl font-bold">{currentEpisode}</p>
                <p className="text-sm">Episodes</p>
              </div>
              <div className="bg-pink-900/50 p-4 rounded-lg text-center">
                <p className="text-3xl font-bold">{selectedCast.length}</p>
                <p className="text-sm">Total Queens</p>
              </div>
              <div className="bg-red-900/50 p-4 rounded-lg text-center">
                <p className="text-3xl font-bold">{eliminated.length}</p>
                <p className="text-sm">Eliminated</p>
              </div>
              <div className="bg-yellow-900/50 p-4 rounded-lg text-center">
                <p className="text-3xl font-bold">{seasonDrama.length}</p>
                <p className="text-sm">Drama Moments</p>
              </div>
            </div>

            {/* Track Record Table */}
            <h3 className="text-3xl font-bold mb-4 text-center">TRACK RECORDS</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-purple-900">
                    <th className="p-3 text-left border border-purple-700">Queen</th>
                    {Array.from({ length: currentEpisode }, (_, i) => (
                      <th key={i} className="p-3 text-center border border-purple-700">
                        Ep {i + 1}
                      </th>
                    ))}
                    <th className="p-3 text-center border border-purple-700">Wins</th>
                    <th className="p-3 text-center border border-purple-700">Points</th>
                  </tr>
                </thead>
                <tbody>
                  {getSortedTrackRecord().map((item, index) => {
                    const wins = item.record.filter(p => p === 'WIN').length;
                    const points = item.record.reduce((sum, p) => sum + getPlacementPoints(p), 0);

                    return (
                      <tr
                        key={item.queen.id}
                        className={`${
                          item.eliminated
                            ? 'opacity-50 bg-gray-800/50'
                            : winner && winner.id === item.queen.id
                            ? 'bg-gradient-to-r from-yellow-600/50 to-yellow-500/50'
                            : 'bg-purple-900/30'
                        } hover:bg-purple-800/50`}
                      >
                        <td className="p-3 border border-purple-700">
                          <div className="flex items-center gap-2">
                            <img
                              src={item.queen.image}
                              alt={item.queen.name}
                              className="w-10 h-10 object-contain rounded-full"
                            />
                            <span className={item.eliminated ? 'line-through' : 'font-bold'}>
                              {item.queen.name}
                              {winner && winner.id === item.queen.id && ' 👑'}
                            </span>
                          </div>
                        </td>
                        {Array.from({ length: currentEpisode }, (_, i) => (
                          <td
                            key={i}
                            className={`p-3 text-center border border-purple-700 text-xl ${
                              item.record[i] === 'WIN' ? 'placement-win' :
                              item.record[i] === 'HIGH' ? 'placement-high' :
                              item.record[i] === 'LOW' ? 'placement-low' :
                              item.record[i] === 'BTM2' ? 'placement-btm2' :
                              item.record[i] === 'ELIM' ? 'placement-elim' :
                              'placement-safe'
                            }`}
                          >
                            {item.record[i] ? getPlacementEmoji(item.record[i]) : '—'}
                          </td>
                        ))}
                        <td className="p-3 text-center border border-purple-700 font-bold text-yellow-400">
                          {wins}
                        </td>
                        <td className="p-3 text-center border border-purple-700 font-bold">
                          {points}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Drama Tea */}
            {seasonDrama.length > 0 && (
              <div className="mt-8">
                <h3 className="text-3xl font-bold mb-4 text-center text-red-300">
                  🍵 SEASON TEA 🍵
                </h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {seasonDrama.map((drama, index) => (
                    <div
                      key={index}
                      className="p-3 bg-red-900/20 rounded border-l-4 border-red-500"
                    >
                      <p>{drama.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {winner && (
            <div className="text-center">
              <button
                onClick={() => {
                  // Reset everything
                  setGamePhase('CAST_SELECTION');
                  setSelectedCast([]);
                  setContestants([]);
                  setEliminated([]);
                  setCurrentEpisode(0);
                  setCurrentChallenge(null);
                  setEpisodePlacements({});
                  setTrackRecords({});
                  setLipsyncResults(null);
                  setSeasonDrama([]);
                  setWinner(null);
                }}
                className="drag-button bg-gradient-to-r from-pink-500 to-purple-500 text-2xl"
              >
                Start New Season 🔄
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
