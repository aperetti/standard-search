<template>
  <div>
    <div class="container">
      <h2>Setup Standard References</h2>
        <div class="col-xs-12"><hr><h4>Possible References Found in PDF</h4></div>
          <div class="col-xs-12 col-md-3" v-for="type in uniqueTypes">
            <h5>{{type}}</h5>
            <div class="list-group">
              <a class="list-group-item" @click="toggleKeyword(keyword)" v-for="keyword in filteredKeyword(type)">
                {{keyword.keyword}} <span style="font-size: 18px;" :class="['pull-left glyphicon glyphicon-ok-sign', activeKeyword(keyword.keyword) ? '' : 'glyphicon-grey']"></span>
              </a>
            </div>
          </div>
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Keyword</th>
            <th>Type</th>
            <th>Reference Standard</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <template v-for='(keyword, index) in keywords'>
              <tr>
                <td class="form-group">
                  <input class="form-control" v-model='keyword.keyword'></input>
                </td>
                <td class="form-group">
                  <drop-down-button>
                    <template slot="title">{{keyword.keywordName}}</template>
                  <template slot='dropdown'>
                    <li><a href='#' @click="keyword.keywordName = keywordType.name" v-for="(keywordType, index) in keywordTypes">{{keywordType.name}}</a></li>
                  </template>             
                  </drop-down-button>
                </td>
                <td class="form-group">
                  <button class="btn btn-default" style="margin-right:5px;" @click="searchStandard(index)"><span class="glyphicon glyphicon-search"></span></button> 
                  {{keyword.reference.code|| 'No Reference'}} - {{keyword.reference.description || ''}}
                </td>
                <td><button class="btn btn-default" @click="toggleKeyword(keyword)">Remove</button></td>
              </tr>
          </template>
            <tr>
              <td class='form-group'><input class="form-control" placeholder="Name" v-model='newKeyword.keyword'></input></td>
              <td class='form-group'><drop-down-button>
                  <template slot="title">{{newKeyword.keywordName}}</template>
                  <template slot='dropdown'>
                    <li><a href='#' @click="newKeyword.keywordName = keywordType.name" v-for="keywordType in keywordTypes">{{keywordType.name}}</a></li>
                  </template>             
                  </drop-down-button>
              </td>
              <td class='form-group'>
                <button class="btn btn-default" style="margin-right:5px;" @click="searchStandard(-1)"><span class="glyphicon glyphicon-search"></span></button> {{newKeyword.reference.code || 'No Reference'}} - {{newKeyword.reference.description || ''}}
              </td>
              <td><button :class="['btn btn-default']" @click.prevent='addKeyword'>Add <span class="glyphicon glyphicon-plus"/><br/></td>
            </tr>  
        </tbody>
      </table>
      <div class="row">
        <div class="col-md-12">
          <button :class="['btn btn-default']" :disabled='!uniqueReferences' @click="modals.save = true">Save Changes</button>
        </div>

      </div>
    <div class="row" style="margin-top: 10px;">
      <div class="col-md-12">
        <div v-if="!uniqueReferences" class="alert alert-info" role="alert"><b>Heads Up!</b> You cannot have the same standard referenced more than once!</div>
      </div>
    </div>
      <!-- Modal to search for a standard and assign it a reference -->
      <base-modal hide-submit="true" v-on:close="closeSearch()" :dim="modals.search.active">
        <template slot="title">Search Standard</template>
        <template slot="body">
          <input id="keyword-search-standard-input" class="form-control" v-model="modals.search.input" />
          <div class='list-group float' id='results' v-show='modals.search.results.length > 0'>
            <a
              @click="updateReference(index)"
              v-for='(item, index) in modals.search.results' 
              :class="['list-group-item text-left']">
                {{item.code}} 
            </a>
          </div>
        </template>
        <template slot="button">Save</template>
      </base-modal>

      <base-modal  v-on:submit="saveKeywords" v-on:close="modals.save = false" :dim="modals.save">
        <template slot="title">Save Changes</template>
        <template slot="body">Are you sure you want to save the following changes?</template>
        <template slot="button">Save</template>
      </base-modal>
    </div>
  </template>
