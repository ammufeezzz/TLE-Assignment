const express = require('express');
const userRoutes=require('./routes/userRoutes')
const contestRoutes=require('./routes/contestRoutes');
const problemRoutes=require('./routes/problemRoutes')
const {connecttomongodb} = require('./db');
const cors = require('cors');


connecttomongodb("mongodb://localhost:27017/tle").then(()=>{
    console.log('Connected to mongodb');
}).catch((err)=>{console.log(err)});


const app = express();
app.use(express.json());
app.use(cors());

const port=3000;


app.use('/users',userRoutes)
app.use('/contests',contestRoutes)
app.use('/problems',problemRoutes)


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});