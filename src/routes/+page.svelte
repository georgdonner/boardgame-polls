<script lang="ts">
  import { enhance } from '$app/forms';
  import type { ActionData } from './$types';

  export let form: ActionData;

  let copied = false;
  let busy = false;

  const copy = () => {
    if (form?.pollLink) {
      navigator.clipboard.writeText(form?.pollLink);
      copied = true;
    }
  }
</script>

<svelte:head>
  <title>Neue Brettspiel-Umfrage</title>
</svelte:head>

{#if form?.pollId}
  <h1>Umfrage erfolgreich erstellt!</h1>

  <label for="pollLink">Link zur Umfrage</label>
  <input type="text" name="pollLink" id="pollLink" bind:value={form.pollLink} readonly>
  <button class="outline" on:click={copy}>Link kopieren</button>
  {#if copied}
    Kopiert!
  {/if}

  <hr>

  <br>
  <a style="width: 100%" role="button" href={form.pollLink}>Zur Umfrage</a>
{:else}
  <h1>Neue Brettspiel-Umfrage erstellen</h1>

  <form method="POST" use:enhance={() => {busy = true;}}>
    <label for="name">Name</label>
    <input type="text" name="name">
    
    <label for="participants">Anzahl der Teilnehmer:innen</label>
    <input type="number" name="participants" value="4" min="1">
    
    <label for="rankingSize">Votes pro Teilnehmer:in</label>
    <input type="number" name="rankingSize" value="5" min="1">
    
    <button type="submit" aria-busy={busy} disabled={busy}>Umfrage erstellen</button>
  </form>
{/if}