#include "backend.h"

#include <cstdlib>
#include <cstring>
#include <string>

// NOLINTBEGIN(cppcoreguidelines-no-malloc, cppcoreguidelines-owning-memory)
extern "C" {

char* backend_greet(const char* name, Language lang) {
    const std::string display_name = name != nullptr ? name : "stranger";

    std::string greeting;
    switch (lang) {
    case LANG_DE:
        greeting = "Hallo, " + display_name + "!";
        break;
    case LANG_FR:
        greeting = "Bonjour, " + display_name + "!";
        break;
    case LANG_EN:
    default:
        greeting = "Hello, " + display_name + "!";
        break;
    }

    auto* const out = static_cast<char*>(std::malloc(greeting.size() + 1));
    std::memcpy(out, greeting.c_str(), greeting.size() + 1);
    return out;
}

void backend_free_string(char* str) {
    std::free(str);
}
}
// NOLINTEND(cppcoreguidelines-no-malloc, cppcoreguidelines-owning-memory)