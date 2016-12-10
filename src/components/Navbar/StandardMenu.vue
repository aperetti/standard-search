<template>
  <transition name="slide">
  <div class=" navbar navbar-default" v-show="enable">
    <div class='row'>
      <div class='col-xs-12'>
        <h4 class='pull-left'>Standards Menu</h4>
        </div>
        <div class='col-xs-12 col-md-12 text-left'>
        <ol class="breadcrumb" style='margin-bottom: 5px; padding-left: 0px;'>
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
      <div class = 'col-xs-5 col-md-4 tabl'  style="padding-right:0px; padding-left:0px; text-align: left;">
          <div class="list-group">
            <!-- Display for Root -->
             <template v-if="!menus.parent">
              <div :class="['list-group-item','parent', 'arrow']" style="cursor: pointer">{{menus.name}}</div>
              <template v-for='child in menus.children'>
                <a class="list-group-item child" style="cursor: pointer;" @click='fetchMenu(child.id)'>{{child.name}}</a>
              </template>
            </template>
            <!-- Display Else -->
            <template v-if="menus.parent">
              <template v-for='sibling in menus.parent.children'>
                <div :class="['list-group-item','parent', menus.id === sibling.id ? 'arrow' : '']" @click='fetchMenu(sibling.id)' style="cursor: pointer">{{sibling.name}}</div>
                <template v-if='sibling.id === menus.id && menus.children'>
                  <template  v-for="child in menus.children">
                    <a class="list-group-item" style="cursor: pointer;" @click='fetchMenu(child.id)'>{{child.name}}</a>
                  </template>
                </template>
              </template>
            </template>
          </div>

      </div>
    <div class = 'col-xs-7 col-md-8 tabl'  style="padding-left:0px;padding-right: 0px;">
        <div v-if='!menus.standards || menus.standards.length === 0 || standardsLoading' class="list-group">
            <a  class="list-group-item">
              <h5 class="list-group-item-heading"><span class="glyphicon glyphicon-sunglasses glyphicon"></span></h4>
              <p class="list-group-item-text">No Standards</p>
            </a>
        </div>
        <div v-else class="list-group">             
          <template v-for='std in sortedStandards'>
              <router-link class="list-group-item" :to="{name: 'standard', params: {standardId: std.id}}">
                <h5 class="list-group-item-heading">{{std.code}}</h5>
                <p class="list-group-item-text">{{std.description}}</p>
              </router-link>
          </template>
        </div>
      
    </div>
  </div>
  </transition>
</template>

<script>
import naturalSort from 'javascript-natural-sort'
import {getMenu} from 'src/api/menu'

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
  computed: {
    sortedStandards () {
      return this.menus.standards.sort((e1, e2) => naturalSort(e1.code, e2.code))
    }
  },
  methods: {
    menuStandards () {
      let standards = []
      if (standards.length > 0) {
        return standards.sort((el, el2) => naturalSort(el.code, el2.code))
      } else {
        return []
      }
    },
    fetchMenu (id = 1) {
      this.standardsLoading = true
      getMenu(id).then((response) => {
        this.menus = response.data
        this.standardsLoading = false
      }, (response) => {
        this.standardsLoading = false
        this.menus = []
      })
    }
  },
  mounted: function () {
    this.fetchMenu()
  }
}
</script>

<style scoped>
    .slide-enter-active, .slide-leave-active {
      transition: all .5s;
      -webkit-transition: all .5s;
    }
    .slide-enter, .slide-leave-active {
      transform: translateX(-100%);
      -ms-transform: translateX(-100%);
      -webkit-transform: translateX(-100%);
    }
    .breadcrumb {
      font-size: 11px;
    }
    .list-group-item {
      padding-top: 4px;
      padding-bottom: 4px;
    }
    .list-group-item-heading {
      margin-bottom: 0px;
    }
    .list-group-item-text {
      font-size: 11px;
    }
    .tabl {
      display: table-cell;
          vertical-align:top;
    }
    .child {
      background-color: #fff;

    }
    .parent, .parent:focus {
      padding-left: 5px;
      background-color: #333;
      border-color: #332;
      color: #bbb;
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
      z-index:10;
    }
    .arrow, .arrow:focus {
      background-color: #333;
      border-color: #332;
      color: #bbb;
      z-index:10;
    }
    .arrow:before {
      content: "";
      position: absolute;
      width: 0;
      height: 0;
      margin-top:1em;
      top: 1.8em;
      left: 99%;
      box-sizing: border-box;
      margin: auto;
      border: .5em solid black;
      border-color: transparent transparent #333 #333;
      transform-origin: 0 0;
      transform: rotate(-135deg);
    }
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
</style>