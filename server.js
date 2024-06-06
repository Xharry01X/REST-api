import express from "express"
const app=express()
const port=4000


// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://root:example@mongo:27017/mydatabase', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Could not connect to MongoDB', err);
});

// Sample route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port,()=>{
    console.log(`Server live at ${port}`)
}) 