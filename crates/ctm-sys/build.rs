//! Compiles the C++ core with CMake and generates the Rust bindings from the C header with bindgen.

use std::env;
use std::path::PathBuf;

fn main() {
    let manifest = PathBuf::from(env::var("CARGO_MANIFEST_DIR").unwrap());
    let cpp = manifest.join("../../ctm-core");
    let include = cpp.join("include");
    let src = cpp.join("src");

    // Build the C++ core using the cmake crate
    let dst = cmake::Config::new(&cpp)
        .define("CMAKE_BUILD_TYPE", "Release")
        .define("CTM_BUILD_TESTS", "OFF")
        .build();

    println!(
        "cargo:rustc-link-search=native={}",
        dst.join("lib").display()
    );
    println!("cargo:rustc-link-lib=static=ctm_core");

    // Rebuild triggers
    println!("cargo:rerun-if-changed=build.rs");
    println!("cargo:rerun-if-changed=CMakeLists.txt");
    println!("cargo:rerun-if-changed={}", src.display());
    println!("cargo:rerun-if-changed={}", include.display());

    // Generate bindings with bindgen
    let bindings = bindgen::Builder::default()
        .header(include.join("ctm_ffi.h").to_string_lossy())
        .allowlist_function("ctm_.*")
        .allowlist_type("Ctm.*")
        .allowlist_var("CTM_.*")
        .rustified_enum("Ctm(Status|ScenarioKind|JunctionKind)$")
        .derive_debug(true)
        .derive_copy(true)
        .derive_default(true)
        .parse_callbacks(Box::new(bindgen::CargoCallbacks::new()))
        .generate()
        .expect("bindgen failed to generate the CTM bindings");

    let out = PathBuf::from(env::var("OUT_DIR").unwrap()).join("bindings.rs");
    bindings
        .write_to_file(out)
        .expect("could not write bindings.rs");
}
