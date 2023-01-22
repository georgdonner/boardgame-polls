<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import {flip} from 'svelte/animate';
  const dispatch = createEventDispatcher();

  import type { Boardgame } from "$lib/server/db";
  
  export let ranking: Boardgame[];
  export let size: number;

  let hovering: number | undefined;

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
          <button type="button" class="outline secondary" on:click={() => dispatch('remove', { boardgame })}>x</button>
        </td>
      </tr>
    {/each}
  </tbody>
</table>

{#if ranking.length < size}
  <p>Du kannst {ranking.length > 0 ? 'noch' : ''} {size - ranking.length} {(size - ranking.length) === 1 ? 'Spiel' : 'Spiele'} auswählen</p>
{/if}
