import React, { useEffect, useReducer } from "react";
import styled from "styled-components";

const initialState = {
  todos: [],
  error: null,
  isLoading: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_TODOS":
      return { ...state, todos: action.payload, isLoading: false };
    case "SET_ERROR":
      return { ...state, error: action.payload, isLoading: false };
    case "SET_LOADING":
      return { ...state, isLoading: true };
    default:
      return state;
  }
};

const TodoListContainer = styled.div`
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ErrorHeading = styled.h1`
  color: #e74c3c;
  margin-bottom: 20px;
`;

const LoadingHeading = styled.h1`
  color: #3498db;
  margin-bottom: 20px;
`;

const TodoList = styled.ul`
  list-style: none;
`;

const TodoItem = styled.li`
  flex: 0 0 300px;
  padding: 8px 16px;
  margin: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f9f9f9;
`;

const TodoListTwo = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const getTodos = async () => {
      try {
        dispatch({ type: "SET_LOADING" });
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/todos"
        );
        const result = await response.json();
        dispatch({ type: "SET_TODOS", payload: result });
      } catch (error) {
        dispatch({ type: "SET_ERROR", payload: error });
      }
    };
    getTodos();
  }, []);

  return (
    <TodoListContainer>
      {state.error && <ErrorHeading>{state.error.message}</ErrorHeading>}
      {state.isLoading && <LoadingHeading>...Loading</LoadingHeading>}
      <TodoList>
        {state.todos.map((todo) => (
          <TodoItem key={todo.id}>{todo.title}</TodoItem>
        ))}
      </TodoList>
    </TodoListContainer>
  );
};

export default TodoListTwo;
