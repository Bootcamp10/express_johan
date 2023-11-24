const express = require("express");
const app =express();
const PORT =3000;
const users= [{'name':'alex'},{'name':'andres'},{'name':'elias'},{'name':'izquierdo'}]
app.get('/users', function(req,res){ //?name=valentina
    console.log(req.query);
    return res.send(users);
});


app.get('/', function(req,res){
    return res.send('Hello word!');
})

app.get('/users', function(req,res){
    return res.send(users);
})

app.get('/users/:id', function(req,res){
    const id=req.params.id
    return res.send(users[id]);
});
app.get('/users/:id?name', function(req,res){
    const id=req.params.id
    return res.send(users[id]);
});


app.listen(PORT,function(){
    console.log('The app is runing');
})