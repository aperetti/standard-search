<template>
  <span>
    <div class="input-group" style="padding: 8px;">
      <span @click="searchMethod += 1" class="input-group-addon link" id="sizing-addon1">
        <div style="overflow: hidden;">
          <transition name="slide" mode="out-in">
            <span v-bind:key="getSearchGlyph" :class="[getSearchGlyph]"></span>
          </transition>
        </div>
      </span>
       <input autocomplete="off" :placeholder='getSearchPlaceholder' class='form-control' id='search' v-model="searchInput" @keyup="getResults"  @focus="focusSearch" @blur="blurResults" />
        <div class='list-group float' id='results' v-show='showResults'>
        <a v-if='searchResults && searchResults.length === 0 && searchInput.length > 0 && !loading' id='results-0' @blur="blurResults" class='list-group-item text-left'>No Standards Found</a>
        <a v-if='loading' class='list-group-item text-left'>Loading...</a>
        <router-link 
          v-if='!loading' 
          v-for='(item, index) in searchResults' 
          :id="'results-'+index" 
          @blur="blurResults" 
          :to="{ name: 'standard', params: { standardId: item.id }}"  
          :class="['list-group-item text-left', item.id == $route.params.standardId ? 'active' : '']">
            {{item.code}} - {{item.description}}
        </router-link>
      </div>
    </div>
  </span>
</template>

<script>
  import {searchStandard, searchSubstring} from 'src/api/standard'
  import bus from 'src/bus'
  export default {
    mounted () {
      bus.on('page-reset', () => {
        this.showResults = false
      })
    },
    data () {
      return {
        loading: false,
        searchInput: '',
        searchResults: [],
        showResults: false,
        fuzzy: 2,
        searchCode: true,
        searchDesc: true,
        searchPlaceholder: ['Search for standard by code and description', 'Search for standard by code'],
        searchGlyph: ['glyphicon glyphicon-search', 'glyphicon glyphicon-signal'],
        searchMethod: 1,
        toggleButton: true
      }
    },
    computed: {
      getSearchGlyph () {
        return this.searchGlyph[this.searchMethod % this.searchGlyph.length]
      },
      getSearchPlaceholder () {
        return this.searchPlaceholder[this.searchMethod % this.searchPlaceholder.length]
      }
    },
    methods: {
      focusSearch: function () {
        bus.emit('page-reset', 'drop-down')
        this.showResults = true
      },
      setCurrentStandard: function (item) {
        this.currentStandard = item._source.file
      },
      getResults: function () {
        var tempLoad = true
        var searchRequest
        switch (this.searchMethod % this.searchGlyph.length) {
          case 0:
            searchRequest = searchStandard(this.searchInput)
            break
          case 1:
            searchRequest = searchSubstring(this.searchInput)
            break
        }
        searchRequest.then((res) => {
          tempLoad = false
          this.loading = false
          this.searchResults = res.data
        }, (e) => {
          this.loading = false
          this.searchResults = []
        })
        setTimeout(() => {
          this.loading = tempLoad
        }, 100)
      },
      blurResults: function () {
        var self = this
        window.setTimeout(function () {
          if (window.document.activeElement.id.indexOf('results') === -1) {
            window.setTimeout(function () {
              self.showResults = false
            }, 50)
          }
        }, 100)
      }
    }
  }
</script>

<style scoped>  
  .slide-enter-active, .slide-leave-active {
    transition: all .3s ease;
  }
  .slide-enter {
    top: 20px;
  }
  .slide-leave-to {
    top: -20px;
  }
  .link {
    cursor: pointer;
  }
  .active {
    cursor: default;
    background-color: #fff;
    border-color: #ddd;
    color: #999;
  }
  .active:hover {
    color: #999;
    background-color: #fff;
    border-color: #ddd;
  }
  .float {
    position: absolute;
    top: 42px;
    z-index: 500;
  }
    /* always present */
  .expand-leave-active {
    height:0;
    transition: opacity .3s ease;
    overflow: hidden;
    opacity:0;
  }
  .expand-enter-active {
    transition: opacity .3s ease;
    overflow: hidden;
  }
</style>
