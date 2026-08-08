<script>
  let message = '';
  let visible = false;
  let timeout;

  export function show(msg) {
    message = msg;
    visible = true;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      visible = false;
    }, 2000);
  }
</script>

<div class="toast" class:show={visible}>
  {message}
</div>
