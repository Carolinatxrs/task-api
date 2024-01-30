import fs from 'node:fs';
import { parse } from 'csv-parse';

fs
  .createReadStream('./streams/tasks.csv')
  .pipe(parse({
    delimiter: ',',
    fromLine: 2
  })).on('data', (data) => {
    const [title, description] = data

    fetch('http://localhost:3333/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title,
        description
      })
    })
  })

