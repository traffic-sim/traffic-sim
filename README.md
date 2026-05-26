# Traffic Sim

A macroscopic traffic simulation application combining a React frontend, a Rust (Tauri) bridge, and a high-performance C++ backend.

## Features

- **Draw & Simulate:** An interactive frontend where users can draw macroscopic traffic networks and simulate traffic flow in real-time.
- **Macroscopic Model:** Solves the Lighthill-Whitham-Richards (LWR) equation using Godunov flux.
- **Advanced Traffic Control:** Support for boundary conditions, traffic lamps, and complex intersections.
- **High Performance Architecture:**
  - **Frontend:** React + Vite ecosystem for a responsive map and canvas rendering.
  - **Bridge:** Rust (Tauri) securely orchestrates data flow, builds the traffic graph, preprocesses, and validates user configurations.
  - **Backend:** C++ core that lowers the graph to a flat array mapped layout and performs ultra-fast numerical integration, returning arrays to Rust.

## Prerequisites

### General Dependencies
- **Node.js & npm**: For the frontend.
- **Rust & Cargo**: For the Tauri app and bridge (install via rustup).
- **CMake**: For building the backend.
- **`just`**: Command runner for executing build scripts (install via `cargo install just`).

### Windows Specific Dependencies
On Windows, you need to install several additional tools to build the C++ backend and Rust bridge successfully:
- **Visual Studio 2022 Build Tools**: Install the "Desktop development with C++" workload. This provides the MSVC compiler.
- **WebView2**: Required for Tauri.
- **Important**: You must run the `just build` and `just dev` commands from the **Developer PowerShell for VS 2022** (or equivalent Developer Command Prompt) so that the C++ compiler (`cl.exe`) and build tools are available in your path.

### Linux Specific Dependencies
- **C++20 Compiler**: e.g., `g++` or `clang++`.
- **Ninja**: Recommended build system for CMake on Linux.
- **Tauri dependencies**: e.g., `libwebkit2gtk-4.1-dev`, `build-essential`, `curl`, `wget`, `file`, `libxdo-dev`, `libssl-dev`, `libcairo2-dev`, `libpango1.0-dev`, `libgtk-3-dev`.

## Getting Started

1. Clone the repository.
2. Run the development environment:
   ```sh
   just dev
   ```
   This will build the backend and concurrently launch the frontend and Tauri dev servers.

## Build Instructions

You can build the entire application and collect artifacts using `just`:

```sh
just build
```

The compiled bindings, frontend assets, and Tauri executables will be bundled in the `build/artifacts` directory.

## Contributing

Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for more details.
