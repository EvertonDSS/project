import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Caminho dos arquivos
const rootDir = path.join(__dirname, '..');
const envProducao = path.join(rootDir, '.env.producao');
const envDesenvolvimento = path.join(rootDir, '.env.desenvolvimento');
const envDestino = path.join(rootDir, '.env');

// Se .env já existe, não sobrescrever (configuração manual do usuário)
if (fs.existsSync(envDestino)) {
  console.log('ℹ Arquivo .env já existe - mantendo configuração atual');
  process.exit(0);
}

// Verificar qual arquivo usar
if (fs.existsSync(envProducao)) {
  console.log('✓ Usando configuração de PRODUÇÃO (.env.producao)');
  fs.copyFileSync(envProducao, envDestino);
  console.log('✓ Arquivo .env configurado com sucesso!');
} else if (fs.existsSync(envDesenvolvimento)) {
  console.log('✓ Usando configuração de DESENVOLVIMENTO (.env.desenvolvimento)');
  fs.copyFileSync(envDesenvolvimento, envDestino);
  console.log('✓ Arquivo .env configurado com sucesso!');
} else {
  console.error('✗ Nenhum arquivo de configuração encontrado!');
  console.error('  Crie .env.producao ou .env.desenvolvimento');
  process.exit(1);
}