<script>
  import {keywords, getCategories, saveKeywords} from 'src/api/admin'
  import {searchSubstring, getStandardKeywords} from 'src/api/standard'
  import BaseModal from 'components/modals/BaseModal'
  import DropDownButton from 'components/widget/DropDownButton'
  export default {
    components: {
      BaseModal,
      DropDownButton
    },
    data () {
      return {
        loading: false,
        modals: {
          delete: false,
          save: false,
          search: {index: 0, active: false, standard: {}, input: '', results: []}
        },
        newKeyword: {keyword: '', keywordName: '', reference: {}},
        keywords: [],
        foundKeywords: [],
        uniqueTypes: [],
        keywordTypes: []
      }
    },
    mounted () {
      this.$watch('modals.search.input', () => {
        searchSubstring(this.modals.search.input).then(res => {
          this.modals.search.results = res.data
        })
      })
      getStandardKeywords(this.$route.params.standardId).then(res => {
        this.keywords = res.data.keywords.map(el => {
          return Object.assign({}, {keyword: el.standardKeyword.keyword, keywordName: el.standardKeyword.keywordName, reference: el})
        })
      })
      getCategories().then(res => {
        this.keywordTypes = res.data
      })
      keywords(this.$route.params.standardId)
      .then(res => {
        this.foundKeywords = res.data
        this.uniqueTypes = res.data.reduce((prev, el) => {
          if (prev.indexOf(el.keywordName) === -1) {
            prev.push(el.keywordName)
          }
          return prev
        }, [])
      })
    },
    methods: {
      searchStandard (n) {
        Object.assign(this.modals.search, {index: n, active: true})
        this.$nextTick(() => {
          document.getElementById('keyword-search-standard-input').focus()
        })
      },
      closeSearch () {
        Object.assign(this.modals.search, {index: 0, active: false, standard: {}, input: ''})
      },
      updateReference (ref) {
        Object.assign(this.modals.search, {standard: this.modals.search.results[ref]})
        var i = this.modals.search.index
        if (i === -1) {
          this.newKeyword.reference = this.modals.search.standard
        } else {
          this.keywords[i].reference = this.modals.search.standard
        }
        this.closeSearch()
      },
      handleDelete (index) {
        this.deleteIndex = index
        this.modals.delete = true
      },
      saveKeywords () {
        this.modals.save = false
        var data = {id: this.$route.params.standardId}
        data.keywords = this.keywords.map(el => {
          return {keyword: el.keyword, keywordName: el.keywordName, referenceId: el.reference.id || undefined}
        })
        this.loading = true
        saveKeywords(data).then(res => {
          this.loading = false
          this.$router.push({name: 'standard', params: {standardId: this.$route.params.standardId}})
          this.$store.dispatch('createAlert', {message: 'References saves!', type: 'success'})
        }).catch(e => {
          this.$store.dispatch('createAlert', {message: 'Error could not save references', type: 'danger'})
        })
      },
      filteredKeyword (type) {
        return this.foundKeywords.filter(el => el.keywordName === type)
      },
      activeKeyword (keyword) {
        var match = this.keywords.filter(el => el.keyword === keyword)
        return match.length > 0
      },
      addKeyword () {
        this.keywords.push(this.newKeyword)
        this.newKeyword = {keyword: '', keywordName: '', reference: ''}
      },
      toggleKeyword (keyword) {
        var keywords = this.keywords.map(el => el.keyword)
        var index = keywords.indexOf(keyword.keyword)
        if (index === -1) {
          searchSubstring(keyword.keyword).then(res => {
            var reference = res.data && res.data[0] || {}
            this.keywords.push({keyword: keyword.keyword, keywordName: keyword.keywordName, reference: reference})
          })
        } else {
          this.keywords.splice(index, 1)
        }
      }
    },
    computed: {
      uniqueReferences () {
        return this.keywords.reduce((accum, el, index, arr) => {
          if (!el.reference) return false
          if (index + 1 === arr.length) return accum
          console.log(arr.slice(index + 1).findIndex((searchEl) => searchEl.reference.id === el.reference.id))
          if (accum && arr.slice(index + 1).findIndex((searchEl) => searchEl.reference.id === el.reference.id) === -1) return true
          return false
        }, true)
      }
    }
  }

</script>
<style scoped>
  tr {
    text-align: left;
  }
  .glyphicon-grey {
    color: lightgrey;
  }
  .float {
    position: absolute;
    top: 50px;
    z-index: 500;
  }

</style>
