# Configuração de Variáveis de Ambiente

## Sistema de Configuração Automática

O projeto usa um sistema automático de configuração que escolhe entre desenvolvimento e produção.

## Arquivos de Configuração

### `.env.desenvolvimento` (commitado no git)
Configuração para desenvolvimento local:
```env
NUXT_PUBLIC_API_BASE=http://localhost:3002/
```

### `.env.producao` (commitado no git)
Configuração para produção:
```env
NUXT_PUBLIC_API_BASE=https://corrida-nest.onrender.com/
```

### `.env` (NÃO commitado - gerado automaticamente)
Este arquivo é gerado automaticamente pelo script `setup-env.js`

## Como Funciona

### Lógica de Seleção
1. Se existir `.env.producao` → usa produção
2. Senão, se existir `.env.desenvolvimento` → usa desenvolvimento
3. O arquivo `.env` é criado automaticamente antes de rodar `dev` ou `build`

### Scripts do NPM

```bash
# Configurar ambiente automaticamente
npm run setup-env

# Rodar em desenvolvimento (configura automaticamente)
npm run dev

# Build para produção (configura automaticamente)
npm run build
```

## Como Alternar Entre Ambientes

### Para usar DESENVOLVIMENTO (localhost):
```bash
# Opção 1: Apagar o .env.producao temporariamente
rm .env.producao
npm run dev

# Opção 2: Renomear temporariamente
mv .env.producao .env.producao.backup
npm run dev
```

### Para usar PRODUÇÃO:
```bash
# Garantir que .env.producao existe
npm run dev
```

## Personalização

Se quiser uma configuração personalizada local, crie um `.env` manualmente:

```bash
# .env (não será commitado)
NUXT_PUBLIC_API_BASE=http://192.168.1.100:3002/
```

O script `setup-env.js` NÃO sobrescreverá um `.env` existente.

## Estrutura de Arquivos

```
project/
├── .env                    # Gerado automaticamente (gitignored)
├── .env.desenvolvimento    # Config de DEV (commitado)
├── .env.producao          # Config de PROD (commitado)
├── scripts/
│   └── setup-env.js       # Script de configuração automática
└── package.json           # Scripts predev e prebuild
```

## Importante

- ✅ `.env.desenvolvimento` e `.env.producao` PODEM ser commitados
- ❌ `.env` NÃO é commitado (gerado automaticamente)
- 🔄 O ambiente é configurado automaticamente ao rodar `npm run dev` ou `npm run build`
