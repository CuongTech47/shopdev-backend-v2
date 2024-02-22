'use strict'

const multer = require('multer')


const uploadMemory = multer({
    storage:multer.memoryStorage(),
})


const uploadDisk = multer({
    storage: multer.diskStorage({
        destination:(req,file,cb) => {
            cb(null,'./src/uploads/')
        },
        filename:(req,file,cb) => {
            const uniqueSuffix = Date.now() + "-" + Math.round.apply(Math.random() * 1e9)
            const filename = file.originalname.split('.')[0]
            cb(null,`${filename}-${uniqueSuffix}.png`)
        }
    })
})

module.exports = {
    uploadMemory,
    uploadDisk
}