#include "backend.h"

#include <cstdlib>
#include <cstring>
#include <string>

extern "C" {

char *backend_greet(const char *name, Language lang) {
  const std::string n = name ? name : "stranger";

  std::string greeting;
  switch (lang) {
  case LANG_DE:
    greeting = "Hallo, " + n + "!";
    break;
  case LANG_FR:
    greeting = "Bonjour, " + n + "!";
    break;
  case LANG_EN:
  default:
    greeting = "Hello, " + n + "!";
    break;
  }

  const auto out = static_cast<char *>(std::malloc(greeting.size() + 1));
  std::memcpy(out, greeting.c_str(), greeting.size() + 1);
  return out;
}

void backend_free_string(char *str) { std::free(str); }
}
