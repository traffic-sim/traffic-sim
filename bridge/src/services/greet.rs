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
