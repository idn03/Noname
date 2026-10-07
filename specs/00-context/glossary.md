# Project Glossary

## Purpose

This document defines the canonical terminology used throughout the Noname specifications and source code.

Specifications should prefer these terms to avoid inconsistent naming.

## Game Roles

### Host

The player whose machine runs the application server and game session.

The Host has administrative actions such as starting or cancelling a game, but also participates as a normal player.

### Player

A person connected to the current game session through a web browser.

### Wolf

The attacking team.

Wolf players select and play cards that generate challenges during the game.

### Sheep

The defending team.

Sheep players attempt to predict and counter Wolf cards using matching card categories.

## Session Terms

### Game Session

The complete multiplayer session managed by the Host, from lobby creation until the session ends or is cancelled.

### Lobby

The waiting state before a game starts.

Players can join the session while the game is waiting in this state.

### Game

A single playable match between Wolf and Sheep.

### Game Phase

A major stage of the game lifecycle.

Examples include:

- Lobby.
- Team Assignment.
- Card Selection.
- Turn Phase.
- Game Result.

### Game State

The authoritative data representing the current state of the game.

It may include players, teams, cards, scores, phase, turn information, and timers.

## Card Terms

### Card

A playable game object owned or selected by a team.

Each card belongs to one Card Category.

### Card Category

The thematic classification of a card.

Example categories may include:

- Music.
- Travel.
- Technology.
- Geography.
- Economy.
- Folklore.

### Card Slot

A position assigned to a team for storing one selected card.

The number of card slots depends on the number of players in the team.

### Card Selection

The phase in which teams choose the cards they will use during the game.

### Challenge

A Truth-or-Dare-style task associated with a Card Category.

A challenge may be presented when the corresponding card is played.

## Turn Terms

### Turn

One attack-defense cycle during the main gameplay phase.

### Attacker

The Wolf team during V0 gameplay.

### Defender

The Sheep team during V0 gameplay.

### Attack

The action in which Wolf reveals or plays one of its selected cards.

### Defense

The action in which Sheep responds to an attack using an eligible card.

### Successful Defense

A defense performed using a card that satisfies the required category-matching rule.

### Failed Defense

A game state where Sheep cannot or does not successfully defend against the attack.

## Score Terms

### Score

The numerical value accumulated by a team during a game.

### Score Event

A game action or outcome that modifies a team's score.

### Winner

The team with the highest valid score after all required turns have finished.

## Networking Terms

### Client

A browser instance connected to the Host server.

### Server

The authoritative application process running on the Host machine.

### Socket

A persistent Socket.IO connection between a client and the server.

### Server-Authoritative State

A model where the server is the source of truth for game state and validates state-changing actions.

### Synchronization

The process of keeping relevant game state consistent across connected clients.

## Technical Terms

### Game Engine

The TypeScript module responsible for implementing game rules, state transitions, scoring, and gameplay validation.

It does not refer to an external engine such as Unity or Godot.

### Static Game Data

Game content that does not represent an active match state.

Examples include card categories and challenge definitions.

### State Transition

A validated change from one game state or phase to another.