cmake_minimum_required(VERSION 3.20)
project(backend CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

if(NOT CMAKE_BUILD_TYPE)
  set(CMAKE_BUILD_TYPE Release)
endif()

add_library(ctm_core STATIC src/backend.cpp)

target_include_directories(ctm_core PUBLIC include PRIVATE src)
target_compile_options(ctm_core PRIVATE -Wall -Wextra -Wpedantic)

install(TARGETS ctm_core
        ARCHIVE DESTINATION lib)

include(CTest)

# Catch2 tests: `cmake -S cpp -B build/cpp -DCTM_BUILD_TESTS=ON && cmake --build build/cpp && ctest --test-dir build/cpp`

option(CTM_BUILD_TESTS "Build the Catch2 test suite" OFF)
if(CTM_BUILD_TESTS)
  include(FetchContent)
  FetchContent_Declare(Catch2 GIT_REPOSITORY https://github.com/catchorg/Catch2.git GIT_TAG v3.16.0)
  FetchContent_MakeAvailable(Catch2)
  file(GLOB CTM_TEST_SOURCES CONFIGURE_DEPENDS tests/*.cpp)
  add_executable(ctm_tests ${CTM_TEST_SOURCES})
  target_link_libraries(ctm_tests PRIVATE ctm_core Catch2::Catch2WithMain)
  target_include_directories(ctm_tests PRIVATE src)
  include(Catch)
  catch_discover_tests(ctm_tests)
endif()

