<template>
  <div class='container'>
    <div class='row'>
       <template v-if='admin'>
          <div class='close' v-if='!edit' @click='edit = true'><small><span class='glyphicon glyphicon-edit'></span></small></div>
          <div class='close' v-else @click='edit = false'><small><span class='glyphicon glyphicon-floppy-saved'></span></small></div>
        </template>
      <div id="editor" class='col-xs-12' v-if='edit'>
        <textarea v-model="input" class="form-control" rows="25"></textarea>
      </div>
      <div class="[edit ? 'col-xs-12' : 'col-xs-12']">
        <div v-html="htmlInput"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import marked from 'marked'
  export default {
    props: {
      admin: {
        default: false,
        type: Boolean
      }
    },
    data () {
      return {
        input: `
# Headers
# H1
## H2
### H3
#### H4
##### H5
###### H6
# Text Modifiers
Emphasis, aka italics, with *asterisks* or _underscores_.
Strong emphasis, aka bold, with **asterisks** or __underscores__.
Combined emphasis with **asterisks and _underscores_**.
Strikethrough uses two tildes. ~~Scratch this.~~
# Lists
1. First ordered list item
2. Another item
⋅⋅* Unordered sub-list.
1. Actual numbers don't matter, just that it's a number
⋅⋅1. Ordered sub-list
4. And another item.
⋅⋅⋅You can have properly indented paragraphs within list items. Notice the blank line above, and the leading spaces (at least one, but we'll use three here to also align the raw Markdown).
* Unordered list can use asterisks
- Or minuses
+ Or pluses
# Links
[I'm an inline-style link](https://www.google.com)
[I'm an inline-style link with title](https://www.google.com "Google's Homepage")
        `,
        edit: false
      }
    },
    computed: {
      htmlInput () {
        return marked(this.input)
      }
    }
  }
</script>

<style scoped>

textarea {
    border: none;
    border-right: 1px solid #ccc;
    resize: none;
    outline: none;
    background-color: #f6f6f6;
    font-size: 14px;
    font-family: 'Monaco', courier, monospace;
    padding: 20px;
}
.form-control {
  height: 100%;
}
.code {
    color: #f66;
}
.row {
  width: 100%;
}
  </style>