<template>
  <div class=" navbar navbar-default" v-show="enable">
    <div class='row'>
      <div class='col-xs-12 col-md-4'>
        <h4 class='pull-left'>Standards Menu</h4>
        </div>
        <div class='col-xs-12 col-md-12 text-left'>
        <ol class="breadcrumb" style='margin-bottom: 5px; padding-left: 0px'>
          <template v-for='ancestor in menus.ancestors'>
            <li class="active" @click='fetchMenu(ancestor.id)'>
              <a class='active'>{{ancestor.name}}</a>
            </li>
          </template>
          <li @click='fetchMenu(menus.id)'>
            {{menus.name}}
          </li>
        </ol>
      </div>
    </div>
    <div class='row' >
      <div class = 'col-xs-5 col-md-4'>
        <div class="panel panel-default">
          <div class="panel-heading" style="cursor: pointer"  @click='fetchMenu(menus.parent.id)'><span class='glyphicon glyphicon-level-up'></span></div></li>
          <div>
            <template v-for='children in menus.children'>
              <a class="list-group-item" style="cursor: pointer" @click='fetchMenu(children.id)'>{{children.name}}</a>
            </template>
          </div>
        </div>
      </div>
    <div class = 'col-xs-7 col-md-8'>
      <img v-if='standardsLoading' class='loader' src='../assets/greyLoading.svg' style="z-index:100;" transition='item'></img>
      <div class="panel panel-default" v-if="!menus.standards || menus.standards.length === 0">
        <div class="panel-heading">{{menus.name}}</div>
        <div class="list-group">
            <a v-if='!menus.standards || menus.standards.length === 0' class="list-group-item" transition='item'>
              <h4 class="list-group-item-heading" transition='item'><span class="glyphicon glyphicon-sunglasses glyphicon" transition='item'></span></h4>
              <p class="list-group-item-text" transition='item'>No Standards</p>
            </a>
        </div>
      </div>
      <div class="panel panel-default" v-if="menus.standards && menus.standards.length != 0">
        <div class="panel-heading">{{menus.name}}</div>
        <div class="list-group">             
          <template v-for='std in menus.standards'>
            <a class="list-group-item" v-link="{name: 'standard', params: {standardId: std.code}}" transition='item'>
              <h4 class="list-group-item-heading">{{std.code}}</h4>
              <p class="list-group-item-text">{{std.description}}</p>
            </a>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
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
      menus: {},
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
    },
    fetchMenu (id = 1) {
      getMenu(id).then((response) => {
        this.menus = response.data
      }, (response) => {
        this.menus = []
      })
    }
  },
  ready: function () {
    this.fetchMenu()
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