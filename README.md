# Super League 1 Playoffs Simulator 🏆

An interactive, real-time web application to simulate the playoffs for the Greek Super League 1 (Stoiximan Super League). 
Built with modern web technologies, this simulator allows users to input match scores and dynamically calculates the final standings according to the exact official tournament tie-breaker rules.

## ✨ Features

- **Real-Time Standings Calculation:** Instantly updates the league table as you type in the match scores.
- **Official Tie-Breaker Rules implemented:**
  1. Points gathered in head-to-head matches between tied teams (Playoffs only).
  2. Goal difference in head-to-head matches between tied teams (Playoffs only).
  3. Final position in the Regular Season.
- **Multi-team Tie Resolution:** Automatically creates mini-leagues to correctly resolve complex ties between 3 or more teams.
- **Premium UI/UX:** A clean, responsive, light-themed glassmorphism design featuring the official team crests.
- **State Management:** Preserves the history of completed matches (locked inputs for past matchdays to ensure accuracy).

## 🚀 Tech Stack

- **Framework:** React.js
- **Build Tool:** Vite
- **Styling:** Custom CSS (Glassmorphism, CSS Variables, Responsive Grid)
- **Icons:** Lucide React

## 🛠️ Installation & Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/p23288/Superleague1-Playoffs-Simulator.git
   ```
2. Navigate to the project directory:
   ```bash
   cd Superleague1-Playoffs-Simulator
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open your browser and visit `http://localhost:5173`.

## 📜 How to use

- The results for the completed matchdays (1 & 2) are locked to maintain historical accuracy.
- Enter your predicted scores for the upcoming matchdays (3 to 6) in the right-side panel.
- Watch the standings table on the left automatically sort and rank the teams based on your predictions!
