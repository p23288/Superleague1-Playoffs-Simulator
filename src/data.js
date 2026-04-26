export const TEAMS = [
  { id: 'aek', name: 'Α.Ε.Κ.', shortName: 'Α.Ε.Κ.', logo: '/aek.svg', regPos: 1, regStats: { p: 26, w: 18, d: 6, l: 2, gf: 49, ga: 17, pts: 60 } },
  { id: 'oly', name: 'ΟΛΥΜΠΙΑΚΟΣ', shortName: 'Ο.Σ.Φ.Π.', logo: '/oly.png', regPos: 2, regStats: { p: 26, w: 17, d: 7, l: 2, gf: 45, ga: 11, pts: 58 } },
  { id: 'paok', name: 'Π.Α.Ο.Κ.', shortName: 'Π.Α.Ο.Κ.', logo: '/paok.png', regPos: 3, regStats: { p: 26, w: 17, d: 6, l: 3, gf: 52, ga: 17, pts: 57 } },
  { id: 'pao', name: 'ΠΑΝΑΘΗΝΑΪΚΟΣ', shortName: 'Π.Α.Ο.', logo: '/pao.png', regPos: 4, regStats: { p: 26, w: 14, d: 7, l: 5, gf: 44, ga: 26, pts: 49 } }
];

export const INITIAL_MATCHES = [
  { id: 1, round: 1, home: 'oly', away: 'aek', homeScore: 0, awayScore: 1 },
  { id: 2, round: 1, home: 'paok', away: 'pao', homeScore: 0, awayScore: 0 },
  
  { id: 3, round: 2, home: 'pao', away: 'oly', homeScore: 0, awayScore: 2 },
  { id: 4, round: 2, home: 'aek', away: 'paok', homeScore: 3, awayScore: 0 },
  
  { id: 5, round: 3, home: 'paok', away: 'oly', homeScore: '', awayScore: '' },
  { id: 6, round: 3, home: 'pao', away: 'aek', homeScore: '', awayScore: '' },
  
  { id: 7, round: 4, home: 'aek', away: 'pao', homeScore: '', awayScore: '' },
  { id: 8, round: 4, home: 'oly', away: 'paok', homeScore: '', awayScore: '' },
  
  { id: 9, round: 5, home: 'oly', away: 'pao', homeScore: '', awayScore: '' },
  { id: 10, round: 5, home: 'paok', away: 'aek', homeScore: '', awayScore: '' },
  
  { id: 11, round: 6, home: 'aek', away: 'oly', homeScore: '', awayScore: '' },
  { id: 12, round: 6, home: 'pao', away: 'paok', homeScore: '', awayScore: '' },
];
