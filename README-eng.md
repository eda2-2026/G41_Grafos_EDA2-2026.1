[🇧🇷 Português](README.md) | 🇺🇸 **English**

<H1> Data Structures Project - ExitPath 🚪 </H1>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Completed-green?style=flat-square" alt="Status">
  <img src="https://img.shields.io/badge/TypeScript-5.0+-blue?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React">
  <img src="https://img.shields.io/badge/Graphs-Dijkstra%20%7C%20BFS%20%7C%20DFS-orange?style=flat-square" alt="Graphs">
</p>

<p align="center">
  <img src="https://i.postimg.cc/vB20Rbfj/Captura-de-Tela-2026-06-29-a-s-21-14-25.png" width="500">
</p>

---

## 📹 Video explaining the project
[YouTube Video](https://youtu.be/fPj6yLoL0tQ)

---

## 📝 Description

**ExitPath** is a web application built with TypeScript and React to simulate evacuation routes in buildings. With a modern and intuitive interface, the system allows registering buildings, configuring floor plans with connected environments, and running real-time evacuation simulations.

The main focus of the project is **modeling and solving shortest-path problems through graphs**. To handle different needs, finding the safest route, verifying reachability, and detecting environments with no exit the system implements three classical algorithms on weighted graphs: **Dijkstra**, **BFS**, and **DFS**.

Ultimately, ExitPath calculates, for each occupied environment, the minimum-cost route to the nearest emergency exit, considering distances, traversal time, risk level, and PCD accessibility, all in logarithmic time.

---

## 💡 Technical Highlights — Graph Structures

The heart of the system is the **Graph Module** (`src/graph/`), which models each building floor as a weighted graph and applies distinct algorithms depending on the operation:

- **Weighted Graph (`Graph.ts`):** Each environment becomes a node and each connection becomes an edge with a weight calculated as a combination of distance (30%), traversal time (40%), and risk level (30%). Dynamic penalties are applied: elevators receive weight 999 under high-intensity scenarios (making them unusable, following real evacuation protocols) and non-accessible connections receive a penalty of 500 when the origin environment has PCD occupants. Implemented with an adjacency list  O(V + E) space complexity, ideal for sparse graphs like building floor plans.

- **Dijkstra (`algorithms/dijkstra.ts`):** The core algorithm of the simulation. Given an origin environment and a set of emergency exits, it finds the minimum weighted-cost path in O((V + E) log V). Used twice per environment: first to compute the primary route, then, after blocking that route's edges to find an alternative contingency route.

- **BFS (`algorithms/bfs.ts`):** Breadth-first search with a FIFO queue. Used to verify simple reachability between two points, ignoring weights, guarantees the path with the fewest connections in O(V + E).

- **DFS + Connected Components (`algorithms/dfs.ts` + `connectedComponents.ts`):** After computing all routes, the system runs DFS from every emergency exit and marks all reachable environments. Unmarked environments have no possible path to any exit, detected in O(V + E) and highlighted in red in the interface.

---

## 🌐 Demonstration

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

## 🎯 Features

- **Route Simulation:** Dijkstra calculates, for each occupied environment, the minimum weighted-cost path to the nearest emergency exit in O((V + E) log V).
- **Alternative Route:** After finding the primary route, the system blocks its edges and runs Dijkstra again, ensuring a backup plan if the main route becomes obstructed.
- **Inaccessible Environment Detection:** DFS from the exits identifies any area with no possible path to an exit and highlights it visually.
- **PCD Accessibility:** Environments with disabled occupants receive a filtered graph that excludes non-accessible connections, guaranteeing valid routes for everyone.
- **Emergency Intensity:** In `HIGH` and `CRITICAL` modes, elevators are automatically removed from the graph, forcing the use of staircases.
- **Dynamic Blocking:** Individual environments and connections can be blocked to simulate fires, collapses, or obstructions and observe route recalculation in real time.
- **Building Management:** Register buildings with multiple floors, typed environments (room, corridor, staircase, elevator, emergency exit) and regular/PCD occupancy control.
- **Evacuation Metrics:** The system displays coverage percentage, total evacuated people, maximum estimated time, and which exits were used.

---

## 🗂️ Graph Module Structure

```
src/graph/
├── Graph.ts                      # Graph class: adjacency list + weight function
├── GraphBuilder.ts               # Builds the context-filtered graph (blockages, PCD, intensity)
├── SimulationEngine.ts           # Orchestrates simulation: primary route, alternative, and coverage
├── index.ts                      # Re-exports all modules
└── algorithms/
    ├── dijkstra.ts               # Minimum weighted path to the nearest exit
    ├── bfs.ts                    # Reachability via breadth-first (unweighted)
    ├── dfs.ts                    # Depth-first exploration
    └── connectedComponents.ts    # Detects environments with no access to any exit
```

---

## 💻 Prerequisites

Before running the project, make sure you have the following installed:

**1. Node.js 18 or higher.**

**2. npm or yarn package manager.**

**3. Operating System: Windows, macOS, or Linux.**

---

## 🚀 Running the Project

**1. Install Node.js**

Check if you have **Node.js 18 or higher** installed. Open the terminal and run:

```bash
node --version
```

If not installed, download it at [nodejs.org](https://nodejs.org/).

**2. Clone the Repository**

```bash
git clone https://github.com/eda2-2026/G41_Grafos_EDA2-2026.1.git
```

**3. Install dependencies**

Navigate to the project directory and run:

```bash
npm install
```

**4. Run the project**

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

**⚠️ Note:**
The system starts with pre-loaded sample data (two registered buildings) to make it easy to explore all features right away.

---

## 🫂 Contributors

| [Camila Cavalcante - 232013944](https://github.com/CamilaSilvaC) | [Luísa Ferreira - 232014807](https://github.com/luisa12ll) |
| :---: | :---: |
| <div align="center"><img src="https://github.com/CamilaSilvaC.png" alt="camila" width="400"></div> | <div align="center"><img src="https://github.com/luisa12ll.png" alt="luisa" width="400"></div> |
