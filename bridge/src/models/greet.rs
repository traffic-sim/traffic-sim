use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, Default)]
#[serde(rename_all = "lowercase")]
pub enum Language {
    #[default]
    En,
    De,
    Fr,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GreetRequest {
    pub name: String,
    pub language: Language,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GreetResponse {
    pub greeting: String,
    pub language_used: Language,
}
