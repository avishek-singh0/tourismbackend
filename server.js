const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');


dotenv.config({ path: './config.env' });
// console.log(process.env)

const DB = process.env.DATABASE
// .replace(
//     '<password>',
//     process.env.DATABASE_PASSWORD
// );

mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    
}).then(() => {
    // console.log(con.connection);
    console.log('DB connection succesfully')
})




const PORT =  process.env.PORT || 3001;
app.listen(PORT, () =>
    console.log(`Server is running in PORT ${PORT}`));