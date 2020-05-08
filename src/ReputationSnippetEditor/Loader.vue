<template>
  <div :class="{'frame-loading': loading}">
      <slot/>
  </div>
</template>

<script>
  export default {
    name: 'Loader',
    props: ['loading']
  }
</script>