use std::collections::HashMap;
use std::env;

#[derive(Debug, Clone, PartialEq)]
pub struct AppConfig {
    pub host: String,
    pub port: u16,
    pub worker_threads: usize,
    pub request_timeout_secs: u64,
    pub enable_metrics: bool,
    pub environment: Environment,
}

#[derive(Debug, Clone, PartialEq)]
pub enum Environment {
    Development,
    Staging,
    Production,
}

#[derive(Debug)]
pub enum ConfigError {
    MissingVariable(String),
    InvalidValue {
        key: String,
        value: String,
        reason: String,
    },
}

impl std::fmt::Display for ConfigError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            ConfigError::MissingVariable(key) => {
                write!(f, "missing required configuration variable: {}", key)
            }
            ConfigError::InvalidValue {
                key,
                value,
                reason,
            } => {
                write!(
                    f,
                    "invalid configuration value for '{}': '{}' ({})",
                    key,
                    value,
                    reason
                )
            }
        }
    }
}

impl std::error::Error for ConfigError {}

impl AppConfig {
    pub fn load() -> Result<Self, ConfigError> {
        Self::from_map(
            env::vars()
                .collect::<HashMap<String, String>>()
        )
    }

    pub fn from_map(
        values: HashMap<String, String>,
    ) -> Result<Self, ConfigError> {
        let host = get_string(
            &values,
            "APP_HOST",
            "0.0.0.0",
        );

        let port = get_u16(
            &values,
            "APP_PORT",
            8080,
            1,
            65535,
        )?;

        let worker_threads = get_usize(
            &values,
            "APP_WORKER_THREADS",
            4,
            1,
            128,
        )?;

        let request_timeout_secs = get_u64(
            &values,
            "APP_REQUEST_TIMEOUT_SECS",
            30,
            1,
            600,
        )?;

        let enable_metrics = get_bool(
            &values,
            "APP_ENABLE_METRICS",
            false,
        )?;

        let environment = parse_environment(
            values
                .get("APP_ENV")
                .map(String::as_str)
                .unwrap_or("development"),
        )?;

        let config = AppConfig {
            host,
            port,
            worker_threads,
            request_timeout_secs,
            enable_metrics,
            environment,
        };

        config.validate()?;

        Ok(config)
    }

    fn validate(&self) -> Result<(), ConfigError> {
        if self.host.trim().is_empty() {
            return Err(ConfigError::InvalidValue {
                key: "APP_HOST".into(),
                value: self.host.clone(),
                reason: "host cannot be empty".into(),
            });
        }

        if self.environment == Environment::Production {
            if self.worker_threads < 2 {
                return Err(ConfigError::InvalidValue {
                    key: "APP_WORKER_THREADS".into(),
                    value: self.worker_threads.to_string(),
                    reason: "production requires at least 2 worker threads".into(),
                });
            }
        }

        Ok(())
    }

    pub fn is_production(&self) -> bool {
        self.environment == Environment::Production
    }

    pub fn summary(&self) -> String {
        format!(
            "host={}, port={}, workers={}, timeout={}s, metrics={}, env={:?}",
            self.host,
            self.port,
            self.worker_threads,
            self.request_timeout_secs,
            self.enable_metrics,
            self.environment
        )
    }
}

fn get_string(
    values: &HashMap<String, String>,
    key: &str,
    default: &str,
) -> String {
    values
        .get(key)
        .cloned()
        .unwrap_or_else(|| default.to_string())
}

fn get_u16(
    values: &HashMap<String, String>,
    key: &str,
    default: u16,
    min: u16,
    max: u16,
) -> Result<u16, ConfigError> {
    let value = match values.get(key) {
        Some(v) => v,
        None => return Ok(default),
    };

    let parsed = value.parse::<u16>().map_err(|_| {
        ConfigError::InvalidValue {
            key: key.into(),
            value: value.clone(),
            reason: "expected unsigned integer".into(),
        }
    })?;

    if parsed < min || parsed > max {
        return Err(ConfigError::InvalidValue {
            key: key.into(),
            value: value.clone(),
            reason: format!("expected value between {} and {}", min, max),
        });
    }

    Ok(parsed)
}

