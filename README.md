🇧🇷 **Português** | 🇺🇸 [English](README-eng.md)

<H1> Trabalho de Estruturas de Dados - ExitPath - Grafos </H1>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Concluido-green?style=flat-square" alt="Status">
  <img src="https://img.shields.io/badge/TypeScript-5.0+-blue?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React">
  <img src="https://img.shields.io/badge/Grafos-Dijkstra%20%7C%20BFS%20%7C%20DFS-orange?style=flat-square" alt="Grafos">
</p>

<p align="center">
  <img src="https://i.postimg.cc/vB20Rbfj/Captura-de-Tela-2026-06-29-a-s-21-14-25.png" width="500">
</p>

---

## 📹 Vídeo explicando o projeto
[Vídeo do YouTube](URL_DO_VIDEO)

---

## 📝 Descrição

O **ExitPath** é uma aplicação web desenvolvida em TypeScript e React para simular rotas de evacuação em edificações. Com uma interface moderna e intuitiva, o sistema permite cadastrar edifícios, configurar plantas baixas com ambientes conectados e executar simulações de evacuação em tempo real.

O foco principal do projeto é a **modelagem e resolução de problemas de caminho mínimo por meio de grafos**. Para lidar com diferentes necessidades, encontrar a rota mais segura, verificar alcançabilidade e detectar ambientes sem saída, sendo assim, o sistema implementa três algoritmos clássicos sobre grafos ponderados: **Dijkstra**, **BFS** e **DFS**.

No fim, o ExitPath consegue calcular, para cada ambiente com pessoas, a rota de menor custo até a saída de emergência mais próxima, considerando distâncias, tempo de travessia, nível de risco e acessibilidade para PCD, tudo em tempo logarítmico.

---

## 💡 Diferenciais Técnicos — Estruturas de Grafo

A base do sistema é o **Módulo de Grafos** (`src/graph/`), que modela cada andar de um edifício como um grafo ponderado e aplica algoritmos distintos dependendo da operação:

- **Grafo Ponderado (`Graph.ts`):** Cada ambiente vira um nó e cada conexão vira uma aresta com peso calculado como combinação de distância (30%), tempo de travessia (40%) e nível de risco (30%). Penalidades dinâmicas são aplicadas: elevadores recebem peso 999 em situações de alta intensidade, ou seja, tornando-os inutilizáveis, como manda o protocolo real de evacuação e conexões não acessíveis recebem penalidade de 500 quando há pessoas com PCD no ambiente de origem. Implementado com lista de adjacência, complexidade de espaço O(V + E), ideal para grafos esparsos como plantas de edifícios.

- **Dijkstra (`algorithms/dijkstra.ts`):** Algoritmo principal da simulação. Dado um ambiente de origem e um conjunto de saídas de emergência, encontra o caminho de menor custo ponderado em O((V + E) log V). Usado duas vezes por ambiente: primeiro para calcular a rota primária e depois, bloqueando as arestas dessa rota, para encontrar uma rota alternativa de contingência.

- **BFS (`algorithms/bfs.ts`):** Busca em largura com fila FIFO. Usada para verificar alcançabilidade simples entre dois pontos, ignorando pesos que garante o caminho com o menor número de conexões em O(V + E).

- **DFS + Componentes Conectados (`algorithms/dfs.ts` + `connectedComponents.ts`):** Após calcular todas as rotas, o sistema executa DFS a partir de cada saída de emergência e marca todos os ambientes alcançáveis. Os ambientes não visitados são ambientes sem caminho possível até qualquer saída, detectados em O(V + E) e destacados em vermelho na interface.

---

## 🌐 Demonstração

<p align="center">
  <img src="https://i.postimg.cc/9QHJHxwM/Captura-de-Tela-2026-06-29-a-s-21-15-29.png" width="600">
  <br></br>
  <img src="https://i.postimg.cc/RC3kMDhQ/Captura-de-Tela-2026-06-29-a-s-21-16-20.png" width="600">
  <br></br>
  <img src="https://i.postimg.cc/8zb3K8K9/Captura-de-Tela-2026-06-29-a-s-21-16-52.png" width="600">
  <br></br>
  <img src="https://i.postimg.cc/2SC9BckQ/Captura-de-Tela-2026-06-29-a-s-21-18-29.png" width="600">
