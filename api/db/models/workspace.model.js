const mongoose = require('mongoose');

const workspaceSchema = new mongoose.Schema({

    _Work_Desc: {
        type: String,
        required: true,
    },
    
    _Work_Name: {
        type: String,
        required: true,
    },

   // _userId: {
   //type: mongoose.Types.ObjectId,
   //required: true
   // },
    _supervisorId : {
        type: mongoose.Types.ObjectId,
        required: true
    }

})

const WorkSpace = mongoose.model('WorkSpace', workspaceSchema);

module.exports = { WorkSpace };