use crate::ffi;
use crate::models::greet::{GreetRequest, GreetResponse};

const MAX_NAME_LENGTH: usize = 32;

pub fn greet(req: GreetRequest) -> GreetResponse {
    let name = sanitise_name(&req.name);
    let language = req.language;

    let greeting = ffi::greet::greet(&name, language);

    GreetResponse {
        greeting,
        language_used: language,
    }
}

fn sanitise_name(raw: &str) -> String {
    let trimmed = raw.trim();
    if trimmed.is_empty() {
        return "stranger".to_string();
    }

    trimmed.chars().take(MAX_NAME_LENGTH).collect()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn trims_whitespace() {
        assert_eq!(sanitise_name("  Alice  "), "Alice");
    }

    #[test]
    fn empty_string_becomes_stranger() {
        assert_eq!(sanitise_name(""), "stranger");
    }

    #[test]
    fn whitespace_only_becomes_stranger() {
        assert_eq!(sanitise_name("     "), "stranger");
    }

    #[test]
    fn does_not_trim_internal_whitespace() {
        assert_eq!(sanitise_name("  Alice Bob  "), "Alice Bob");
    }

    #[test]
    fn truncates_to_max_length() {
        let input = "abcdefghijklmnopqrstuvwxyzaaaaaaaaaaaaaaaaa";

        let result = sanitise_name(input);

        assert_eq!(result.chars().count(), MAX_NAME_LENGTH);
        assert_eq!(
            result,
            input.chars().take(MAX_NAME_LENGTH).collect::<String>()
        );
    }

    #[test]
    fn empty_after_trimming_overrides_truncation() {
        assert_eq!(sanitise_name("     abc     "), "abc");
    }
}