</p>

---

## 🎯 Funcionalidades

- **Simulação de Rotas:** O Dijkstra calcula, para cada ambiente com pessoas, o caminho de menor custo ponderado até a saída de emergência mais próxima, em O((V + E) log V).
- **Rota Alternativa:** Após encontrar a rota primária, o sistema bloqueia suas arestas e roda Dijkstra novamente, garantindo um plano B caso a rota principal fique obstruída.
- **Detecção de Ambientes Inacessíveis:** O DFS a partir das saídas identifica qualquer área do edifício sem caminho possível até uma saída, destacando-a visualmente.
- **Acessibilidade para PCD:** Ambientes com pessoas com deficiência recebem um grafo filtrado que exclui conexões não acessíveis, garantindo rotas válidas para todos.
- **Intensidade da Emergência:** Nos modos `HIGH` e `CRITICAL`, elevadores são automaticamente removidos do grafo, forçando o uso de escadas.
- **Bloqueio Dinâmico:** É possível bloquear ambientes e conexões individualmente para simular incêndios, colapsos ou obstruções e observar o recalculo das rotas em tempo real.
- **Gestão de Edifícios:** Cadastro de edifícios com múltiplos andares, ambientes tipados (sala, corredor, escada, elevador, saída de emergência) e controle de ocupação regular e PCD.
- **Métricas de Evacuação:** O sistema exibe percentual de cobertura, total de pessoas evacuadas, tempo estimado máximo e quais saídas foram utilizadas.

---

## 🗂️ Estrutura do Módulo de Grafos

```
src/graph/
├── Graph.ts                      # Classe do grafo: lista de adjacência + função de peso
├── GraphBuilder.ts               # Monta o grafo filtrado por contexto (bloqueios, PCD, intensidade)
├── SimulationEngine.ts           # Orquestra a simulação: rota primária, alternativa e cobertura
├── index.ts                      # Re-exporta os módulos
└── algorithms/
    ├── dijkstra.ts               # Menor caminho ponderado até a saída mais próxima
    ├── bfs.ts                    # Alcançabilidade por largura (sem pesos)
    ├── dfs.ts                    # Exploração em profundidade
    └── connectedComponents.ts    # Detecta ambientes sem acesso a qualquer saída
```

---

## 💻 Pré-requisitos

Antes de executar o projeto, certifique-se de que você possui os seguintes requisitos instalados:

**1. Node.js 18 ou superior.**

**2. Gerenciador de pacotes npm ou yarn.**

**3. Sistema Operacional: Windows, macOS ou Linux.**

---

## 🚀 Executando

**1. Instalar o Node.js**

Verifique se você possui o **Node.js 18 ou superior** instalado. Para isso, abra o terminal e execute:

```bash
node --version
```

Se não tiver, baixe em [nodejs.org](https://nodejs.org/).

**2. Clonar o Repositório**

```bash
git clone https://github.com/eda2-2026/G41_Grafos_EDA2-2026.1.git
```

**3. Instalar as dependências**

Navegue até o diretório do projeto e execute:

```bash
npm install
```

**4. Executar o projeto**

```bash
npm run dev
```

Acesse [http://localhost:5173](http://localhost:5173) no navegador.

**⚠️ Observação:**
O sistema já inicia com dados de exemplo pré-carregados comdois edifícios cadastrados para facilitar a exploração das funcionalidades.

---

## 🫂 Colaboradores

| [Camila Cavalcante - 232013944](https://github.com/CamilaSilvaC) | [Luísa Ferreira - 232014807](https://github.com/luisa12ll) |
| :---: | :---: |
| <div align="center"><img src="https://github.com/CamilaSilvaC.png" alt="camila" width="400"></div> | <div align="center"><img src="https://github.com/luisa12ll.png" alt="luisa" width="400"></div> |