// import Vue from 'vue'
import {getStandardById, getStandardByFile, getStandardsByMenu, addHistory} from 'src/api/standard.js'
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

var testStandard2 = {_id: '5784702ecd8f4c92123fdd06'}

describe('Connecting and Saving Token...', function () {
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
    it(`Get Standard Standard ID ${testStandard._id}`, (done) => {
      getStandardById(testStandard._id).then((res) => {
        expect(res.data._id).to.equal(testStandard._id)
        expect(res.status).to.equal(200)
        done()
      }).catch(done)
    })
  })

  describe('getStandardById', () => {
    it('Using random string for id returns undefined', (done) => {
      getStandardById('random_string').then((result) => {
        expect(result.data).to.equal(null)
        expect(result.data).to.be.a('object')
        expect(result.status).to.equal(400)
        done()
      }).catch(result => {
        expect(result.data).to.equal(null)
        expect(result.status).to.equal(400)
        done()
      })
    })
  })

  describe('getStandardByFile', () => {
    it(`Using test Standard ${testStandard._id}`, (done) => {
      getStandardByFile(testStandard.file).then((result) => {
        expect(result.data).to.be.an('object')
        expect(result.data._id).to.equal(testStandard._id)
        done()
      })
    })
  })

  describe('getStandardByFile', () => {
    it('Using random string for file returns undefined', (done) => {
      getStandardByFile('fake_file.pdf').then((result) => {
        done()
      }).catch(result => {
        expect(result.data).to.equal(null)
        expect(result.status).to.equal(400)
        done()
      })
    })
  })

  describe('getStandardsByMenu', () => {
    it('Using test Standard Menu', (done) => {
      getStandardsByMenu(testStandard.menu).then((result) => {
        expect(result.data).to.be.a('array')
        expect(result.data.length).to.be.above(0)
        done()
      }).catch((e) => {
        done(new Error(e.status))
      })
    })
  })

  describe('getStandardsByMenu', () => {
    it('Using random string for menu returns undefined', (done) => {
      getStandardsByMenu('fake_file.pdf').then((result) => {
        throw new Error(`Received successful API Code: ${result.status}`)
      }).catch((e) => {
        if (e && Error === e.constructor) {
          done(e)
        }
        expect(e.data).to.be.a('string')
        expect(e.status).to.equal(400)
        done()
      })
    })
  })

  describe('addHistory', () => {
    it('Add Valid Standard to User History', (done) => {
      addHistory(testStandard._id).then((result) => {
        expect(result.data).to.be.a('array')
        expect(result.data[0]).to.equal(testStandard._id)
        done()
      }).catch((e) => {
        done(new Error(e.status + '-' + e.data))
      })
    })
  })

  describe('addHistory', () => {
    it('Improper Standard ID', (done) => {
      addHistory('1251').then((result) => {
        throw new Error(`Received successful API Code: ${result.status}`)
      }).catch((e) => {
        expect(e.data).to.be.a('string')
        expect(e.status).to.equal(400)
        done()
      })
    })
  })

  describe('addHistory', () => {
    it(`Testing multiple History Entries ${testStandard._id} and ${testStandard2._id}`, (done) => {
      addHistory(testStandard._id).then((result) => {
        addHistory(testStandard2._id).then((result2) => {
          expect(result.data[0]).to.equal(testStandard._id)
          expect(result2.data[0]).to.equal(testStandard2._id)
          expect(result2.data[1]).to.equal(testStandard._id)
          done()
        })
      }).catch((e) => {
        throw new Error(e.status + '-' + e.data)
      })
    })
  })

  // describe('getVersions', () => {
  //   it('Testing retrieval of Changes of ${testStandard._id}')
  // })
})
