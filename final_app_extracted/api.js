import axios from 'axios';

// Use the local server URL
const API_URL = 'http://localhost:3000/tasks';

// No API key or special headers needed for the local server
export const getTasks = () => axios.get(API_URL);
export const addTask = (task) => axios.post(API_URL, task);
export const deleteTask = (id) => axios.delete(`${API_URL}/${id}`);
export const updateTask = (id, updatedTask) => axios.put(`${API_URL}/${id}`, updatedTask);

