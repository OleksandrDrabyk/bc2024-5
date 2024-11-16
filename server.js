const http = require('http');
const fs = require('fs');
const { program } = require('commander');

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

const { host, port, cache } = program.opts(); // Отримуємо параметри з командного рядка
const fsPromises = fs.promises;

// Перевірки на пропущені параметри і кастомні помилки
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

// Створення сервера
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end(`Server running at http://${host}:${port}\n`);
});

server.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}`);
});
