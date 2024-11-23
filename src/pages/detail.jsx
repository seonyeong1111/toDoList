import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getTodoById } from "../apis/todo";

function Detail() {
  const { id } = useParams();
  const { data: todos = [] } = useQuery({
    queryKey: ["todos"],
    queryFn: () => getTodoById({ id: id }),
    onError: (error) => {
      console.error("Error fetching data:", error);
    },
  });
  console.log(todos);
  return (
    <div className="detailBox">
      <div className="detail">
        <span className="id">
          <b>{todos.id}</b>
        </span>
        <span>{todos.title}</span>
        <span>{todos.content}</span>
        <span>{todos.updatedAt}</span>
        <span>상태: {todos.checked ? "완료" : "미완료"}</span>
      </div>
    </div>
  );
}
export default Detail;
