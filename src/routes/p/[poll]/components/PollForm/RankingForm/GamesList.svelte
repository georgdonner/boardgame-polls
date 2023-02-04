<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  import type { Boardgame } from "$lib/server/db";
  
  export let boardgames: Boardgame[];
  export let ranking: Boardgame[];
  export let size: number;
</script>

<table class="available-games">
  <tbody>
    {#each boardgames.filter(it => !ranking.map(bg => bg._id).includes(it._id)) as boardgame}
      <tr>
        <td>
          <h4>{boardgame.emoji} {boardgame.name}</h4>
        </td>
        <td>
          <button
            type="button" class="outline"
            on:click={() => dispatch('add', { boardgame })}
            disabled={ranking.length >= size}
          >Auswählen</button>
        </td>
      </tr>
    {/each}
  </tbody>
</table>