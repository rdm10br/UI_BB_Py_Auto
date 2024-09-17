import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from 'react';
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import styles from "./LanguageSwitcher.module.css";
// import { ipcRenderer } from 'electron';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
  const [languages, setLanguages] = useState([]);
  const [dropdown, setDropdown] = useState(false);
  
  
  // Fetch available languages from the locales.json file
  useEffect(() => {
    fetch('./locales/locales.json')
      .then((response) => response.json())
      .then((data) => {
        setLanguages(data.languages);
      })
      .catch((error) => console.error("Error fetching languages:", error));
  
    // Retrieve saved language preference from the persistent store
    // const savedLanguage = window.ipcRenderer.sendSync('get-language-preference');
    const savedLanguage = 'pt_br'
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
      setCurrentLanguage(savedLanguage);
    }
  }, []);
  
  const toggleDropdown = () => {
    setDropdown((prevState) => !prevState);
  };

  const handleChangeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setCurrentLanguage(lng);
    setDropdown(false);
    // ipcRenderer.send('save-language-preference', lng);
  };
  
  return (
    <React.Fragment className={styles.langchang}>
      <button onClick={toggleDropdown}>
        {currentLanguage}
        {dropdown ? (
          <FaChevronUp className={styles.icon} />
        ) : (
          <FaChevronDown className={styles.icon} />
        )}
      </button>
      {dropdown && (
        <ul className={styles.dropdown}>
          {languages.map((lang) => (
            <li key={lang.code} onClick={() => handleChangeLanguage(lang.code)}>
              {lang.name}
            </li>
          ))}
        </ul>
      )}
    </React.Fragment>
  );
};

export default LanguageSwitcher;