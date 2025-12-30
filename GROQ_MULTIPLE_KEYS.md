# 🔑 Sistema de Múltiplas API Keys do Groq

## Como Funciona

O sistema agora tenta **até 3 API keys** automaticamente:
1. Tenta `GROQ_API_KEY` (primeira)
2. Se der erro 429 (limite), tenta `GROQ_API_KEY_2`
3. Se ainda falhar, tenta `GROQ_API_KEY_3`

**Resultado:** Você multiplica seu limite diário!
- 1 key = 100.000 tokens/dia
- 2 keys = 200.000 tokens/dia
- 3 keys = 300.000 tokens/dia

## Como Adicionar Mais Keys

### 1. Criar Nova Conta Groq

1. Acesse: https://console.groq.com
2. Faça logout da conta atual
3. Crie nova conta com **email diferente** (pode usar Gmail com + trick: seu.email+groq2@gmail.com)
4. Vá em **API Keys**
5. Clique em **Create API Key**
6. Copie a nova key

### 2. Adicionar no Arquivo .env

Abra o arquivo `.env` na raiz do projeto e adicione:

```env
GROQ_API_KEY=gsk_sua_primeira_key_aqui
GROQ_API_KEY_2=gsk_sua_segunda_key_aqui
GROQ_API_KEY_3=gsk_sua_terceira_key_aqui
```

### 3. Adicionar no Vercel (Deploy)

1. Acesse: https://vercel.com/seu-projeto
2. Vá em **Settings** → **Environment Variables**
3. Adicione:
   - `GROQ_API_KEY_2` = sua segunda key
   - `GROQ_API_KEY_3` = sua terceira key
4. Clique em **Save**
5. Faça redeploy

### 4. Adicionar no Render (Backend)

1. Acesse: https://dashboard.render.com
2. Selecione seu serviço backend
3. Vá em **Environment** → **Environment Variables**
4. Adicione:
   - `GROQ_API_KEY_2` = sua segunda key
   - `GROQ_API_KEY_3` = sua terceira key
5. Clique em **Save Changes**
6. O servidor reinicia automaticamente

## Logs no Console

Quando o sistema estiver funcionando, você verá logs como:

```
[Groq] Tentando API key 1/3...
[Groq] ✅ API key 1 funcionou!
```

Ou se a primeira falhar:

```
[Groq] Tentando API key 1/3...
[Groq] API key 1 error: Rate limit reached
[Groq] Tentando API key 2/3...
[Groq] ✅ API key 2 funcionou!
```

## Dicas

- **Use emails diferentes** para cada conta Groq
- **Guarde as keys em local seguro** (não commite no Git!)
- **Monitore o uso** em https://console.groq.com/usage
- Se quiser adicionar mais keys, edite `server.js` linha 67

## Status Atual

✅ Sistema de fallback implementado
⏳ Aguardando você adicionar `GROQ_API_KEY_2` e `GROQ_API_KEY_3`
