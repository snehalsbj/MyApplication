'use client'
import Image from "next/image";
import download from "D:\Todo list\nextjs-todo\app\download.ico";
import { db } from '../firebaseConfig'; 
import { collection, addDoc,getDoc,deleteDoc,serverTimestamp,query,orderBy,doc,updateDoc, getDocs} from "firebase/firestore";
import React,{useState,useEffect} from "react";
import { todo } from "node:test";
import Head from "next/head";

async function addTodoToFirebase(
  title: string,       
  details: string,     
  dueDate: Date       
): Promise<boolean>{
  try{
    const docRef=await addDoc(collection(db,"todos"),{
      title:title,
      details:details,
      dueDate:dueDate,
      createdAt:serverTimestamp(),
    });
    console.log("Todo added with Id",docRef.id);
    return true;
  }
  catch(error){
    console.log("Error adding todo:",error);
    return false;
  }
 }

 //funtion to fetch todo from firebase

 interface Todo {
  id: string;
  title: string; 
  details: string;
  dueDate: Date; 
  createdAt: any; 
}

async function fetchTodosFromFirestore(): Promise<Todo[]> {
  const todosCollection = collection(db, "todos");
  const querySnapshot = await getDocs(query(todosCollection, orderBy("createdAt", "desc")));
  
  const todos: Todo[] = []; 
  
  querySnapshot.forEach((doc) => {
    const todoData = doc.data() as Omit<Todo, 'id'>; 
    todos.push({ id: doc.id, ...todoData });
  });
  
  return todos;
}

// delete todos

