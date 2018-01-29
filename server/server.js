const express = require('express')
const bodyParser = require('body-parser')
const utils = require('utility')
const models = require('./model')
const Chat = models.getModel('chat')
const cookieParser = require('cookie-parser')
const app = express()
//Work with express: Need to accordance the socket.io and http's interface
const server = require('http').Server(app)//First using http module emcorporate express server
const io = require('socket.io')(server)//then pass the above server to io object
//Above achieve bind the express with socket.io
io.on('connection',function(socket) {/*Socket is current connection request. io is global request.*/
	console.log('user login')
	socket.on('sendmsg', function(data) {
		// console.log(data)
		// io.emit('recvmsg',data)
		const {from, to, msg} = data
		const chatid = [from, to].sort().join('_')
		Chat.create({chatid, from, to, content:msg}, function(err, doc) {
			io.emit('recvmsg',Object.assign({},doc._doc))
		})
	})
})
const userRouter = require('./user')
app.use(cookieParser())
app.use(bodyParser.json())
app.use('/user',userRouter)//Enable middleware, anything relate to user prefix, child router is defined in
//user router.

server.listen(9093,function() {
	console.log('Node app start at port 9093')
})
