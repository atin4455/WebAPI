import { useState, useEffect } from 'react';

// 🌟 這裡精準對接到你剛蓋好的後端 SERVER 網址
const API_URL = 'https://localhost:7112/api/todo';

function App() {
    const [todos, setTodos] = useState([]);
    const [newTodoTitle, setNewTodoTitle] = useState('');

    // 1. 網頁一打開，立刻發送 GET 請求去後端撈資料 (對應 GetTodos)
    useEffect(() => {
        const fetchTodos = async () => {
            try {
                const response = await fetch(API_URL);
                if (!response.ok) throw new Error('網路回應不成功');
                const data = await response.json();
                setTodos(data);
            } catch (error) {
                console.error('撈取資料失敗：', error);
            }
        };
        fetchTodos();
    }, []);

    // 2. 按下新增按鈕，發送 POST 請求去後端生成物件 (對應 PostTodo)
    const handleAddTodo = async (e) => {
        e.preventDefault();
        if (!newTodoTitle.trim()) return;

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: newTodoTitle, isCompleted: false }),
            });

            if (response.ok) {
                const createdTodo = await response.json();
                setTodos([...todos, createdTodo]); // 把後端生成完、帶有新 ID 的物件塞進畫面
                setNewTodoTitle(''); // 清空輸入框
            }
        } catch (error) {
            console.error('連線後端發生錯誤：', error);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto', fontFamily: 'sans-serif' }}>
            <h1>Todo List (React + .NET)</h1>

            <form onSubmit={handleAddTodo} style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="想要做點什麼？"
                    value={newTodoTitle}
                    onChange={(e) => setNewTodoTitle(e.target.value)}
                    style={{ padding: '8px', width: '70%', marginRight: '10px' }}
                />
                <button type="submit" style={{ padding: '8px 15px' }}>新增</button>
            </form>

            {todos.length === 0 ? (
                <p>目前沒有任何待辦事項 😎</p>
            ) : (
                <ul style={{ paddingLeft: '20px' }}>
                    {todos.map((todo) => (
                        <li key={todo.id} style={{ margin: '10px 0' }}>
                            {todo.title}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default App;