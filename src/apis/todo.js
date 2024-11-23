import axios from "axios";

const postTodo = async ({ title, content, checked = false }) => {
  const { data } = await axios.post("http://localhost:3000/todo", {
    title,
    content,
    checked,
  });
  return data;
};

const getTodo = async ({ title }) => {
  let url = `http://localhost:3000/todo`;
  if (title) {
    url = url + `?title=${title}`;
  }
  const { data } = await axios.get(url);
  return data;
};

const getTodoById = async ({ id }) => {
  const { data } = await axios.get(`http://localhost:3000/todo/${id}`);
  return data;
};

const deleteTodo = async ({ id }) => {
  const { data } = await axios.delete(`http://localhost:3000/todo/${id}`);
  return data;
};

const patchTodo = async ({ id, title, content, checked }) => {
  const { data } = await axios.patch(`http://localhost:3000/todo/${id}`, {
    title,
    content,
    checked,
  });
  return data;
};
export { postTodo, getTodo, getTodoById, deleteTodo, patchTodo };
