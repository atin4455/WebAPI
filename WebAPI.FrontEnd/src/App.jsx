import { useState, useEffect } from 'react';

// 🌟 請確保這裡的 Port 號碼 (7112) 與你 .NET 後端啟動時的 Port 完全一致
const API_URL = 'https://localhost:7112/api/todo';

function App() {
    const [todos, setTodos] = useState([]);
    const [newTodoTitle, setNewTodoTitle] = useState('');

    // 1. 【查】 撈取全部
    useEffect(() => {
        const fetchTodos = async () => {
            try {
                const response = await fetch(API_URL);
                if (!response.ok) throw new Error('網路回應不成功');
                const data = await response.json();
                setTodos(data);
            } catch (error) {
                console.error('撈取失敗：', error);
            }
        };

        fetchTodos();
    }, []);

    // 2. 【增】 新增事項
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
                setTodos([...todos, createdTodo]);
                setNewTodoTitle('');
            }
        } catch (error) {
            console.error('新增失敗：', error);
        }
    };

    // 3. 【改】 切換完成狀態 (PUT)
    const handleToggleComplete = async (todo) => {
        const updatedTodo = { ...todo, isCompleted: !todo.isCompleted };

        try {
            // 🌟 注意：RESTful 規範，修改特定 ID 必須在網址後加上 /{id}
            const response = await fetch(`${API_URL}/${todo.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedTodo),
            });

            if (response.ok) {
                setTodos(todos.map(t => t.id === todo.id ? updatedTodo : t));
            }
        } catch (error) {
            console.error('修改失敗：', error);
        }
    };

    // 4. 【刪】 刪除事項 (DELETE)
    const handleDeleteTodo = async (id) => {
        try {
            // 🌟 注意：刪除特定 ID 必須在網址後加上 /{id}
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setTodos(todos.filter(t => t.id !== id));
            }
        } catch (error) {
            console.error('刪除失敗：', error);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto', fontFamily: 'sans-serif' }}>
            <h1>Todo List 完整 CRUD 版 🔥</h1>

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
                <ul style={{ paddingLeft: '0', listStyle: 'none' }}>
                    {todos.map((todo) => (
                        <li key={todo.id} style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '10px',
                            borderBottom: '1px solid #eee'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <input
                                    type="checkbox"
                                    checked={todo.isCompleted}
                                    onChange={() => handleToggleComplete(todo)}
                                    style={{ marginRight: '10px', width: '18px', height: '18px', cursor: 'pointer' }}
                                />
                                <span style={{
                                    textDecoration: todo.isCompleted ? 'line-through' : 'none',
                                    color: todo.isCompleted ? '#aaa' : '#000'
                                }}>
                                    {todo.title}
                                </span>
                            </div>

                            <button
                                onClick={() => handleDeleteTodo(todo.id)}
                                style={{ backgroundColor: '#ff4d4d', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer', borderRadius: '4px' }}
                            >
                                刪除
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default App;