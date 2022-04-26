import { createStore } from 'vuex'
import axios from 'axios'


const store = createStore({

  state() {
    return {
      token: {},
      userProfile: {},
      searchedTracks: {},
      previewTrack: {},
    }
  },

  mutations: {
    addData(state, payload) {
      if (payload.dataName !== 'savedTrack') {
        state[payload.dataName] = payload.d
      } else if (state.userProfile.data !== undefined) {
        for (let times = 0; times < payload.d.data.length; times++) {
          state.searchedTracks[payload.index][times].savedTrack = payload.d.data[times]
        }
      } else {
        for (let times = 0; times < payload.d.data.length; times++) {
          state.searchedTracks[payload.index][times].savedTrack = null
        }
      }
    },
    addTracks(state, payload) {
      for (let times = Object.keys(state.searchedTracks).length; times > payload.index + 1; times--) {
        delete state.searchedTracks[times - 1]
      }
      if (payload.d.data.tracks.items !== undefined) {
        state.searchedTracks[payload.index] = payload.d.data.tracks.items
      } else {
        state.searchedTracks[payload.index] = payload.d.data.tracks
      }
      let checkTracks = state.searchedTracks[payload.index]
      let length = checkTracks.length
      let checkIds = ''
      if (length !== 0) {
        for (let times = 0; times < length; times++) {
          if (state.searchedTracks[payload.index][times].preview_url !== null) {
            this.dispatch('getPreview', {
              url: state.searchedTracks[payload.index][times].preview_url,
              index: payload.index,
              times: times,
            })
          }
        }
        if (state.userProfile.data !== undefined) {
          for (let times = 0; times < length; times++) {
            checkIds += checkTracks[times].id + ","
          }
          this.dispatch('getSpotify', {
            url: 'me/tracks/contains?ids=' + checkIds,
            index: payload.index
          })
        }
      }
    },
    addPreview(state, payload) {
      state.searchedTracks[payload.index][payload.times].previewMp3 = payload.d
    },
    changeSavedTrack(state, payload) {
      state.previewTrack.savedTrack = payload.b
      if (state.searchedTracks[payload.times][payload.index].id == payload.id) {
        state.searchedTracks[payload.times][payload.index].savedTrack = payload.b
      }
    }
  },

  actions: {
    auth() {
        let endpoint = 'https://accounts.spotify.com/authorize'
        let response_type = 'token'
        let client_id = '17c2fe4ed1a147099b08737dd76dd0bd'
        let redirect_uri = 'https://midnight-music-app-byaurk.netlify.app/midnight'
        let scope = 'user-read-private \ user-read-email \ user-library-modify \ user-library-read'
        location.href = endpoint +
          '?response_type=' + response_type +
          '&client_id=' + client_id +
          '&redirect_uri=' + redirect_uri +
          '&scope=' + scope
    },
    async getSpotify({ commit, state }, payload) {
      let endpoint = 'https://api.spotify.com/v1/' + payload.url
      let data = {
        headers: {
          'Authorization': state.token.token_type + ' ' + state.token.access_token
        },
        data: {}
      }
      await axios
        .get(endpoint, data)
        .then(res => {
          if (payload.index == undefined) {
            this.commit(payload.mutationName, {
              dataName: payload['dataName'],
              d: res
            })
          } else {
            this.commit('addData', {
              dataName: 'savedTrack',
              index: payload.index,
              d: res
            })
          }
        })
        .catch(e => {
          console.error(e)
        })
    },
    async putSpotify({ commit, state }, payload) {
      let endpoint = "https://api.spotify.com/v1/" + payload.url
      let header = {
        headers: {
          'Accept': 'application/json',
          'Authorization': state.token.token_type + ' ' + state.token.access_token,
          'Content-Type': 'application/json'
        }
      }
      if (payload.data == undefined) {
        let data = {}
        await axios
          .put(endpoint, data, header)
          .then(res => {
            console.log(payload.purpose)
          })
          .catch(e => {
            console.log(e)
          })
      } else {
        let data = payload.data
        await axios
          .put(endpoint, data, header)
          .then(res => {
            console.log(payload.purpose)
          })
          .catch(e => {
            console.log(e)
          })
      }
    },
    async deleteSpotify({ commit, state }, payload) {
      let endpoint = "https://api.spotify.com/v1/" + payload.url
      let header = {
        headers: {
          'Accept': 'application/json',
          'Authorization': state.token.token_type + ' ' + state.token.access_token,
          'Content-Type': 'application/json'
        }
      }
      await axios
        .delete(endpoint, header)
        .then(res => {
          console.log(payload.purpose)
        })
        .catch(e => {
          console.log(e)
        })
    },
    async getPreview(commit, payload) {
      let endpoint = payload.url
      await axios
        .get(endpoint, {
          responseType: 'blob'
        })
        .then(res => {
          this.commit('addPreview', {
            index: payload.index,
            times: payload.times,
            d: res.data
          })
        })
        .catch(e => {
          console.error(e)
        })
    },
    async getTracks({ commit, state }, payload) {
      let endpoint = 'https://api.spotify.com/v1/' + payload.url
      let data = {
        headers: {
          'Authorization': state.token.token_type + ' ' + state.token.access_token
        },
        data: {}
      }
      await axios
        .get(endpoint, data)
        .then(res => {
          this.commit('addTracks', {
            index: payload.index,
            d: res
          })
        })
        .catch(e => {
          console.error(e)
        })
    }
  }
})



export default store