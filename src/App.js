import './App.css';

//importar coisas que vamos usar no projeto que vem do react
import {useState, useEffect} from "react"
//importar icons 
import {BsTrash, BsBookmarkCheck, BsBookmarkCheckFill } from "react-icons/bs"
//endereço base que estou utilizando
const API = "http://localhost:5000"

//APP de ToDo
function App() {
  //titulo e tempo de duração da tarefa que iniciará vazio
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  //array que objetos das tarefas que começa com uma lista vazia
  const [todos, setTodos] = useState([]);
  //forma de carregar os dados e exibir pro usuário
  const [loading, setLoading] = useState(false);

  //controla mudanças e aciona funções
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
  
      const res = await fetch(API + "/todos")
      const todos = await res.json()
  
        setLoading(false);

        setTodos(todos);
    };

    loadData();
  }, []);

  //para nao carregar a pagina no click do botão - quebra o fluxo SPA
  const handleSubmit = async (e) => {
    e.preventDefault();

    const todo = {
      id: Math.random(),
      title,
      time,
      done: false,
    };

    await fetch(API + "/todos", {
      method: "POST",
      body: JSON.stringify(todo),
      headers: {
        "Content-Type": "application/json",
      },
    });

    //p atualizar a pagina automaticamente quando eu inserir o dado
    setTodos((prevState) => [... prevState, todo]);

    setTitle("");
    setTime("");
  };

  //id pega para deletar o dado do ToDo
  const handleDelete = async (id) => {
    await fetch(API + "/todos/" + id, {
      method: "DELETE",
    });

    setTodos((prevState) => prevState.filter((todo) => todo.id !== id));
  }

  //para editar precisa utilizar todos os dados para conseguir acessa-los e preencher a "tarefa" como feita
  const handleEdit = async(todo) => {
    todo.done = !todo.done;

    const data = await fetch(API + "/todos/" + todo.id,{
      method: "PUT",
      body: JSON.stringify(todo),
      headers: {
        "Content-Type": "application/json",
      },
    });

    setTodos((prevState) => 
    prevState.map((t) => (t.id === data.id ? (t = data) : t))
    );
  }

  //se estiver carregado imprimir na tela carregando e evitar aparecer outros dados
  if(loading) {
    return <p>Carregando</p>
  }

  return (
    <div className="App">
      <div className='todo-header'>
        <h1>React ToDo</h1>
      </div>

      <div className='form-todo'>
        <h2>Insira a sua próxima tarefa:</h2>
        {/* chamando a função criada ali em cima - p nao recarregar a pagina*/}
        <form onSubmit={handleSubmit}>
          <div className="form-control">
            <label htmlFor="title">O que você vai fazer?</label>
            <input 
            type='text' 
            name='title' 
            placeholder='Titulo da tarefa' 
            // onChange: capta a mudança de cada evento a cada tecla que o usuário pressiona
            //E é o evento TARGET é o input - está colocando no Title o valor desse input
            onChange={(e) => setTitle(e.target.value)}
            //o valor = state do input - para limpar o input depois
            value={title || ""}
            required
            ></input>
          </div>

          <div className="form-control">
            <label htmlFor="time">Duração:</label>
            <input 
            type='text' 
            name='time' 
            placeholder='Tempo estimado (em horas)' 
            // onChange: capta a mudança de cada evento a cada tecla que o usuário pressiona
            //E é o evento TARGET é o input - está colocando no Title o valor desse input
            onChange={(e) => setTime(e.target.value)}
            //o valor = state do input - para limpar o input depois
            value={time || ""}
            required
            ></input>
          </div>

          <input type="submit" value="Criar tarefa" />
        </form>
      </div>

      <div className='list-todo'>
        <h2>Lista de tarefas:</h2>
        {/* rederização condicional que foi pego do array vazio acima */}
        {/* pego o array vazio e faço a comparação pq se ele for igual a 0 não ha tarefas */}
        {todos.length === 0 && <p>Não há tarefas</p>}
        {todos.map((todo) => (
          <div className="todo" key={todo.id}>
            <h3 className={todo.done ? "todo-done" : ""}>{todo.title }</h3>
            <p>Duração: {todo.time}</p>
            <div className="actions">
              <span onClick={() => handleEdit(todo)}>
                {!todo.done ? <BsBookmarkCheck /> : <BsBookmarkCheckFill />}
              </span>
              <BsTrash onClick={() => handleDelete(todo.id) }/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

//para exportar que eu poder "chamar" o App
export default App;
