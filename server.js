const express = require('express');
const fs = require('fs');
const { program } = require('commander');


const app = express();
app.use(express.json());

// Налаштування для обробки помилок
program.configureOutput({
  writeErr: (str) => {
    console.error(str);
  }
});

program
  .option('-h, --host <host>', 'server address')
  .option('-p, --port <port>', 'server port')
  .option('-c, --cache <cache>', 'cache directory')
  .parse();

const { host, port, cache } = program.opts(); 
const fsPromises = fs.promises;
if (!host) {
  console.error('Error: Host parameter is missing. Please specify the --host parameter.');
  process.exit(1);
}
if (!port) {
  console.error('Error: Port parameter is missing. Please specify the --port parameter.');
  process.exit(1);
}
if (!cache) {
  console.error('Error: Cache parameter is missing. Please specify the --cache parameter.');
  process.exit(1);
}
// Якщо параметри є, можна перейти до виконання основної логіки
fsPromises.mkdir(cache, { recursive: true })
  .catch((err) => {
    console.error(`Error creating cache directory: ${err.message}`);
    process.exit(1);
  });

  app.get('/notes/:name', (req, res) => {
    const notePath = path.join(cachePath, req.params.name + '.txt');
    if (!fs.existsSync(notePath)) {
        return res.status(404).send('Not found');
    }
    const noteContent = fs.readFileSync(notePath, 'utf-8');
    res.send(noteContent);
});
app.put('/notes/:name', (req, res) => {
    const notePath = path.join(cachePath, req.params.name + '.txt');
    if (!fs.existsSync(notePath)) {
        return res.status(404).send('Not found');
    }
    fs.writeFileSync(notePath, req.body.text);
    res.send('Note updated');
});
app.delete('/notes/:name', (req, res) => {
    const notePath = path.join(cachePath, req.params.name + '.txt');
    if (!fs.existsSync(notePath)) {
        return res.status(404).send('Not found');
    }
    fs.unlinkSync(notePath);
    res.send('Note deleted');
});
app.get('/notes', (req, res) => {
    const notes = fs.readdirSync(cachePath)
        .filter(file => file.endsWith('.txt'))
        .map(file => ({
            name: file.replace('.txt', ''),
            text: fs.readFileSync(path.join(cachePath, file), 'utf-8')
        }));
    res.json(notes);
});
app.post('/write', (req, res) => {
    const noteName = req.body.note_name;
    const noteText = req.body.note;

    const notePath = path.join(cachePath, noteName + '.txt');
    if (fs.existsSync(notePath)) {
        return res.status(400).send('Note already exists');
    }
    fs.writeFileSync(notePath, noteText);
    res.status(201).send('Note created');
});
app.get('/UploadForm.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'UploadForm.html'));
});
app.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}`);
});
