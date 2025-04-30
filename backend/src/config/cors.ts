import { CorsOptions } from 'cors'

export const corsConfig : CorsOptions = {
    origin: function(origin, callback) {
        const whiteList = [process.env.FRONTEND_URL]

        // Allow requests with no origin
        if(process.argv[2] === '--api') {
            whiteList.push(undefined)
        }
        
        // Allow requests from localhost in development
        if(whiteList.includes(origin)) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}