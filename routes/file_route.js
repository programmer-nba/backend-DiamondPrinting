const route = require('express').Router()

// controllers
const File = require('../controllers/upload_controller.js')

// middlewares
const verifyToken = require('../middlewares/verifyToken.js')
const {upload, uploadFiles} = require('../middlewares/uploadFiles.js')

route.post('/upload',verifyToken, upload.any(), uploadFiles, File.fileUpload)
route.get('/all', File.getFiles)
route.get('/:id', File.getFile)
route.get('/pre-order/:id', File.getFilesOfPreOrder)
route.delete('/:id',verifyToken, File.deleteFile)

module.exports = route