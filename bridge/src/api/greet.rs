use crate::models::greet::{GreetRequest, GreetResponse};
use crate::services;

pub fn greet(req: GreetRequest) -> GreetResponse {
    services::greet::greet(req)
}
