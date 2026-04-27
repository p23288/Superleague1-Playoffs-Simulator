import React, { useState, useMemo } from 'react';
import { Trophy, Calendar, Info } from 'lucide-react';
import { TEAMS, INITIAL_MATCHES } from './data';
import './index.css';

const App = () => {
  const [matches, setMatches] = useState(INITIAL_MATCHES);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [supportStep, setSupportStep] = useState(1);
  const [supportAmount, setSupportAmount] = useState("");

  const handleScoreChange = (id, field, value) => {
    setMatches(prev => prev.map(m => {
      if (m.id === id) {
        return { ...m, [field]: value };
      }
      return m;
    }));
  };

  const calculateStandings = (matches) => {
    // 1. Initialize teams with reg season stats
    const teams = TEAMS.map(t => ({
      ...t,
      p: t.regStats.p,
      w: t.regStats.w,
      d: t.regStats.d,
      l: t.regStats.l,
      gf: t.regStats.gf,
      ga: t.regStats.ga,
      pts: t.regStats.pts,
      playoffMatches: [],
      miniPts: 0,
      miniGd: 0,
    }));

    const teamMap = {};
    teams.forEach(t => teamMap[t.id] = t);

    // 2. Add playoff matches to stats
    matches.forEach(m => {
      if (m.homeScore !== '' && m.awayScore !== '') {
        const h = parseInt(m.homeScore, 10);
        const a = parseInt(m.awayScore, 10);
        const hTeam = teamMap[m.home];
        const aTeam = teamMap[m.away];

        hTeam.p++; aTeam.p++;
        hTeam.gf += h; aTeam.gf += a;
        hTeam.ga += a; aTeam.ga += h;
        
        hTeam.playoffMatches.push({ opp: m.away, gf: h, ga: a });
        aTeam.playoffMatches.push({ opp: m.home, gf: a, ga: h });

        if (h > a) {
          hTeam.w++; hTeam.pts += 3;
          aTeam.l++;
        } else if (h < a) {
          aTeam.w++; aTeam.pts += 3;
          hTeam.l++;
        } else {
          hTeam.d++; aTeam.d++;
          hTeam.pts += 1; aTeam.pts += 1;
        }
      }
    });

    // 3. Group by total points
    const pointsGroups = {};
    teams.forEach(t => {
      if (!pointsGroups[t.pts]) pointsGroups[t.pts] = [];
      pointsGroups[t.pts].push(t);
    });

    const sortedTeams = [];
    const sortedPoints = Object.keys(pointsGroups).map(Number).sort((a, b) => b - a);

    // 4. Resolve tie-breakers for each point group
    sortedPoints.forEach(pts => {
      const group = pointsGroups[pts];
      if (group.length === 1) {
        sortedTeams.push(group[0]);
      } else {
        // Calculate H2H (mini-league) among tied teams
        group.forEach(t => {
          t.miniPts = 0;
          t.miniGd = 0;
          t.playoffMatches.forEach(pm => {
            if (group.find(g => g.id === pm.opp)) {
              t.miniGd += (pm.gf - pm.ga);
              if (pm.gf > pm.ga) t.miniPts += 3;
              else if (pm.gf === pm.ga) t.miniPts += 1;
            }
          });
        });

        group.sort((a, b) => {
          if (a.miniPts !== b.miniPts) return b.miniPts - a.miniPts;
          if (a.miniGd !== b.miniGd) return b.miniGd - a.miniGd;
          return a.regPos - b.regPos; // Reg Season position
        });

        sortedTeams.push(...group);
      }
    });

    return sortedTeams;
  };

  const standings = useMemo(() => calculateStandings(matches), [matches]);

  const teamMap = {};
  TEAMS.forEach(t => teamMap[t.id] = t);

  return (
    <div className="container">
      <header>
        <h1>Super League Simulator</h1>
        <p>Playoffs 2025-2026 Calculator</p>
      </header>

      <div className="layout">
        {/* Left Col: Standings */}
        <div className="glass-panel">
          <h2 className="panel-title"><Trophy size={24} color="#3b82f6" /> Βαθμολογία</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Θέση</th>
                  <th style={{textAlign: 'left'}}>Ομάδα</th>
                  <th>ΑΓ</th>
                  <th>Ν-Ι-Η</th>
                  <th>ΓΚΟΛ</th>
                  <th>Δ/Γ</th>
                  <th>ΒΑΘ</th>
                </tr>
              </thead>
              <tbody>
                {standings.map((team, index) => (
                  <tr key={team.id}>
                    <td>
                      <div className={`pos-indicator pos-${index + 1}`}>{index + 1}</div>
                    </td>
                    <td>
                      <div className="team-cell">
                        <img src={team.logo} alt={team.name} className="team-logo" />
                        {team.name}
                      </div>
                    </td>
                    <td>{team.p}</td>
                    <td>{team.w}-{team.d}-{team.l}</td>
                    <td>{team.gf}-{team.ga}</td>
                    <td>{(team.gf - team.ga) > 0 ? `+${team.gf - team.ga}` : team.gf - team.ga}</td>
                    <td className="stat-pts">{team.pts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="tie-breaker-info">
            <Info size={16} style={{display: 'inline', marginRight: '8px', verticalAlign: 'middle'}}/>
            <strong>Κριτήρια Ισοβαθμίας Playoffs:</strong><br />
            1. Βαθμοί στα μεταξύ τους ματς (Playoffs)<br />
            2. Διαφορά τερμάτων στα μεταξύ τους (Playoffs)<br />
            3. Καλύτερη θέση στην κανονική διάρκεια.
          </div>
        </div>

        {/* Right Col: Matches */}
        <div className="glass-panel" style={{ maxHeight: '700px', overflowY: 'auto' }}>
          <h2 className="panel-title"><Calendar size={24} color="#3b82f6" /> Αγώνες Playoffs 1-4</h2>
          <div className="matches-list">
            {matches.map(m => {
              const home = teamMap[m.home];
              const away = teamMap[m.away];
              return (
                <div key={m.id} className="match-card">
                  <div className="match-round">Αγωνιστική {m.round}</div>
                  <div className="match-teams">
                    <div className="team-display">
                      <img src={home.logo} alt={home.name} />
                      <span>{home.shortName || home.name}</span>
                    </div>
                    
                    <div className="score-inputs">
                      <input 
                        type="number" 
                        min="0"
                        className="score-input"
                        value={m.homeScore}
                        onChange={(e) => handleScoreChange(m.id, 'homeScore', e.target.value)}
                        disabled={m.round <= 2}
                        title={m.round <= 2 ? "Αυτός ο αγώνας έχει ολοκληρωθεί" : ""}
                      />
                      <span className="divider">-</span>
                      <input 
                        type="number" 
                        min="0"
                        className="score-input"
                        value={m.awayScore}
                        onChange={(e) => handleScoreChange(m.id, 'awayScore', e.target.value)}
                        disabled={m.round <= 2}
                        title={m.round <= 2 ? "Αυτός ο αγώνας έχει ολοκληρωθεί" : ""}
                      />
                    </div>

                    <div className="team-display">
                      <img src={away.logo} alt={away.name} />
                      <span>{away.shortName || away.name}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      <footer className="app-footer">
        <p className="copyright">Copyright &copy; 2026 CHRISTOS G D</p>
        <div className="footer-links">
          <a href="https://github.com/p23288/Superleague1-Playoffs-Simulator" target="_blank" rel="noopener noreferrer">View on GitHub</a>
          <span className="separator">|</span>
          <button className="link-button" onClick={() => setShowPrivacyPolicy(true)}>Privacy Policy</button>
        </div>
      </footer>

      {showPrivacyPolicy && (
        <div className="modal-overlay" onClick={() => setShowPrivacyPolicy(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Privacy Policy</h2>
              <button className="close-button" onClick={() => setShowPrivacyPolicy(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <p>Thank you for using our website. This page provides information regarding how we handle data and display advertisements.</p>
              
              <h3>Use of Google AdSense</h3>
              <p>We display Google AdSense advertisements on this website. Google may use cookies to serve ads based on your prior visits to this or other websites. Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our site and/or other sites on the Internet.</p>
              
              <p>You may opt out of personalized advertising by visiting Google Ads Settings. Alternatively, you can opt out of a third-party vendor's use of cookies by visiting the YourAdChoices website.</p>
              
              <h3>Data Collection</h3>
              <p>We do not collect personal data beyond what is necessary for displaying standings and serving ads. Any data collected by Google is governed by Google's own privacy policies. We encourage you to review Google's Privacy Policy for more details.</p>
              
              <h3>Changes</h3>
              <p>We may update this policy from time to time by posting a new version on this page. Your continued use of the website after changes indicates your acceptance of the revised policy.</p>
            </div>
          </div>
        </div>
      )}

      {/* Floating Football Button */}
      <button 
        className="floating-football" 
        onClick={() => { setShowSupportModal(true); setSupportStep(1); }}
        title="Support the creator!"
      >
        ⚽
      </button>

      {/* Support / Tip Modal */}
      {showSupportModal && (
        <div className="modal-overlay" onClick={() => setShowSupportModal(false)}>
          <div className="modal-content support-modal" onClick={e => e.stopPropagation()}>
            {supportStep === 1 ? (
              <>
                <div className="modal-header support-header">
                  <h2>Support sl-playoffs.page.gd</h2>
                  <button className="close-button" onClick={() => setShowSupportModal(false)}>&times;</button>
                </div>
                <div className="modal-body support-body">
                  <div className="support-amount-box">
                    <span className="currency">€</span>
                    <input 
                      type="number" 
                      placeholder="Enter amount" 
                      className="amount-input" 
                      value={supportAmount}
                      onChange={(e) => setSupportAmount(e.target.value)}
                    />
                    <div className="quick-amounts">
                      <button onClick={() => setSupportAmount("9")}>+9</button>
                      <button onClick={() => setSupportAmount("21")}>+21</button>
                      <button onClick={() => setSupportAmount("43")}>+43</button>
                    </div>
                  </div>
                  
                  <input type="text" placeholder="Name or @yoursocial" className="support-input" />
                  <textarea placeholder="Say something nice..." className="support-textarea"></textarea>
                  
                  <label className="monthly-checkbox">
                    <input type="checkbox" /> Make this monthly
                  </label>
                  
                  <button className="support-submit-btn" onClick={() => setSupportStep(2)}>
                    Support
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="modal-header support-header checkout-header">
                  <button className="back-button" onClick={() => setSupportStep(1)}>← Back</button>
                  <h2>Checkout</h2>
                  <button className="close-button" onClick={() => setShowSupportModal(false)}>&times;</button>
                </div>
                <div className="modal-body checkout-body">
                  <div className="google-pay-btn">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg" alt="GPay" className="gpay-logo" />
                  </div>
                  
                  <div className="pay-divider">
                    <span>PAY WITH</span>
                  </div>

                  <div className="checkout-form">
                    <input type="email" placeholder="Email" className="checkout-input" />
                    
                    <div className="payment-methods">
                      <div className="method-box active">
                        <span className="method-icon">💳</span>
                        <span>Card</span>
                      </div>
                      <div className="method-box">
                        <span className="method-icon">🏦</span>
                        <span>iDEAL | Wero</span>
                      </div>
                    </div>

                    <div className="secure-checkout">
                      🔒 Secure, fast checkout with Link
                    </div>

                    <div className="card-input-group">
                      <label>Card number</label>
                      <div className="card-input-wrapper">
                        <input type="text" placeholder="1234 1234 1234 1234" maxLength="19" />
                        <div className="card-icons">
                          <span className="card-mc"></span>
                          <span className="card-vi"></span>
                        </div>
                      </div>
                    </div>

                    <div className="card-row">
                      <div className="card-input-group">
                        <label>Expiration date</label>
                        <input type="text" placeholder="MM / YY" maxLength="5" />
                      </div>
                      <div className="card-input-group">
                        <label>Security code</label>
                        <input type="text" placeholder="CVC" maxLength="3" />
                      </div>
                    </div>

                    <button className="support-submit-btn checkout-pay-btn" onClick={() => {
                      alert("Προσοχή: Αυτή είναι μόνο η σχεδίαση (UI) που ζήτησες! Για να δέχεσαι πραγματικά χρήματα, πρέπει να φτιάξεις λογαριασμό στο Stripe (stripe.com) και να αντικαταστήσουμε το κουμπί με το επίσημο δικό τους Payment Link.");
                      setShowSupportModal(false);
                    }}>
                      Pay {supportAmount ? `€${supportAmount}` : ''}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
