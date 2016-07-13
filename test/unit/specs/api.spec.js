// import Vue from 'vue'
import {getStandardById, getStandardByFile, getStandardsByMenu} from 'src/api/standard.js'
import {getToken} from 'src/api/auth.js'
import creds from '../../apiCredentials.js'
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

describe('Connection', function () {
  before(function (done) {
    console.log(`Getting Token! with ${creds.username} using ${creds.password}`)
    getToken(creds.username, creds.password).then(function (response) {
      console.log('Success')
      window.localStorage.setItem('token', response.data.token)
      done()
    }, (e) => {
      console.log(e)
      console.log('Please check your username and password in ../apiCredentials.js')
    })
  })
  describe('getStandardById', () => {
    var standard = {}
    beforeEach(function (done) {
      console.log(window.localStorage.getItem('token'))
      var testApi = getStandardById(testStandard._id)
      testApi.then((result) => {
        console.log(result)
        standard = result.data
        done()
      }, (e) => {
        console.log(e)
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
      }, (e) => {
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
})
