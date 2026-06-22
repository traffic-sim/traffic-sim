#include "backend.h"
#include "catch2/catch_test_macros.hpp"

#include <string>

static std::string take(char* ptr) {
    REQUIRE(ptr != nullptr);

    std::string str(ptr);
    backend_free_string(ptr);
    return str;
}

TEST_CASE("backend_greet", "[backend]") {
    SECTION("English greeting") {
        char* raw = backend_greet("Alice", LANG_EN);
        REQUIRE(take(raw) == "Hello, Alice!");
    }

    SECTION("German greeting") {
        char* raw = backend_greet("Alice", LANG_DE);
        REQUIRE(take(raw) == "Hallo, Alice!");
    }

    SECTION("French greeting") {
        char* raw = backend_greet("Alice", LANG_FR);
        REQUIRE(take(raw) == "Bonjour, Alice!");
    }

    SECTION("Null name defaults to stranger") {
        char* raw = backend_greet(nullptr, LANG_EN);
        REQUIRE(take(raw) == "Hello, stranger!");
    }
}
