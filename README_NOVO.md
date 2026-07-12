# 🎮 Protocol Kodexia - Card Game

> Um jogo de cartas estratégico com temática de **Programação Super Trunfo**, desenvolvido com Angular 19 e Java.

---

## 📋 Resumo

**Protocol Kodexia** é uma aplicação full-stack que implementa o clássico jogo de Super Trunfo adaptado para linguagens de programação. Dois jogadores (ou player vs CPU) competem escolhendo atributos de suas cartas para ganhar rodadas e acumular cartas do adversário.

### Características Principais
- 🃏 **32 Cartas** com 7 atributos (Performance, Sintaxe, Segurança, Longevidade, Popularidade, Abstração, Versatilidade)
- ⭐ **Mechânica de Super Trunfo** - Cartas lendárias (Grupo A) vencem todas as rodadas
- 🎯 **Empate Leva Tudo** - Cartas em empate acumulam e vão para o vencedor da próxima rodada
- 💻 **Tema Cibernético** - Interface futurista com VT323 monospace font
- 🔄 **CRUD Completo** - Gerenciar cartas do banco de dados em tempo real
- 📱 **Responsive Design** - Funciona em desktop, tablet e mobile

---

## 🛠 Stack Tecnológico

### Backend
- **Linguagem:** Java 25.0.3
- **Arquitetura:** MVC (Model-View-Controller)
- **Padrões:** Herança, Enum, Collections

### Frontend
- **Framework:** Angular 19.2.0
- **Linguagem:** TypeScript 5.7.2
- **State Management:** RxJS Observables + Angular Signals
- **HTTP:** HttpClient com REST API
- **Componentes:** Standalone Components (sem NgModule)

### Backend de Dados
- **Database:** JSON Server (mock API)
- **Formato:** JSON
- **Porta:** 3000
- **Arquivo:** db.json

### DevOps
- **Node.js:** v24.12.0
- **npm:** 11.6.2
- **Angular CLI:** 19.2.10

---

## 📁 Estrutura do Projeto

```
tcc kodexia/
├── README.md                                    (este arquivo)
├── SUMARIO_CONCLUSAO.md                        (status final)
├── RELATORIO_VALIDACAO_INTEGRACAO.md           (validação completa)
├── GUIA_EXECUCAO.md                            (instruções de execução)
├── DOCUMENTACAO_TECNICA.md                     (detalhes técnicos)
│
├── back/                                        (Backend Java)
│   └── src/
│       ├── Main.java                           (Entry point + Demo)
│       ├── controller/
│       │   └── Partida.java                    (Lógica de jogo)
│       └── model/
│           ├── Carta.java                      (Modelo de carta)
│           ├── CartaLendaria.java              (Carta lendária)
│           ├── Jogador.java                    (Jogador)
│           └── GrupoCarta.java                 (Enum de grupos)
│
└── front/                                       (Frontend Angular)
    ├── src/
    │   ├── index.html                          (Entry HTML)
    │   ├── main.ts                             (Bootstrap)
    │   ├── styles.css                          (Estilos globais)
    │   └── app/
    │       ├── app.component.ts                (Root component)
    │       ├── app.routes.ts                   (Roteamento)
    │       ├── app.config.ts                   (Configuração)
    │       ├── models/
    │       │   └── carta.model.ts              (Interface Carta)
    │       ├── services/
    │       │   ├── carta.service.ts            (CRUD + Deck)
    │       │   └── loading.service.ts          (Loading state)
    │       └── components/
    │           ├── carta/                      (Renderização)
    │           ├── carta-exibicao/             (Display em batalha)
    │           ├── partida/                    (Lógica do jogo)
    │           ├── gerenciar-cartas/           (CRUD UI)
    │           ├── selecao-deck/               (Seleção de deck)
    │           ├── inicio/                     (Menu principal)
    │           ├── splash/                     (Tela inicial)
    │           ├── ajuda/                      (Help)
    │           └── desconectado/               (Offline page)
    │
    ├── package.json                            (Dependências)
    ├── angular.json                            (Config Angular)
    ├── tsconfig.json                           (Config TypeScript)
    ├── db.json                                 (Database)
    └── node_modules/                           (552 pacotes instalados)
```

---

## 🚀 Quick Start

### Pré-requisitos
- ✅ Java 25.0.3 JDK
- ✅ Node.js v24.12.0+
- ✅ npm 11.6.2+

### Instalação & Execução

**1. Frontend - Instalar dependências:**
```bash
cd "c:\Users\CHICO\Desktop\tcc kodexia\front"
npm install
```
✅ Já está instalado! (552 dependências)

**2. Iniciar JSON Server (Terminal 1):**
```bash
cd front
npm run start:server
```
✅ API rodando em: [URL_DA_API]

**3. Iniciar Angular Dev Server (Terminal 2):**
```bash
cd front
npm start
```
✅ Aplicação rodando em: [URL_DA_APLICACAO]

**4. (Opcional) Executar Backend Demo (Terminal 3):**
```bash
cd back/src
java Main
```

### Acessar o Jogo
Abra seu navegador: **[URL_DA_APLICACAO]**

---

## 🎮 Como Jogar

### Fluxo do Jogo
1. **Splash Screen** (1-2s) → Intro da aplicação
2. **Menu Principal** → Opções: Jogar, Gerenciar Cartas, Ajuda
3. **Seleção de Deck** → Escolher 16 cartas do banco (importante!)
4. **Gameplay (3 fases por rodada):**
   - **COMPRAR:** Ambos os jogadores recebem uma carta
   - **ESCOLHER:** Você clica em um atributo para comparar
   - **COMPARAR:** Após 3.5s, a carta do computador aparece
