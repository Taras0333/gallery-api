const spinUpServer = async ({ server, port, connectDB }) => {
  try {
    await connectDB(process.env.MONGO_URI)
    console.log('db is connected')
    server.listen(port, () => {
      console.log(`The server is listening to port: ${port}`)
    })
  } catch (error) {
    console.log(error)
  }
}

module.exports = spinUpServer
