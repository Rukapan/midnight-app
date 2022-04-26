<template>
  <!-- All Settings -->
  <div class="relative h-screen w-screen bg-midnight bg-cover text-white">
    <!-- TopBar -->
    <div class="bg-black w-screen h-10 fixed">
      <!-- Title -->
      <div class="pl-4 pt-0.5">
        <h1 class="text-3xl font-bold">
          MID<span class="text-rose-500">N</span>IGHT.
        </h1>
      </div>
      <!-- MenuButton -->
      <div class="absolute top-1.5 right-4">
        <div class="relative">
          <!-- Not Login -->
          <button v-if="this.$store.state.userProfile.data == undefined" @click="login()">
            <img src="/public/assets/image/spotify-icon.png" class="h-7 w-7 bg-black rounded-full" />
          </button>
          <!-- Login -->
          <button
            @click="changeState('menuState')"
            v-else
            class="relative hover:ring-1 ring-rose-500 rounded-full"
          >
            <img
              v-if="this.$store.state.userProfile.data.images.length !== 0"
              :src="this.$store.state.userProfile.data.images[0].url"
              class="h-7 w-7 rounded-full"
            />
            <img v-else src="/public/assets/image/user-icon.png" class="h-7 w-7 rounded-full" />
          </button>
          <!-- Menu -->
          <ul v-if="this.menuState" class="absolute right-1.5 mt-2 w-28 h-14 border rounded-lg">
            <div class="p-1">
              <li>
                <button @click="moveLink('https://open.spotify.com/')" class="flex group">
                  <p class="group-hover:font-medium">WebPlayer</p>
                  <img src="/public/assets/image/spotify-icon.png" class="w-5 h-5 ml-1 mt-0.5" />
                </button>
              </li>
              <li>
                <button @click="moveLink('https://www.spotify.com/logout/')" class="flex group">
                  <p class="group-hover:font-medium">Logout</p>
                  <span class="mdi mdi-logout-variant text-xl ml-1"></span>
                </button>
              </li>
            </div>
          </ul>
        </div>
      </div>
      <!-- Login Instructions -->
      <div v-if="this.$store.state.userProfile.data == undefined">
        <img src="/public/assets/image/arrow-rose2.png" class="absolute right-10 top-16 w-16" />
        <p
          class="absolute right-32 top-32 text-end text-lg"
        >Login with your Spotify account, Be able to save the tracks.</p>
      </div>
    </div>
    <!-- MainScreen -->
    <div class="w-screen h-screen flex justify-around">
      <!-- LeftScreen -->
      <div class="w-1/2">
        <!-- Instruction -->
        <h2 class="mt-24 text-xl font-bold text-center">find music you like that you never knew.</h2>
        <!-- Search -->
        <div class="flex items-center mt-12 w-full">
          <div class="w-full border-2">
            <input
              v-model="searchInput"
              type="search"
              placeholder="Search by Track or Artist"
              class="w-full text-xl outline-none placeholder-gray-400 text-center hover:ring ring-rose-500"
            />
          </div>
          <span class="mdi mdi-magnify text-3xl ml-1"></span>
        </div>
        <!-- TreeDiagram -->
        <tree-diagram v-if="this.$store.state.searchedTracks[0] !== undefined" />
      </div>
      <!-- RightScreenInstruction -->
      <div v-if="this.$store.state.previewTrack.track == undefined" class="w-2/5 flex items-center">
        <div>
          <video
            src="/public/assets/video/MIDNIGHT-Video.mp4"
            loop
            autoplay
            muted
            class="w-[40rem] brightness-100 shadow-xl"
          ></video>
          <p
            class="mt-4 text-2xl"
          >While listening a preview music, by searching for a song or artist, be able to discover more music related to it.</p>
        </div>
      </div>
      <!-- RightScreen -->
      <div
        v-if="this.$store.state.previewTrack.track !== undefined"
        class="flex items-center w-2/5 mt-40"
      >
        <div class="relative flex-col w-[32rem] truncate">
          <p
            v-if="this.$store.state.previewTrack.track.previewMp3 == null"
            class="text-2xl mb-1 text-center"
          >No Preview</p>
          <img :src="this.$store.state.previewTrack.track.album.images[0].url" class="shadow-xl" />
          <div class="flex mt-3 w-full items-center">
            <div class="flex-col ml-1 mr-1 w-11/12 truncate">
              <p
                @click="moveLink(this.$store.state.previewTrack.track.external_urls.spotify)"
                class="text-2xl font-bold truncate hover:underline cursor-pointer"
              >{{ this.$store.state.previewTrack.track.name }}</p>
              <div class="flex truncate">
                <div
                  v-for="times in this.$store.state.previewTrack.track.artists.length"
                  :key="times"
                  class="truncate"
                >
                  <p
                    @click="moveLink(this.$store.state.previewTrack.track.artists[times - 1].external_urls.spotify)"
                    class="truncate hover:underline cursor-pointer"
                  >
                    {{ this.$store.state.previewTrack.track.artists[times - 1].name }}
                    <span
                      v-if="this.$store.state.previewTrack.track.artists.length > 1 && times !== this.$store.state.previewTrack.track.artists.length"
                      class="mr-1"
                    >,</span>
                  </p>
                </div>
              </div>
            </div>
            <div v-if="this.$store.state.userProfile.data !== undefined" class="mr-1">
              <button
                @click="likePush(this.$store.state.previewTrack.track.savedTrack, this.$store.state.previewTrack.track.id, this.$store.state.previewTrack.index, this.$store.state.previewTrack.times)"
              >
                <span
                  v-if="this.$store.state.previewTrack.track.savedTrack == false"
                  class="mdi mdi-heart-outline text-3xl text-red-400/70 hover:text-red-400"
                ></span>
                <span v-else class="mdi mdi-heart text-3xl text-red-400 hover:text-red-400/70"></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- BottomBar -->
    <div class="absolute w-screen h-10 bg-black bottom-0 text-white">
      <div class="relative w-full text-xs">
        <p class="pl-4 pt-3.5">@Using SpotifyApi & UnsplashPhot</p>
        <p class="absolute right-4 top-2.5">Project by Au/rK</p>
      </div>
    </div>
  </div>
