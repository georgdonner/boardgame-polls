<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  import NotificationBox from './NameForm/NotificationBox.svelte';

  export let pushSubscription: PushSubscription|undefined;
</script>

<label for="name">Dein Name</label>
<input type="text" name="name" required
  on:keypress={(event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      dispatch('submit');
    }
  }}
>

<NotificationBox bind:pushSubscription={pushSubscription} />
<br>

<button
  type="button"
  on:click={() => dispatch('submit')}
>
  Weiter
</button>