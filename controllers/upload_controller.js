const File = require('../models/files/file_model.js')

exports.fileUpload = async (req, res) => {
    try {
        const userId = req.user.id
        const userRole = req.user.role
        const userCode = req.user.code
        const userName = req.user.name || 'anonymus'
        const files = req.dataIds

        if(!files || files.length===0) {
            return res.send({
                message: 'ไม่พบไฟล์ที่แนบมา',
                files: files || []
            })
        }
        const new_files = files.map(async file => {
            const prev_file = await File.find()
            const new_file = await File.create({
                code: `${userCode}-${prev_file.length}`,
                sender: {
                    _id: userId,
                    name: `${userName.first} ${userName.last}`,
                    role: userRole.main,
                    code: userCode
                },
                preOrderId: file.preOrderId,
                fileName: file.fileName,
                fileId: file.fileId,
                fileType: file.fileType
            })
            if(!new_file) {
                return res.send({
                    message: 'ไม่สามารถสร้างไฟล์ใน database',
                    new_file: new_file
                })
            }
            return new_file
        })
        const saved_files = await Promise.all(new_files)
        if (!saved_files) {
            return res.send({
                message: 'ไม่สามารถบันทึกไฟล์ลงใน database'
            })
        }
        
        return res.status(200).send({
            message: 'บันทึกไฟล์สำเร็จ !!!',
            success: true,
            files: saved_files
        });
    }
    catch(err) {
        return res.send({
            message: 'อัพโหลดไฟล์ผิดพลาด',
            err: err.message
        })
    }
}

exports.getFiles = async (req, res) => {
    try {
        const files = await File.find()
        if(!files || files.length===0) {
            return res.send({
                message: 'ไม่พบไฟล์ในระบบ',
                files: files || []
            })
        }

        return res.send({
            message: `มีไฟล์ทั้งหมด = ${files.length}`,
            success: true,
            files: files
        })
    }
    catch(err) {
        return res.send({
            message: 'ERROR',
            err: err.message
        })
    }
}

exports.getFile = async (req, res) => {
    const { id } = req.params
    try {
        const file = await File.findById(id)
        if(!file) {
            return res.send({
                message: 'ไม่พบไฟล์ในระบบ',
                files: file
            })
        }

        return res.send({
            success: true,
            file: file
        })
    }
    catch(err) {
        return res.send({
            message: 'ERROR',
            err: err.message
        })
    }
}

exports.getFilesOfPreOrder = async (req, res) => {
    const { id } = req.params
    try {
        const files = await File.find({
            preOrderId: id
        })
        if(!files || files.length===0) {
            return res.send({
                message: 'preOrderId นี้ ไม่พบไฟล์ในระบบ',
                files: files || []
            })
        }

        return res.send({
            success: true,
            files: files
        })
    }
    catch(err) {
        return res.send({
            message: 'ERROR',
            err: err.message
        })
    }
}

exports.deleteFile = async (req, res) => {
    const { id } = req.params
    try {
        const delete_file = await File.findOneAndDelete({_id:id})
        if (!delete_file) {
            return res.status(404).json({
                message: "not found",
                success: false,
                files: null
            })
        }

        return res.status(200).json({
            message: "founded",
            success: true,
            files: null
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            message: "error !",
            success: false,
            files: null
        })
    }
}