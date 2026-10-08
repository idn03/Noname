# Business Rules

## Game Scope

- The game is a local multiplayer, turn-based card game.
- A game session contains exactly two teams: **Wolf** and **Sheep**.
- The supported player count is **6 to 10 players**.
- The Host is also considered a regular player.
- V0 is designed for players connected to the same LAN or Wi-Fi network.
- Only one active game session may exist at a time.

## Host Rules

- The player running the game server is the Host.
- The Host may start a game when the minimum player requirement is satisfied.
- The Host may cancel the current game session.
- The Host participates in team assignment like every other player.
- Host privileges do not provide gameplay advantages.

## Team Assignment

- Players are assigned randomly to Wolf or Sheep when the Host starts the game.
- When the total player count is even, both teams must contain the same number of players.
- When the total player count is odd, one randomly selected team receives one additional player.
- Team assignments remain unchanged until the game ends or is cancelled.

## Card Slot Rules

- Each team receives one card slot per team member.
- Each card slot belongs to the player assigned to it; a player selects and manages only their own slot.
- Therefore, each team normally has between 3 and 5 card slots.
- The number of game rounds is equal to the number of members on the team with fewer members.
- Each team receives access to one more card category than its number of card slots.
- Multiple cards from the same category may be selected.

## Card Category Rules

- Each card belongs to exactly one category.
- Example categories include Music, Travel, Technology, Geography, Economy, Films, Healthcare, and Folklore.
- A category may contain up to 50 predefined challenges.
- Only a random subset of challenges is available during a game session.
- The available subset must contain no more than 10 challenges per category.
- Wolf players may inspect the available challenges while selecting their cards.
- Sheep players must not see the Wolf team's selected cards before they are revealed.

## Card Selection Phase

- Every player selects one card for their personal slot before the first round begins.
- The selection duration in minutes equals the number of card slots.
- A player may replace or remove their selection while the Selection Phase remains active.
- Pressing Done submits the player's selection and marks that slot ready. Removing or changing a submitted selection makes that slot unready until submitted again.
- The game proceeds to the turn phase only after every player's slot has a complete submitted selection. Once the phase advances, selections can no longer be changed.
- Each selected card remains associated with its selecting player and team for the current game.
- A card may only be used once unless another rule explicitly states otherwise.

## Turn Rules

- Wolf is the attacking team in V0.
- Sheep is the defending team in V0.
- Each round begins when a Wolf player reveals an unused card from their own slot.
- A Wolf player may reveal only a card they selected. The server permits only one active attack at a time.
- A Sheep player may defend only with an unused card from their own slot that matches the attack category; that player handles the defense and corresponding challenge.
- If multiple Sheep players hold unused cards of the matching category, the first valid defense accepted by the server handles the attack.
- A Sheep card from another category cannot be used as a defense.
- Once used, both attacking and defending cards are removed from the available card pool.

## Challenge Rules

- An attack card produces one challenge from its available challenge pool.
- The selected challenge must belong to the attacking card's category.
- The same challenge should not be repeated within the same game when alternatives are available.
- If Sheep successfully matches the category, the challenge may be attempted.
- Challenge completion is determined by the participating players or Host in V0.

## Scoring Rules

- If Sheep cannot defend the attack, Wolf receives **2 points**.
- If Sheep successfully defends with the same category, Sheep receives **1 point**.
- If Sheep also completes the challenge successfully, Sheep receives **1 additional point**.
- A successful defense may therefore award Sheep a maximum of **2 points**.
- Scores cannot be manually modified by regular players.

## Game Completion

- The game ends after all scheduled rounds have been completed.
- The team with the highest score wins.
- If both teams have the same score, the game ends as a draw in V0.
- The final result must be visible to every connected player.
