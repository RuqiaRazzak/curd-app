import { useEffect, useState } from 'react';
import axios from 'axios';

export default function App() {
  const [text, setText] = useState('');
  const [items, setItems] = useState([]);
  const [editId, setEditId] = useState('');

  useEffect(() => {
    reload();
  }, []);

  function reload() {
    axios.get('/api/items')
      .then(res => {
        setItems(res.data);
        setText('');
        setEditId('');
      })
      .catch(err => console.error(err));
  }

  function save(e) {
    e.preventDefault();
    if (editId) {
      axios.put('/api/items', { id: editId, name: text })
        .then(() => reload())
        .catch(err => console.error(err));
    } else {
      axios.post('/api/items', { name: text })
        .then(() => reload())
        .catch(err => console.error(err));
    }
  }

  function del(id) {
    axios.delete(`/api/items?id=${id}`)
      .then(() => reload())
      .catch(err => console.error(err));
  }

  function edit(item) {
    setText(item.name);
    setEditId(item._id);
  }

  return (
    <div style={{ maxWidth: 400, margin: '40px auto', fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' }}>
      <h2 style={{ textAlign: 'center' }}>CRUD App</h2>
      <form onSubmit={save} style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <input
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          required
          style={{ flex: 1, padding: 10, borderRadius: 8, border: '2px solid #ddd' }}
        />
        <button type="submit" style={{ padding: '10px 14px', borderRadius: 8, backgroundColor: '#7e57c2', color: 'white', border: 'none', cursor: 'pointer' }}>
          {editId ? 'Update' : 'Add'}
        </button>
      </form>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {items.map(i => (
          <li key={i._id} style={{ background: '#f7f7f7', padding: 12, borderRadius: 10, marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {i.name}
            <span>
              <button onClick={() => edit(i)} style={{ marginRight: 8, background: 'transparent', border: 'none', color: '#7e57c2', cursor: 'pointer', fontSize: 18 }}>✏️</button>
              <button onClick={() => del(i._id)} style={{ background: 'transparent', border: 'none', color: '#7e57c2', cursor: 'pointer', fontSize: 18 }}>🗑️</button>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
