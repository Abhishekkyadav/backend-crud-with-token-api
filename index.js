const express = require('express');
const connectDb = require('./db.js')
const app = express();

const bodyParser = require('body-parser');
const employeeRoutes = require('./controllers/employee.controller.js');
const employeeRoutesDetais = require('./controllers/employee.details.js');
const { errorHandler } = require('./middlewares/index.js');
app.use(bodyParser.json());


// ADD THIS
var cors = require('cors');
app.use(cors());
app.use('/api/employee', employeeRoutes);
app.use('/api/EmployeeDetails', employeeRoutesDetais);
app.use(errorHandler);
connectDb().then(() => {
    console.log("db connected");
    app.listen(3000, () => console.log("test is yes"))
}
).catch((error) => {

})




