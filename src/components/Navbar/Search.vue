<template>
  <span>
    <div class="input-group" style="padding: 8px;">
      <span class="input-group-addon" id="sizing-addon1">@</span>
       <input autocomplete="off" placeholder='Search for...' class='form-control' id='search' v-model="searchInput" @keyup="getResults"  @focus="showResults = true" @blur="blurResults" />

        <div class='list-group float' id='results' v-show='showResults'>
        <a v-if='searchResults && searchResults.length === 0 && searchInput.length > 0 && !loading' id='results-0' @blur="blurResults" class='list-group-item text-left'>No Standards Found</a>
        <a v-if='loading' class='list-group-item text-left'>Loading...</a>
        <router-link 
          v-if='!loading && $route.params && $route.params.standardId !== item._id' 
          v-for='(item, index) in searchResults' 
          :id="'results-'+index" 
          @blur="blurResults" 
          :to="{ name: 'standard', params: { standardId: item._id }}"  
          :class="['list-group-item text-left']">
            {{item._source.code}} - {{item._source.description}}
        </router-link>
      </div>
    </div>
  </span>
</template>

<script>
  import {searchStandard} from 'src/api/standard'
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
        searchDesc: true
      }
    },
    methods: {
      setCurrentStandard: function (item) {
        this.currentStandard = item._source.file
      },
      getResults: function () {
        var tempLoad = true
        searchStandard(this.searchInput).then((res) => {
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
