const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({

    _Skill_Desc: {
        type: String,
        required: true,
    },
    
    _Skill_Name: {
        type: String,
        required: true,
        unique: true,
        dropDups: true
    }

})

const SkillSpace = mongoose.model('SkillSpace', skillSchema);

module.exports = { SkillSpace };