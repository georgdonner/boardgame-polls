<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
  
  import type { Boardgame } from '$lib/server/db';
  import GamesList from './RankingForm/GamesList.svelte';
  import Ranking from './RankingForm/Ranking.svelte';

  export let boardgames: Boardgame[];
  export let ranking: Boardgame[];
  export let size: number;
  export let label = '';
  export let buttonLabel = 'Weiter';
  export let buttonType: "button" | "submit" = 'button';
  export let busy = false;

  const handleAdd = (event: CustomEvent) => {
    const boardgame: Boardgame = event.detail.boardgame;
    ranking = [...ranking, boardgame];
  };
  
  const handleRemove = (event: CustomEvent) => {
    const boardgame: Boardgame = event.detail.boardgame;
    ranking = ranking.filter(it => it._id !== boardgame._id);
  };
</script>

<h3>Dein {label ? `${label}-` : ''}Ranking</h3>
<Ranking
  ranking={ranking}
  size={size}
  on:remove={handleRemove}
/>

<button
  type={buttonType}
  on:click={() => dispatch('submit')}
  disabled={ranking.length === 0 || busy}
  aria-busy={busy}
>
  {buttonLabel}
</button>

<h3>{label || 'Spiele'} zur Auswahl</h3>
<GamesList
  boardgames={boardgames.filter(it => ! it.neverPlayed )}
  ranking={ranking}
  size={size}
  on:add={handleAdd}
/>

{#if boardgames.some(it => it.neverPlayed)}
  <h3>...mal was Neues</h3>
  <GamesList
    boardgames={boardgames.filter(it => it.neverPlayed )}
    ranking={ranking}
    size={size}
    on:add={handleAdd}
  />
{/if}