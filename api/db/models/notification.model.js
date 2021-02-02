const mongoose = require('mongoose');

const notifSchema = new mongoose.Schema({

    _pmId: {
        type: mongoose.Types.ObjectId,
        required: false
    },

    _supervisorId: {
        type: mongoose.Types.ObjectId,
        required: false
    },

    _empId: {
        type: mongoose.Types.ObjectId,
        required: false
    },

    _workspaceId: {
        type: mongoose.Types.ObjectId,
        required: false
    },

    _projectId: {
        type: mongoose.Types.ObjectId,
        required: false
    },

    _taskId: {
        type: mongoose.Types.ObjectId,
        required: false
    },

    _message: {
        type: String,
        required: true
    }

})

const NotifSpace = mongoose.model('NotifSpace', notifSchema);

module.exports = { NotifSpace };