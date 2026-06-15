import { useState, useEffect } from 'react';

// 🌟 請確保這裡的 Port 號碼與你 .NET 後端啟動時的 Port 一致
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
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>
                    Todo List <span style={styles.badge}>v1.0</span>
                </h1>
                <p style={styles.subtitle}>React 19 + .NET 10 全端分離實戰</p>

                {/* 表單區塊 */}
                <form onSubmit={handleAddTodo} style={styles.form}>
                    <input
                        type="text"
                        placeholder="想做點什麼？輸入後按新增..."
                        value={newTodoTitle}
                        onChange={(e) => setNewTodoTitle(e.target.value)}
                        style={styles.input}
                    />
                    <button type="submit" style={styles.addButton}>
                        新增
                    </button>
                </form>

                {/* 列表區塊 */}
                {todos.length === 0 ? (
                    <div style={styles.emptyState}>
                        <p style={{ fontSize: '24px', marginBottom: '10px' }}>😎</p>
                        <p>目前沒有任何待辦事項，輕鬆一下吧！</p>
                    </div>
                ) : (
                    <ul style={styles.list}>
                        {todos.map((todo) => (
                            <li key={todo.id} style={styles.listItem}>
                                <div style={styles.itemLeft}>
                                    <label style={styles.checkboxContainer}>
                                        <input
                                            type="checkbox"
                                            checked={todo.isCompleted}
                                            onChange={() => handleToggleComplete(todo)}
                                            style={styles.checkbox}
                                        />
                                        <span style={styles.customCheckbox} />
                                    </label>
                                    <span style={{
                                        ...styles.itemText,
                                        textDecoration: todo.isCompleted ? 'line-through' : 'none',
                                        color: todo.isCompleted ? '#64748b' : '#f1f5f9'
                                    }}>
                                        {todo.title}
                                    </span>
                                </div>

                                <button
                                    onClick={() => handleDeleteTodo(todo.id)}
                                    style={styles.deleteButton}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = '#ef4444'}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                >
                                    刪除
                                </button>
                            </li>
                        ))}
                    </ul>
                )}

                <div style={styles.footer}>
                    共 {todos.length} 項任務 · 已完成 {todos.filter(t => t.isCompleted).length} 項
                </div>
            </div>
        </div>
    );
}

// 🎨 高質感深色系內聯樣式表
const styles = {
    container: {
        backgroundColor: '#0f172a', // 深藍黑背景色
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        padding: '20px',
        boxSizing: 'border-box',
    },
    card: {
        backgroundColor: '#1e293b', // 卡片深灰色
        borderRadius: '16px',
        width: '100%',
        maxWidth: '480px',
        padding: '32px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.3)',
    },
    title: {
        color: '#ffffff',
        fontSize: '28px',
        fontWeight: '700',
        margin: '0 0 4px 0',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
    },
    badge: {
        fontSize: '12px',
        backgroundColor: '#3b82f6',
        color: '#fff',
        padding: '2px 8px',
        borderRadius: '20px',
        fontWeight: '500'
    },
    subtitle: {
        color: '#94a3b8',
        fontSize: '14px',
        margin: '0 0 24px 0',
    },
    form: {
        display: 'flex',
        gap: '12px',
        marginBottom: '24px',
    },
    input: {
        flex: 1,
        backgroundColor: '#334155',
        border: '1px solid #475569',
        borderRadius: '8px',
        padding: '12px 16px',
        color: '#ffffff',
        fontSize: '15px',
        outline: 'none',
        transition: 'border-color 0.2s',
    },
    addButton: {
        backgroundColor: '#3b82f6', // 質感藍色
        color: '#ffffff',
        border: 'none',
        borderRadius: '8px',
        padding: '0 20px',
        fontSize: '15px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
    },
    list: {
        listStyle: 'none',
        padding: 0,
        margin: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    listItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#334155',
        padding: '14px 16px',
        borderRadius: '10px',
        border: '1px solid #475569',
        transition: 'transform 0.2s, box-shadow 0.2s',
    },
    itemLeft: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flex: 1,
    },
    checkboxContainer: {
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
    },
    checkbox: {
        width: '18px',
        height: '18px',
        cursor: 'pointer',
        accentColor: '#3b82f6', // 讓勾選鈕變藍色
    },
    itemText: {
        fontSize: '15px',
        transition: 'color 0.2s, text-decoration 0.2s',
        wordBreak: 'break-all',
    },
    deleteButton: {
        backgroundColor: 'transparent',
        color: '#f87171',
        border: '1px solid #f87171',
        padding: '6px 12px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '13px',
        fontWeight: '500',
        transition: 'all 0.2s',
    },
    emptyState: {
        textAlign: 'center',
        padding: '40px 0',
        color: '#64748b',
        fontSize: '14px',
    },
    footer: {
        marginTop: '24px',
        paddingTop: '16px',
        borderTop: '1px solid #334155',
        color: '#64748b',
        fontSize: '13px',
        textAlign: 'center'
    }
};

export default App;