</template>


<script>

import TreeDiagram from '../components/TreeDiagram.vue'

export default {
  name: 'midnight',
  components: { TreeDiagram },
  props: {
    routeParams: Object
  },

  data() {
    return {
      menuState: false,
      searchInput: "",
    }
  },

  methods: {
    login() {
      this.$store.dispatch('auth')
    },
    changeState(dataName) {
      if (this[dataName] == false) {
        this[dataName] = true
      } else {
        this[dataName] = false
      }
    },
    moveLink(url) {
      location.href = url
    },
    async createHome() {
      if (this.$store.state.token.access_token == undefined) {
        await this.$store.commit('addData', {
          dataName: 'token',
          d: this.routeParams
        })
      } if (this.$store.state.token.access_token !== undefined) {
        this.getUserProfile()
      }
    },
    getUserProfile() {
      this.$store.dispatch('getSpotify', {
        url: 'me',
        mutationName: 'addData',
        dataName: 'userProfile'
      })
    },
    getSearchTracks() {
      this.$store.dispatch('getTracks', {
        url: 'search?q=' + this.searchInput + '&type=track&limit=9',
        index: 0
      })
    },
    likePush(savedTrack, id, index, times) {
      if (savedTrack == false) {
        this.$store.dispatch('putSpotify', {
          url: 'me/tracks',
          data: {
            'ids': [
              id
            ]
          },
          purpose: 'SaveTrack'
        })
        this.$store.commit('changeSavedTrack', {
          id: id,
          times: times,
          index: index,
          b: true
        })
      } else {
        this.$store.dispatch('deleteSpotify', {
          url: 'me/tracks?ids=' + id,
          purpose: "DeleteSavedTrack"
        })
        this.$store.commit('changeSavedTrack', {
          id: id,
          times: times,
          index: index,
          b: false
        })
      }
    },
  },

  created() {
    if (this.$route.hash) {
      this.$router.push(this.$route.fullPath.replace('#', '?'))
    }
    this.createHome()
  },

  watch: {
    routeParams() {
      this.createHome()
    },
    searchInput() {
      if (this.searchInput !== "") {
        this.getSearchTracks()
      }
    }
  }
}
</script>