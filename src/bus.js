var EventEmitter = require('events')
var bus = new EventEmitter()
bus.setMaxListeners(50)
export default bus
