<template>
  <div class="container" v-show="enable">
    <div class='row'>
      <div class='col-12'>
        <h4>Standards Menu</h4>
        <ol class="breadcrumb">
          <li class="active"><template  v-if='currentPath.length > 0'><a @click='currentPath = []'>Root</a></template><template v-else>Root</template></li>
          <li v-for='path in currentPath' class="active" @click='currentPath = currentPath.slice(0,$index + 1)'>
            <template  v-if='currentPath.length > $index + 1'><a class='$index === currentPath.length - 1 ? active : ""'>{{path}}</a></template>
            <template v-else>{{path}}</template>
          </li>
        </ol>
      </div>
    </div>
    <div class='row' >
      <div class = 'col-xs-6 col-md-6'>
        <div class="panel panel-default">
          <div class="panel-heading" style="cursor: pointer"  @click='currentPath = currentPath.slice(0, -1)'><span class='glyphicon glyphicon-level-up'></span></div></li>
          <div>
            <template v-for='category in currentCategories'>
              <a class="list-group-item" style="cursor: pointer" @click='currentPath.push(category)'>{{category}}</a>
            </template>
          </div>
        </div>
      </div>
    <div class = 'col-xs-6 col-md-6'>
      <div class="panel panel-default" v-if="menuStandards.length != 0 || standardsLoading">
        <div class="panel-heading">{{currentPath[currentPath.length-1]}}</div>
        <div class="list-group">
            <img v-if='standardsLoading' src='../assets/greyLoading.svg'></img>             
          <template v-for='std in menuStandards'>
            <a class="list-group-item" v-link="{name: 'standard', params: {standardId: std._id}}">
              <h4 class="list-group-item-heading">{{std.code}}</h4>
              <p class="list-group-item-text">{{std.desc}}</p>
            </a>

          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import equals from 'array-equal'
import naturalSort from 'javascript-natural-sort'
import {getStandardsByMenu} from '../api/standard'
import {getMenu} from '../api/menu'

export default {
  props: ['enable'],
  data () {
    return {
      open: true,
      standardsLoading: false,
      currentPath: [],
      menus: [],
      menuStandards: []
    }
  },
  methods: {
    addToPath: function (category) {
      this.currentPath.push(category)
    },
    getChildMenus: function () {
      let standards = getStandardsByMenu(this.currentPath)
      standards.then((response) => {
        this.childLoading = false
        this.childMenus = response.data
      }, (response) => {
        this.childMenus = []
      })
    },
    menuStandards () {
      let standards = []
      if (standards.length > 0) {
        return standards.sort((el, el2) => naturalSort(el.code, el2.code))
      } else {
        return []
      }
    }
  },
  computed: {
    currentCategories () {
      if (this.menus.length !== 0) {
        let allMenus = this.menus
        let path = this.currentPath
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
    let menu = getMenu()
    menu.then((response) => {
      this.menus = response.data
    }, (response) => {
      this.menus = []
    })
    this.$watch('currentPath', () => {
      this.standardsLoading = true
      this.menuStandards = []
      let standards = getStandardsByMenu(this.currentPath)
      standards.then((response) => {
        this.standardsLoading = false
        this.menuStandards = response.data
      }, (response) => {
        this.standardsLoading = false
        this.menuStandards = []
      })
    })
  }
}
</script>


