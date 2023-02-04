<script lang="ts">
  import type { WithId } from 'mongodb';
  import type { Boardgame, Poll } from '$lib/server/db';

  import ResultsList from './Results/ResultsList.svelte';

  export let poll: WithId<Poll>;
  export let boardgames: Boardgame[];
</script>

<h3>Die Ergebnisse der Umfrage sind da!</h3>

<ResultsList
  boardgames={boardgames}
  entries={poll.entries}
  size={poll.rankingSize}
/>

<h3>Absacker</h3>
<ResultsList
  boardgames={boardgames}
  entries={poll.entries}
  size={poll.rankingShortSize}
  short
/>