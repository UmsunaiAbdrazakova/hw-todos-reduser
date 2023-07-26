import { useEffect } from "react";
import { useReducer } from "react";
import { useState } from "react";
import styled from "styled-components";
import "./App.css";
import TodoListTwo from "./components/TodoListTwo";
//import Button from "./components/UI/Button"; //styled(Button)
//import Input from "./components/UI/Input";  //styled(Input) кылсам стилдер иштебей койду

const initialState = { // Начальное состояние для хранения задач и состояния загрузки
  todos: [],
  loading: false,
};
const reducer = (state, action) => {
  switch (action.type) {
    case "SET_TODOS":
      return { ...state, todos: action.payload };
    case "ON_LOADING":
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};
function App() {
  const [value, setValue] = useState("");
  const [state, dispatch] = useReducer(reducer, initialState);
  console.log(value, "hello");

  const onHandleAddItem = async () => { // Обработчик для добавления новой задачи
     // Отправляем POST-запрос на сервер с введенным значением задачи
    await fetch("https://todos-39843-default-rtdb.firebaseio.com/todo.json", {
      method: "POST",
      body: JSON.stringify(value),
    });
    getUserData();
  };

  const getUserData = async () => {// Функция для получения списка задач с сервера
    dispatch({ type: "ON_LOADING", payload: true });// Устанавливаем состояние загрузки, пока данные не получены
    const response = await fetch(
      "https://todos-39843-default-rtdb.firebaseio.com/todo.json"
    );
    const result = await response.json();
    console.log(result);

    const data = result
      ? Object.entries(result).map(([id, value]) => {
          return { id, value };
        })
      : [];
    // Обновляем состояние задач и завершаем состояние загрузки
    dispatch({ type: "SET_TODOS", payload: data });
    dispatch({ type: "ON_LOADING", payload: false });
  };
  const onDeleteTodo = async (id) => { // Обработчик для удаления задачи
    try {
      await fetch(
        `https://todos-39843-default-rtdb.firebaseio.com/todo/${id}.json`,
        { method: "DELETE" }
      );
      getUserData();
    } catch (error) {}
  };

  useEffect(() => { // Получаем список задач с сервера при первой загрузке компонента
    getUserData();
  }, []);//mount

  if (state.loading) {
    return <LoadingText>Loading...</LoadingText>;
  } // Если данные загружаются, отображаем "Loading..."

  return (
    <StyledApp>
      <StyledInput value={value} onChange={(e) => setValue(e.target.value)} />
      <AddButton onClick={onHandleAddItem}>Add</AddButton>
      <TodoList>
        {state.todos.map((item) => (
          <TodoItem key={item.id}>
            {item.value}
            <DeleteButton onClick={() => onDeleteTodo(item.id)}>
              Delete
            </DeleteButton>
          </TodoItem>
        ))}
      </TodoList>
      <TodoListTwo/>
    </StyledApp>
  );
}

const StyledApp = styled.div`
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
`;

const LoadingText = styled.h3`
  text-align: start;
  margin-top: 5px;
  color: green;
`;

const TodoList = styled.ul`
  list-style: none;
  padding: 0;
`;

const TodoItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border: 1px solid #cdbcbc;
  border-radius: 6px;
  margin: 10px 0;
`;

const StyledInput = styled.input`
  color: black;
  padding: 10px 15px;
  box-shadow: 0 0 10px rgba(68, 67, 67, 0.2);
  border-radius: 8px;
  width: 81%;
  border: none;
  cursor: pointer;
  font-size: 14px;
`;

const AddButton = styled.button`
  background-color: #4caf50;
  color: white;
  padding: 10px 15px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background-color: #45a049;
  }
`;

const DeleteButton = styled.button`
  background-color: #f44336;
  color: white;
  padding: 10px 15px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background-color: #9f0e0e;
  }
`;

export default App;
