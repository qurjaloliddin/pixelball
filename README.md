# Pixelball

Pixelball is a retro 5v5 football game built with React and the HTML5 Canvas API. Choose a national team, select a formation, and play a three-minute match against a cooperative AI opponent.

The game combines a 16-bit-inspired presentation with momentum-based ball movement, player ratings, stamina, goalkeeper saves, tactical positioning, crowd audio, and browser-persisted match history.

## Features

- 5v5 matches with two 90-second halves
- Single-player matches against Easy, Normal, or Hard AI
- Ten selectable countries with distinct kits and player appearances
- Individual player traits including skin tone, hair, face, role, and ratings
- Player ratings for shooting, speed, stamina, and tackling
- Hold-and-release kicking with charge-based power
- Passing, dribbling, sprinting, tackling, and manual player switching
- Goalkeeper saves and long clearances for both teams
- Cooperative AI with formation spacing, pressing, changing lanes, and varied attacks
- 45-degree-style perspective field with depth scaling and player shadows
- Pause, halftime formation changes, substitutions, and tactical stats
- Stadium ambience, whistles, kicks, horns, cheers, and crowd reactions
- Match history and aggregate results stored in `localStorage`

## Requirements

- Node.js 18 or newer
- npm
- A modern browser with Canvas and Web Audio API support

## Installation

```bash
git clone https://github.com/qurjaloliddin/pixelball.git
cd pixelball
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

## Production Build

```bash
npm run build
npm run preview
```

## Controls

| Key | Action |
| --- | --- |
| `WASD` | Move the selected player |
| Arrow keys | Aim the player |
| Hold `Space` or `Enter`, then release | Kick or shoot with charged power |
| `Shift` | Sprint and dribble; consumes stamina |
| `Q` | Switch to the next available player |
| `T` | Attempt a tackle |
| `P` | Pause or resume the match |
| `Tab` | Open tactical formation and ratings view |

## Match Setup

Before kickoff, choose:

- Your country and opponent country
- AI difficulty
- `4-1-0` balanced formation or `3-2` aggressive formation
- Match audio on or off

The same country cannot be selected for both teams.

## Match Flow

1. Select teams, formation, difficulty, and audio.
2. Play the first 90-second half.
3. Use the halftime screen to change formation or refresh the selected player.
4. Play the second half.
5. Review the final score and saved match history.

Completed results are stored under the `pixel-strikers-history` browser storage key. Clearing browser storage removes the local record.

## Project Structure

```text
src/
	App.jsx       Game state, menus, physics, AI, and Canvas renderer
	App.css       Retro game interface styling
	audio.js      Web Audio stadium sound engine
	index.css     Global styles and typography
	main.jsx      React application entry point
```

The game loop runs through `requestAnimationFrame`. React manages menu and HUD state, while mutable match state lives in refs for responsive frame-by-frame updates.

## Technology

- React
- Vite
- HTML5 Canvas
- Web Audio API
- Browser `localStorage`

No game engine or external UI framework is required.
