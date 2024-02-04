import { useState, useEffect } from "react"

const API_BASE = "http://localhost:3001"

function App() {
  const [todos, setTodos] = useState([])
  const [popupActivate, setPopupactivate] = useState(false)
  const [newTodo, setNewTodo] = useState("")

  useEffect(() => {
    GetTodos()
  })

  const GetTodos = () => {
    fetch(API_BASE + "/todos")
      .then(res => res.json())
      .then(data => setTodos(data))
      .catch(err => console.error("Error: ", err))
  }

  const deleteTodo = async id => {
    const data = await fetch(API_BASE + "/todo/delete/" + id, 
    {method: "DELETE"})
      .then(res => res.json())

    setTodos(todos => todos.filter(todo => todo._id !== data._id))
  }

  const addTodo = async() => {
    const data = await fetch(API_BASE + "/todo/create", {
      method: "POST",
      headers: {
        "content-type":"application/json"
      },
      body: JSON.stringify({
        text: newTodo
      })
    }).then(res => res.json())

    setTodos([...todos, data])
    setPopupactivate(false)
    setNewTodo("")
  }

  const closePopup = () => {
    setPopupactivate(false) 
    setNewTodo("")
  }

  const completeTodo = async id => {
    const data = await fetch(API_BASE + "/todo/complete/" + id)
      .then(res => res.json())

    setTodos(todos => todos.map(todo => {
      if(todo._id === data._id) {
        todo.complete = data.complete
      } 
      return todo
    }))
  }

  return (
    <div className="App">
      <h1>Bem vindo</h1>
      <h4>Suas Tarefas</h4>
      <div className="todos">

        {todos.map(todo => (
          <div className={"todo " + (todo.complete ? "is-complete" : "")} 
          key={todo._id} onClick={() => completeTodo(todo._id)}>
            <div className="checkbox"></div>

            <div className="text">{todo.text}</div>

            <div className="delete" onClick={() => deleteTodo(todo._id)}>x</div>
          </div>
        ))}

      </div>

      <div className="addPopup" onClick={() => setPopupactivate(true)}>+</div>

      {popupActivate ? (
        <div className="popup">
          <div className="closePopup" 
          onClick={closePopup}>
            x
          </div>
          <div className="content">
            <h3>Crie uma tarefa</h3>
            <input type="text" className="add-todo" 
            value={newTodo}
            onChange={e => setNewTodo(e.target.value)}/>
          </div>
          <div className="button" onClick={addTodo}>Criar</div>
        </div>
      ): ''}
    </div>
  );
}

export default App;
