//File to handle connection logic to MongoDB.

const mongoose = require('mongoose');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

mongoose.Promise = global.Promise;
const locationConnectionString="mongodb://localhost:27017/TaskManager?replicaSet=r2TMS";
const cloudDBConnectionString = "mongodb+srv://ajeet-chaulagain:ajeet@cluster0.jwzvt.mongodb.net/TaskManager?replicaSet=r2TMS"

mongoose.connect(cloudDBConnectionString, {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true }).then(() => {
    console.log("Successfully connected to MongoDB.");
}).catch((e) => {
    console.log("Error encountered while trying to connect to MongoDB.");
    console.log(e);
});

//Prevent deprecation warnings from MongoDB native driver.
//mongoose.set('userCreateIndex', true);
//mongoose.set('userFindAndModify', false);

module.exports = {
    mongoose
};