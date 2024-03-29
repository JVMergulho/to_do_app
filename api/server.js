const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

// import data model
const Todo = require('./models/Todo')

const app = express()

app.use(express.json())
app.use(cors())

mongoose.connect("mongodb://localhost:27017/to-do-app")
    .then(() => console.log("Conected to db"))
    .catch(console.error)

app.listen(3001, () => console.log("Server started on port 3001"))

app.get('/todos', async (req, res) => {
    const todos = await Todo.find()

    res.json(todos)
})

app.post('/todo/create', (req, res) => {
    const todo = new Todo({
        text: req.body.text
    })

    todo.save()
    res.json(todo)
})

app.get('/todo/complete/:id', async (req, res) => {
    const todo = await Todo.findById(req.params.id)

    todo.complete = !todo.complete

    todo.save()
    res.json(todo)
})

app.delete('/todo/delete/:id', async (req, res) => {
    const result = await Todo.findByIdAndDelete(req.params.id)

    res.json(result)
})