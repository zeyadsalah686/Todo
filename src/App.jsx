import { FaPlus } from "react-icons/fa6";
import { useState, useEffect } from "react";
import Todo from "./components/Todo";
import { style } from "./shared/style";
import { auth, provider } from "./firebase/firebase";
import { signInWithPopup } from "firebase/auth";
import Cookies from "universal-cookie";
import { addDoc, collection, deleteDoc, doc, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import { db } from "./firebase/firebase";

const cookies = new Cookies();

function App() {
    const [todos, setTodos] = useState([]);
    const [isAuth, setIsAuth] = useState(cookies.get("auth-token"));
    const [input, setInput] = useState("");

    const createTodo = async (e) => {
        e.preventDefault();

        if (isAuth) {
            await addDoc(collection(db, 'todos'), {
                text: input,
                completed: false,
                userId: cookies.get("userId"),
            });

            setInput("");
        }
    }

    const deleteTodo = async (id) => {
        await deleteDoc(doc(db, 'todos', id));
    };

    useEffect(() => {
        if (isAuth) {
            const q = query(collection(db, 'todos'), where("userId", "==", cookies.get("userId")));
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                let todosArr = [];
                querySnapshot.forEach((doc) => {
                    todosArr.push({ ...doc.data(), id: doc.id });
                });
                setTodos(todosArr);
            });
            return () => unsubscribe();
        }
    });

    const toggleComplete = async (todo) => {
        if (isAuth) {
            try {
                await updateDoc(doc(db, 'todos', todo.id), {
                    completed: !todo.completed,
                });
            } catch (error) {
                console.error("Error updating document:", error);
            }
        }
    };

    const signInWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            cookies.set("auth-token", result.user.refreshToken);
            cookies.set("userId", result.user.uid)
            console.log(cookies.get("auth-token"));
            console.log(cookies.get("userId"));
            window.location.reload();
        } catch (err) {
            console.error("Error: ", err)
        }
    }

    return (
        <div className="p-4 mt-7">
            <div className={isAuth ? style.container : "border max-w-[500px] w-full m-auto rounded-md shadow-xl p-6 flex justify-center flex-col"}>
                <h1 className={style.heading}>To Do App</h1>

                {isAuth ? (
                    <>
                        <form className={style.form} onSubmit={createTodo}>
                            <input value={input} onChange={(e) => setInput(e.target.value)} required type="text" className={style.input} placeholder="Add Task" />
                            <button type="submit" className={style.button}><FaPlus size={30} /></button>
                        </form>
                        <ul>
                            {todos.map((todo, index) => (
                                <Todo
                                    key={index}
                                    todo={todo}
                                    toggleComplete={toggleComplete}
                                    deleteTodo={deleteTodo}
                                />
                            ))}
                        </ul>
                        {todos.length < 1 ? '' : <p className={style.count}>You Have {todos.length} Todos</p>}
                    </>
                ) : <button className="my-3 bg-[#dd4b39] p-3 rounded-md border-none text-white" onClick={() => signInWithGoogle()}>Sign In With Google</button>
                }
            </div>
        </div>
    );
}

export default App;
