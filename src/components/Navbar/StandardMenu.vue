<template>
  <transition name="slide">
  <div id='standard-menu' class=" navbar navbar-default" v-show="enable">
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
              <div v-if="menus.parent" :class="['list-group-item','parent']" @click='fetchMenu(menus.parent.id)'>{{menus.parent.name}}<span class="glyphicon glyphicon-arrow-up pull-right" style='position: absolute; right: 5px; top: 5px;'/></div>
            <!-- Display for Root -->
             <div v-if="!menus.parent">
              <div :class="['list-group-item', 'parent']" style="cursor: pointer">{{menus.name}}</div>
              <template v-for='child in menus.children'>
                <a class="list-group-item child" style="cursor: pointer;" @click='fetchMenu(child.id)'>{{child.name}}</a>
              </template>
            </div>
            <!-- Display Else -->
            <div v-if="menus.parent" style='overflow:hidden;'>
              <template v-for='sibling in menus.parent.children'>
                <div v-if="menus.id === sibling.id" :class="['list-group-item', menus.id === sibling.id ? 'arrow' : '']">{{sibling.name}}</div>
                <div v-else :class="['list-group-item','sibling', menus.id === sibling.id ? 'arrow' : '']" @click='fetchMenu(sibling.id)' style="cursor: pointer">{{sibling.name}}</div>
                <transition v-on:leave='shrinkLeave' name="shrink">
                <div v-if='sibling.id === menus.id && menus.children' style='overflow: hidden;'>
                  <template  v-for="child in menus.children" >
                    <a class="list-group-item"  v-bind:key="child" v-if='sibling.id === menus.id && menus.children' style="cursor: pointer;" @click='fetchMenu(child.id)'>{{child.name}}</a>
                  </template>
                <div>
                </transition>
              </template>
            </div>
          </div>

      </div>
    <div class = 'col-xs-7 col-md-8 tabl'  style="padding-left:0px;padding-right: 0px;">
    <transition name="fast">
      <div v-if='!(!menus.standards || menus.standards.length === 0 || standardsLoading)' style="overflow: hidden;" class="list-group">             
        <template v-for='std in sortedStandards'>
          <router-link class="list-group-item" :to="{name: 'standard', params: {standardId: std.id}}">
            <h5 class="list-group-item-heading">{{std.code}}</h5>
            <p class="list-group-item-text">{{std.description}}</p>
          </router-link>
        </template>
      </div>
    </transition>
    </div>
  </div>
  </transition>
</template>

<script>
import naturalSort from 'javascript-natural-sort'
import {getMenu} from 'src/api/menu'
import Velocity from 'velocity-animate'

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
    shrinkLeave (el, done) {
      Velocity(el, { height: 0 }, {complete: done})
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
   .shrink-enter-to {
      transition: all 1.5s;
      -webkit-transition: all 1.5s;
      max-height: 100em;
   }
    .shrink-enter {
      max-height: 0;
    }
    .fast-enter-active, .shrinkfast-leave  {
      transition: all .5s;
      -webkit-transition: all .5s;
      max-height: 100em;
   }
    .fast-enter{
      opacity: 0;
      max-height: 0;
    }
    .breadcrumb {
      font-size: 11px;
    }
    .list-group-item {
      max-height: 5em;
      padding-top: 4px;
      padding-bottom: 4px;
      border-top-left-radius: 0px;
      border-top-right-radius: 0px;
    }
    .list-group-item-heading {
      margin-bottom: 0px;
    }
    .list-group-item-text {
      font-size: 11px;
    }
    .table {
      display: table-cell;
          vertical-align:top;
    }
    .child {
      background-color: #fff;

    }
    .sibling, .sibling:focus {
      cursor: pointer;
      padding-left: 5px;
      background-color: #333;
      border-color: #332;
      color: #bbb;
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
      z-index:11;
    }
    .sibling:hover {
      background-color: #353535;
    }
    .parent, .parent:focus {
      cursor: pointer;
      padding-left: 5px;
      background-color: #222;
      border-color: #222;
      color: #bbb;
      box-shadow: 0 3px 3px 0 rgba(0, 0, 0, 0.2), 0 19px 20px 0 rgba(0, 0, 0, 0.19);
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
      z-index:12;
    }
    .parent:hover {
      background-color: #252525
    }
    .arrow, .arrow:focus {
      background-color: #5f5f5f;
      cursor: default;
      border-color: #5f5f5f;
      color: #bbb;
      z-index:10;
      padding-left: 5px;
    }
    #standard-menu { 
      min-height: 300px;
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
      border-color: transparent transparent #5f5f5f #5f5f5f;
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