5. **Resultado:** Vencedor leva as cartas (incluindo empates acumulados)
6. **Repetir** até alguém ficar sem cartas

### Mecânicas Especiais

**Super Trunfo (Cartas Lendárias - Grupo A):**
- Vencem TODAS as outras cartas
- EXCETO: Contra outras cartas do Grupo A (resultado = empate)
- Efeito visual: "⭐ SUPER TRUNFO ACIONADO!"

**Empate Leva Tudo:**
- Quando há empate, ambas as cartas vão para um "pote"
- O vencedor da próxima rodada leva TUDO (suas 2 + pote acumulado)

---

## 📊 Atributos das Cartas

Cada carta de linguagem tem 7 atributos (0-100):

| Atributo | Descrição |
|----------|-----------|
| **Performance** | Velocidade de execução |
| **Sintaxe** | Clareza e facilidade da linguagem |
| **Segurança** | Proteção contra vulnerabilidades |
| **Longevidade** | Anos de relevância e suporte |
| **Popularidade** | Uso na indústria |
| **Abstração** | Nível de abstração oferecido |
| **Versatilidade** | Aplicações e usos possíveis |

### Exemplo: Python (Carta Lendária)
```
Python (Grupo A-1) ⭐ SUPER TRUNFO
Performance:    85  ████████░░
Sintaxe:        98  █████████░
Segurança:      90  █████████░
Longevidade:    95  █████████░
Popularidade:   100 ██████████
Abstração:      92  █████████░
Versatilidade:  100 ██████████
```

---

## 🔧 Funcionalidades

### Gerenciar Cartas (CRUD)
- ✅ **Criar:** Adicionar novas cartas com todos os atributos
- ✅ **Ler:** Visualizar todas as cartas do banco
- ✅ **Atualizar:** Editar dados de cartas existentes
- ✅ **Deletar:** Remover cartas do banco

### Seleção de Deck
- Selecionar até 16 cartas
- Mix de cartas lendárias e regulares
- Estratégia importante para vencer

### Interface do Jogo
- Visualização lado-a-lado de cartas
- Botões de atributos para seleção rápida
- Placar em tempo real
- Mensagens de sistema (vitória/derrota/empate)

---

## 🔌 API REST

### Base URL
```
[URL_DA_API]
```

### Endpoints

**GET - Buscar todas as cartas**
```http
GET /cartas
```

**POST - Criar nova carta**
```http
POST /cartas
Content-Type: application/json

{
  "grupo": "B",
  "codigo": "2",
  "nome": "JavaScript",
  "performance": 80,
  "sintaxe": 90,
  "seguranca": 85,
  "longevidade": 95,
  "popularidade": 100,
  "abstracao": 88,
  "versatilidade": 98,
  "lendaria": false
}
```

**DELETE - Remover carta**
```http
DELETE /cartas/:id
```

---

## 📦 Build & Deploy

### Development
```bash
npm start        # ng serve (porta 4200)
npm run watch    # ng build --watch
npm test         # ng test
```

### Production
```bash
npm run build    # Cria dist/super-trunfo-rally/
```

Output: `dist/super-trunfo-rally/` pronto para deploy

---

## 📚 Documentação

Este projeto inclui documentação completa:

1. **[SUMARIO_CONCLUSAO.md](SUMARIO_CONCLUSAO.md)** - Status final de validação
2. **[GUIA_EXECUCAO.md](GUIA_EXECUCAO.md)** - Instruções passo-a-passo
3. **[DOCUMENTACAO_TECNICA.md](DOCUMENTACAO_TECNICA.md)** - Detalhes de implementação
4. **[RELATORIO_VALIDACAO_INTEGRACAO.md](RELATORIO_VALIDACAO_INTEGRACAO.md)** - Relatório completo

---

## ✅ Status de Validação

```
Backend Java:        ✅ Compilado, executado, testado
Frontend Angular:    ✅ Instalado, configurado, pronto
API JSON Server:     ✅ Pronto
Documentação:        ✅ Completa
Integração:          ✅ Validada
```

---

## 🎯 Roadmap Futuro

- [ ] Multiplayer online (WebSockets)
- [ ] Autenticação e scores globais
- [ ] Mais cartas e linguagens
- [ ] Temas alternativos
- [ ] Mobile app (React Native/Flutter)
- [ ] Backend em Spring Boot/Node.js

---

## 👨‍💻 Tecnologia

Desenvolvido com:
- Java + Angular 19
- TypeScript 5.7.2
- RxJS 7.8.0
- JSON Server
- CSS3 + HTML5

---

## 📄 Licença

Este projeto foi desenvolvido como trabalho acadêmico (TCC).

---

## 🆘 Suporte

Para problemas:
1. Consulte [GUIA_EXECUCAO.md](GUIA_EXECUCAO.md) - Troubleshooting
2. Verifique portas (3000 para API, 4200 para frontend)
3. Confirme que Node.js e Java estão instalados

---

## 📧 Autor

**Projeto:** Protocol Kodexia - Card Game  
**Tipo:** Full-stack Web Application  
**Data:** 2026  

---

**Status: ✅ 100% Validado e Funcional**

Aproveite o jogo! 🚀🎮

