import { randomUUID } from 'node:crypto';
import { Database } from './database.js';
import { buildRoutePath } from './utils/build-route-path.js';
import { validateUUID } from './utils/validate-uuid.js';

const database = new Database();

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query;
      
      const tasks = database.select('tasks', search ? {
        title: search,
        description: search
      } : null);

      return res.end(JSON.stringify(tasks));
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body;

      if (!title || !description) {
        return res.writeHead(400).end(JSON.stringify({
          message: 'Title and description is required'
        }));
      }
      
      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      }

      database.insert('tasks', task);
      
      return res.writeHead(201).end();
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params;
      const { title, description } = req.body;

      if (!validateUUID(id)) {
        return res.writeHead(404).end(JSON.stringify({
          message: 'Task not found'
        }));
      }

      const [task] = database.select('tasks', {
        id
      });

      if (!task) {
        return res.writeHead(404).end(JSON.stringify({
          message: 'Task not found'
        }));
      }

      if (!title && !description) {
        return res.writeHead(400).end(JSON.stringify({
          message: 'You can only update the title or description'
        }));
      }

      database.update('tasks', id, {
        title: title ? title : task.title,
        description: description ? description : task.description,
        updated_at: new Date()
      });

      return res.writeHead(204).end();
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params;

      if (!validateUUID(id)) {
        return res.writeHead(404).end(JSON.stringify({
          message: 'Task not found'
        }));
      }

      const [task] = database.select('tasks', {
        id
      });

      if (!task) {
        return res.writeHead(404).end(JSON.stringify({
          message: 'Task not found'
        }));
      }

      database.update('tasks', id, {
        completed_at: task.completed_at ? null : new Date(),
      });

      return res.writeHead(204).end();
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params;

      if (!validateUUID(id)) {
        return res.writeHead(404).end(JSON.stringify({
          message: 'Task not found'
        }));
      }

      const [task] = database.select('tasks', {
        id
      });

      if (!task) {
        return res.writeHead(404).end(JSON.stringify({
          message: 'Task not found'
        }));
      }

      database.delete('tasks', id);

      return res.writeHead(204).end();
    }
  }
]