# 🔧 DOCUMENTAÇÃO TÉCNICA - PROTOCOL KODEXIA

## 📚 Índice
1. [Arquitetura](#arquitetura)
2. [Backend Java](#backend-java)
3. [Frontend Angular](#frontend-angular)
4. [API & Comunicação](#api--comunicação)
5. [Modelos de Dados](#modelos-de-dados)
6. [Lógica de Jogo](#lógica-de-jogo)

---

## Arquitetura

### Visão Geral
```
┌─────────────────────────────────────────────────────┐
│           PROTOCOL KODEXIA - CARD GAME             │
├─────────────────────────────────────────────────────┤
│  Frontend (Angular 19.2.0)    Backend (Java)       │
│  ├─ Standalone Components     ├─ MVC Pattern       │
│  ├─ RxJS Observables          ├─ Model Layer       │
│  ├─ Angular Signals           ├─ Controller Layer  │
│  └─ HttpClient                └─ Business Logic    │
│                                                     │
│         JSON Server (Mock API)                     │
│         Port: 3000                                 │
│         Database: db.json                          │
└─────────────────────────────────────────────────────┘
```

### Padrões de Design
- **MVC:** Backend organizado em Model/View/Controller
- **Service Pattern:** CartaService e LoadingService para lógica compartilhada
- **Observable Pattern:** RxJS para async operations
- **Signal Pattern:** Angular Signals para state management
- **Dependency Injection:** Angular DI em toda aplicação

---

## Backend Java

### Estrutura de Pacotes
```
src/
├── model/
│   ├── GrupoCarta.java         (Enum A-H)
│   ├── Carta.java              (14 atributos + validação)
│   ├── CartaLendaria.java      (Herança de Carta)
│   └── Jogador.java            (Gerenciamento de deck)
├── controller/
│   └── Partida.java            (Lógica de rodadas)
└── Main.java                   (Entry point + Demo)
```

### Modelo de Dados - Carta

#### Classe Carta
```java
public class Carta {
    private GrupoCarta grupo;
    private String codigo;
    private String nome;
    private double performance;    // 0-100
    private double sintaxe;         // 0-100
    private double seguranca;       // 0-100
    private double longevidade;     // 0-100
    private double popularidade;    // 0-100
    private double abstracao;       // 0-100
    private double versatilidade;   // 0-100
    
    // Métodos
    public Carta(GrupoCarta, String, String, double, double, double, double, double, double, double)
    public void validarNota(double nota)
    public void exibirCarta()
    public GrupoCarta getGrupo()
    public String getCodigo()
    public String getNome()
    // ... getters
}
```

**Atributos Validados:**
- Nome e código não-vazios
- Todas as 7 notas entre 0-100

**Exemplo de Instância:**
```java
Carta python = new Carta(
    GrupoCarta.A,
    "1",
    "Python",
    85,    // performance
    98,    // sintaxe
    90,    // seguranca
    95,    // longevidade
    100,   // popularidade
    92,    // abstracao
    100    // versatilidade
);
```

#### Classe CartaLendaria
```java
public class CartaLendaria extends Carta {
    // Herda todos os atributos de Carta
    
    public CartaLendaria(GrupoCarta, String, String, double, double, double, double, double, double, double)
    
    public boolean ehImbativel(Carta cartaAdversaria)
    // Retorna true EXCETO quando cartaAdversaria.getGrupo() == GrupoCarta.A
    
    public void exibirCarta()
    // Adiciona "★ CARTA LENDÁRIA ★" no output
}
```

**Super Trunfo Mechânica:**
- CartaLendaria vence TODAS as cartas
- **EXCETO:** Contra outras cartas do Grupo A (resultado = empate)

#### Enum GrupoCarta
```java
public enum GrupoCarta { A, B, C, D, E, F, G, H }
```
- 8 grupos de linguagens de programação
- Grupo A: Legendárias (Python, Ruby, etc)
- Grupos B-H: Linguagens regulares

#### Classe Jogador
```java
public class Jogador {
    private String nome;
    private List<Carta> monteCartas;
    
    public Jogador(String nome)
    public Jogador(String nome, List<Carta> cartasJogador)
    public void adicionarCarta(Carta carta)
    public void removerCarta(Carta carta)
    public List<Carta> getMonteCartas()
    public void exibirJogador()
}
```

**Validações:**
- Nome não-vazio
- monteCartas nunca null

### Lógica de Jogo - Partida

#### Classe Partida
```java
public class Partida {
    private Jogador jogador1;
    private Jogador jogador2;
    private List<Carta> cartasExistentes;
    private Jogador turno;
    
    // Constructor - Distribui cartas alternadamente
    public Partida(Jogador, Jogador, List<Carta>)
    
    // Fluxo de rodada
    public Jogador compararCartas(Carta carta1, Carta carta2, String atributo)
    // Retorna vencedor ou null para empate
    
    // Suporte
    public void definirTurnoInicial(Jogador)
    public Jogador getTurno()
    public void adicionarCartasMesa(Carta, Carta)
    public void moverCartasMesaJogadorVencedor(Jogador)
    public List<Carta> verCartas()
}
```

#### Algoritmo de Comparação
```
1. Se carta1 é CartaLendaria?
   - SIM: Chama ehImbativel(carta2)?
     - SIM: carta1 vence (returnar jogador1)
     - NÃO: resultado é empate (returnar null)
   
2. Switch no atributo selecionado:
   - "performance": comparar carta1.performance vs carta2.performance
   - "sintaxe": comparar carta1.sintaxe vs carta2.sintaxe
   - ... (outros 5 atributos)
   
3. Retornar:
   - Jogador 1 se carta1 > carta2
   - Jogador 2 se carta2 > carta1
   - null se carta1 == carta2 (EMPATE)
```

#### Distribuição de Cartas
```java
// Embaralha com Fisher-Yates shuffle
Collections.shuffle(cartasExistentes);

// Distribui alternadamente
for (int i = 0; i < cartasExistentes.size(); i++) {
    if (i % 2 == 0)
        jogador1.adicionarCarta(cartasExistentes.get(i));
    else
        jogador2.adicionarCarta(cartasExistentes.get(i));
}
```

---

## Frontend Angular

### Estrutura de Componentes

#### Arquitetura Standalone
```
AppComponent (root)
├── RouterOutlet
├── LoadingComponent (overlay)
├── FundoCiberneticoComponent (background)
└── Routes
    ├── SplashComponent
    ├── InicioComponent
    ├── PartidaComponent
    ├── GerenciarCartasComponent
    ├── SelecaoDeckComponent
    ├── AjudaComponent
    └── DesconectadoComponent
```

**Todos os componentes são standalone:**
```typescript
@Component({
  selector: 'app-example',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ...],
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.css']
})
```

### Roteamento

#### app.routes.ts
```typescript
export const routes: Routes = [
  { path: '', component: SplashComponent },
  { path: 'inicio', component: InicioComponent },
  { path: 'mesa', component: PartidaComponent },
  { path: 'crud', component: GerenciarCartasComponent },
  { path: 'deck', component: SelecaoDeckComponent },
  { path: 'desconectado', component: DesconectadoComponent },
  { path: 'ajuda', component: AjudaComponent },
  { path: '**', redirectTo: '' }
];
```

**Fluxo Padrão:**
```
'' (Splash, 1-2s) → 'inicio' (Menu) → 'deck' (Seleção) → 'mesa' (Jogo)
```

### Modelo de Dados

#### carta.model.ts
```typescript
export interface Carta {
  id?: string;
  grupo: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H';
  codigo: string;
  nome: string;
  imagem?: string;
  performance: number;        // 0-100
  sintaxe: number;            // 0-100
  seguranca: number;          // 0-100
  longevidade: number;        // 0-100
  popularidade: number;       // 0-100
  abstracao: number;          // 0-100
  versatilidade: number;      // 0-100
  lendaria: boolean;          // Super Trunfo flag
  selecionada?: boolean;      // UI state
}
```

#### CartaTrunfo (Interface Interna)
```typescript
interface CartaTrunfo {
  isSuperTrunfo: boolean;
  mensagemSuperTrunfo: string;
  atributos: Array<{
    nome: string;
    valor: number;
  }>;
}
```

### Serviços

#### CartaService (CRUD + State)
```typescript
@Injectable({ providedIn: 'root' })
export class CartaService {
  private apiUrl = 'http://localhost:3000/cartas';
  private deckSelecionado: Carta[] = [];
  
  constructor(private http: HttpClient) {}
  
  // CRUD Operations
  getCartas(): Observable<Carta[]> {
    return this.http.get<Carta[]>(this.apiUrl);
  }
  
  addCarta(carta: Carta): Observable<Carta> {
    return this.http.post<Carta>(this.apiUrl, carta);
  }
  
  deleteCarta(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  
  // Deck Management
  setDeck(cartas: Carta[]): void {
    this.deckSelecionado = cartas;
  }
  
  getDeck(): Carta[] {
    return this.deckSelecionado;
  }
}
```

#### LoadingService (Global State)
```typescript
@Injectable({ providedIn: 'root' })
export class LoadingService {
  private loadingItems: string[] = [];
  isLoading = signal<boolean>(false);
  
  adicionarItemLoading(item: string): void {
    this.loadingItems.push(item);
    this.checkLoadingStatus();
  }
  
  removerItemLoading(item: string): void {
    this.loadingItems = this.loadingItems.filter(i => i !== item);
    this.checkLoadingStatus();
  }
  
  private checkLoadingStatus(): void {
    this.isLoading.set(this.loadingItems.length > 0);
  }
}
```

### Componentes Principais

#### PartidaComponent (Game Logic)

**Estado:**
```typescript
faseAtual: 'COMPRAR' | 'ESCOLHER' | 'COMPARAR' | 'RESULTADO' = 'COMPRAR';
deckJogador: Carta[] = [];        // Player deck
deckBot: Carta[] = [];             // CPU deck
deckEmpate: Carta[] = [];          // Empate accumulator
cartaAtualJogador: Carta | null;
cartaAtualBot: Carta | null;
mensagemSistema: string = '';
jogoAcabou: boolean = false;
```

**Fases do Jogo:**
```typescript
1. COMPRAR
   - puxarCartas(): Retira carta do topo do deck
   - Player e Bot usam shift() para remover

2. ESCOLHER
   - batalla(atributo): Player clica em botão
   - CPU escolhe aleatoriamente via Math.random()

3. COMPARAR
   - Após 3.5s delay, Bot card aparece
   - recolherCartas(): Determina vencedor
   - Vencedor += deckEmpate + 2 cartas novas
   - Empate: cartas vão para deckEmpate

4. RESULTADO
   - Se deckJogador.length === 0: DERROTA
   - Se deckBot.length === 0: VITÓRIA
```

#### GerenciarCartasComponent (CRUD)

**Formulário:**
```
Nome: <input type="text">
Grupo: <select A-H>
Código: <auto-generated 1-9>

7 Atributos (number 0-100):
- Performance
- Sintaxe
- Segurança
- Longevidade
- Popularidade
- Abstração
- Versatilidade

Lendária: <checkbox>

Botões:
- Adicionar Carta
- Excluir Carta
- Limpar Formulário
```

**Operações:**
- `adicionarCarta()`: POST /cartas
- `excluirCarta(id)`: DELETE /cartas/{id}
- `carregarCartas()`: GET /cartas

#### CartaComponent (Visualização)

```typescript
@Input() cartaInput: Carta;

atualizarDesign(): CartaTrunfo {
  return {
    isSuperTrunfo: this.cartaInput.lendaria,
    mensagemSuperTrunfo: 'VENCE DE TODOS (EXCETO GRUPO A)',
    atributos: [
      { nome: 'Performance', valor: this.cartaInput.performance },
      // ... outros 6 atributos
    ]
  };
}
```

---

## API & Comunicação

### JSON Server Configuration

**Porta:** 3000  
**Base URL:** http://localhost:3000  
**Arquivo:** db.json

#### Endpoints

**GET - Buscar todas as cartas**
```http
GET http://localhost:3000/cartas

Response: 200 OK
[
  {
    "id": 1,
    "grupo": "A",
    "codigo": "1",
    "nome": "Python",
    "performance": 85,
    ...
  },
  ...
]
```

**POST - Criar nova carta**
```http
POST http://localhost:3000/cartas
Content-Type: application/json

Request:
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
  "lendaria": false,
  "selecionada": false
}

Response: 201 Created
{
  "id": 33,
  "grupo": "B",
  ...
}
```

**DELETE - Remover carta**
```http
DELETE http://localhost:3000/cartas/1

Response: 200 OK
```

### RxJS Observable Patterns

```typescript
// GET com subscription
this.cartaService.getCartas().subscribe({
  next: (cartas) => this.cartas = cartas,
  error: (err) => console.error(err),
  complete: () => console.log('Carregamento completo')
});

// POST com flatMap (para operações sequenciais)
this.cartaService.addCarta(novaCarta).pipe(
  switchMap(() => this.cartaService.getCartas())
).subscribe(cartas => this.cartas = cartas);

// DELETE com finalização
this.cartaService.deleteCarta(id).pipe(
  finalize(() => this.carregando = false)
).subscribe();
```

---

## Modelos de Dados

### Backend - Carta (Java)
```
┌─────────────────────────┐
│   GrupoCarta (Enum)     │
│ A: Legendárias          │
│ B-H: Regulares          │
└─────────────────────────┘
        ▲
        │
        │ (usa)
        │
┌──────────────────────────────────────┐
│       Carta (Base Class)             │
├──────────────────────────────────────┤
│ - grupo: GrupoCarta                  │
│ - codigo: String                     │
│ - nome: String                       │
│ - performance: double (0-100)        │
│ - sintaxe: double (0-100)            │
│ - seguranca: double (0-100)          │
│ - longevidade: double (0-100)        │
│ - popularidade: double (0-100)       │
│ - abstracao: double (0-100)          │
│ - versatilidade: double (0-100)      │
└──────────────────────────────────────┘
        ▲
        │ (extends)
        │
┌──────────────────────────────────────┐
│    CartaLendaria (Subclass)          │
├──────────────────────────────────────┤
│ + ehImbativel(Carta): boolean        │
│ + exibirCarta() [override]           │
└──────────────────────────────────────┘
```

### Frontend - Carta (TypeScript)
```
Interface: Carta
├─ id?: string (Firebase/JSON ID)
├─ grupo: 'A'|'B'|'C'|'D'|'E'|'F'|'G'|'H'
├─ codigo: string ('1'-'9')
├─ nome: string (Linguagem)
├─ imagem?: string (URL)
├─ performance: number (0-100)
├─ sintaxe: number (0-100)
├─ seguranca: number (0-100)
├─ longevidade: number (0-100)
├─ popularidade: number (0-100)
├─ abstracao: number (0-100)
├─ versatilidade: number (0-100)
├─ lendaria: boolean (Super Trunfo)
└─ selecionada?: boolean (UI state)
```

---

## Lógica de Jogo

### Fluxo Completo de Rodada

```
┌─────────────────────────────────────┐
│   INÍCIO DA RODADA                  │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│   FASE 1: COMPRAR CARTAS            │
│ - Player: shift() do deck           │
│ - Bot: shift() do deck              │
│ - Mensagem: "Carta retirada!"       │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│   FASE 2: ESCOLHER ATRIBUTO         │
│ - Mostra 7 botões de atributos      │
│ - Player clica em um               │
│ - Bot escolhe aleatório             │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│   FASE 3: COMPARAR (Delay 3.5s)     │
│ - Exibe card do Bot                 │
│ - Calcula vencedor                  │
│ - Mostra resultado                  │
└──────────────┬──────────────────────┘
               │
        ┌──────┴──────┐
        │             │
        ▼             ▼
   ┌────────┐    ┌───────────┐
   │ EMPATE │    │ VENCEDOR  │
   └────┬───┘    └─────┬─────┘
        │              │
        │    ┌─────────┴──────────┐
        │    │                    │
        ▼    ▼                    ▼
   Add to  Player Win         Bot Win
   Empate  (+ empate)         (+ empate)
   Deck
        │    │                    │
        └────┴────────┬───────────┘
                      │
                      ▼
         ┌──────────────────────────────┐
         │  PRÓXIMA RODADA?             │
         ├──────────────────────────────┤
         │ Player tem cartas?  SIM      │
         │ Bot tem cartas?     SIM      │
         └──────────────────────────────┘
              │          │
             NÃO        SIM
              │          │
              ▼          ▼
           DERROTA    PRÓXIMA
                      RODADA
```

### Sistema de Empate "Leva Tudo"

```
Rodada 1: Empate → deckEmpate = [CartaJogador, CartaBot]

Rodada 2: Empate → deckEmpate += 2 cartas

Rodada 3: Player vence
         → Player recebe: 
           • Sua carta atual
           • Carta do Bot
           • TODAS as 6 cartas do deckEmpate
           Total = 8 cartas ganhas!
         → deckEmpate = [] (resetado)
```

### Validação de Super Trunfo

```
Se CartaLendaria?
  ├─ SIM: cartaAdversaria.grupo == A?
  │   ├─ SIM: EMPATE (ambos Grupo A)
  │   └─ NÃO: CARTALEGENDÁRIA VENCE
  └─ NÃO: Comparar atributos normalmente
```

---

## Banco de Dados

### db.json Structure
```json
{
  "cartas": [
    {
      "id": 1,
      "grupo": "A",
      "codigo": "1",
      "nome": "Python",
      "lendaria": true,
      ... (7 atributos)
    },
    // 31 cartas adicionais
    // Total: 32 cartas (1 legendária A-1, 31 regulares A-H códigos 2-4)
  ]
}
```

### Inicialização de Dados
- 32 cartas pré-carregadas
- 1 CartaLendaria (Python, Grupo A-1)
- 3 cartas por grupo (B-H, códigos 2-4)

---

## Tecnologias

### Backend
- **Linguagem:** Java 25.0.3
- **Arquitetura:** MVC
- **Patterns:** Herança (CartaLendaria), Enum (GrupoCarta)

### Frontend
- **Framework:** Angular 19.2.0
- **Componentes:** Standalone
- **State Management:** Angular Signals + RxJS
- **Tipagem:** TypeScript 5.7.2
- **Styling:** CSS3 (tema cibernético)

### API & Database
- **Server:** JSON Server
- **Database:** JSON (db.json)
- **Communication:** REST + RxJS Observables

### DevTools
- **Node:** v24.12.0
- **npm:** 11.6.2
- **Angular CLI:** 19.2.10

---

**Documentação Técnica Completa - Protocol Kodexia**
