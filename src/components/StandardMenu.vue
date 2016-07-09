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
      <img v-if='standardsLoading' class='loader' src='../assets/greyLoading.svg' style="z-index:100;" transition='item'></img>
      <div class="panel panel-default" v-if="menuStandards.length === 0">
        <div class="panel-heading" v-if='currentPath.length > 0'>{{currentPath[currentPath.length-1]}}</div>
        <div class="panel-heading" v-else>Root</div> 
        <div class="list-group">
            <a v-if='menuStandards.length === 0' class="list-group-item" transition='item'>
              <h4 class="list-group-item-heading" transition='item'><span class="glyphicon glyphicon-sunglasses glyphicon" transition='item'></span></h4>
              <p class="list-group-item-text" transition='item'>No Standards</p>
            </a>
        </div>
      </div>
      <div class="panel panel-default" v-if="menuStandards.length != 0">
        <div class="panel-heading">{{currentPath[currentPath.length-1]}}</div>
        <div class="list-group">             
          <template v-for='std in menuStandards'>
            <a class="list-group-item" v-link="{name: 'standard', params: {standardId: std._id}}" transition='item'>
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

<style scoped>
    .loader {
      position: absolute;
      margin: auto;
      top: 0; left: 0; bottom: 0; right: 0;
    }
    .grey {
      opacity: .15;
      background-color: #000;
      position: absolute;
      margin: auto;
      top: 0; left: 0; bottom: 0; right: 0;
    }
    .item {
     
    }
    .item-transition {
      -webkit-transition: opacity .25s ease-in-out;
      -moz-transition: opacity .25s ease-in-out;
      -o-transition: opacity .25s ease-in-out;
      transition: opacity .25s ease-in-out;
    }
    .item-enter {
      filter: alpha(opacity=0);
      height: 0;
      opacity: 0;
    }
    .item-leave {
      filter: alpha(opacity=0);
      opacity: 0;
      height: 0;
      position: absolute; /* important for removal move to work */
    }
</style>