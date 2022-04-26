<template>
  <!-- TreeDiagram Settings -->
  <div v-bind:class="tailStyle">
    <!-- Row -->
    <div v-for="times in Object.keys(this.$store.state.searchedTracks).length" :key="times">
      <!-- Column -->
      <ul class="flex space-x-0.5 mt-0.5">
        <p
          v-if="this.$store.state.searchedTracks[times - 1].length == 0"
          class="text-xl"
        >Not Results</p>
        <!-- Track -->
        <li
          v-else
          v-for="(item, index) in this.$store.state.searchedTracks[times - 1]"
          :key="item.id"
        >
          <div
            @click="changePlayerState()"
            @mouseover="playPreview(times - 1, index, item)"
            @mouseleave="stopPreview()"
            class="relative group"
          >
            <img
              v-if="item.album.images.length !== 0"
              :src="item.album.images[0].url"
              @click="getRecommendations(item.id, times)"
              class="rounded-lg shadow-md group-hover:brightness-50 cursor-pointer"
            />
            <img
              v-else
              src="/public/assets/image/unknown.jpg"
              class="rounded-lg shadow-md group-hover:brightness-50 cursor-pointer"
            />
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>

export default {
  name: 'tree-diagram',

  props: ['changeTimes'],

  data() {
    return {
      player: new Audio(),
      playerState: false,
      tailStyle: 'h-[38rem] border px-1 pb-1 overflow-y-auto no-scrollbar'
    }
  },

  methods: {
    changePlayerState() {
      if (this.playerState == false) {
        this.playerState = true
        this.tailStyle = 'h-[38rem] border px-1 pb-1 overflow-y-auto no-scrollbar brightness-50'
      } else {
        this.playerState = false
        this.tailStyle = 'h-[38rem] border px-1 pb-1 overflow-y-auto no-scrollbar'
      }
    },
    getRecommendations(trackId, index) {
      if (this.playerState == false) {
        this.$store.dispatch('getTracks', {
          url: 'recommendations?seed_tracks=' + trackId + '&limit=9',
          index: index
        })
      }
    },
    playPreview(times, index, item) {
      if (this.playerState == false) {
        this.$store.commit('addData', {
          dataName: 'previewTrack',
          d: {
            times: times,
            index: index,
            track: item
          }
        })

        if (this.$store.state.searchedTracks[times][index].previewMp3 !== undefined) {
          let objectUrl = URL.createObjectURL(this.$store.state.searchedTracks[times][index].previewMp3)

          this.player.src = objectUrl
          this.player.volume = 0.3
          this.player.play()
        }
      }
    },
    stopPreview() {
      if (this.playerState == false) {
        this.player.pause()
        this.player.currentTime = 0
      }
    }
  }
}
</script>

<style>
/* Hide scrollbar for Chrome, Safari and Opera */
.no-scrollbar::-webkit-scrollbar {
  width: 3px;
  height: 3px;
}

.no-scrollbar::-webkit-scrollbar-track {
  display: none;
}

.no-scrollbar::-webkit-scrollbar-thumb {
  background: #ffff;
}

/* Hide scrollbar for IE, Edge and Firefox */
.no-scrollbar {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>