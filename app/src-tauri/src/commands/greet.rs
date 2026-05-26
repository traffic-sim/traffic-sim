// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

use bridge::models::greet::{GreetRequest, GreetResponse};

#[tauri::command]
pub fn greet(req: GreetRequest) -> GreetResponse {
    bridge::api::greet::greet(req)
}
