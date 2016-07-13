// import Vue from 'vue'
import {getStandardById, getStandardByFile, getStandardsByMenu} from 'src/api/standard.js'

// describe('Hello.vue', () => {
//   it('should render correct contents', () => {
//     const vm = new Vue({
//       template: '<div><hello></hello></div>',
//       components: { Hello }
//     }).$mount()
//     expect(vm.$el.querySelector('.hello h1').textContent).to.contain('Hello World!')
//   })
// })

var testStandard = {
  _id: '576859209d46a0342545c4ae',
  path: 'Assembly|Overhead',
  code: '12F401',
  desc: '3Ø Double Circuit Ten Foot Arm',
  file: '12f400.pdf',
  status: 'ACTIVE',
  references: [ 'I0103', 'I0305', 'X0402' ],
  menu: [ 'Assembly', 'Overhead' ],
  __v: 0 }

describe('getStandardById', () => {
  var standard = {}
  beforeEach(function (done) {
    var testApi = getStandardById(testStandard._id)
    testApi.then((result) => {
      standard = result.code
      done()
    }, (response) => {
      done()
    })
  })
  it(`Using test Standard ${testStandard._id}`, () => {
    expect(standard._id).to.equal(testStandard._id)
  })
})

describe('getStandardById', () => {
  it('Using random string for id returns undefined', () => {
    var testApi = getStandardById('random_string')
    testApi.then((result) => {
      expect(result.data._id).to.equal(undefined)
    })
  })
})

describe('getStandardByFile', () => {
  it(`Using test Standard ${testStandard._id}`, () => {
    var testApi = getStandardByFile(testStandard.file)
    testApi.then((result) => {
      expect(result.data._id).to.equal(testStandard._id)
    })
  })
})

describe('getStandardByFile', () => {
  it('Using random string for file returns undefined', () => {
    var testApi = getStandardByFile('fake_file.pdf')
    testApi.then((result) => {
      expect(result.data._id).to.equal(undefined)
    })
  })
})

describe('getStandardsByMenu', () => {
  it('Using test Standard Menu', () => {
    var testApi = getStandardsByMenu(testStandard.menu)
    testApi.then((result) => {
      return expect(result.data).to.equal(1)
    }, (err) => {
      return expect(false).to.equal(true)
    })
  })
})

describe('getStandardsByMenu', () => {
  it('Using random string for menu returns undefined', () => {
    var testApi = getStandardsByMenu('fake_file.pdf')
    testApi.then((result) => {
      expect(result.data._id).to.equal(undefined)
    })
  })
})
