<script>
export default {
  name: 'authorization',
  created() {
    this.$store.dispatch('auth')
  }
}
</script>