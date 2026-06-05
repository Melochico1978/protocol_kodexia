# 🚀 GUIA DE EXECUÇÃO - PROTOCOL KODEXIA

## ✅ Pré-requisitos Instalados

- ✅ Java 25.0.3 JDK
- ✅ Node.js v24.12.0
- ✅ npm 11.6.2
- ✅ Angular CLI 19.2.10
- ✅ 552 dependências npm instaladas

---

## 📋 PASSO A PASSO PARA EXECUTAR

### ⚙️ Terminal 1: Backend Java (OPCIONAL - Apenas Demonstração)

```bash
# Navegar para o backend
cd "c:\Users\CHICO\Desktop\tcc kodexia\back\src"

# Compilar (se necessário)
javac model/GrupoCarta.java model/Carta.java model/CartaLendaria.java model/Jogador.java controller/Partida.java Main.java

# Executar demonstração de jogo
java Main
```

**Esperado:**
```
>>> INICIANDO O JOGO: PROGRAMAÇÃO SUPER TRUNFO <<<
=== CARTAS DISTRIBUÍDAS ===
João recebeu 16 cartas.
Maria recebeu 16 cartas.
...
```

---

### 📡 Terminal 2: JSON Server (API Mock)

```bash
# Navegar para o frontend
cd "c:\Users\CHICO\Desktop\tcc kodexia\front"

# Iniciar servidor JSON na porta 3000
npm run start:server
```

**Ou manualmente:**
```bash
npx json-server --watch db.json --port 3000
```

**Esperado:**
```
  \{^\}
  ｜ (o_o)
  ｜ > )  ) >
  ｜ (  (  (
  ｜
  ｜ Mock server is running at http://localhost:3000
```

✅ Servidor rodando em: **http://localhost:3000**  
✅ Banco de dados: **db.json**  
✅ Endpoint: **GET/POST/DELETE http://localhost:3000/cartas**

---

### ▶️ Terminal 3: Angular Development Server

```bash
# Navegar para o frontend (novo terminal)
cd "c:\Users\CHICO\Desktop\tcc kodexia\front"

# Iniciar servidor Angular (porta 4200 por padrão)
npm start
```

**Esperado (após ~30-60 segundos):**
```
✔ Compiled successfully.

→ Local:        http://localhost:4200
→ open http://localhost:4200/ in your browser
```

---

## 🎮 ACESSAR O JOGO

1. **Abra o navegador:**
   ```
   http://localhost:4200
   ```

2. **Você verá:**
   - Splash Screen (1-2 segundos)
   - Menu Principal (Inicio)
   - Opções: Jogar, Gerenciar Cartas, Ajuda

3. **Para Jogar:**
   - Clique em "Jogar"
   - Selecione 16 cartas do banco
   - Clique "Iniciar Partida"
   - Selecione um atributo para comparar
   - CPU joga automaticamente após 3.5s
   - Vencedor acumula cartas
   - Jogo termina quando um jogador fica sem cartas

---

## 🛠️ COMANDOS ÚTEIS

### Build para Produção
```bash
cd "c:\Users\CHICO\Desktop\tcc kodexia\front"
npm run build
```
Output: `dist/super-trunfo-rally/` (pronto para deploy)

### Executar Testes
```bash
cd "c:\Users\CHICO\Desktop\tcc kodexia\front"
npm test
```

### Modo Watch (Rebuild automático)
```bash
cd "c:\Users\CHICO\Desktop\tcc kodexia\front"
npm run watch
```

### Verificar Dependências
```bash
cd "c:\Users\CHICO\Desktop\tcc kodexia\front"
npm list
```

---

## 🔍 TROUBLESHOOTING

### Porta 3000 já em uso?
```bash
# Mudar porta do JSON Server
npx json-server --watch db.json --port 3001

# Depois editar em src/app/services/carta.service.ts:
# apiUrl = 'http://localhost:3001/cartas'
```

### Porta 4200 já em uso?
```bash
# Angular usará a próxima porta disponível automaticamente
ng serve --port 4201
```

### Limpeza completa (node_modules corrompido)
```bash
cd "c:\Users\CHICO\Desktop\tcc kodexia\front"
rm -r node_modules package-lock.json
npm install
```

