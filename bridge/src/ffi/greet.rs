use crate::ffi::{self, Language as CLanguage};
use crate::models::greet::Language;
use std::ffi::{CStr, CString};

pub fn greet(name: &str, language: Language) -> String {
    let c_name = CString::new(name.as_bytes()).unwrap();

    let c_lang = match language {
        Language::En => CLanguage::LANG_EN,
        Language::De => CLanguage::LANG_DE,
        Language::Fr => CLanguage::LANG_FR,
    };

    unsafe {
        let ptr = ffi::backend_greet(c_name.as_ptr(), c_lang);
        let result = CStr::from_ptr(ptr).to_string_lossy().into_owned();

        ffi::backend_free_string(ptr);
        result
    }
}
