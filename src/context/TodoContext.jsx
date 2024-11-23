import { createContext } from "react";
import { useState } from "react";

//데이터를 담고 있음
export const TodoContext = createContext();

//우산을 만듦
export function TodoContextProvider({ children }) {
  //투두리스트, 화면에 출력되는 (추가, 삭제, 수정)
  const [todos, setTodos] = useState([
    { id: 1, task: "투두 만들기" },
    { id: 2, task: "투두 만들기2" },
  ]);

  const [text, setText] = useState("");

  const [editingId, setEditingId] = useState("");
  const [editText, setEditText] = useState("");

  //렌더링 방지
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  //1. 추가하기
  const addTodo = () => {
    setTodos((prev) => [
      ...prev,
      {
        id: Math.floor(Math.random() * 100) + 2,

        task: text,
      },
    ]);
    setText("");
  };

  //2. 삭제하기
  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((item) => item.id !== id));
  };

  //3. 수정하기
  const updateTodo = (id, text) => {
    setTodos((prev) =>
      prev.map((item) => (item.id === id ? { ...item, task: text } : item))
    );
    setEditingId("");
  };
  return (
    <TodoContext.Provider
      value={{
        todos,
        setTodos,
        text,
        setText,
        editingId,
        setEditingId,
        editText,
        setEditText,
        handleSubmit,
        addTodo,
        deleteTodo,
        updateTodo,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
}
