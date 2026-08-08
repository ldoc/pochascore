<script>
  import { isMuted, toggleMute } from '../lib/voice';
</script>

<button class="mute-btn" on:click={toggleMute}>
  {$isMuted ? '🔇' : '🔊'}
</button>