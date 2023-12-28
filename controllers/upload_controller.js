const File = require('../models/files/file_model.js')

exports.fileUpload = async (req, res) => {
    try {
        const uploadedFile = req.file;
        // Generate download URL
        const downloadUrl = `${req.protocol}://${req.get('host')}/uploads/${uploadedFile.filename}`;
        res.status(200).json({ downloadUrl });
    }
    catch(err) {
        res.send({
            message: 'อัพโหลดไฟล์ผิดพลาด',
            err: err.message
        })
        console.log(err)
    }
}