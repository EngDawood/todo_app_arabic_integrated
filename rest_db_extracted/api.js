// api.js
import axios from 'axios';

const API_URL = 'https://yourdbname.restdb.io/rest/tasks'; // استبدله برابط قاعدة بياناتك
const API_KEY = 'your_api_key_here'; // استبدله بمفتاح API الخاص بك

const headers = {
  'Content-Type': 'application/json',
  'x-apikey': API_KEY,
  'cache-control': 'no-cache'
};

export const getTasks = () => axios.get(API_URL, { headers });

export const addTask = (task) => axios.post(API_URL, task, { headers });

export const deleteTask = (id) => axios.delete(`${API_URL}/${id}`, { headers });

export const updateTask = (id, updatedTask) =>
  axios.put(`${API_URL}/${id}`, updatedTask, { headers });