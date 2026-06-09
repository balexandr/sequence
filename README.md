# Sequence — Daily Ordering Puzzle

A daily puzzle game where you arrange six items in the correct order based on a prompt. You get three attempts.

Part of the [NoodleGames](https://noodlegames.co) family alongside **Odd One Out** and **Chain Link**.

---

## How to play

A prompt is shown at the top — for example *"Order these cities by population, smallest to largest."* Drag the six items into what you think is the right sequence, then lock in your answer.

- 🟩 Green = correct position
- 🟥 Red = wrong position
- You get **3 attempts** per puzzle
- Resets daily at **midnight EST**

---

## Sharing

After the puzzle ends you can share an emoji grid showing your guess history across all attempts — no spoilers, just colours.

---

## Stack

React + Vite · CSS Modules · @dnd-kit (drag and drop) · localStorage · GitHub Pages

---

## Puzzles

Puzzles run from **May 12, 2026** onward, stored in `src/data/puzzles.json` keyed by date. Each entry contains a prompt, the six shuffled items, the correct answer order, and a hint label.
