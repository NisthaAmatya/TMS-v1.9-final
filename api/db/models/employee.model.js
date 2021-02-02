const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({

    _Emp_Name: {
        type: String,
        required: true
    },

    _Emp_Addr: {
        type: String,
        required: true
    },

    _Emp_Phone: {
        type: String,
        required: true
    },

    _Emp_Email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique: true
    },

    password: {
        type: String,
        required: true,
        minlength: 8
    },

    _Skill_Name_1: {
        type: String,
        required: true
    },

    _Skill_Name_2: {
        type: String,
        required: false
    },

    _Skill_Name_3: {
        type: String,
        required: false
    },

    _Leave_StartDate: {
        type: Date,
        required: false
    },

    _Leave_EndDate: {
        type: Date,
        required: false
    },

})

const EmployeeSpace = mongoose.model('EmployeeSpace', employeeSchema);

module.exports = { EmployeeSpace };