async function deleteTodoFromFirebase(todoId: string): Promise<string | null> {
  try{
    console.log("Attempting to delte todo with ID:",todoId);
    await deleteDoc(doc(db,"todos",todoId));
    return todoId;
  } catch(error){
    console.error("Error deleteing todo:",error);
    return null;
  }
}
export default function Home() {
  const[title,setTitle]=useState("");
  const[details,setDetails]=useState("");
  const[dueDate,setDueDate]=useState("");

  //state to hold the list of tools
  const [todos, setTodos] = useState<Todo[]>([]);

  //state to hold the selected todo for update
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);

  //state to track whether the form is in update mode
  const [isUpdateMode,setIsUpdateMode]=useState(false);

  const handleSubmit=async(e:React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    if(isUpdateMode){
      if(selectedTodo){
        try{
          const updatedTodo={
            title,
            details,
            dueDate: new Date,
          };
            const todoRef = doc(db, "todos", selectedTodo.id);
            await updateDoc(todoRef,updatedTodo);

          // reset the form fields
          setTitle("");
          setDetails("");
          setDueDate("");
          setSelectedTodo(null);
          setIsUpdateMode(false);

          alert("Todo updated successfully..")
        }catch(error){
          console.error("Error updating todo:",error);
        }
      }
    }
    else{
      const success = await addTodoToFirebase(title, details, new Date(dueDate)); // Use the Date object here
      if (success) {
          alert("Todo added to firestore successfully!!");

      }
    }
  };

  //fetch todos from firestore on component mount
  useEffect(()=>{
    async function fetchTodos(){
      const todos=await fetchTodosFromFirestore();
      setTodos(todos);
    }
    fetchTodos();
  },[]);

  // function to handle "update button click"
  const handleUpdateClick=(todo: Todo)=>{
    //set selected todo's values to form fields
    setTitle(todo.title||"");
    setDetails(todo.details||"");
    const dueDate = new Date(todo.dueDate);
    setDueDate(isNaN(dueDate.getTime()) ? "" : dueDate.toISOString().substring(0, 10));
    setSelectedTodo(todo);
    setIsUpdateMode(true);
  }

  // fetch todos from firestore on component mount
  useEffect(()=>{
    async function fetchTodos(){
      const todos=await fetchTodosFromFirestore();
      setTodos(todos);
    }
    fetchTodos();
  },[]);
  return (
    <div className="flex felx-1 items-center justify-center flex-col md:flex-row min-h-screen">
      {/* left section */ }
      <section className='flex-1 flex md:flex-col items-center md:justify-start mx-auto'>
      {/*  logo */}
      <div className='absolute top-4 left-4'>
      <link rel="icon" href="favicon.ico" />
      <Image
            aria-hidden
            src="https://www.svgrepo.com/show/396909/letter-s.svg"
            alt="Globe icon"
            width={50}
            height={50}
          />
      </div>
      {/* todo form*/}
      <div className="p-6 md:p-12 mt-10 rounded-lg shadow-xl w-full max-w-lg bg-white">
        <h2 className="text-center text-2xl font-bold leading-9 text-gray-900">
          {isUpdateMode?"UPdate your Todo ": " Create a Todo"}
        </h2>
        <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="title" className="block text-sm font-mediun leading-6 text-gray-600">
              Title
            </label>
            <div className=" mt-2">
              <input 
              id="title"
              name="title"
              type="text"
              autoComplete="off"
              required
              value={title}
              onChange={(e)=>setTitle(e.target.value)}
              className="w-full rounded boarder py-2 pl-2 test-gray-900 shadow ring"
              />
            </div>
          </div>
          <div>
            <label htmlFor="details" className="block text-sm font-mediun leading-6 text-gray-600">
              Details
            </label>
            <div className=" mt-2">
              <textarea 
              id="details"
              name="details"
              rows={4}
              autoComplete="off"
              required
              value={details}
              onChange={(e)=>setDetails(e.target.value)}
              className="w-full rounded boarder py-2 pl-2 test-gray-900 shadow ring"
              ></textarea>
            </div>
          </div>
          <div>
            <label htmlFor="dueDate" className="block text-sm font-mediun leading-6 text-gray-600">
              Due Date
            </label>
            <div className=" mt-2">
              <input 
              id="dueDate"
              name="dueDate"
              type="date"
              autoComplete="off"
              required
              value={dueDate}
              onChange={(e)=>setDueDate(e.target.value)}
              className="w-full rounded boarder py-2 pl-2 test-gray-900 shadow ring"
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md font -semibold hover:bg-indigo-700 "
            >
              {isUpdateMode ? "Update Todo":"Create Todo "}
            </button>
          </div>
        </form>
      </div>
      </section>
      {/*  Right section  */}
      <section className="md:w-1/2 md:max-h-screen overflow-y-auto md:ml-10 mt-20 mx-auto">
        {/* todo list */}
        <div className="p-6 md:p-12 mt-10 rounded-lg shadow-xl w-full max-w-lg bg-white">
          <h2 className="test-center text-2xl font-bold leading-9 text-gray-900">
            Todo List
          </h2>
          {/* todo items */}
          <div className="mt-6 space-y-6">
            {todos.map((todo)=>
            <div key={todo.id} className="border p-4 rounded-md shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 break-words">{todo.title}
              <p className="text-sm text-gray-500">
                  Due Date :"2024-12-31"
              </p>
              <p className="text-gray-700 multiline break-words">
                {todo.details}
              </p>
              <div className="mt-4 space-x-6">
                <button
                   type="button"
                  className="px-3 py-1 text-sm font-semibold text bg-blue-500 hover:bg-blue-600 rounded-md"
                  onClick={() => handleUpdateClick(todo)}
                 >
                Update
                </button>

                <button
                  type="button"
                  onClick={async()=>{
                    const deletedTodoId=await deleteTodoFromFirebase(todo.id);
                    if(deletedTodoId){
                      const updatedTodos=todos.filter((t)=>t.id!== deletedTodoId);
                      setTodos(updatedTodos);
                    }
                  }}
                  className="px-3 py-1 text-sm font-semibold text bg-red-500 hover:bg-red-600 rounded-md"
                >
                  Delete
                </button>
              </div>
              </h3>
            </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
