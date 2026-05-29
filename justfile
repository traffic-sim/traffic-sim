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
# LINT
# =========================

lint:
  just lint-cpp
  just lint-rust
  just lint-frontend

# Requires compile_commands.json — run `just cmake-configure` first.
[working-directory: "backend"]
lint-cpp:
  find src include -name '*.cpp' -o -name '*.h' \
    | xargs clang-tidy --config-file=.clang-tidy -p _cmake_build

lint-rust: copy-headers
  cargo clippy --manifest-path bridge/Cargo.toml -- -D warnings
  cargo clippy --manifest-path app/src-tauri/Cargo.toml -- -D warnings

[working-directory: "frontend"]
lint-frontend:
  npm run lint -- --max-warnings 0

# =========================
# FORMAT
# =========================

fmt:
  just fmt-cpp
  just fmt-rust
  just fmt-frontend

[working-directory: "backend"]
fmt-cpp:
  find src include -name '*.cpp' -o -name '*.h' \
    | xargs clang-format -i

fmt-rust:
  cargo fmt --manifest-path bridge/Cargo.toml
  cargo fmt --manifest-path app/src-tauri/Cargo.toml

[working-directory: "frontend"]
fmt-frontend:
  npx prettier --write .

# =============================================================================
# CHECK  (read-only, CI-safe)
# =============================================================================

check:
  just check-cpp
  just check-rust
  just check-frontend

[working-directory: "backend"]
check-cpp:
  find src include -name '*.cpp' -o -name '*.h' \
    | xargs clang-format --dry-run --Werror
  find src include -name '*.cpp' \
    | xargs clang-tidy --config-file=.clang-tidy -p _cmake_build

check-rust: copy-headers
  cargo fmt --manifest-path bridge/Cargo.toml -- --check
  cargo fmt --manifest-path app/src-tauri/Cargo.toml -- --check
  cargo clippy --manifest-path bridge/Cargo.toml -- -D warnings
  cargo clippy --manifest-path app/src-tauri/Cargo.toml -- -D warnings

[working-directory: "frontend"]
check-frontend:
  npx prettier --check .
  npm run lint -- --max-warnings 0

# =========================
# HELPERS
# =========================

# Copy backend headers into build/backend/include so bindgen can find them
# without needing to compile the static lib.
copy-headers:
  cmake -E make_directory build/backend/include
  cmake -E copy_directory backend/include build/backend/include

# Generate compile_commands.json for clang-tidy / IDE integration.
[working-directory: "backend"]
cmake-configure:
  cmake -S . -B _cmake_build \
    -G Ninja \
    -DCMAKE_BUILD_TYPE=Release \
    -DCMAKE_INSTALL_PREFIX="backend" \
    -DCMAKE_EXPORT_COMPILE_COMMANDS=ON


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

# =========================
# SETUP (one-time, after fresh clone)
# =========================

setup:
  pip install pre-commit
  pre-commit install
  npm --prefix frontend install
  @echo "Pre-commit hooks installed. Run 'just cmake-configure' before linting C++."
