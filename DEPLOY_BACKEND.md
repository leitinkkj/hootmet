# 🔥 HotMeet - Deploy Backend (Render)

## 🚀 Deploy Rápido no Render

### 1️⃣ Criar Web Service

1. Acesse: https://dashboard.render.com/
2. Clique em **"New +"** → **"Web Service"**
3. Conecte seu repositório GitHub: `leitinkkj/hootmet`
4. Configure:
   - **Name**: `hotmeet-api`
   - **Region**: Oregon (US West) ou mais próximo
   - **Branch**: `main`
   - **Root Directory**: deixe vazio
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: `Free`

### 2️⃣ Adicionar Variáveis de Ambiente

Na seção **Environment Variables**, adicione (copie do seu `.env` local):

```
GROQ_API_KEY=sua_chave_groq_aqui
PORT=3001
SUPABASE_URL=sua_url_supabase_aqui
SUPABASE_ANON_KEY=sua_chave_supabase_aqui
NODE_ENV=production
```

### 3️⃣ Deploy!

Clique em **"Create Web Service"** e aguarde o deploy (~3-5 minutos).

### 4️⃣ Copiar URL da API

Após o deploy, você receberá uma URL tipo:
```
https://hotmeet-api.onrender.com
```

### 5️⃣ Atualizar Frontend (Vercel)

No Vercel, adicione a variável de ambiente:

```
VITE_API_URL=https://hotmeet-api.onrender.com
```

E no código (`src/App.tsx`), troque:
```typescript
const API_URL = 'http://localhost:3001';
```

Por:
```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
```

---

## ⚠️ Notas Importantes

- **Free Tier do Render**: O servidor "dorme" após 15 minutos de inatividade. A primeira requisição pode demorar ~30s para "acordar".
- **CORS**: O `server.js` já está configurado com CORS para aceitar requisições do frontend.
- **SSL**: O Render fornece HTTPS automaticamente.

---

## 🔧 Alternativas de Deploy

Se preferir outra plataforma:

### Railway
1. https://railway.app/new
2. Conecte o GitHub
3. Configure as mesmas variáveis de ambiente
4. Deploy automático!

### Heroku (Pago)
```bash
heroku create hotmeet-api
heroku config:set GROQ_API_KEY=xxx
git push heroku main
```

---

## ✅ Checklist Final

- [ ] Backend deployado no Render
- [ ] Variáveis de ambiente configuradas
- [ ] URL da API copiada
- [ ] Frontend atualizado com `VITE_API_URL`
- [ ] Redeploy do frontend no Vercel
- [ ] Testar chat AI funcionando online! 🎉