### Verificar se Java está instalado
```bash
java -version
javac -version
```

---

## 📊 ARQUITETURA DE EXECUÇÃO

```
┌─────────────────────────────────────────────────────────────────┐
│                    Browser (localhost:4200)                     │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Angular Application (standalone components)             │   │
│  │ ├─ Splash Screen                                        │   │
│  │ ├─ Menu Principal                                       │   │
│  │ ├─ Game Board (Partida Component)                       │   │
│  │ ├─ Card Management (CRUD Interface)                     │   │
│  │ └─ Help/Settings                                        │   │
│  └─────────────────────────────────────────────────────────┘   │
└──────────────────────────┬──────────────────────────────────────┘
                           │ HTTP Requests (RxJS Observables)
                           │
┌──────────────────────────▼──────────────────────────────────────┐
│         JSON Server (localhost:3000)                             │
│  ├─ GET /cartas - Buscar todas as cartas                        │
│  ├─ POST /cartas - Criar nova carta                             │
│  └─ DELETE /cartas/:id - Remover carta                          │
│  └─ Banco: db.json (32 cartas inicializadas)                    │
└──────────────────────────────────────────────────────────────────┘

Backend Java (Opcional - Standalone Demo):
└─ java Main (Simula uma rodada completa)
```

---

## 📈 FLUXO DO JOGO COMPLETO

```
1. Aplicação Inicia
   ↓
2. Splash Screen (2s)
   ↓
3. Menu Principal
   ↓
4. Selecionar "Jogar"
   ↓
5. CartaService.getCartas() → GET /cartas (JSON Server)
   ↓
6. Player seleciona 16 cartas
   ↓
7. Inicia Partida
   ↓
8. FAZE 1 - COMPRAR:
   - Player carta do topo
   - CPU carta do topo
   ↓
9. FASE 2 - ESCOLHER:
   - Player clica em atributo (performance, sintaxe, etc)
   - CPU escolhe aleatoriamente
   ↓
10. FASE 3 - COMPARAR:
    - Sistema compara valores
    - Vencedor leva todas as cartas
    - Se empate: cartas vão para "pote de empate"
    - Próximo vencedor leva tudo
    ↓
11. Loop voltar para FASE 1
    ↓
12. Se Player sem cartas → DERROTA
    Se CPU sem cartas → VITÓRIA
    ↓
13. Voltar ao Menu
```

---

## 💾 ESTRUTURA DE DADOS

### Carta (db.json)
```json
{
  "id": 1,
  "grupo": "A",
  "codigo": "1",
  "nome": "Python",
  "imagem": "assets/images/python.png",
  "performance": 85,
  "sintaxe": 98,
  "seguranca": 90,
  "longevidade": 95,
  "popularidade": 100,
  "abstracao": 92,
  "versatilidade": 100,
  "lendaria": true,
  "selecionada": false
}
```

---

## ✨ RECURSOS DESTACADOS

✅ **Super Trunfo:** Cartas lendárias (Grupo A) vencem tudo (exceto outra Grupo A)  
✅ **Empate Leva Tudo:** Sistema que acumula cartas em empate  
✅ **7 Atributos:** Performance, Sintaxe, Segurança, Longevidade, Popularidade, Abstração, Versatilidade  
✅ **Tema Cibernético:** Estilo VT323 monospace, cores cyan/red, design futurista  
✅ **Responsive Design:** Funciona em mobile/tablet/desktop  
✅ **CRUD Completo:** Criar, ler, atualizar, deletar cartas  
✅ **Estado Reativo:** Angular Signals + RxJS Observables

---

## 🎯 PRÓXIMOS PASSOS RECOMENDADOS

1. **Executar os 3 serviços** simultaneamente (Terminal 1, 2, 3)
2. **Testar o fluxo completo** do jogo
3. **Verificar API communication** via DevTools (F12 → Network tab)
4. **Jogar algumas rodadas** para validar lógica
5. **Testar CRUD** (criar/deletar cartas via gerenciador)

---

**Boa sorte no Protocol Kodexia! 🚀**
