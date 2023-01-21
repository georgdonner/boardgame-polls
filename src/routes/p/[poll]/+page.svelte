<script lang="ts">
  import { enhance } from '$app/forms';
  import type { Boardgame } from '$lib/server/db';
  import type { ActionData, PageData } from './$types';
  import RankingForm from './components/RankingForm.svelte';
  import Results from './components/Results.svelte';
  import './styles.css';
  
  export let form: ActionData;
  export let data: PageData;

  let ranking: Boardgame[] = [];
  let rankingShort: Boardgame[] = [];
  let htmlForm: HTMLFormElement;
  let busy = false;
  let submitForm = false;
</script>

<svelte:head>
  <title>{data.poll.name} - Brettspiel-Umfrage</title>
</svelte:head>

<h1>{data.poll.name}</h1>

{#if data.poll.ended}

  <h3>Die Ergebnisse der Umfrage sind da!</h3>

  <Results
    boardgames={data.boardgames}
    entries={data.poll.entries}
    size={data.poll.rankingSize}
  />

  <h3>Absacker</h3>
  <Results
    boardgames={data.boardgames}
    entries={data.poll.entries}
    size={data.poll.rankingShortSize}
    short
  />
{:else}

{#if form?.success}
  <h4>Danke für deine Teilnahme!</h4>
{:else}
  <form
    method="POST"
    action="?/vote"
    bind:this={htmlForm}
    use:enhance={({ data: formData }) => {
      formData.append('ranking', ranking.map(it => it._id).join(','));
      formData.append('rankingShort', rankingShort.map(it => it._id).join(','));
      busy = true;
    }}
  >

  <p class="subtitle">
    {#if data.poll.entries.length > 1}
      Es haben schon {data.poll.entries.length} Teilnehmer:innen abgestimmt.
    {:else if data.poll.entries.length === 1}
      Es hat schon 1 Teilnehmer:in abgestimmt.
    {:else}
      Es hat noch niemand abgestimmt.
    {/if}
  </p>
  

  <label for="name">Dein Name</label>
  <input type="text" name="name" required>

  {#if ! submitForm}
    <RankingForm
      boardgames={data.boardgames.filter(it => ! it.short)}
      size={data.poll.rankingSize}
      bind:ranking={ranking}
      on:submit={() => {
        submitForm = true;
        window.scroll(0, 0);
      }}
    />
  {:else}
    <RankingForm
      boardgames={data.boardgames.filter(it => it.short)}
      size={data.poll.rankingShortSize}
      label="Absacker"
      busy={busy}
      bind:ranking={rankingShort}
      on:submit={() => htmlForm.requestSubmit()}
    />
  {/if}

  </form>
{/if}

{/if}
