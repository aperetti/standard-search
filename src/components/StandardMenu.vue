<template>
  <div class="container" v-show="enable">
    <div class='row'>
      <div class='col-12'>
        <h4>Standards Menu</h4>
        <div><h6 style='display: inline;' v-for='menu in currentMenu'>{{menu}} </h6><div>
      </div>
    </div>
    <div class='row' >
      <div class = 'col-xs-6 col-md-6'>
        <div class="panel panel-default">
          <div class="panel-heading" style="cursor: pointer"  @click='setCurrentMenu(currentMenu.slice(0, -1))'><span class='glyphicon glyphicon-level-up'></span></div></li>
          <div v-if="childMenus.length > 0">
          <template v-for='category in childMenus'>
            <a class="list-group-item" style="cursor: pointer" @click='setCurrentMenu(currentMenu.concat(category))'>{{category}}</a>
          </template>
          </div>
        </div>
      </div>
      <div class = 'col-xs-6 col-md-6'>
        <div class="panel panel-default" v-if="menuStandards.length != 0">
          <div class="panel-heading">{{currentMenu[currentMenu.length-1]}}</div>
            <div class="list-group">
              <template v-for='std in menuStandards'>
                <a class="list-group-item" v-link="{path: '/search', query: {standard: std.file}}">
                  <h4 class="list-group-item-heading">{{std.code}}</h4>
                  <p class="list-group-item-text">{{std.desc}}</p>
                </a>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {hydrateMenu, menuLoading, setCurrentMenu, updateStandard} from '../vuex/actions'
  import equals from 'array-equal'
  import {affix} from 'vue-strap'
  import naturalSort from 'javascript-natural-sort'
  
  export default {
    components: {
      affix
    },
    props: ['enable'],
    data () {
      return {
        open: true
      }
    },
    computed: {
      getLink: function (std) {
        return {path: '/search', query: {standard: std.file}}
      }
    },
    vuex: {
      actions: {
        hydrateMenu,
        menuLoading,
        setCurrentMenu,
        updateStandard
      },
      getters: {
        currentMenu: state => state.standard.currentMenu,
        menuStandards: state => {
          let standards = state.standard.menuStandards.slice()
          if (standards.length > 0) {
            return standards.sort((el, el2) => naturalSort(el.code, el2.code))
          } else {
            return []
          }
        },
        childMenus: state => {
          let allMenus = state.standard.menus
          let path = state.standard.currentMenu
          let menus = []
          allMenus.forEach((menu) => {
            if (menus.indexOf(menu[path.length]) === -1) {
              if ((equals(path, menu.slice(0, path.length)) || path.length === 0) && menu.length !== path.length) {
                menus.push(menu[path.length])
              }
            }
          })
          return menus.sort(naturalSort)
        }
      }
    },
    ready: function () {
      this.hydrateMenu()
    }
  }
</script>

