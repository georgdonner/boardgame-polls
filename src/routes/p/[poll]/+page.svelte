<script lang="ts">
  import {flip} from 'svelte/animate';
  import { enhance } from '$app/forms';
  import type { Boardgame } from '$lib/server/db';
  import type { ActionData, PageData } from './$types';
  import './styles.css';
  
  export let form: ActionData;
  export let data: PageData;

  let ranking: Boardgame[] = [];
  let hovering: number | undefined;
  let busy = false;

  /* RANKING */
  const add = (boardgame: Boardgame) => {
    ranking = [...ranking, boardgame];
  };
  
  const remove = (boardgame: Boardgame) => {
    ranking = ranking.filter(it => it._id !== boardgame._id);
  };

  const calculateWinners = () => {
    const boardgameMap = new Map<string, Boardgame>(
      data.boardgames.map(it => [it._id, it])
    );

    interface GameScore {
      gameId: string;
      score: number;
      votes: number;
    }

    interface WinnersMap {
      [key: string]: GameScore;
    }

    const winnersMap: WinnersMap = data.poll.entries
      .flatMap(entry => entry.ranking.map(
        (it, index) => ({ gameId: it, score: data.poll.rankingSize - index })
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

  /* DRAG AND DROP */
  const drop = (event: DragEvent, target: number) => {
    if (!event.dataTransfer) {
      return;
    }
    event.dataTransfer.dropEffect = 'move'; 
    const start = parseInt(event.dataTransfer.getData("text/plain"));
    const newRanking = ranking;

    if (start < target) {
      newRanking.splice(target + 1, 0, newRanking[start]);
      newRanking.splice(start, 1);
    } else {
      newRanking.splice(target, 0, newRanking[start]);
      newRanking.splice(start + 1, 1);
    }
    ranking = newRanking;
    hovering = undefined;
  }

  const dragstart = (event: DragEvent, i: number) => {
    if (!event.dataTransfer) {
      return;
    }
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.dropEffect = 'move';
    event.dataTransfer.setData('text/plain', String(i));
  }
</script>

<svelte:head>
  <title>{data.poll.name} - Brettspiel-Umfrage</title>
</svelte:head>

<h1>{data.poll.name}</h1>

{#if data.poll.ended}

  <h3>Die Ergebnisse der Umfrage sind da!</h3>

  {#each calculateWinners() as winner, i}
    <h4>
      {i + 1}. {winner.boardgame?.emoji} {winner.boardgame?.name} ({winner.score} Punkte, {winner.votes} Votes)
    </h4>
  {/each}

{:else}

{#if form?.success}
  <h4>Danke für deine Teilnahme!</h4>
{:else}
  <form
    method="POST"
    use:enhance={({ data: formData }) => {
      formData.append('ranking', ranking.map(it => it._id).join(','));
      busy = true;
    }}
  >

  <label for="name">Dein Name</label>
  <input type="text" name="name" required>

  <h3>Dein Ranking</h3>

  <table class="ranking">
    <tbody>
      {#each ranking as boardgame, i (boardgame._id)}
        <tr
          animate:flip="{{duration: 500}}"
          draggable={true} 
          on:dragstart={event => dragstart(event, i)}
          on:drop={event => drop(event, i)}
          on:dragover|preventDefault={() => false}
          on:dragenter={() => hovering = i}
          on:mousedown={() => hovering = i}
          on:mouseup={() => hovering = undefined}
          class:is-active={hovering === i}
        >
          <td>
            <h4>{i + 1}</h4>
          </td>
          <td>
            <h4>{boardgame.emoji} {boardgame.name}</h4>
          </td>
          <td class="remove-col">
            <button type="button" class="outline secondary" on:click={() => remove(boardgame)}>x</button>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>

  {#if ranking.length < data.poll.rankingSize}
    <p>Du kannst {ranking.length > 0 ? 'noch' : ''} {data.poll.rankingSize - ranking.length} {(data.poll.rankingSize - ranking.length) === 1 ? 'Spiel' : 'Spiele'} auswählen</p>
  {/if}

  <button
    type="submit"
    disabled={ranking.length === 0 || busy}
    aria-busy={busy}
  >
    Abschicken
  </button>

  <h3>Spiele zur Auswahl</h3>

  <table class="available-games">
    <tbody>
      {#each data.boardgames.filter(it => !it.neverPlayed && !ranking.map(bg => bg._id).includes(it._id)) as boardgame}
        <tr>
          <td>
            <h4>{boardgame.emoji} {boardgame.name}</h4>
          </td>
          <td>
            <button
              type="button" class="outline"
              on:click={() => add(boardgame)}
              disabled={ranking.length >= data.poll.rankingSize}
            >Auswählen</button>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>

  <h3>...mal was Neues</h3>

  <table class="available-games">
    <tbody>
      {#each data.boardgames.filter(it => it.neverPlayed && !ranking.map(bg => bg._id).includes(it._id)) as boardgame}
        <tr>
          <td>
            <h4>{boardgame.emoji} {boardgame.name}</h4>
          </td>
          <td>
            <button
              type="button" class="outline"
              on:click={() => add(boardgame)}
              disabled={ranking.length >= data.poll.rankingSize}
            >Auswählen</button>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>

  </form>
{/if}

{/if}
