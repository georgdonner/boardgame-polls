<script lang="ts">
  import type { WithId } from 'mongodb';
  import { onMount } from 'svelte';
  import { enhance } from '$app/forms';
  
  import type { Boardgame, Poll } from '$lib/server/db';
  import { TabIndex, tabs } from '../lib/tabs';
  import NameForm from './PollForm/NameForm.svelte';
  import RankingForm from './PollForm/RankingForm.svelte';

  export let poll: WithId<Poll>;
  export let boardgames: Boardgame[];
  export let success: boolean;
    
  let currentTab: TabIndex = TabIndex.Loading;
  let ranking: Boardgame[] = [];
  let rankingShort: Boardgame[] = [];
  let pushSubscription: PushSubscription|undefined;
  let busy = false;

  const nextTab = () => {
    currentTab += 1;
    window.scroll(0, 0);
  };

  onMount(() => {
    currentTab = success ? TabIndex.Done : TabIndex.Name;
  })
</script>

{#if currentTab === TabIndex.Loading}
  <div>Lädt...</div>
{:else if currentTab < TabIndex.Done}
  <p class="subtitle">
    {#if poll.entries.length > 1}
      Es haben schon {poll.entries.length} Teilnehmer:innen abgestimmt.
    {:else if poll.entries.length === 1}
      Es hat schon 1 Teilnehmer:in abgestimmt.
    {:else}
      Es hat noch niemand abgestimmt.
    {/if}
  </p>
{/if}

<div class="tabs">
  {#each tabs as tab, i}
    <span class="tab" class:is-active="{currentTab >= tab.index}">
      <span>{tab.index}</span>
      <span>{tab.label}</span>
      {#if i < (tabs.length - 1)}
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
    use:enhance={({ data: formData }) => {
      formData.append('ranking', ranking.map(it => it._id).join(','));
      formData.append('rankingShort', rankingShort.map(it => it._id).join(','));
      if (pushSubscription) {
        formData.append('pushSubscription', JSON.stringify(pushSubscription));
      }
      busy = true;
      return async ({ update }) => {
        busy = false;
        currentTab = TabIndex.Done;
        update();
      };
    }}
  >

  <div hidden={currentTab !== TabIndex.Name}>
    <NameForm bind:pushSubscription={pushSubscription} on:submit={nextTab} />
  </div>

  <div hidden={currentTab !== TabIndex.Games}>
    <RankingForm
      boardgames={boardgames.filter(it => ! it.short)}
      size={poll.rankingSize}
      bind:ranking={ranking}
      on:submit={nextTab}
    />
  </div>

  <div hidden={currentTab !== TabIndex.ShortGames}>
    <RankingForm
      boardgames={boardgames.filter(it => it.short)}
      size={poll.rankingShortSize}
      label="Absacker"
      buttonLabel="Abschicken"
      buttonType="submit"
      busy={busy}
      bind:ranking={rankingShort}
    />
  </div>
  </form>
{/if}