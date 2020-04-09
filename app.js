const express = require('express')
const fileUpload = require('express-fileupload')

const app = express()
const port = 3000

var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/photos");

var photoSchema = new mongoose.Schema({
    description: String,
    name: String
}, { collection: 'photoinfo' });
  
var IndividualPhoto = mongoose.model("PhotoModel", photoSchema);

app.use(fileUpload())
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/', (req, res) => {
    res.json("server is running");
}) 

app.get('/form', (req, res) => {
    res.sendFile(__dirname + '/form.html')
})

app.post('/upload', (req, res) => {
    console.log(req.body.description)
    if(!req.body.description || !req.files){
        res.send('Missing mandatory fields');
    }
    
    console.log(req.files)
    var inputFile = req.files.photo
    var fileName = inputFile.name
    console.log(inputFile + '-' + fileName)
    inputFile.mv('./uploads/' + fileName, function(err) {
        if(err){
            res.send('Error in moving file. Retry. Error : ' + err)
            return
        } else {
            console.log('File uploaded in to folder')
        }
    })

    var myPhoto = new IndividualPhoto({
        description : req.body.description,
        name : fileName
    });

    myPhoto.save().then(item => {
        res.send(JSON.stringify(item));
    }).catch(err => {
        res.status(400).send("unable to save to database");
    })
    
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

