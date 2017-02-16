<template>
  <div class='col-lg-5'>
    <div class="input-group"  style="padding: 8px;">
      <span @click="searchMethod += 1" class="input-group-addon link" id="sizing-addon1">
        <div style="overflow: hidden;">
          <transition name="slide" mode="out-in">
            <span v-bind:key="getSearchGlyph" :class="[getSearchGlyph]"></span>
          </transition>
        </div>
      </span>
       <input autocomplete="off" :placeholder='getSearchPlaceholder' class='form-control' type="search" id='search' v-model="searchInput" @keyup="getResults"  @focus="onSearchFocus" @blur="blurResults" />
        <div class='list-group float' id='results' style="padding-right: 8px;" v-show='showResults'>
        <div class='list-group-item nav nav-tab' style="padding: 0px; height: 30px; width: 100%">
          <a :class="['col-xs-4 highlight', index === searchMethod ? 'active' : '']" :tabindex="index" :id="'search-method-' + index" v-for="(search, index) in searchGlyph" @blur="blurResults" @click="searchMethod = index; getResults();">
            <span :class="[search]" style="height:30px; padding:5px;"></span><span class="hidden-xs">{{searchLabel[index]}}</span>
          </a>
        </div>
        <a v-if='searchResults && searchResults.length === 0 && searchInput.length > 0 && !loading' id='results-0' class='list-group-item text-left'>No Standards Found</a>
        <a v-if='loading' class='list-group-item text-left'>Loading...</a>
        <router-link 
          v-if='!loading' 
          v-for='(item, index) in searchResults' 
          :id="'results-'+index" 
          @blur="blurResults" 
          :to="{ name: 'standard', params: { standardId: item.id }}"  
          :class="['list-group-item text-left', item.id == $route.params.standardId ? 'active' : '']">
            <span v-if="item.highlights"><strong>{{item.code}} - {{item.description}}</strong></span>
            <span v-else>{{item.code}} - {{item.description}}</span>
            </br>
            <hr v-if="item.highlights" style='margin: 3px;'>
          <small v-if="item.highlights && index < 2" v-for="(highlight, index) in item.highlights" style="padding-left: 20px;" v-html="'...' + highlight + '...<br>'"></small>
        </router-link>
      </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {searchStandard, searchSubstring, searchStandardText} from 'src/api/standard'
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
        preventClose: false,
        showResults: false,
        fuzzy: 2,
        searchCode: true,
        searchDesc: true,
        searchLabel: ['Code', 'Code + Desc', 'Full Text'],
        searchPlaceholder: ['Search for standard by code', 'Search for standard by code and description', 'Search by standard text'],
        searchGlyph: ['glyphicon glyphicon-signal', 'glyphicon glyphicon-search', 'glyphicon glyphicon-console'],
        searchMethod: 0,
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
      onSearchFocus: function (event) {
        bus.emit('page-reset', 'drop-down')
        this.getResults()
        this.$nextTick(() => {
          this.showResults = true
        })
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
          case 2:
            searchRequest = searchStandardText(this.searchInput)
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
      blurResults: function (ev) {
        var self = this
        window.setTimeout(() => {
          if (!ev.relatedTarget || ev.relatedTarget.id.indexOf('search') === -1) {
            window.setTimeout(() => {
              self.showResults = false
            }, 50)
          }
          self.preventClose = false
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
  a.highlight:focus, a.highlight:hover {
    text-decoration: none;
  }
  a.highlight.active {
    cursor: default;
  }
  a.highlight {
    cursor: pointer;
    outline-color: grey;
    outline-width: 0;
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
    left: 50px;
    right: 0px;
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
