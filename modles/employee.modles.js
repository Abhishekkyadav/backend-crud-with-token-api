const mongoose = require('mongoose');
const Employee = mongoose.model('Employee', {
    userId: { type: String },

    firstName: { type: String },
    lastName: { type: String },
    email: { type: String },
    password: { type: String },
})
const EmployeeDetails = mongoose.model('EmployeeDetails', {
    userId: { type: Number },
    address: { type: String },
    city: { type: String },
    distric: { type: String }
})
module.exports = {
    Employee, EmployeeDetails
}