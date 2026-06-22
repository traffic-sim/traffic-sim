cmake_minimum_required(VERSION 3.20)
project(backend CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

add_library(backend STATIC src/backend.cpp)

target_include_directories(backend PUBLIC
    $<BUILD_INTERFACE:${CMAKE_CURRENT_SOURCE_DIR}/include>
    $<INSTALL_INTERFACE:include>
)

if(MSVC)
  target_compile_options(backend PRIVATE /W4 /O2 /EHsc /MT)
else()
  target_compile_options(backend PRIVATE -Wall -Wextra -O2 -fPIC)
endif()

install(TARGETS backend ARCHIVE DESTINATION lib)
install(DIRECTORY include/ DESTINATION include)


include(FetchContent)
FetchContent_Declare(
  Catch2
  GIT_REPOSITORY https://github.com/catchorg/Catch2.git
  GIT_TAG        v3.15.1
)
FetchContent_MakeAvailable(Catch2)

enable_testing()
add_executable(backend_tests tests/backend_test.cpp)
target_link_libraries(backend_tests PRIVATE backend Catch2::Catch2WithMain)

include(CTest)
include(Catch)
catch_discover_tests(backend_tests)

