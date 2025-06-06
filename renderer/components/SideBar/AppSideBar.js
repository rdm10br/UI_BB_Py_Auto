import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

import styles from "./AppSideBar.module.css";
import Tooltip from '../tooltip/Tooltip';

const AppSideBar = () => {
  const router = useRouter();
  const [dropdown, setDropdown] = useState({
    DoubleCheck: false,
    Cópia: false,
    Avulso: false,
  });

  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipText, setTooltipText] = useState('');
  const [hoveredLabel, setHoveredLabel] = useState(null);


  const dropdownRef = useRef(null);

  const [collapsed, setCollapsed] = useState(false);

  const openExcelFile = () => {
    window.MainIPC.openExcel("scripts/BB_Py_Automation/Planilhas/SALAS.xlsx");
  };

  // Toggle dropdown menus (sempre aberto)
  // const toggleDropdown = (menu) => {
  //   setDropdown((prevState) => ({
  //     ...prevState,
  //     [menu]: !prevState[menu],
  //   }));
  // };

  // Toggle dropdown menus (só um aberto por vez)
  const toggleDropdown = (menu) => {
    setDropdown((prevState) => {
      const isCurrentlyOpen = prevState[menu];
      // Fecha todos os menus e abre apenas o selecionado (se ainda não estiver aberto)
      const newState = Object.keys(prevState).reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {});
      return {
        ...newState,
        [menu]: !isCurrentlyOpen,
      };
    });
  };

  // Toggle sidebar
  const toggleSidebar = () => setCollapsed((prev) => !prev);

  useEffect(() => {
    document.body.classList.toggle("collapsedBody", collapsed);
  }, [collapsed]);

  const renderMenuItem = (label, icon, link, tooltip) => (
    <li className={styles.menus}>
      <Link href={link} className={styles.links}>
        <x
          className="tooltipContainer"
          // onMouseEnter={() => setShowTooltip(true)}
          // onMouseLeave={() => setShowTooltip(false)}
          onMouseEnter={() => setHoveredLabel(label)}
          onMouseLeave={() => setHoveredLabel(null)}
          >
          <Image className={styles.icon_menus} src={icon} height={20} width={20} alt={label} />
          {!collapsed && <span>{label}</span>}
          {/* {collapsed && <span className="tooltiptext">{tooltip}</span>} */}
          {collapsed && <Tooltip text={label} visible={hoveredLabel === label}/>}
        </x>
      </Link>
    </li>
  );

  const renderDropdownItem = (label, icon, items, dropdownKey) => (
    <>
      <li
        className="tooltipContainer"
        onClick={() => toggleDropdown(dropdownKey)}
        // onMouseEnter={() => setShowTooltip(true)}
        // onMouseLeave={() => setShowTooltip(false)}
        onMouseEnter={() => setHoveredLabel(label)}
        onMouseLeave={() => setHoveredLabel(null)}
        >
        <Image className={styles.icon_menus} src={icon} height={20} width={20} alt={label} />
        {!collapsed && <span>{label}</span>}
        {/* {collapsed && <span className="tooltiptext">{label}</span>} */}
        {collapsed && <Tooltip text={label} visible={hoveredLabel === label}/>}
        {dropdown[dropdownKey] ? <FaChevronUp className={styles.icon} /> : <FaChevronDown className={styles.icon} />}
      </li>
      {dropdown[dropdownKey] && (
      !collapsed ? (
        <ul className={styles.dropdown}>
          {items.map(({ label, link }, index) => (
            <li key={index}>
              <Link href={link} className={styles.links}>
                {label}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className={styles.dropdownBubble}>
          <ul>
            <li>
              <h2 className={styles.bubbleTitle}>
                <a>{label}</a>
                <Image className={styles.icon_menus_bubble} src={icon} height={20} width={20} alt={label} />
              </h2>
            </li>
            {items.map(({ label, link }, index) => (
              <li key={index}>
                <Link href={link} className={styles.links}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )
    )}
    </>
  );
  // close dropdown menu on router change
  useEffect(() => {
    const handleRouteChange = () => {
      setDropdown((prevState) =>
        Object.fromEntries(Object.keys(prevState).map((key) => [key, false]))
      );
    };

    router.events.on('routeChangeStart', handleRouteChange);
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
          { label: "Atividades P.", link: "/bot/loose/AtividadesP" },
          { label: "A. P. Verif.", link: "/bot/loose/AtividadesPConfig" },
          { label: "Prof Acesso", link: "/bot/loose/Prof_acesso" },
          { label: "Ocultar Boletim", link: "/bot/loose/ocultar_boletim" },
          { label: "Fael", link: "/bot/loose/fael" },
          { label: "Datas", link: "/bot/loose/datas" },
          { label: "Ajuste AV1", link: "/bot/loose/AV1" },
          { label: "Ajuste AV2", link: "/bot/loose/AV1AV2" },
          { label: "Remove S.M.", link: "/bot/loose/RemoveSer" },
          { label: "Link E-Book", link: "/bot/loose/AjusteLink" },
          { label: "Open Mescla", link: "/bot/loose/OpenMescla" },
          { label: "Material D.", link: "/bot/loose/MaterialDidatico" },
          { label: "Fale com Tutor", link: "/bot/loose/FalecomTutor" },
          { label: "DB", link: "/bot/loose/doublecheckDB" },
          { label: "Canal", link: "/bot/loose/AjusteCanal" },
          { label: "Link", link: "/bot/loose/AjusteLink" },
        ], "Avulso")}
        {renderMenuItem("BQ", "/icon/fill.png", "/bot/bq", "BQ")}
        {renderMenuItem("X9", "/icon/detective.png", "/bot/x9", "X9")}
        {renderMenuItem("Teste", "/icon/experiment.png", "/bot/teste", "Teste")}
        <li
          className={styles.plan}
          // onMouseEnter={() => setShowTooltip(true)}
          // onMouseLeave={() => setShowTooltip(false)}
          onMouseEnter={() => setHoveredLabel("Planilha")}
          onMouseLeave={() => setHoveredLabel(null)}
          >
          <Link href="#" className={styles.links} onClick={openExcelFile}>
            <Image className={styles.icon_menus} src="/icon/spreadsheet.png" height={20} width={20} alt="Planilha" />
            {!collapsed && <span>Planilha</span>}
            {/* {collapsed && <span className={styles.tooltiptext}>Planilha</span>} */}
            {collapsed && <Tooltip text="Planilha" visible={hoveredLabel === "Planilha"}/>}
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