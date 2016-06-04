<template>
  <div class='row' v-show="open">
    <div class = 'col-xs-6 col-md-4 col-md-offset-2'>
      <div class="list-group">
        <a class="list-group-item active" style="cursor: pointer"  @click='setCurrentMenu(currentMenu.slice(0, -1))'>{{currentMenu.length === 0 ? 'Categories' : currentMenu[currentMenu.length -1]}}</a></li>
        <div v-if="childMenus.length > 0">
        <template v-for='category in childMenus'>
          <a class="list-group-item" style="cursor: pointer" @click='setCurrentMenu(currentMenu.concat(category))'>{{category}}</a>
        </template>
        </div>
      </div>
    </div>
    <div class = 'col-xs-6 col-md-4'>
      <div class="panel panel-default" v-if="menuStandards.length != 0">
        <div class="panel-heading"> <template v-for="category in currentMenu">{{category}}</template> </div>
          <div class="list-group">
            <template v-for='std in menuStandards'>
              <a class="list-group-item" v-link="{path: '/search', {query:standard: std.file}}">
                <h4 class="list-group-item-heading">{{std.code}}</h4>
                <p class="list-group-item-text">{{std.desc}}</p>
              </a>
            </template>
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
    data () {
      return {
        open: false
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

