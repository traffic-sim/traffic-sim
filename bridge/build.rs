use std::path::PathBuf;

fn main() {
    let manifest_dir = PathBuf::from(std::env::var("CARGO_MANIFEST_DIR").unwrap());
    let repo_root = manifest_dir.parent().unwrap();
    let backend_out = repo_root.join("build").join("backend");
    let lib_dir = backend_out.join("lib");
    let header = backend_out.join("include").join("backend.h");
    let out_dir = PathBuf::from(std::env::var("OUT_DIR").unwrap());

    // -----------------------------------------------------------------------
    // 1. Link the pre-built static library
    // -----------------------------------------------------------------------
    println!("cargo:rustc-link-search=native={}", lib_dir.display());
    println!("cargo:rustc-link-lib=static=backend");

    // C++ stdlib — platform-specific
    let target = std::env::var("TARGET").unwrap_or_default();
    if target.contains("apple") {
        println!("cargo:rustc-link-lib=c++");
    } else if !target.contains("windows-msvc") {
        println!("cargo:rustc-link-lib=stdc++");
    }

    // Re-run if the installed header or lib changes (after `just build-backend`)
    println!("cargo:rerun-if-changed={}", header.display());
    println!("cargo:rerun-if-changed={}", lib_dir.display());

    // -----------------------------------------------------------------------
    // 2. Generate FFI bindings with bindgen
    // -----------------------------------------------------------------------
    if !header.exists() {
        panic!(
            "\n\nbuild/backend/include/backend.h not found.\n\
             Run `just build-backend` before building the Rust crates.\n"
        );
    }

    let bindings = bindgen::Builder::default()
        .header(header.to_str().unwrap())
        .allowlist_function("backend_greet|backend_free_string")
        .rustified_enum(".*")
        .generate()
        .expect(
            "bindgen failed — is libclang installed?\n  \
             Linux:   apt install libclang-dev\n  \
             macOS:   brew install llvm\n  \
             Windows: install LLVM from https://releases.llvm.org/download.html",
        );

    bindings
        .write_to_file(out_dir.join("bindings.rs"))
        .expect("could not write bindings.rs");
}
