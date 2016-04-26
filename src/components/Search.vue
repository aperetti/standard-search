<template>
  <div> {{hydrateMenu()}} </div>
  <div class='row'>
    <div class='col-md-6 col-xs-8 col-md-offset-3 col-xs-offset-2'>
        <input autocomplete="off" placeholder='Search for...' class='form-control' id='search' v-model="searchInput" @keyup="getResults"  @focus="showResults = true" @blur="blurResults" />
        <div class='list-group float' id='results' v-show='showResults'>
          <template v-for='item in searchResults'>
            <a @blur="blurResults" @click='updateStandard(item._source.file)' class='list-group-item text-left'>{{item._source.code}} - {{item._source.desc}}</a>
          </template>
        </div>
    </div>
  </div>
  <div class='row' style='height: 100%;'>
    <standard-view></standard-view>
  </div>
</template>

<script>
  import StandardView from './StandardView'
  import {updateStandard, hydrateMenu} from '../vuex/actions'
  export default {
    data () {
      return {
        searchInput: '',
        searchResults: [],
        showResults: false,
        fuzzy: true,
        searchCode: true,
        searchDesc: true
      }
    },
    vuex: {
      actions: {
        updateStandard,
        hydrateMenu
      }
    },
    components: {
      StandardView
    },
    methods: {
      setCurrentStandard: function (item) {
        this.currentStandard = item._source.file
      },
      getResults: function () {
        var xmlHttp = new window.XMLHttpRequest()
        var self = this
        let searchUrl = 'http://45.56.92.153:9200/standards/_search'
        let search = {
          sort: [{_score: 'desc'}],
          query: {
            multi_match: {
              fields: [this.searchCode ? 'code' : '', this.searchDesc ? 'desc' : ''],
              query: encodeURIComponent(this.searchInput),
              fuzziness: 2
            }
          }
        }
        if (this.fuzzy) {
          xmlHttp.open('POST', searchUrl, true)
          xmlHttp.send(JSON.stringify(search))
        } else {
          searchUrl = searchUrl + '?q=' + this.searchInput
          xmlHttp.open('GET', searchUrl, true)
          xmlHttp.send(null)
        }
        xmlHttp.onreadystatechange = function () {
          if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
            let results = JSON.parse(xmlHttp.responseText)
            self.searchResults = results.hits.hits
          }
        }
      },
      blurResults: function () {
        var self = this
        if (window.document.activeElement.parentElement.id !== 'results') {
          console.log(window.document.activeElement.parentElement.id)
          window.setTimeout(function () {
            self.showResults = false
          }, 125)
        }
      }
    },
    computed: {
      getTokenString: function () {
        return '&token=' + window.localStorage.getItem('token')
      }
    }
  }
</script>

<style scoped>
  .float {
    position: absolute;
    top: 40px;
    z-index: 1000;
  }
</style>
