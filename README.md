# Pixel Strikers

A 5v5 retro angled-view soccer game built with React and the HTML5 Canvas API. Play a five-minute match (two 2:30 halves) against a cooperative, formation-aware AI, manage stamina, switch formation, substitute at halftime, choose from ten countries, and keep your record in localStorage.

## Run

```bash
npm install
npm run dev
```

## Controls

- `WASD`: move selected player
- Arrow keys: aim
- `Space` / `Enter`: kick (hold, then release, for power)
- `Shift`: sprint/dribble with the ball
- `Q`: switch player manually
- `P`: pause/resume (the pause overlay also lets you quit)
- `R`: request a substitution at halftime
- `Tab`: toggle formation/stats panel

Choose both countries, formation, difficulty, and match audio before kickoff. The field uses a 45-degree-style perspective projection, depth-scaled players, shadows, skin/hair/face traits, individual ratings, and crowd ambience. Goals, results, and aggregate records are saved in the browser.
