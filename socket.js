let io; 

module.exports = {
    init : httpServer =>{
        const {Server} = require('socket.io')
        io = new Server(httpServer , {
            cors: {
                origin: ['http://localhost:3000', 'http://localhost:3001'],
                methods: ['GET', 'POST' , 'PUT'],
                credentials: true,
              }
        })
        return io
    },

    getIO : ()=>{
        if(!io){
            const error = new Error('Socket.io is not initialized!')
            throw error
        }
        return io
    }
}