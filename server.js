const app = require('./src/app')


const PORT = process.env.PROD_APP_PORT
const server = app.listen(PORT,()=>{
    console.log(`Server khoi chay thanh cong o http://localhost:${PORT}`)
})