fn get_usize(
    values: &HashMap<String, String>,
    key: &str,
    default: usize,
    min: usize,
    max: usize,
) -> Result<usize, ConfigError> {
    let value = match values.get(key) {
        Some(v) => v,
        None => return Ok(default),
    };

    let parsed = value.parse::<usize>().map_err(|_| {
        ConfigError::InvalidValue {
            key: key.into(),
            value: value.clone(),
            reason: "expected positive integer".into(),
        }
    })?;

    if parsed < min || parsed > max {
        return Err(ConfigError::InvalidValue {
            key: key.into(),
            value: value.clone(),
            reason: format!("expected value between {} and {}", min, max),
        });
    }

    Ok(parsed)
}

fn get_u64(
    values: &HashMap<String, String>,
    key: &str,
    default: u64,
    min: u64,
    max: u64,
) -> Result<u64, ConfigError> {
    let value = match values.get(key) {
        Some(v) => v,
        None => return Ok(default),
    };

    let parsed = value.parse::<u64>().map_err(|_| {
        ConfigError::InvalidValue {
            key: key.into(),
            value: value.clone(),
            reason: "expected positive integer".into(),
        }
    })?;

    if parsed < min || parsed > max {
        return Err(ConfigError::InvalidValue {
            key: key.into(),
            value: value.clone(),
            reason: format!("expected value between {} and {}", min, max),
        });
    }

    Ok(parsed)
}

fn get_bool(
    values: &HashMap<String, String>,
    key: &str,
    default: bool,
) -> Result<bool, ConfigError> {
    let value = match values.get(key) {
        Some(v) => v,
        None => return Ok(default),
    };

    match value.to_lowercase().as_str() {
        "true" | "1" | "yes" | "on" => Ok(true),
        "false" | "0" | "no" | "off" => Ok(false),
        _ => Err(ConfigError::InvalidValue {
            key: key.into(),
            value: value.clone(),
            reason: "expected boolean value".into(),
        }),
    }
}

fn parse_environment(
    value: &str,
) -> Result<Environment, ConfigError> {
    match value.to_lowercase().as_str() {
        "development" | "dev" => Ok(Environment::Development),
        "staging" => Ok(Environment::Staging),
        "production" | "prod" => Ok(Environment::Production),
        _ => Err(ConfigError::InvalidValue {
            key: "APP_ENV".into(),
            value: value.into(),
            reason: "unknown environment".into(),
        }),
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::collections::HashMap;

    fn base_config() -> HashMap<String, String> {
        HashMap::new()
    }

    #[test]
    fn loads_defaults() {
        let cfg = AppConfig::from_map(base_config()).unwrap();

        assert_eq!(cfg.host, "0.0.0.0");
        assert_eq!(cfg.port, 8080);
        assert_eq!(cfg.worker_threads, 4);
        assert_eq!(cfg.request_timeout_secs, 30);
        assert!(!cfg.enable_metrics);
    }

    #[test]
    fn parses_custom_values() {
        let mut map = base_config();

        map.insert("APP_PORT".into(), "9000".into());
        map.insert("APP_WORKER_THREADS".into(), "16".into());
        map.insert("APP_ENABLE_METRICS".into(), "true".into());
        map.insert("APP_ENV".into(), "production".into());

        let cfg = AppConfig::from_map(map).unwrap();

        assert_eq!(cfg.port, 9000);
        assert_eq!(cfg.worker_threads, 16);
        assert!(cfg.enable_metrics);
        assert!(cfg.is_production());
    }

    #[test]
    fn rejects_invalid_port() {
        let mut map = base_config();
        map.insert("APP_PORT".into(), "999999".into());

        assert!(AppConfig::from_map(map).is_err());
    }

    #[test]
    fn rejects_invalid_boolean() {
        let mut map = base_config();
        map.insert("APP_ENABLE_METRICS".into(), "sometimes".into());

        assert!(AppConfig::from_map(map).is_err());
    }

    #[test]
    fn validates_production_constraints() {
        let mut map = base_config();

        map.insert("APP_ENV".into(), "production".into());
        map.insert("APP_WORKER_THREADS".into(), "1".into());

        assert!(AppConfig::from_map(map).is_err());
    }
}
