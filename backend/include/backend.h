#pragma once

// NOLINTBEGIN(modernize-use-using, cppcoreguidelines-use-enum-class, performance-enum-size)
#ifdef __cplusplus
extern "C" {
#endif

typedef enum {
    LANG_EN = 0,
    LANG_DE = 1,
    LANG_FR = 3,
} Language;

char* backend_greet(const char* name, Language lang);

void backend_free_string(char* str);

#ifdef __cplusplus
}
#endif
// NOLINTEND(modernize-use-using, cppcoreguidelines-use-enum-class, performance-enum-size)