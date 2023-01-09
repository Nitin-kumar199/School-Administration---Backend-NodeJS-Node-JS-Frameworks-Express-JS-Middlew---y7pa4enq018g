const express = require("express");
const app = express()
const bodyParser = require("body-parser");
const studentArray = require("./InitialData");
const port = 8080 ;
let currentId = studentArray.length;
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// your code goes here

app.get("/api/student", (req, res)=>{
    res.json(studentArray);
});

app.get("/api/student/:id", (req, res)=>{
    let id=req.params.id;
    if(isNaN(id)){
        res.sendStatus(400);
    }else{
        id = parseInt(id);
        let data = studentArray.find((e)=>{return (e.id === id)})
        if(data === undefined || data === {}){
            res.sendStatus(404);
        }else{
            res.json(data);
        }

    }
});

app.post("/api/student", (req, res)=>{
    let reqKeys = Object.keys(req.body);
    if(reqKeys.find((e)=>{return e === "name";}) && reqKeys.find((e)=>{return e === "currentClass";}) && reqKeys.find((e)=>{return e === "division";})){
        if(!isNaN(req.body.currentClass)){
            let name =req.body.name;
            let currentClass = req.body.currentClass;
            let division = req.body.division;
            currentId++;
            studentArray.push({
                id: currentId,
                name: name,
                currentClass: parseInt(currentClass),
                division: division,
            });
            res.json({ id: currentId });
        }else{
            res.sendStatus(400);
        }
    }else{
        res.sendStatus(400);
    }
});

app.put("/api/student/:id", (req, res) =>{
    let id = req.params.id;
    if(isNaN(id)){
        res.sendStatus(400);
    }else{
        id = parseInt(id);
        let updatedBody = req.body;
        let oldData = studentArray.find((e)=>{ return e.id === id});
        if(oldData === undefined){
            res.sendStatus(400);
        }else{
            // add all the updates here.
            if(Object.keys(updatedBody).find((e)=>{return e === "currentClass"})){
                if(!isNaN(updatedBody.currentClass)){
                    updatedBody.currentClass = parseInt(updatedBody.currentClass);
                }else{
                    res.sendStatus(400);
                }
            }
            let newData = { ...oldData, ...updatedBody};
            let index = studentArray.indexOf(oldData);
            studentArray.splice(index, 1);
            studentArray.push(newData);
            res.sendStatus(200);

        }

    }
});

app.delete("/api/student/:id", (req, res)=>{
    let id = req.params.id
    if(isNaN(id)){
        res.sendStatus(400);
    }else{
        id = parseInt(id);
        let data = studentArray.find((e)=>{return (e.id === id)})
        if(data === undefined || data === {}){
            res.sendStatus(404);
        }else{
            const index = studentArray.indexOf(data);
            studentArray.splice(index,1);
            res.sendStatus(200);
        }
    }
})

app.listen(port, () => console.log(`App listening on port ${port}!`))

module.exports = app;   
