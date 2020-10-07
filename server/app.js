const app = require('express')()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

io.on('connection', socket => {
  socket.on('recordLoggedInUser', data => {
    io.emit('recordLoggedInUser', data);
  })

  // socket.on('recordLoggedOutUser', data => {
  //   io.emit('recordLoggedOutUser', data);
  // })

  socket.on('newOrderKitchen', data => {
    io.emit('newOrderKitchen', data)
  })

  socket.on('newOrderBarista', data => {
    io.emit('newOrderBarista', data)
  })

  socket.on('sendPickedTableToReady1', table_index => {
    socket.broadcast.emit('sendPickedTableToReady1', table_index)
  })

  socket.on('sendPickedTableToReady2', data=> {
    socket.broadcast.emit('sendPickedTableToReady2', data)
  })

  socket.on('additionalProductsSend', data => {
    socket.broadcast.emit('additionalProductsSend', data)
  })

  socket.on('additionalProductsSendDrinks', data => {
    socket.broadcast.emit('additionalProductsSendDrinks', data)
  })

  socket.on('additionalItem_to_barista_from_ready', data => {
    socket.broadcast.emit('additionalItem_to_barista_from_ready', data)
  })

  socket.on('additionalItem_to_kitchen_from_ready', data => {
    socket.broadcast.emit('additionalItem_to_kitchen_from_ready', data)
  })

  socket.on('sendAddedFoodToPick1', data => {
    socket.broadcast.emit('sendAddedFoodToPick1', data)
  })

  socket.on('sendAddedFoodToPick2', data => {
    socket.broadcast.emit('sendAddedFoodToPick2', data)
  })

  socket.on('removeClearedTable', table_index => {
    socket.broadcast.emit('removeClearedTable', table_index)
  })

  socket.on('sendToPicks', data => {
    socket.broadcast.emit('sendToPicks', data)
  })

  socket.on('removePickedTableKitchen', table_index => {
    socket.broadcast.emit('removePickedTableKitchen', table_index)
  })

  socket.on('removePickedTableBarista', table_index => {
    socket.broadcast.emit('removePickedTableBarista', table_index)
  })

  socket.on('sendReadyToSales', table_index => {
    socket.broadcast.emit('sendReadyToSales', table_index)
  })

  socket.on('sendReadyToSalesBill', table_index => {
    socket.broadcast.emit('sendReadyToSalesBill', table_index)
  })

  socket.on('removeTableFromReadies', table_index => {
    socket.broadcast.emit('removeTableFromReadies', table_index)
  })

  socket.on('AddItemsToKitchen', data => {
    socket.broadcast.emit('AddItemsToKitchen', data)
  })

  socket.on('AddItemsToBarista', data => {
    socket.broadcast.emit('AddItemsToBarista', data)
  })

  socket.on('removeAddPicksFromPicks', data => {
    socket.broadcast.emit('removeAddPicksFromPicks', data)
  })

  socket.on('newUserRequest', data => {
    socket.broadcast.emit('newUserRequest', data)
  })

})

module.exports = {
  app,
  server
}
