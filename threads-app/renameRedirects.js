const fs = require('fs');
const path = require('path');

const source = path.join(__dirname, 'dist', 'threads-app', 'browser', 'redirects.txt');
const destination = path.join(__dirname, 'dist', 'threads-app', 'browser', '_redirects');

console.log('Tentando renomear o arquivo...');
console.log('Caminho de origem:', source);
console.log('Caminho de destino:', destination);

if (!fs.existsSync(source)) {
    console.error(`Arquivo não encontrado: ${source}`);
    process.exit(1);
}

try {
    fs.renameSync(source, destination);
    console.log('Arquivo renomeado com sucesso!');
} catch (err) {
    console.error('Erro ao renomear o arquivo:', err);
    process.exit(1);
}
