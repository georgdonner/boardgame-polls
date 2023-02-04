<script lang="ts">
  import { onMount } from 'svelte';
  import { isSupported } from '$lib/pushService';
  import type { ActionData, PageData } from './$types';

  import Results from './components/Results.svelte';
  import PollForm from './components/PollForm.svelte';
  import './styles.css';
  
  export let form: ActionData;
  export let data: PageData;

  onMount(() => {
    if (isSupported) {
      navigator.serviceWorker.addEventListener('message', (e) => {
        if (e.data === 'reload') {
          window.location.reload();
        }
      });
    }
  })
</script>

<svelte:head>
  <title>{data.poll.name} - Brettspiel-Umfrage</title>
</svelte:head>

<h1>{data.poll.name}</h1>

{#if data.poll.ended}
  <Results
    poll={data.poll}
    boardgames={data.boardgames}
  />
{:else}
  <PollForm
    poll={data.poll}
    boardgames={data.boardgames}
    success={Boolean(form?.success)}
  />
{/if}
