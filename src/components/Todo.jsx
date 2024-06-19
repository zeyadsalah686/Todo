import { FaRegTrashAlt } from "react-icons/fa";
import {style} from "../shared/style";

function Todo({todo, toggleComplete, deleteTodo}) {
	return (
        <>
            <li className={style.li}>
                <div className={style.row} onClick={() => toggleComplete(todo)}>
                    <input onChange={() => toggleComplete(todo)} type="checkbox" checked={todo.completed ? 'checked' : ''}/>
                    <p className={!todo.completed ? style.text : style.textComplete}>{todo.text}</p>
                </div>
                <button onClick={() => deleteTodo(todo.id)}>{<FaRegTrashAlt />}</button>
            </li>
        </>
    );
}

export default Todo;
