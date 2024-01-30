import fs from 'node:fs';
import { parse } from 'csv-parse';


async function importTasks() {
  const stream = fs.createReadStream('./streams/tasks.csv')
    .pipe(parse({
      delimiter: ',',
      fromLine: 2
    }))

  console.log('Iniciando importação...⌛');

  for await (const line of stream) {
    const [title, description] = line

    console.log(`\tCadastrando tarefa: ${title}...⬆️`);

    await fetch('http://localhost:3333/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title,
        description
      })
    })
  }

  console.log('Importação concluída!✅');
}

importTasks()