<template lang="pug">
  .game
    nuxt-link.button(to="/") Exit
    .wrapper
      .hodler_status
        img(:src="$store.state.hodler.md_image_url" style="height: 60px;border:2px solid #aaa;border-radius:60px;float:left;margin-right:10px")
        p {{ $store.state.hodler.name }}
        p 💩 {{ $store.state.balances[$store.state.status.original_shitcoin_id] ? $store.state.balances[$store.state.status.original_shitcoin_id].balance : 0}}
        p ❤️ {{ Math.round($store.state.hodler.hp()) }} / {{ $store.state.hodler.maxhp() }}
    .nav_bar
      .wrapper
        nuxt-link(to="/game") Story
        nuxt-link(to="/game/arena") Arena
        nuxt-link(to="/game/equipment") Equipment
        nuxt-link(to="/game/messages") Messages
    .wrapper
      nuxt
</template>

<script lang="coffee">
module.exports =
  mounted: ->
    clearInterval(this._updater)
    this._updater = setInterval((=> this.$forceUpdate()), 1000)
</script>


<style lang="scss">

</style>
