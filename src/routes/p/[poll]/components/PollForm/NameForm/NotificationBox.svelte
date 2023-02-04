<script lang="ts">
  import { onMount } from 'svelte';
  import { isSupported, getSubscription, subscribe } from '$lib/pushService';

  export let pushSubscription: PushSubscription|undefined;

  let checked = false;

  onMount(async () => {
    const subscription = await getSubscription();
    if (subscription) {
      checked = true;
      pushSubscription = subscription;
    }
  });
</script>

{#if isSupported}
  <label for="push" id="push">
    <input type="checkbox" name="push" checked={checked} on:change={async (e) => {
      if (e.currentTarget?.checked) {
        const subscription = await subscribe();
        if (subscription) {
          pushSubscription = subscription;
        }
      }
    }}>
    Sende eine Benachrichtigung wenn die Umfrage abgeschlossen ist
  </label>
{/if}