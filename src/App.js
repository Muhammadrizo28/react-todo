import { useEffect, useState } from 'react';
import style from '../src/style.module.css'

function App() {

  const [formBull, setFormBull] = useState(null)

  const [data, setData] = useState([])

  const [title, setTitle] = useState('')

  const [description, setDescription] = useState('')


  useEffect(() => {

    let getData = async () => {

      let res = await fetch('http://localhost:8080/todos')

      let result = await res.json()

      setData(result)

    }

    getData()

  }, [])


  async function sendData() {

    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0'); 
    const year = String(now.getFullYear()).slice(-2); 
    const formattedDate = `${day}.${month}.${year}`;

    let newTodo = {

      title : title,
      description : description,
      id : Date.now().toString(),
      date : formattedDate,
      done : false

    }

    let res = await fetch('http://localhost:8080/todos', {

      method : "POST",
      headers : {

        "content-type" : "application/json"
      },
      body : JSON.stringify(newTodo)
    })

    if (res.ok) {

      setData((prevData) =>
      [...prevData, newTodo]
      );

      setDescription('')
      setTitle('')
    }

    
  }



  async function changeData(value, id, field) {

    let newTodo = {

      [field] : value
    }

    let res = await fetch(`http://localhost:8080/todos/${id}`, {

      method : 'PATCH',
      headers : {

        'Content-type' : 'application/json'
      },
      body : JSON.stringify(newTodo)

    })

    if (res.ok) {

      setData((prevData) =>
        prevData.map((item) =>
          item.id === id ? { ...item, [field]: value } : item
        )
      );
    }
    
  }

  async function deleteTodo(todoId) {
    let res = await fetch(`http://localhost:8080/todos/${todoId}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      setData((prevData) =>
        prevData.filter((item) => item.id !== todoId)
      );
    }
  }

  

  return (

    <div className={style.container}>

      <button className={style.formButton_add} onClick={() => {setFormBull(formBull === null ? true : !formBull)}}><div className={formBull === true ? style.plus_X : style.plus_X2}></div></button>

      <form className={formBull ? style.showForm : formBull === false ? style.hideForm : style.nothingForm} onSubmit={(e) => {sendData(); e.preventDefault()}}>

        <input type='text' className={style.formInput} value={title}       onChange={(e) => {setTitle(e.target.value)}}></input>
        <input type='text' className={style.formInput} value={description} onChange={(e) => {setDescription(e.target.value)}}></input>
        <button className={style.formButton}>Add</button>

      </form>

      <div className={style.mainBlock}>

        {data.map((item) => (

          <div key={item.id} className={style.todo}>

            <div className={item.done ? style.todoBoxDone : style.todoBox}>

              <input type='text' className={item.done ? style.todoInputDone : style.todoInput} value={item.title}        onChange={(e) => {changeData(e.target.value, item.id, 'title')}}></input>
              <input type='text' className={item.done ? style.todoInputDone2 : style.todoInput2} value={item.description} onChange={(e) => {changeData(e.target.value, item.id, 'description')}}></input>
              <span className={style.todoDate}>{item.date}</span>
              <input type='checkbox' className={style.todoCheckBox} onClick={() => {changeData(!item.done, item.id, 'done')}} checked = {item.done}></input>


            </div>

            <button className={style.todoDeleteButton} onClick={() => {deleteTodo(item.id)}}></button>

          </div>

        ))}


      </div>


    </div>
    
  );
}

export default App;
