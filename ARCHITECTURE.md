# Architecture Documentation

This document describes the high-level architecture and data flow of the `traffic-sim` project.

## Overview

The application is structured into four main components:
1. **Frontend** (React, Vite, TypeScript)
2. **App** (Tauri Application Shell)
3. **Bridge** (Rust Library)
4. **Backend** (C++ Static Library)

Their boundaries are strictly defined to enforce separation of concerns and maximize simulation performance.

## 1. Frontend
**Directory:** `frontend/`

- **Purpose:** Provide a graphical user interface for users to draw traffic networks (roads, intersections, lamps) and visualize the running simulation.
- **Tools:** React, Recharts, Zustand (for state management).
- **Behavior:** The frontend focuses solely on presentation and capturing user intent. When a simulation starts, it serializes the visual graph into a structured payload and sends it to the Tauri app (via IPC commands). It subsequently receives simulation frame updates to animate the traffic flow.

## 2. App & Tauri Shell
**Directory:** `app/src-tauri/`

- **Purpose:** Serve as the application shell across platforms and expose Rust capabilities to the frontend.
- **Behavior:** It defines Tauri commands that act as endpoints for frontend invocations. The App acts as a thin wrapper that delegates business and simulation logic to the `bridge` crate.

## 3. Bridge
**Directory:** `bridge/`

- **Purpose:** Orchestration, graph preprocessing, validation, and C/C++ FFI bridging.
- **Behavior:**
  - **Validation & Transformation:** Receives the network payload from the frontend. It converts the unstructured UI data into a robust, validated Rust graph data structure.
  - **Preprocessing:** Handles preliminary calculations, ensuring that segments, intersections, and lamps are properly connected and physically valid.
  - **FFI Interaction:** Calls C++ backend functions. It handles safe memory passing and bindings generation (`bindgen`).
  - **Result Handling:** After querying the C++ backend for the simulation state, it translates the flat array representation back into structured JSON or typed Rust structs which are then pushed back to the frontend.

## 4. Backend (C++)
**Directory:** `backend/`

- **Purpose:** The numerical core of the simulation.
- **Characteristics:**
  - Uses C++20.
  - Implements the Lighthill-Whitham-Richards (LWR) macroscopic traffic model.
  - Computes numerical solutions using the Godunov flux scheme.
- **Data Model:**
  To optimize for cache hits and maximize CPU throughput, the backend avoids traditional object-oriented graph representations. Instead:
  - Takes the validated network from Rust and lowers it into data-oriented **flat arrays**.
  - Applies boundary conditions and flux equations across arrays.
  - Updates densities/flows internally per tick and shares raw memory arrays back to the Rust bridge to avoid object serialization overhead.

## Data Flow Lifecycle

1. **User Input:** User draws a road network in the UI.
2. **Setup:** Frontend sends a start simulation command with the network configuration to the Tauri app via IPC.
3. **Graph Construction:** The Bridge parses the configuration into a logical Rust graph. It checks constraints (e.g., properly connected nodes, valid lamp cycles).
4. **Lowering:** The Bridge extracts node and edge list arrays (flat data) and passes them to the C++ backend via FFI.
5. **Simulation Loop:** 
   - Bridge calls simulation step functions via FFI.
   - C++ calculates the Godunov flux for all flat road segments and safely applies junction and lamp rules.
   - C++ updates its internal flat arrays.
   - Bridge reads the updated density/flow arrays.
   - Tauri emits an event containing the frame data to the Frontend.
6. **Rendering:** Frontend draws updated network traffic density.

