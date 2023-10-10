const mongoose = require('mongoose');
const dbUri = 'mongodb+srv://blog:bKHzi8lbx05Mhs6e@atlascluster.gltqzvp.mongodb.net/?retryWrites=true&w=majority';
module.exports = () => {
    return mongoose.connect(dbUri, {
        useNewUrlParser: true, useUnifiedTopology: true
    })
}