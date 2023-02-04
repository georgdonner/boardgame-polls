<script lang="ts">
  import type { Boardgame, Entry } from "$lib/server/db";

  export let boardgames: Boardgame[];
  export let entries: Entry[];
  export let size: number;
  export let short = false;

  const calculateWinners = () => {
    const boardgameMap = new Map<string, Boardgame>(
      boardgames.map(it => [it._id, it])
    );
  
    const rankingField = short ? 'rankingShort' : 'ranking';

    interface GameScore {
      gameId: string;
      score: number;
      votes: number;
    }

    interface WinnersMap {
      [key: string]: GameScore;
    }

    const winnersMap: WinnersMap = entries
      .flatMap(entry => entry[rankingField].map(
        (it, index) => ({ gameId: it, score: size - index })
      ))
      .reduce((prev: any, curr) => {
        const gameScore: GameScore = {
          gameId: curr.gameId,
          score: (prev[curr.gameId]?.score ?? 0) + curr.score,
          votes: (prev[curr.gameId]?.votes ?? 0) + 1,
        };
        return {
          ...prev,
          [curr.gameId]: gameScore,
        };
      }, {});

    return Object.entries(winnersMap)
      .map(([gameId, gameScore]) => ({
        boardgame: boardgameMap.get(gameId),
        score: gameScore.score,
        votes: gameScore.votes
      }))
      .sort((a, b) => b.score - a.score || b.votes - a.votes);
  }
</script>

{#each calculateWinners() as winner, i}
  <h4>
    {i + 1}. {winner.boardgame?.emoji} {winner.boardgame?.name} ({winner.score} Punkte, {winner.votes} Votes)
  </h4>
{/each}