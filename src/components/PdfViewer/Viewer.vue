<template>
<!-- Standard PDF Viewer -->
  <div class='row' style="position: fixed; height: 100%; min-height: 95%; width: 100%; z-index: 9999">
    <canvas id="pdf-viewer" style="border:1px solid black;"/> 
  </div>
</template>

<script>
  import {withToken, apiGetStandardPdf} from 'src/api/config'
  import {addHistory} from 'src/api/standard'
  import Pdf from 'pdfjs-dist/build/pdf'
  export default {
    props: ['standard'],
    data () {
      return {
        close: false,
        pdf: {},
        pdfMeta: {
          retrieving: false
        }
      }
    },
    mounted () {
      // Load PDF and add to this.pdf
      var this.pdfMeta.retrieving = true 
      Pdf.getDocument(standardUrl).then((pdf) => {
        this.pdfMeta.retrieving = false
        this.pdf = pdf
        pdf.getPage(1).then((page) => {
          var scale = 1.5;
          var viewport = page.getViewport(scale);

          // Prepare canvas using PDF page dimensions.
          var canvas = document.getElementById('pdf-viewer');
          var context = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          // Render PDF page into canvas context.
          var renderContext = {
            canvasContext: context,
            viewport: viewport
          };
          page.render(renderContext);
        })
      })

      this.$watch('standard', () => {
        addHistory(this.standard).then().catch(e => console.log('Failed to add Histroy'))
          // TODO: HANDLE ERROR WHEN STANDARD IS NOT ADDED. IS THIS NEEDED?)
      })
    },
    computed: {
      standardUrl: function () {
        var standardUrl = withToken(apiGetStandardPdf(this.standard))

        return standardUrl
      }
    }
  }
</script>

<style scoped>
.close {
  margin-top: 50px;
  color: #fff;
  position: absolute;
  right: 10px;
  top: 10px;
  z-index: 10000;
}
.pdf-frame {
  position: absolute;
  right: 0;
  margin-top: 100px;
  width: 100%;
  height: 100%;
  z-index: 2;
  }
.row {
  top: 0px;
  left: 15px;
  right: 15px;
}
.dim {
  position: absolute;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
}

</style>
