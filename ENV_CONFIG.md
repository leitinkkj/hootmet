# Configuração de Variáveis de Ambiente

## Frontend (Vercel)

Adicione estas variáveis em: https://vercel.com/[seu-usuario]/hootmet/settings/environment-variables

```
VITE_API_URL=https://hootmet.onrender.com
VITE_SUPABASE_URL=https://ksajfkeidfaovrtcgwvd.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzYWpma2VpZGZhb3ZydGNnd3ZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5MDE1NDMsImV4cCI6MjA4MjQ3NzU0M30.Fr75LLYBoVIivmkdmzfhhaBZ87J92DLXi5_lYyvSsxc
```

Marque todas as opções:
- [x] Production
- [x] Preview
- [x] Development

Depois clique em **Save** e faça **Redeploy** do projeto.

## Backend (Render)

Já configuradas em: https://dashboard.render.com/web/[seu-servico]/env

✅ GROQ_API_KEY
✅ SUPABASE_URL
✅ SUPABASE_ANON_KEY
✅ PORT (3001)
✅ NODE_ENV (production)

---

## ✅ Checklist Final

- [ ] Variáveis adicionadas no Render
- [ ] Render redeploy completo (sem erro de API Key)
- [ ] Variáveis adicionadas no Vercel
- [ ] Vercel redeploy feito
- [ ] Testar chat AI no site deployado! 🎉
