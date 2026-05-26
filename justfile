set windows-shell := ["powershell.exe", "-NoLogo", "-Command"]

default:
  @just --list

# =========================
# DEV
# =========================

dev:
  just build-backend
  npx concurrently --kill-others --names FRONTEND,TAURI "just dev-frontend" "just dev-tauri"

[working-directory: "frontend"]
dev-frontend:
  npm install
  npm run dev

[working-directory: "app/src-tauri"]
dev-tauri:
  cargo tauri dev

# =========================
# BUILD
# =========================

build:
  just build-backend
  just build-frontend
  just build-tauri
  just collect-artifacts

build-backend:
  just build-backend-{{os()}}

build-backend-windows:
  cmake -S backend -B backend/_cmake_build \
    -G "Visual Studio 17 2022" \
    -A x64 \
    -DCMAKE_BUILD_TYPE=Release \
    -DCMAKE_INSTALL_PREFIX="build/backend"
  cmake --build backend/_cmake_build --config Release
  cmake --install backend/_cmake_build --config Release

build-backend-linux:
  cmake -S backend -B backend/_cmake_build \
    -G Ninja \
    -DCMAKE_BUILD_TYPE=Release \
    -DCMAKE_INSTALL_PREFIX="build/backend"
  cmake --build backend/_cmake_build
  cmake --install backend/_cmake_build

build-frontend:
  npm --prefix frontend install
  npm --prefix frontend run build
  cmake -E rm -rf build/frontend
  cmake -E make_directory build/frontend
  cmake -E copy_directory frontend/dist build/frontend

build-tauri:
  just build-tauri-{{os()}}

[working-directory: "app/src-tauri"]
build-tauri-windows:
  cargo tauri build --config '{\"bundle\":{\"targets\":[\"msi\",\"nsis\"]}}'

[working-directory: "app/src-tauri"]
build-tauri-linux:
  cargo tauri build --config '{"bundle":{"targets":["deb","rpm","appimage"]}}'

collect-artifacts:
  cmake -E rm -rf build/artifacts
  cmake -E make_directory build/artifacts
  cmake -E copy_directory app/src-tauri/target/release/bundle build/artifacts

# =========================
# CLEAN
# =========================

clean:
  cmake -E rm -rf build
  cmake -E rm -rf backend/_cmake_build
  cmake -E rm -rf frontend/dist
  cmake -E rm -rf frontend/node_modules
  cargo clean --manifest-path bridge/Cargo.toml
  cargo clean --manifest-path app/src-tauri/Cargo.toml
