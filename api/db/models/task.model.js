const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({

    _workspaceId: {
        type: mongoose.Types.ObjectId,
        required: true
    },

    _projectId: {
        type: mongoose.Types.ObjectId,
        required: true
    },

    _Task_Name: {
        type: String,
        required: true
    },

    _Task_Desc: {
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

    _Priority:{
        type: String,
        required: true
    },

    _Attach_File:{
        type: Object,
        required: false
    },

    _Comments:{
        type: String,
        require: false
       
    }, 

    _Status:{

        type: String,
        required: true
    },

    _pmId: {
        type: mongoose.Types.ObjectId,
        required: true
    },

    _supervisorId: {
        type: mongoose.Types.ObjectId,
        required: true
    },

    _empId: {
        type: mongoose.Types.ObjectId,
        required: false
    }
   
   

})

const TaskSpace = mongoose.model('TaskSpace', taskSchema);

module.exports = { TaskSpace };