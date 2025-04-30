import server from './server'
import colors from 'colors'

// Importing environment variables
const port = process.env.PORT || 4000

server.listen(port, () => {
    console.log( colors.cyan.bold (`Server started | Port: ${port}`) )
})