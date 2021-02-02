const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({

    _workspaceId: {
        type: mongoose.Types.ObjectId,
        required: true
    },

    _Proj_Name: {
        type: String,
        required: true
    },

    _Proj_Desc: {
        type: String
    },
    
    _Start_Date: {
        type: Date,
        required: true
    },
    
    _End_Date:{
        type: Date,
        required: true

    },

    _Comments: {
        type: String,
        required: false
    },
    
    _pmId: {
        type: mongoose.Types.ObjectId,
        required: true
    },

    _supervisorId: {
        type: mongoose.Types.ObjectId,
        required: true
    }
   

})

const ProjSpace = mongoose.model('ProjSpace', projectSchema);

module.exports = { ProjSpace };