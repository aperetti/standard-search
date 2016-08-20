var EventEmitter = require('events')
var bus = new EventEmitter()
bus.setMaxListeners(50)
bus.events = {
  alert: 'alert',
  pageReset: 'page-reset',
  projectCreated: 'project-created'
}
export default bus
