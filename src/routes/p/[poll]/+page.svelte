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

  /* TABS */
  enum TabIndex {
    Name = 1,
    Games,
    ShortGames,
    Done,
  }

  interface Tab {
    index: TabIndex;
    label: string;
  }

  const TABS: Tab[] = [
    {index: TabIndex.Name, label: 'Name'},
    {index: TabIndex.Games, label: 'Spiele'},
    {index: TabIndex.ShortGames, label: 'Absacker'},
    {index: TabIndex.Done, label: 'Fertig'},
  ];

  let currentTab = form?.success ? TabIndex.Done : TabIndex.Name;
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

{#if currentTab < TabIndex.Done}
  <p class="subtitle">
    {#if data.poll.entries.length > 1}
      Es haben schon {data.poll.entries.length} Teilnehmer:innen abgestimmt.
    {:else if data.poll.entries.length === 1}
      Es hat schon 1 Teilnehmer:in abgestimmt.
    {:else}
      Es hat noch niemand abgestimmt.
    {/if}
  </p>
{/if}

<div class="tabs">
  {#each TABS as tab, i}
    <span class="tab" class:is-active="{currentTab >= tab.index}">
      <span>{tab.index}</span>
      <span>{tab.label}</span>
      {#if i < (TABS.length - 1)}
        <span>></span>
      {/if}
    </span>
  {/each}
</div>

{#if currentTab === TabIndex.Done}
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
      return async ({ update }) => {
        busy = false;
        currentTab = TabIndex.Done;
        update();
      };
    }}
  >

  <div hidden={currentTab !== TabIndex.Name}>
    <label for="name">Dein Name</label>
    <input type="text" name="name" required
      on:keypress={(event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          currentTab = currentTab + 1;
        }
      }}
    >
    <button
      type="button"
      on:click={() => {currentTab = currentTab + 1;}}
    >
      Weiter
    </button>
  </div>

  <div hidden={currentTab !== TabIndex.Games}>
    <RankingForm
      boardgames={data.boardgames.filter(it => ! it.short)}
      size={data.poll.rankingSize}
      bind:ranking={ranking}
      on:submit={() => {
        currentTab = currentTab + 1;
        window.scroll(0, 0);
      }}
    />
  </div>

  <div hidden={currentTab !== TabIndex.ShortGames}>
    <RankingForm
      boardgames={data.boardgames.filter(it => it.short)}
      size={data.poll.rankingShortSize}
      label="Absacker"
      buttonLabel="Abschicken"
      busy={busy}
      bind:ranking={rankingShort}
      on:submit={() => htmlForm.requestSubmit()}
    />
  </div>
  </form>
{/if}

{/if}
