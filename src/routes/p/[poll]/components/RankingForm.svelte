<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import {flip} from 'svelte/animate';
  import type { Boardgame } from '$lib/server/db';

  export let boardgames: Boardgame[];
  export let ranking: Boardgame[];
  export let size: number;
  export let label: string = '';
  export let busy = false;

  let hovering: number | undefined;

  const dispatch = createEventDispatcher();

  /* RANKING */
  const add = (boardgame: Boardgame) => {
    ranking = [...ranking, boardgame];
  };
  
  const remove = (boardgame: Boardgame) => {
    ranking = ranking.filter(it => it._id !== boardgame._id);
  };

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

<h3>Dein {label ? `${label}-` : ''}Ranking</h3>

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

{#if ranking.length < size}
  <p>Du kannst {ranking.length > 0 ? 'noch' : ''} {size - ranking.length} {(size - ranking.length) === 1 ? 'Spiel' : 'Spiele'} auswählen</p>
{/if}

<button
  type="button"
  on:click={() => dispatch('submit')}
  disabled={ranking.length === 0 || busy}
  aria-busy={busy}
>
  Abschicken
</button>

<h3>{label || 'Spiele'} zur Auswahl</h3>

<table class="available-games">
  <tbody>
    {#each boardgames.filter(it => !it.neverPlayed && !ranking.map(bg => bg._id).includes(it._id)) as boardgame}
      <tr>
        <td>
          <h4>{boardgame.emoji} {boardgame.name}</h4>
        </td>
        <td>
          <button
            type="button" class="outline"
            on:click={() => add(boardgame)}
            disabled={ranking.length >= size}
          >Auswählen</button>
        </td>
      </tr>
    {/each}
  </tbody>
</table>

{#if boardgames.some(it => it.neverPlayed)}
  <h3>...mal was Neues</h3>

  <table class="available-games">
    <tbody>
      {#each boardgames.filter(it => it.neverPlayed && !ranking.map(bg => bg._id).includes(it._id)) as boardgame}
        <tr>
          <td>
            <h4>{boardgame.emoji} {boardgame.name}</h4>
          </td>
          <td>
            <button
              type="button" class="outline"
              on:click={() => add(boardgame)}
              disabled={ranking.length >= size}
            >Auswählen</button>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
{/if}