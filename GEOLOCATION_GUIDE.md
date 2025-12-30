# 🌍 Guia de Implementação - Geolocalização e Toast de Boas-Vindas

## ✅ Arquivos Criados

1. **`src/services/geolocation.ts`** - Serviço de geolocalização via IP
2. **`src/components/WelcomeToast.tsx`** - Componente de notificação
3. **`src/components/Toast.css`** - Estilos do toast

## 📝 Próximos Passos - Integração Manual

### 1. Adicionar Estados no App.tsx

Procure a área onde os estados são definidos (logo após `function App()` ou similar) e adicione:

```typescript
// Estados de Geolocalização
const [showWelcomeToast, setShowWelcomeToast] = useState(false);
const [userCity, setUserCity] = useState<string | null>(null);
```

### 2. Adicionar useEffect de Geolocalização

Logo após os outros `useEffect`, adicione:

```typescript
// Detectar localização ao carregar o app
useEffect(() => {
    const initializeLocation = async () => {
        // Verificar se já temos localização salva
        let location = getSavedLocation();
        
        if (!location) {
            // Buscar nova localização via API
            location = await getUserLocation();
            saveUserLocation(location);
        }
        
        // Salvar cidade no estado
        setUserCity(location.city);
        
        // Mostrar toast apenas na primeira visita da sessão
        const hasSeenWelcome = sessionStorage.getItem('hasSeenWelcome');
        if (!hasSeenWelcome) {
            setShowWelcomeToast(true);
            sessionStorage.setItem('hasSeenWelcome', 'true');
            
            // Auto-fechar após 8 segundos
            setTimeout(() => {
                setShowWelcomeToast(false);
            }, 8000);
        }
    };
    
    initializeLocation();
}, []);
```

### 3. Renderizar Toast no JSX

No return do componente principal, adicione (logo no início, antes de outros elementos):

```tsx
return (
    <div style={{ minHeight: '100vh', background: '#05050a' }}>
        <FuturisticBackground />
        
        {/* Toast de Boas-Vindas */}
        {showWelcomeToast && (
            <WelcomeToast 
                message="Bem-vindo ao HotMeet!"
                city={userCity || undefined}
                onClose={() => setShowWelcomeToast(false)}
            />
        )}
        
        {/* Resto do conteúdo... */}
        <Header onToggleSidebar={() => setSidebarOpen(true)} />
        {/* ... */}
    </div>
);
```

## 🧪 Como Testar

1. **Limpe o cache do navegador** (Ctrl+Shift+Delete)
2. **Abra http://localhost:5174/**
3. **Deve aparecer** um toast rosa/roxo no canto superior direito dizendo:
   ```
   📍 Bem-vindo ao HotMeet!
   Olá! Você é de [Sua Cidade] 🔥
   Conecte-se com pessoas próximas de você
   ```
4. **O toast some automaticamente** após 8 segundos
5. **Recarregue a página** - o toast NÃO aparece novamente (usa sessionStorage)
6. **Feche e abra o navegador** - o toast aparece novamente

## 🔍 Debug

Se o toast não aparecer, veja o console do navegador (F12):

1. Verifique se há erros de importação
2. Verifique se a API `ipapi.co` está respondendo:
   ```javascript
   fetch('https://ipapi.co/json/').then(r => r.json()).then(console.log)
   ```
3. Verifique o sessionStorage:
   ```javascript
   session Storage.getItem('hasSeenWelcome')
   ```

## 🎨 Personalizar

### Mudar Tempo de Exibição

No useEffect, troque `8000` por outro valor (em milissegundos):

```typescript
setTimeout(() => {
    setShowWelcomeToast(false);
}, 5000); // 5 segundos
```

### Mudar Estilo do Toast

Edite `src/components/Toast.css` - pode mudar:
- Cores do gradiente
- Tamanho (`min-width`, `max-width`)
- Posição (`top`, `right`)
- Animação (`slideInRight`)

### Mostrar Sempre (não só primeira vez)

Remova a verificação do sessionStorage:

```typescript
// Simplesmente:
setShowWelcomeToast(true);
setTimeout(() => setShowWelcomeToast(false), 8000);
```

## 🚀 Próximas Melhorias

Depois de funcionar, podemos:

1. **Usar localização real** (GPS do navegador com `navigator.geolocation`)
2. **Filtrar perfis por distância** usando as coordenadas
3. **Mostrar distância exata** nos cards ("2.5 km de você")
4. **Priorizar perfis próximos** nas seções "Top 3 da Cidade"
5. **Pesquisar por cidade** ao digitar

---

**Precisa de ajuda com a integração?** Me chame quando estiver testando! 🔥
