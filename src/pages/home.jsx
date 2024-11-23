import { Link } from "react-router-dom";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../main";
import useDebounce from "../hooks/useDebounce";
import { BeatLoader } from "react-spinners";

import { postTodo, getTodo, deleteTodo, patchTodo } from "../apis/todo";

function Home() {
  const [text, setText] = useState({
    title: "",
    content: "",
  });

  const [searchText, setSearchText] = useState("");

  const debouncedVal = useDebounce(searchText, 500);

  const {
    data: todos = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["todos", debouncedVal],
    queryFn: () => getTodo({ title: debouncedVal }),
    //enabled: !!debouncedVal, // debouncedVal이 비어있을 때 쿼리 비활성화 !!는 JavaScript에서 값을 명시적으로 boolean으로 변환하는 방법
    onError: (error) => {
      console.error("Error fetching data:", error);
    },
  });

  const postMutation = useMutation({
    mutationFn: postTodo,
    onSuccess: () => {
      console.log("postTodo연결성공");
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      setText({
        title: "",
        content: "",
      });
    },
    onError: (error) => {
      console.error("postMutation에러", error);
    },
  });
  const deleteMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      console.log("deleteTodo연결성공");
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
    onError: (error) => {
      console.error("deleteMutation에러", error);
    },
  });

  const patchMutation = useMutation({
    mutationFn: patchTodo,
    onSuccess: () => {
      console.log("patchTodo연결성공");
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      setEditId("");
    },
    onError: (error) => {
      console.error("patchMutation에러", error);
    },
  });

  const [editId, setEditId] = useState("");
  const [editText, setEditText] = useState({ title: "", content: "" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setText((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditText((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditButtonClick = (id, title, content) => {
    setEditId(id);
    setEditText({
      title: title,
      content: content,
    });
  };

  if (isLoading) {
    return (
      <div className="loadingSpinner">
        <BeatLoader color={"#007efb"}></BeatLoader>
        <p>
          <b>게시글을 불러오는 중입니다..</b>
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="loadingSpinner">
        <img src="error.gif"></img>

        <b>에러가 발생했습니다</b>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="top">
        <input
          className="input"
          type="text"
          name="title"
          placeholder="제목을 입력하세요"
          value={text.title}
          onChange={handleInputChange}
        />
        <input
          className="input"
          type="text"
          name="content"
          placeholder="내용을 입력하세요"
          value={text.content}
          onChange={handleInputChange}
        />
        <button
          className="button"
          type="submit"
          onClick={() => postMutation.mutate(text)}
          disabled={!text.title || !text.content}
        >
          ToDo 생성
        </button>
        <input
          type="text"
          className="input"
          placeholder="검색할 제목을 입력하세요"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        ></input>
      </div>
      <div>
        {todos[0]?.map((todo, _) => {
          return editId !== todo.id ? (
            <div className="todoBox" key={todo.id}>
              <input
                type="checkbox"
                defaultChecked={todo.checked}
                onChange={() =>
                  patchMutation.mutate({ id: todo.id, checked: !todo.checked })
                }
              ></input>
              <Link to={`/todo/${todo.id}`}>
                <div className="todo">
                  <p>{todo.title}</p>
                  <p>{todo.content}</p>
                </div>
              </Link>
              <button
                className="button"
                onClick={(e) =>
                  handleEditButtonClick(todo.id, todo.title, todo.content)
                }
              >
                수정
              </button>
              <button
                className="button"
                onClick={() => deleteMutation.mutate(todo)}
              >
                삭제
              </button>
            </div>
          ) : (
            <div className="todoBox" key={todo.id}>
              <input type="checkbox"></input>
              <div className="todo">
                <input
                  className="input"
                  type="text"
                  name="title"
                  defaultValue={todo.title}
                  onChange={handleEditInputChange}
                ></input>
                <input
                  className="input"
                  type="text"
                  name="content"
                  defaultValue={todo.content}
                  onChange={handleEditInputChange}
                ></input>
              </div>
              <button
                onClick={() =>
                  patchMutation.mutate({
                    id: editId,
                    title: editText.title,
                    content: editText.content,
                  })
                }
              >
                수정 완료
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Home;
