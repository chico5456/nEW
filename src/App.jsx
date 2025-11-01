import { useState, useEffect } from 'react';
import { Trophy, Skull, Star, Sparkles, Crown, Mic, Music, Smile, Drama, Zap, Heart, Flame, Frown, Meh, Eye, Settings } from 'lucide-react';
import './App.css';
import { pokemonContestants, challengeTypes } from './data/pokemon';
import {
  generatePlacements,
  generatePerformanceDescription,
  generateEntranceQuote,
  generateDrama,
  generateLipsyncCommentary,
  generateDoubleShantayCommentary,
  getPlacementPoints,
  getPlacementText
} from './utils/simulator';
import { cn } from './lib/utils';

function App() {
  // Game state
  const [gamePhase, setGamePhase] = useState('CAST_SELECTION');
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
  const [episodePhase, setEpisodePhase] = useState('CHALLENGE_SELECT');
  const [performances, setPerformances] = useState([]);
  const [episodeDrama, setEpisodeDrama] = useState([]);

  // Initialize track records
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

    const drama = generateDrama(contestants, currentEpisode);
    setEpisodeDrama(drama);
    setSeasonDrama([...seasonDrama, ...drama]);
  };

  const showResults = () => {
    setEpisodePhase('RESULTS');
  };

  const proceedToLipsync = () => {
    if (contestants.length === 4) {
      setEpisodePhase('FINALE');
    } else {
      setEpisodePhase('LIPSYNC');
    }
  };

  const performLipsync = (eliminatedQueenId, isDoubleShantay = false) => {
    const btm2 = episodePlacements.BTM2;

    if (isDoubleShantay) {
      // Both queens stay
      const result = {
        queens: btm2,
        eliminated: null,
        doubleShantay: true,
        commentary: generateDoubleShantayCommentary(btm2[0], btm2[1])
      };
      setLipsyncResults(result);
      setEpisodePhase('ELIMINATION');
    } else {
      // One queen eliminated
      const eliminatedQueen = btm2.find(q => q.id === eliminatedQueenId);
      const staying = btm2.find(q => q.id !== eliminatedQueenId);

      const result = {
        queens: btm2,
        eliminated: eliminatedQueen,
        staying: staying,
        doubleShantay: false,
        commentary: generateLipsyncCommentary(btm2[0], btm2[1], staying)
      };

      setLipsyncResults(result);
      setEpisodePhase('ELIMINATION');
    }
  };

  const finalizeElimination = () => {
    const newTrackRecords = { ...trackRecords };

    if (lipsyncResults.doubleShantay) {
      // Double shantay - both queens get BTM2
      Object.keys(episodePlacements).forEach(placement => {
        const queens = episodePlacements[placement];
        if (Array.isArray(queens)) {
          queens.forEach(queen => {
            newTrackRecords[queen.id].push(placement);
          });
        }
      });

      setTrackRecords(newTrackRecords);
      setCurrentEpisode(currentEpisode + 1);
      setEpisodePhase('CHALLENGE_SELECT');
      setCurrentChallenge(null);
      setEpisodePlacements({});
      setPerformances([]);
      setLipsyncResults(null);
    } else {
      // Regular elimination
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

      const newContestants = contestants.filter(q => q.id !== lipsyncResults.eliminated.id);
      setContestants(newContestants);
      setEliminated([...eliminated, lipsyncResults.eliminated]);

      if (newContestants.length === 4) {
        setGamePhase('FINALE_READY');
      } else {
        setCurrentEpisode(currentEpisode + 1);
        setEpisodePhase('CHALLENGE_SELECT');
        setCurrentChallenge(null);
        setEpisodePlacements({});
        setPerformances([]);
        setLipsyncResults(null);
      }
    }
  };

  const crownWinner = (queen) => {
    setWinner(queen);
    setGamePhase('CROWNED');
  };

  // Producers Room
  const overridePlacement = (queenId, newPlacement) => {
    const newPlacements = { ...episodePlacements };

    Object.keys(newPlacements).forEach(placement => {
      newPlacements[placement] = newPlacements[placement].filter(q => q.id !== queenId);
    });

    const queen = contestants.find(q => q.id === queenId);
    if (!newPlacements[newPlacement]) {
      newPlacements[newPlacement] = [];
    }
    newPlacements[newPlacement].push(queen);

    setEpisodePlacements(newPlacements);

    const performanceDescriptions = {};
    Object.keys(newPlacements).forEach(placement => {
      newPlacements[placement].forEach(queen => {
        performanceDescriptions[queen.id] = generatePerformanceDescription(queen, currentChallenge, placement);
      });
    });
    setPerformances(performanceDescriptions);
  };

  // Get sorted track record
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

    remaining.sort((a, b) => {
      const winsA = a.record.filter(p => p === 'WIN').length;
      const winsB = b.record.filter(p => p === 'WIN').length;
      if (winsA !== winsB) return winsB - winsA;

      const pointsA = a.record.reduce((sum, p) => sum + getPlacementPoints(p), 0);
      const pointsB = b.record.reduce((sum, p) => sum + getPlacementPoints(p), 0);
      return pointsB - pointsA;
    });

    elim.sort((a, b) => b.eliminationOrder - a.eliminationOrder);

    return [...remaining, ...elim];
  };

  // Get placement class for track record cell
  const getTrackCellClass = (placement) => {
    const classes = {
      WIN: 'track-cell-win',
      HIGH: 'track-cell-high',
      SAFE: 'track-cell-safe',
      LOW: 'track-cell-low',
      BTM2: 'track-cell-btm2',
      ELIM: 'track-cell-elim'
    };
    return classes[placement] || 'track-cell-safe';
  };

  // Get placement icon
  const getPlacementIcon = (placement) => {
    switch(placement) {
      case 'WIN': return <Crown className="w-4 h-4" />;
      case 'HIGH': return <Star className="w-4 h-4" />;
      case 'SAFE': return <Meh className="w-4 h-4" />;
      case 'LOW': return <Frown className="w-4 h-4" />;
      case 'BTM2': return <Flame className="w-4 h-4" />;
      case 'ELIM': return <Skull className="w-4 h-4" />;
      default: return null;
    }
  };

  // Track Record Preview Component
  const TrackRecordPreview = ({ queen }) => {
    const record = trackRecords[queen.id] || [];
    const wins = record.filter(p => p === 'WIN').length;
    const highs = record.filter(p => p === 'HIGH').length;
    const lows = record.filter(p => p === 'LOW').length;
    const btms = record.filter(p => p === 'BTM2').length;

    return (
      <div className="bg-gray-50 rounded-lg p-3 space-y-2">
        <div className="flex items-center gap-2">
          <img src={queen.image} alt={queen.name} className="w-12 h-12 object-contain" />
          <div className="flex-1">
            <h4 className="font-semibold text-sm">{queen.name}</h4>
            <p className="text-xs text-gray-500">{queen.archetype}</p>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2 text-xs">
          <div className="flex items-center gap-1">
            <Crown className="w-3 h-3 text-yellow-600" />
            <span className="font-semibold">{wins}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-green-600" />
            <span className="font-semibold">{highs}</span>
          </div>
          <div className="flex items-center gap-1">
            <Frown className="w-3 h-3 text-orange-600" />
            <span className="font-semibold">{lows}</span>
          </div>
          <div className="flex items-center gap-1">
            <Flame className="w-3 h-3 text-red-600" />
            <span className="font-semibold">{btms}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-1">
          {record.map((placement, idx) => (
            <span key={idx} className={cn('text-xs px-2 py-0.5 rounded', getTrackCellClass(placement))}>
              {placement}
            </span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <header className="text-center mb-12 animate-fade-in">
        <h1 className="text-5xl md:text-7xl font-black mb-4 bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          POKEMON DRAG RACE
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 font-medium">Gotta Slay 'Em All! 💅✨</p>
      </header>

      {/* Cast Selection */}
      {gamePhase === 'CAST_SELECTION' && (
        <div className="max-w-7xl mx-auto animate-slide-in">
          <div className="card p-8 mb-8">
            <h2 className="text-3xl font-bold mb-4 text-center">Select Your Cast</h2>
            <p className="text-center text-gray-600 mb-4">Choose at least 8 queens (up to 20) to compete!</p>
            <div className="text-center mb-6">
              <span className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                {selectedCast.length}/20
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 mb-8">
            {pokemonContestants.map(queen => (
              <div
                key={queen.id}
                onClick={() => toggleCastMember(queen)}
                className={cn(
                  'queen-card',
                  selectedCast.find(q => q.id === queen.id) ? 'queen-card-selected' : 'queen-card-unselected'
                )}
              >
                <div className="relative">
                  <img
                    src={queen.image}
                    alt={queen.name}
                    className="w-full h-32 md:h-40 object-contain bg-gradient-to-br from-gray-50 to-gray-100 p-4"
                  />
                  {selectedCast.find(q => q.id === queen.id) && (
                    <div className="absolute top-2 right-2 bg-pink-500 text-white rounded-full p-1">
                      <Sparkles className="w-4 h-4" />
                    </div>
                  )}
                </div>
                <div className="p-4 bg-white">
                  <h3 className="text-lg font-bold text-center">{queen.name}</h3>
                  <p className="text-sm text-center text-gray-500 mt-1">{queen.archetype}</p>
                </div>
              </div>
            ))}
          </div>

          {selectedCast.length >= 8 && (
            <div className="text-center animate-slide-in">
              <button onClick={startSeason} className="btn-primary text-2xl px-12 py-6">
                <Sparkles className="inline-block w-6 h-6 mr-2" />
                START THE SEASON!
              </button>
            </div>
          )}
        </div>
      )}

      {/* Entrances */}
      {gamePhase === 'ENTRANCES' && (
        <div className="max-w-4xl mx-auto animate-slide-in">
          <div className="card p-8 mb-8">
            <h2 className="text-4xl font-bold mb-6 text-center flex items-center justify-center gap-2">
              <Sparkles className="w-8 h-8 text-pink-500" />
              ENTRANCES
              <Sparkles className="w-8 h-8 text-purple-500" />
            </h2>
            <div className="space-y-4">
              {selectedCast.map((queen, index) => (
                <div
                  key={queen.id}
                  className="card-hover p-6 animate-slide-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={queen.image}
                      alt={queen.name}
                      className="w-20 h-20 object-contain rounded-full bg-gradient-to-br from-pink-100 to-purple-100 p-2"
                    />
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900">{queen.name}</h3>
                      <p className="text-lg italic text-gray-600 mt-1">"{generateEntranceQuote(queen)}"</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <button onClick={proceedToPromo} className="btn-primary text-xl">
              See Promo Looks 📸
            </button>
          </div>
        </div>
      )}

      {/* Promo Chart */}
      {gamePhase === 'PROMO' && (
        <div className="max-w-7xl mx-auto animate-slide-in">
          <div className="card p-8 mb-8">
            <h2 className="text-4xl font-bold mb-6 text-center">📸 MEET THE QUEENS 📸</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {selectedCast.map(queen => (
                <div key={queen.id} className="text-center">
                  <div className="card-hover">
                    <img
                      src={queen.image}
                      alt={queen.name}
                      className="w-full h-40 object-contain bg-gradient-to-br from-gray-50 to-gray-100 p-4"
                    />
                    <div className="p-4 bg-white">
                      <h3 className="text-lg font-bold">{queen.name}</h3>
                      <p className="text-sm text-gray-500">{queen.archetype}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <button onClick={startCompetition} className="btn-primary text-2xl px-12 py-6">
              <Trophy className="inline-block w-6 h-6 mr-2" />
              LET THE GAMES BEGIN!
            </button>
          </div>
        </div>
      )}

      {/* Episode - Challenge Selection */}
      {gamePhase === 'EPISODE' && episodePhase === 'CHALLENGE_SELECT' && (
        <div className="max-w-4xl mx-auto animate-slide-in">
          <div className="card p-8 mb-8">
            <h2 className="text-4xl font-bold mb-4 text-center">Episode {currentEpisode}</h2>
            <p className="text-xl text-center text-gray-600 mb-6">{contestants.length} Queens Remain</p>
            <h3 className="text-2xl font-bold mb-6 text-center">Select This Week's Challenge</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {challengeTypes.map((challenge, index) => (
                <button
                  key={index}
                  onClick={() => selectChallenge(challenge)}
                  className="btn-secondary text-left p-6 hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50"
                >
                  <div className="text-4xl mb-2">{challenge.icon}</div>
                  <div className="text-xl font-bold mb-2">{challenge.name}</div>
                  <div className="text-sm text-gray-600">{challenge.description}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Challenge Announcement */}
      {gamePhase === 'EPISODE' && episodePhase === 'ANNOUNCEMENT' && currentChallenge && (
        <div className="max-w-4xl mx-auto animate-slide-in">
          <div className="card p-8 mb-8 text-center">
            <div className="text-6xl mb-4">{currentChallenge.icon}</div>
            <h2 className="text-4xl font-bold mb-4">{currentChallenge.name}</h2>
            <p className="text-xl mb-6 text-gray-600">{currentChallenge.description}</p>
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-100 to-purple-100 px-6 py-3 rounded-full">
              <Eye className="w-5 h-5 text-pink-600" />
              <p className="text-lg font-medium text-gray-900">
                Judged on: {currentChallenge.relevantStats.join(', ')}
              </p>
            </div>
          </div>

          <div className="text-center">
            <button onClick={announceChallenge} className="btn-primary text-2xl">
              <Drama className="inline-block w-6 h-6 mr-2" />
              See Performances
            </button>
          </div>
        </div>
      )}

      {/* Performances */}
      {gamePhase === 'EPISODE' && episodePhase === 'PERFORMANCES' && (
        <div className="max-w-6xl mx-auto animate-slide-in">
          <div className="card p-8 mb-8">
            <h2 className="text-4xl font-bold mb-6 text-center">Performances</h2>

            {/* Drama Section */}
            {episodeDrama.length > 0 && (
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2 text-pink-600">
                  <Drama className="w-6 h-6" />
                  THE TEA
                </h3>
                <div className="space-y-3">
                  {episodeDrama.map((drama, index) => (
                    <div key={index} className="tea-card animate-slide-in" style={{ animationDelay: `${index * 0.1}s` }}>
                      <p className="text-gray-800">{drama.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Performance Descriptions */}
            <div className="space-y-4">
              {contestants.map(queen => (
                <div key={queen.id} className="card p-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={queen.image}
                      alt={queen.name}
                      className="w-16 h-16 object-contain rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 p-2"
                    />
                    <div className="flex-1">
                      <h4 className="text-xl font-bold">{queen.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{performances[queen.id]}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <button onClick={showResults} className="btn-primary text-2xl">
              <Trophy className="inline-block w-6 h-6 mr-2" />
              Judging Time!
            </button>
          </div>
        </div>
      )}

      {/* Results */}
      {gamePhase === 'EPISODE' && episodePhase === 'RESULTS' && (
        <div className="max-w-6xl mx-auto animate-slide-in">
          <div className="card p-8 mb-8">
            <h2 className="text-4xl font-bold mb-6 text-center flex items-center justify-center gap-2">
              <Trophy className="w-8 h-8 text-yellow-500" />
              RESULTS
            </h2>

            <div className="space-y-6">
              {/* Winner */}
              {episodePlacements.WIN && (
                <div className="placement-win p-6 rounded-xl shadow-lg">
                  <h3 className="text-2xl font-bold mb-4 flex items-center justify-center gap-2">
                    <Crown className="w-6 h-6" />
                    CHALLENGE WINNER
                  </h3>
                  <div className="flex justify-center">
                    {episodePlacements.WIN.map(queen => (
                      <div key={queen.id} className="text-center">
                        <img
                          src={queen.image}
                          alt={queen.name}
                          className="w-32 h-32 object-contain mx-auto mb-2 rounded-full bg-white/50 p-2"
                        />
                        <p className="text-xl font-bold">{queen.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* High */}
              {episodePlacements.HIGH && episodePlacements.HIGH.length > 0 && (
                <div className="placement-high p-6 rounded-xl shadow-lg">
                  <h3 className="text-2xl font-bold mb-4 text-center flex items-center justify-center gap-2">
                    <Star className="w-6 h-6" />
                    HIGH
                  </h3>
                  <div className="flex justify-center gap-4">
                    {episodePlacements.HIGH.map(queen => (
                      <div key={queen.id} className="text-center">
                        <img
                          src={queen.image}
                          alt={queen.name}
                          className="w-24 h-24 object-contain mx-auto mb-2 rounded-full bg-white/50 p-2"
                        />
                        <p className="font-bold">{queen.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Safe */}
              {episodePlacements.SAFE && episodePlacements.SAFE.length > 0 && (
                <div className="placement-safe p-4 rounded-xl">
                  <h3 className="text-xl font-bold mb-3 text-center flex items-center justify-center gap-2">
                    <Meh className="w-5 h-5" />
                    SAFE
                  </h3>
                  <div className="flex justify-center flex-wrap gap-3">
                    {episodePlacements.SAFE.map(queen => (
                      <div key={queen.id} className="text-center">
                        <img
                          src={queen.image}
                          alt={queen.name}
                          className="w-16 h-16 object-contain mx-auto mb-1 rounded-full bg-white p-1"
                        />
                        <p className="text-sm font-medium">{queen.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Low */}
              {episodePlacements.LOW && episodePlacements.LOW.length > 0 && (
                <div className="placement-low p-6 rounded-xl shadow-lg">
                  <h3 className="text-2xl font-bold mb-4 text-center flex items-center justify-center gap-2">
                    <Frown className="w-6 h-6" />
                    LOW
                  </h3>
                  <div className="flex justify-center gap-4">
                    {episodePlacements.LOW.map(queen => (
                      <div key={queen.id} className="text-center">
                        <img
                          src={queen.image}
                          alt={queen.name}
                          className="w-24 h-24 object-contain mx-auto mb-2 rounded-full bg-white/50 p-2"
                        />
                        <p className="font-bold">{queen.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bottom 2 */}
              {episodePlacements.BTM2 && episodePlacements.BTM2.length > 0 && (
                <div className="placement-btm2 p-6 rounded-xl shadow-lg">
                  <h3 className="text-2xl font-bold mb-4 text-center flex items-center justify-center gap-2">
                    <Flame className="w-6 h-6" />
                    BOTTOM 2
                  </h3>
                  <div className="flex justify-center gap-4">
                    {episodePlacements.BTM2.map(queen => (
                      <div key={queen.id} className="text-center">
                        <img
                          src={queen.image}
                          alt={queen.name}
                          className="w-24 h-24 object-contain mx-auto mb-2 rounded-full bg-white/20 p-2 border-2 border-white"
                        />
                        <p className="font-bold">{queen.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => setShowProducersRoom(!showProducersRoom)}
              className="btn-secondary flex items-center gap-2"
            >
              <Settings className="w-5 h-5" />
              {showProducersRoom ? 'Hide' : 'Show'} Producer's Room
            </button>
            <button onClick={proceedToLipsync} className="btn-primary text-xl flex items-center gap-2">
              {contestants.length === 4 ? (
                <>
                  <Crown className="w-6 h-6" />
                  Crown The Winner!
                </>
              ) : (
                <>
                  <Music className="w-6 h-6" />
                  Time to Lipsync!
                </>
              )}
            </button>
          </div>

          {/* Producers Room */}
          {showProducersRoom && (
            <div className="card p-8 mb-8 bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-400 animate-slide-in">
              <h3 className="text-3xl font-bold mb-6 text-center flex items-center justify-center gap-2 text-yellow-800">
                <Settings className="w-8 h-8" />
                PRODUCER'S ROOM
              </h3>
              <p className="text-center mb-6 text-gray-700 font-medium">
                Override placements to create your perfect storyline!
              </p>

              <div className="space-y-4">
                {contestants.map(queen => {
                  const currentPlacement = Object.keys(episodePlacements).find(placement =>
                    episodePlacements[placement]?.some(q => q.id === queen.id)
                  );

                  return (
                    <div key={queen.id} className="bg-white rounded-lg p-4 shadow-md">
                      <div className="flex items-center gap-4 mb-3">
                        <img
                          src={queen.image}
                          alt={queen.name}
                          className="w-16 h-16 object-contain rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 p-2"
                        />
                        <div className="flex-1">
                          <p className="font-bold text-lg">{queen.name}</p>
                          <p className="text-sm text-gray-500">Current: <span className="font-semibold">{currentPlacement}</span></p>
                        </div>
                        <select
                          value={currentPlacement}
                          onChange={(e) => overridePlacement(queen.id, e.target.value)}
                          className="px-4 py-2 border-2 border-gray-200 rounded-lg font-semibold focus:border-pink-500 focus:outline-none"
                        >
                          <option value="WIN">WIN</option>
                          <option value="HIGH">HIGH</option>
                          <option value="SAFE">SAFE</option>
                          <option value="LOW">LOW</option>
                          <option value="BTM2">BTM2</option>
                        </select>
                      </div>
                      <TrackRecordPreview queen={queen} />
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
        <div className="max-w-5xl mx-auto animate-slide-in">
          <div className="card p-8 mb-8 text-center">
            <h2 className="text-4xl font-bold mb-6 flex items-center justify-center gap-2">
              <Music className="w-8 h-8 text-pink-600" />
              LIPSYNC FOR YOUR LIFE!
            </h2>
            <p className="text-2xl mb-8 text-gray-600">Who should go home?</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {episodePlacements.BTM2.map(queen => (
                <div key={queen.id} className="card p-6">
                  <img
                    src={queen.image}
                    alt={queen.name}
                    className="w-48 h-48 object-contain mx-auto mb-4 rounded-full bg-gradient-to-br from-red-50 to-pink-50 p-4 border-4 border-red-300"
                  />
                  <p className="text-2xl font-bold mb-4">{queen.name}</p>
                  <div className="mb-4">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Music className="w-5 h-5 text-pink-600" />
                      <span className="text-lg">Lipsync: <span className="font-bold">{queen.stats.lipsync}/10</span></span>
                    </div>
                  </div>

                  <TrackRecordPreview queen={queen} />

                  <button
                    onClick={() => performLipsync(queen.id)}
                    className="btn-danger w-full mt-4 flex items-center justify-center gap-2"
                  >
                    <Skull className="w-5 h-5" />
                    Eliminate {queen.name}
                  </button>
                </div>
              ))}
            </div>

            <div className="card bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-400 p-6">
              <h3 className="text-xl font-bold mb-3 text-green-800">Double Shantay Option</h3>
              <p className="text-gray-700 mb-4">Both queens slayed! Keep them both in the competition.</p>
              <button
                onClick={() => performLipsync(null, true)}
                className="btn-success flex items-center justify-center gap-2 mx-auto"
              >
                <Heart className="w-5 h-5" />
                Shantay You BOTH Stay!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Elimination */}
      {gamePhase === 'EPISODE' && episodePhase === 'ELIMINATION' && lipsyncResults && (
        <div className="max-w-4xl mx-auto animate-slide-in">
          <div className="card p-8 mb-8 text-center">
            <h2 className="text-4xl font-bold mb-6">Elimination Results</h2>

            <div className="card bg-gradient-to-br from-purple-50 to-pink-50 p-6 mb-8">
              <p className="text-xl mb-4">{lipsyncResults.commentary}</p>
            </div>

            {lipsyncResults.doubleShantay ? (
              <div className="space-y-6">
                <div className="card bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-400 p-6">
                  <h3 className="text-3xl font-bold mb-4 text-green-800 flex items-center justify-center gap-2">
                    <Heart className="w-8 h-8" />
                    DOUBLE SHANTAY!
                  </h3>
                  <div className="flex justify-center gap-8">
                    {lipsyncResults.queens.map(queen => (
                      <div key={queen.id}>
                        <img
                          src={queen.image}
                          alt={queen.name}
                          className="w-40 h-40 object-contain mx-auto mb-4"
                        />
                        <p className="text-xl font-bold">{queen.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <p className="text-3xl font-bold mb-4 text-green-600 flex items-center justify-center gap-2">
                    <Heart className="w-8 h-8" />
                    {lipsyncResults.staying.name} - Shantay You Stay!
                  </p>
                  <img
                    src={lipsyncResults.staying.image}
                    alt={lipsyncResults.staying.name}
                    className="w-48 h-48 object-contain mx-auto mb-4"
                  />
                </div>

                <div className="mb-8 opacity-50">
                  <p className="text-3xl font-bold mb-4 text-red-600 flex items-center justify-center gap-2">
                    <Skull className="w-8 h-8" />
                    {lipsyncResults.eliminated.name} - Sashay Away...
                  </p>
                  <img
                    src={lipsyncResults.eliminated.image}
                    alt={lipsyncResults.eliminated.name}
                    className="w-48 h-48 object-contain mx-auto mb-4 grayscale"
                  />
                </div>
              </>
            )}
          </div>

          <div className="text-center">
            <button onClick={finalizeElimination} className="btn-primary text-2xl">
              Continue →
            </button>
          </div>
        </div>
      )}

      {/* Finale Ready */}
      {gamePhase === 'FINALE_READY' && (
        <div className="max-w-5xl mx-auto animate-slide-in">
          <div className="card p-8 mb-8 text-center">
            <h2 className="text-5xl font-bold mb-6 flex items-center justify-center gap-2 animate-shimmer">
              <Sparkles className="w-10 h-10 text-pink-600" />
              TOP 4 FINALE
              <Sparkles className="w-10 h-10 text-purple-600" />
            </h2>
            <p className="text-2xl mb-8 text-gray-600">The final four queens are ready to compete for the crown!</p>

            <div className="grid grid-cols-2 gap-6 mb-8">
              {contestants.map(queen => (
                <div key={queen.id} className="card-hover">
                  <img
                    src={queen.image}
                    alt={queen.name}
                    className="w-full h-64 object-contain bg-gradient-to-br from-gray-50 to-gray-100 p-8"
                  />
                  <div className="p-6 bg-white text-center">
                    <h3 className="text-2xl font-bold mb-2">{queen.name}</h3>
                    <p className="text-lg flex items-center justify-center gap-2">
                      <Crown className="w-5 h-5 text-yellow-600" />
                      <span className="font-bold">{trackRecords[queen.id]?.filter(p => p === 'WIN').length || 0}</span> Wins
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => setGamePhase('FINALE')}
              className="btn-primary text-3xl px-12 py-6 flex items-center gap-3 mx-auto"
            >
              <Crown className="w-8 h-8" />
              Crown the Winner!
            </button>
          </div>
        </div>
      )}

      {/* Finale - Crown Winner */}
      {gamePhase === 'FINALE' && (
        <div className="max-w-6xl mx-auto animate-slide-in">
          <div className="card p-8 mb-8 text-center">
            <h2 className="text-5xl font-bold mb-6 flex items-center justify-center gap-2 animate-shimmer">
              <Crown className="w-10 h-10 text-yellow-600" />
              CROWNING MOMENT
            </h2>
            <p className="text-2xl mb-8 text-gray-600">Who will be America's Next Drag Superstar?</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {contestants.map(queen => {
                const wins = trackRecords[queen.id]?.filter(p => p === 'WIN').length || 0;
                const points = trackRecords[queen.id]?.reduce((sum, p) => sum + getPlacementPoints(p), 0) || 0;

                return (
                  <div key={queen.id} className="card-hover" onClick={() => crownWinner(queen)}>
                    <img
                      src={queen.image}
                      alt={queen.name}
                      className="w-full h-48 object-contain bg-gradient-to-br from-gray-50 to-gray-100 p-4"
                    />
                    <div className="p-6 bg-white text-center">
                      <h3 className="text-xl font-bold mb-2">{queen.name}</h3>
                      <p className="text-sm mb-2 flex items-center justify-center gap-1">
                        <Crown className="w-4 h-4 text-yellow-600" />
                        {wins} Wins
                      </p>
                      <p className="text-sm mb-4 flex items-center justify-center gap-1">
                        <Star className="w-4 h-4 text-gray-600" />
                        {points} Points
                      </p>
                      <button className="btn-primary text-sm w-full">
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
        <div className="max-w-4xl mx-auto animate-slide-in">
          <div className="card p-8 mb-8 text-center">
            <h2 className="text-6xl font-bold mb-6 animate-shimmer flex items-center justify-center gap-3">
              <Trophy className="w-16 h-16 text-yellow-600" />
              WINNER
            </h2>
            <img
              src={winner.image}
              alt={winner.name}
              className="w-96 h-96 object-contain mx-auto mb-6"
            />
            <h3 className="text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent">
              {winner.name}
            </h3>
            <p className="text-3xl mb-8 text-gray-700">America's Next Drag Superstar! 🎉</p>
            <p className="text-xl mb-4 flex items-center justify-center gap-2">
              <Crown className="w-6 h-6 text-yellow-600" />
              <span className="font-bold">{trackRecords[winner.id]?.filter(p => p === 'WIN').length || 0}</span> Challenge Wins
            </p>
          </div>

          <div className="text-center">
            <button
              onClick={() => setGamePhase('STATS')}
              className="btn-primary text-2xl"
            >
              <Trophy className="inline-block w-6 h-6 mr-2" />
              See Season Recap
            </button>
          </div>
        </div>
      )}

      {/* Season Stats Toggle */}
      {(gamePhase === 'STATS' || gamePhase === 'EPISODE') && currentEpisode > 0 && (
        <div className="fixed bottom-4 right-4 z-50">
          <button
            onClick={() => setGamePhase(gamePhase === 'STATS' ? 'EPISODE' : 'STATS')}
            className="btn-secondary shadow-2xl flex items-center gap-2"
          >
            <Trophy className="w-5 h-5" />
            {gamePhase === 'STATS' ? 'Back to Show' : 'Season Stats'}
          </button>
        </div>
      )}

      {/* Season Stats */}
      {gamePhase === 'STATS' && (
        <div className="max-w-7xl mx-auto animate-slide-in">
          <div className="card p-8 mb-8">
            <h2 className="text-4xl font-bold mb-6 text-center flex items-center justify-center gap-2">
              <Trophy className="w-8 h-8 text-yellow-600" />
              SEASON STATISTICS
            </h2>

            {/* Overall Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="card bg-gradient-to-br from-purple-50 to-purple-100 p-6 text-center">
                <p className="text-4xl font-bold text-purple-700">{currentEpisode}</p>
                <p className="text-sm text-gray-600 mt-1">Episodes</p>
              </div>
              <div className="card bg-gradient-to-br from-pink-50 to-pink-100 p-6 text-center">
                <p className="text-4xl font-bold text-pink-700">{selectedCast.length}</p>
                <p className="text-sm text-gray-600 mt-1">Total Queens</p>
              </div>
              <div className="card bg-gradient-to-br from-red-50 to-red-100 p-6 text-center">
                <p className="text-4xl font-bold text-red-700">{eliminated.length}</p>
                <p className="text-sm text-gray-600 mt-1">Eliminated</p>
              </div>
              <div className="card bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 text-center">
                <p className="text-4xl font-bold text-yellow-700">{seasonDrama.length}</p>
                <p className="text-sm text-gray-600 mt-1">Drama Moments</p>
              </div>
            </div>

            {/* Track Record Table */}
            <h3 className="text-3xl font-bold mb-4 text-center">TRACK RECORDS</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-lg">
                <thead>
                  <tr className="bg-gradient-to-r from-pink-500 to-purple-600 text-white">
                    <th className="p-4 text-left font-bold">Queen</th>
                    {Array.from({ length: currentEpisode }, (_, i) => (
                      <th key={i} className="p-4 text-center font-bold">
                        Ep {i + 1}
                      </th>
                    ))}
                    <th className="p-4 text-center font-bold">Wins</th>
                    <th className="p-4 text-center font-bold">Points</th>
                  </tr>
                </thead>
                <tbody>
                  {getSortedTrackRecord().map((item, index) => {
                    const wins = item.record.filter(p => p === 'WIN').length;
                    const points = item.record.reduce((sum, p) => sum + getPlacementPoints(p), 0);

                    return (
                      <tr
                        key={item.queen.id}
                        className={cn(
                          'border-b border-gray-100 hover:bg-gray-50 transition-colors',
                          item.eliminated && 'opacity-60',
                          winner && winner.id === item.queen.id && 'bg-gradient-to-r from-yellow-100 to-yellow-50'
                        )}
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.queen.image}
                              alt={item.queen.name}
                              className="w-12 h-12 object-contain rounded-lg bg-gray-50 p-1"
                            />
                            <span className={cn('font-bold', item.eliminated && 'line-through text-gray-500')}>
                              {item.queen.name}
                              {winner && winner.id === item.queen.id && (
                                <Crown className="inline-block w-4 h-4 ml-1 text-yellow-600" />
                              )}
                            </span>
                          </div>
                        </td>
                        {Array.from({ length: currentEpisode }, (_, i) => (
                          <td key={i} className="p-2 text-center">
                            {item.record[i] ? (
                              <span className={cn('inline-block px-2 py-1 rounded text-xs font-semibold', getTrackCellClass(item.record[i]))}>
                                {item.record[i]}
                              </span>
                            ) : (
                              <span className="text-gray-300">—</span>
                            )}
                          </td>
                        ))}
                        <td className="p-4 text-center">
                          <span className="inline-flex items-center gap-1 font-bold text-yellow-700">
                            <Crown className="w-4 h-4" />
                            {wins}
                          </span>
                        </td>
                        <td className="p-4 text-center font-bold text-gray-900">
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
                <h3 className="text-3xl font-bold mb-4 text-center flex items-center justify-center gap-2 text-pink-600">
                  <Drama className="w-8 h-8" />
                  SEASON TEA
                </h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {seasonDrama.map((drama, index) => (
                    <div key={index} className="tea-card">
                      <p className="text-gray-800">{drama.text}</p>
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
                className="btn-primary text-2xl flex items-center gap-2 mx-auto"
              >
                <Sparkles className="w-6 h-6" />
                Start New Season
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
