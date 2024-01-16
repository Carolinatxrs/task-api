import { Database } from './database.js';
import { buildRoutePath } from './utils/build-route-path.js';

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
  }
]