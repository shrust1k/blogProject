const express = require('express')
const app = express()
const fs = require('fs');
const { consumers } = require('stream');

const PORT = 3000;

app.use(express.json({limit: '1mb'})); //to make server be available to listen json type data

app.get('/', (req, res) => {
    res.sendFile('./index.html', { root: __dirname})
})

app.get('/render-posts', (req, res) => {
    fs.readFile("./posts.json",  { root: __dirname}, (err, data) => {
        if (err) throw err;
        let parsed = JSON.parse(data)
        res.json(parsed)
    })
})

app.post('/create-post', (req, res) => {
    console.log(req.body)
})

app.post('/add-post', (req, res) => {
    let title = req.body[0][1];
    let text = req.body[1][1];
    let author = req.body[2][1];


    fs.readFile('./posts.json', { root: __dirname}, (err, data) => {
        if (err) throw err;
        let postsString = data.toString();
        
        let postsObj = JSON.parse(postsString);
        postsObj.push({
            title, 
            text,
            author, 
    })


        fs.writeFile('./posts.json', JSON.stringify(postsObj, null, 2), (err) => {
            if (err) throw err;
        })

        })
})

app.post('/delete-post', (req, res) => {
    const postsIdThatWIllBeDeleted = req.body.postsIdThatWIllBeDeleted
    
    fs.readFile('./posts.json', { root: __dirname}, (err, data) => {
        if (err) throw err;
        let postsString = data.toString();
        
        let postsObj = JSON.parse(postsString);
        let newPostObj = [];

        let index = 0;
        for (post of postsObj) {
            if (index == postsIdThatWIllBeDeleted){
                
            } else {
                newPostObj.push(post)
            }
            index++;
        }
        console.log(newPostObj)
        fs.writeFile('./posts.json', JSON.stringify(newPostObj, null, 2), (err) => {
            if (err) throw err;
            res.send('Post deleted successfully');
        })
    })
}) 

app.listen(PORT)
