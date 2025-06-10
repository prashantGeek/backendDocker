'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { todoAPI, Todo } from '@/lib/api';
import toast from 'react-hot-toast';

export default function Home() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const router = useRouter();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loadingTodos, setLoadingTodos] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTodo, setNewTodo] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high'
  });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchTodos();
    }
  }, [isAuthenticated]);

  const fetchTodos = async () => {
    setLoadingTodos(true);
    try {
      const todosData = await todoAPI.getTodos();
      setTodos(todosData);
    } catch (error) {
      toast.error('Failed to fetch todos');
    } finally {
      setLoadingTodos(false);
    }
  };

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.title.trim()) {
      toast.error('Title is required');
      return;
    }

    try {
      const todo = await todoAPI.createTodo(newTodo);
      setTodos([...todos, todo]);
      setNewTodo({ title: '', description: '', priority: 'medium' });
      setShowAddForm(false);
      toast.success('Todo added successfully');
    } catch (error) {
      toast.error('Failed to add todo');
    }
  };

  const handleToggleStatus = async (todoId: string, currentStatus: boolean) => {
    try {
      const updatedTodo = await todoAPI.updateTodo(todoId, { status: !currentStatus });
      setTodos(todos.map(todo => 
        todo._id === todoId ? { ...todo, status: !currentStatus } : todo
      ));
      toast.success('Todo updated');
    } catch (error) {
      toast.error('Failed to update todo');
    }
  };

  const handleDeleteTodo = async (todoId: string) => {
    if (!confirm('Are you sure you want to delete this todo?')) return;

    try {
      await todoAPI.deleteTodo(todoId);
      setTodos(todos.filter(todo => todo._id !== todoId));
      toast.success('Todo deleted');
    } catch (error) {
      toast.error('Failed to delete todo');
    }
  };

  const getPriorityClass = (priority: string) => {
    return `priority-badge priority-${priority}`;
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Header */}
      <header className="card" style={{ borderLeft: 'none', borderRight: 'none', borderTop: 'none' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '32px 20px' }}>
          <h1>Todo</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>{user?.username}</span>
            <button onClick={logout} className="secondary">
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
        {/* Add Todo Button */}
        <div style={{ marginBottom: '32px' }}>
          <button onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? 'Cancel' : 'New Todo'}
          </button>
        </div>

        {/* Add Todo Form */}
        {showAddForm && (
          <div className="card" style={{ padding: '32px', marginBottom: '32px' }}>
            <h2 style={{ marginBottom: '24px' }}>Add Todo</h2>
            <form onSubmit={handleAddTodo} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                  Title
                </label>
                <input
                  type="text"
                  value={newTodo.title}
                  onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
                  placeholder="Enter todo title"
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                  Description
                </label>
                <textarea
                  value={newTodo.description}
                  onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
                  placeholder="Enter todo description"
                  rows={3}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                  Priority
                </label>
                <select
                  value={newTodo.priority}
                  onChange={(e) => setNewTodo({ ...newTodo, priority: e.target.value as 'low' | 'medium' | 'high' })}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '12px', paddingTop: '8px' }}>
                <button type="submit">Add Todo</button>
                <button type="button" onClick={() => setShowAddForm(false)} className="secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Todos List */}
        <div className="card">
          <div style={{ padding: '24px' }} className="divider">
            <h2>Todos ({todos.length})</h2>
          </div>
          
          {loadingTodos ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              Loading todos...
            </div>
          ) : todos.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              No todos yet. Create your first todo to get started.
            </div>
          ) : (
            <div>
              {todos.map((todo, index) => (
                <div key={todo._id}>
                  <div style={{ padding: '24px', display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                    <input
                      type="checkbox"
                      checked={todo.status}
                      onChange={() => handleToggleStatus(todo._id, todo.status)}
                      style={{ marginTop: '2px', flexShrink: 0 }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <h3 style={{ 
                          textDecoration: todo.status ? 'line-through' : 'none',
                          color: todo.status ? 'var(--text-muted)' : 'var(--text-primary)',
                          flex: 1
                        }}>
                          {todo.title}
                        </h3>
                        <span className={getPriorityClass(todo.priority)}>
                          {todo.priority}
                        </span>
                      </div>
                      {todo.description && (
                        <p style={{ 
                          fontSize: '14px',
                          color: todo.status ? 'var(--text-muted)' : 'var(--text-secondary)',
                          marginBottom: '8px',
                          lineHeight: '1.4'
                        }}>
                          {todo.description}
                        </p>
                      )}
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        {new Date(todo.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteTodo(todo._id)}
                      className="danger"
                      style={{ flexShrink: 0 }}
                    >
                      Delete
                    </button>
                  </div>
                  {index < todos.length - 1 && <div className="divider" />}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
