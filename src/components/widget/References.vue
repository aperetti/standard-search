<template>
  <div>
    <div v-if='regexes.length !== 0'>
      <div v-for='regex in regexes'>
        <div v-if='regex.edit' class='input group'>
          <input v-model='regex.group'></input>
          <input v-model='regex.regex'></intut>
          <button>Save</button>
        </div>
      </div>
    </div>
    <div class='group input'>
      <input v-model='newRegex.group'></input>
      <input v-model='newRegex.regex'></input>
      <input v-model='newRegex.modifiers'></input>
      <button @click='saveReferences'>Save</button>
    </div>
  </div>
</template>

<script>
  import {getReference, addReference} from 'src/api/admin'
  export default {
    data () {
      return {
        regexes: [],
        loading: false,
        newRegex: {group: '', regex: '', modifiers: ''}
      }
    },
    mounted () {
      this.refreshReferences()
    },
    methods: {
      refreshReferences () {
        var self = this
        getReference().then((res) => {
          if (res.data && res.data.length !== 0) {
            var regexes = res.data
            console.log(regexes)
            for (var i in regexes) {
              regexes[i].edit = false
            }
            self.regexes = regexes
          } else {
            self.regexes = []
          }
        }, (e) => {
          self.regexes = []
        })
      },
      saveReferences () {
        var newRegex = this.newRegex
        var refresh = this.refreshReferences
        if (newRegex.group.length !== 0 && newRegex.regex.length !== 0) {
          addReference([newRegex]).then(() => {
            refresh()
          }, () => {
            // TODO: Error Toast
          })
        } else {
          // TODO: Error Toast
        }
      }
    }
  }

</script>