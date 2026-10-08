# Scoring and Results Design

## Goal

Calculate scores from validated game outcomes and show a consistent final result to every player.

## Authority

The Game Engine owns score calculation, score events, round completion, and the winner or draw. Clients display server-provided scores and cannot submit score values.

Challenge success is determined by participating players or the Host. Only the Host records the human-determined outcome in authoritative game state.
