import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./AppSideBar.module.css";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const AppSideBar = () => {
  const [dropdown, setDropdown] = useState({
    DoubleCheck: false,
    Cópia: false,
    Avulso: false,
  });

  const [collapsed, setCollapsed] = useState(false);

  const openExcelFile = () => {
    window.ipc.send(
      "open-excel-file",
      "../../BB_Py_Automation/Planilhas/SALAS.xlsx"
    );
  };

  // Toggle dropdown menus
  const toggleDropdown = (menu) => {
    setDropdown((prevState) => ({
      ...prevState,
      [menu]: !prevState[menu],
    }));
  };

  // Toggle sidebar
  const toggleSidebar = () => setCollapsed((prev) => !prev);

  useEffect(() => {
    document.body.classList.toggle("collapsedBody", collapsed);
  }, [collapsed]);

  const renderMenuItem = (label, icon, link, tooltip) => (
    <li className={styles.menus}>
      <Link href={link} className={styles.links}>
        <Image className={styles.icon_menus} src={icon} height={20} width={20} alt={label} />
        {!collapsed && <span>{label}</span>}
        {collapsed && <span className={styles.tooltiptext}>{tooltip}</span>}
      </Link>
    </li>
  );

  const renderDropdownItem = (label, icon, items, dropdownKey) => (
    <>
      <li onClick={() => toggleDropdown(dropdownKey)}>
        <Image className={styles.icon_menus} src={icon} height={20} width={20} alt={label} />
        {!collapsed && <span>{label}</span>}
        {collapsed && <span className={styles.tooltiptext}>{label}</span>}
        {dropdown[dropdownKey] ? <FaChevronUp className={styles.icon} /> : <FaChevronDown className={styles.icon} />}
      </li>
      {dropdown[dropdownKey] && !collapsed && (
        <ul className={styles.dropdown}>
          {items.map(({ label, link }, index) => (
            <li key={index}>
              <Link href={link} className={styles.links}>
                {label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );

  return (
    <div className={`${styles.sideMenu} ${collapsed ? styles.collapsed : ""}`}>
      <ul className={styles.header}>
        <li className={styles.titleHead}>
          <Image className={styles.icon_menus} src="/icon/automated-process.png" height={20} width={20} alt="BlackBot" />
          {!collapsed && <p>BlackBot</p>}
        </li>
        <li className={styles.menu} onClick={toggleSidebar}>
          <Image className={styles.icon_menu} src="/icon/menu-bar.png" height={20} width={20} alt="Toggle Sidebar" />
        </li>
      </ul>
      <ul>
        {renderMenuItem("Home", "/icon/home.png", "/home", "Home")}
        {renderDropdownItem("Double Check", "/icon/double-check.png", [
          { label: "Master", link: "/bot/double_check/master" },
          { label: "Veteranos", link: "/bot/double_check/veteranos" },
          { label: "Digital", link: "/bot/double_check/digital" },
        ], "DoubleCheck")}
        {renderDropdownItem("Cópia", "/icon/copy.png", [
          { label: "Material", link: "/bot/copy/material" },
          { label: "Sala Nova", link: "/bot/copy/sala" },
        ], "Cópia")}
        {renderDropdownItem("Avulsos", "/icon/calendar.png", [
          { label: "Datas", link: "/bot/loose/datas" },
          { label: "Ajuste AV1", link: "/bot/teste" },
          { label: "Ajuste AV2", link: "/bot/teste" },
          { label: "Remove S.M.", link: "/bot/teste" },
          { label: "Link E-Book", link: "/bot/teste" },
          { label: "Open Mescla", link: "/bot/teste" },
        ], "Avulso")}
        {renderMenuItem("BQ", "/icon/fill.png", "/bot/bq", "BQ")}
        {renderMenuItem("X9", "/icon/detective.png", "/bot/x9", "X9")}
        {renderMenuItem("Teste", "/icon/experiment.png", "/bot/teste", "Teste")}
        <li className={styles.plan}>
          <Link href="#" className={styles.links} onClick={openExcelFile}>
            <Image className={styles.icon_menus} src="/icon/spreadsheet.png" height={20} width={20} alt="Planilha" />
            {!collapsed && <span>Planilha</span>}
            {collapsed && <span className={styles.tooltiptext}>Planilha</span>}
          </Link>
        </li>
      </ul>
      <div className={styles.settings_container}>
        {renderMenuItem("Configuração", "/icon/settings.png", "/settings", "Configuração")}
      </div>
    </div>
  );
};

export default AppSideBar;