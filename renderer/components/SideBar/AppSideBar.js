// import React, { useState, useEffect } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import styles from "./AppSideBar.module.css";
// import { FaChevronDown, FaChevronUp } from "react-icons/fa";
// // import { ipcRenderer } from 'electron';

// const AppSideBar = () => {
//   const [dropdown, setDropdown] = useState({
//     DoubleCheck: false,
//     Cópia: false,
//     Avulso: false,
//   });

//   const [collapsed, setCollapsed] = useState(false);

//   const openExcelFile = async () => {
//     window.ipc.send(
//       "open-excel-file",
//       "../../BB_Py_Automation/Planilhas/SALAS.xlsx"
//     );
//   };

//   // Toggle dropdown menus
//   const toggleDropdown = (menu) => {
//     setDropdown((prevState) => ({
//       ...prevState,
//       [menu]: !prevState[menu],
//     }));
//   };

//   // Toggle between expanded and collapsed sidebar
//   const toggleSidebar = () => {
//     setCollapsed(!collapsed);
//   };

//   useEffect(() => {
//     const body = document.querySelector("body");
//     if (collapsed) {
//       body.classList.add("collapsedBody");
//     } else {
//       body.classList.remove("collapsedBody");
//     }
//   }, [collapsed]);

//   useEffect(() => {
//     document.querySelectorAll(".icon-container").forEach((container) => {
//       const tooltipText = container.getAttribute("data-tooltip");

//       // Criar o elemento tooltip
//       const tooltip = document.createElement("div");
//       tooltip.className = "tooltip";
//       tooltip.textContent = tooltipText;

//       // Adicionar a tooltip ao container
//       container.appendChild(tooltip);

//       // Mostrar a tooltip ao passar o mouse
//       container.addEventListener("mouseenter", () => {
//         tooltip.style.visibility = "visible";
//         tooltip.style.opacity = "1";
//       });

//       // Esconder a tooltip ao sair do mouse
//       container.addEventListener("mouseleave", () => {
//         tooltip.style.visibility = "hidden";
//         tooltip.style.opacity = "0";
//       });
//     });
//   }, []); //NOVO ATE AQUI

//   return (
//     <div className={`${styles.sideMenu} ${collapsed ? styles.collapsed : ""}`}>
//       <ul className={styles.header}>
//         <li className={styles.titleHead}>
//           <Image
//             className={styles.icon_menus}
//             src="/icon/automated-process.png"
//             height={20}
//             width={20}
//             alt="Description of the image"
//           />
//           {!collapsed && <p>BlackBot</p>}
//         </li>
//         <li className={styles.menu} onClick={toggleSidebar}>
//           {collapsed ? (
//             <Image
//               className={styles.icon_menu}
//               src="/icon/menu-bar.png"
//               height={20}
//               width={20}
//               alt="Description of the image"
//             />
//           ) : (
//             <Image
//               className={styles.icon_menu}
//               src="/icon/menu-bar.png"
//               height={20}
//               width={20}
//               alt="Description of the image"
//             />
//           )}
//         </li>
//       </ul>
//       <ul>
//         <li className={styles.home}>
//           {/* <div className="icon-container" data-tooltip='home'> */}
//             <Link href="/home" className={styles.link}>
//               <Image
//                 className={styles.icon_menus}
//                 src="/icon/home.png"
//                 height={20}
//                 width={20}
//                 alt="Description of the image"
//               />
//               {!collapsed && <span className="home">Home</span>}
//             </Link>
//           {/* </div> */}
//         </li>
//         <li onClick={() => toggleDropdown("DoubleCheck")}>
//           <Image
//             className={styles.icon_menus}
//             src="/icon/double-check.png"
//             height={20}
//             width={20}
//             alt="Description of the image"
//           />
//           {!collapsed && <span>Double Check</span>}
//           {collapsed && (
//             <span className={styles.tooltiptext}>Double Check</span>
//           )}
//           {dropdown.DoubleCheck ? (
//             <FaChevronUp className={styles.icon} />
//           ) : (
//             <FaChevronDown className={styles.icon} />
//           )}
//         </li>
//         {dropdown.DoubleCheck && !collapsed && (
//           <ul className={styles.dropdown}>
//             <li>
//               <Link href="/bot/double_check/master" className={styles.link}>
//                 Master
//               </Link>
//             </li>
//             <li>
//               <Link href="/bot/double_check/veteranos" className={styles.link}>
//                 Veteranos
//               </Link>
//             </li>
//             <li>
//               <Link href="/bot/double_check/digital" className={styles.link}>
//                 Digital
//               </Link>
//             </li>
//           </ul>
//         )}
//         <li onClick={() => toggleDropdown("Cópia")}>
//           <Image
//             className={styles.icon_menus}
//             src="/icon/copy.png"
//             height={20}
//             width={20}
//             alt="Description of the image"
//           />
//           {!collapsed && <span>Cópia</span>}
//           {collapsed && <span className={styles.tooltiptext}>Cópia</span>}
//           {dropdown.Cópia ? (
//             <FaChevronUp className={styles.icon} />
//           ) : (
//             <FaChevronDown className={styles.icon} />
//           )}
//         </li>
//         {dropdown.Cópia && !collapsed && (
//           <ul className={styles.dropdown}>
//             <li>
//               <Link href="/bot/copy/material" className={styles.link}>
//                 Material
//               </Link>
//             </li>
//             <li>
//               <Link href="/bot/copy/sala" className={styles.link}>
//                 Sala Nova
//               </Link>
//             </li>
//           </ul>
//         )}
//         <li onClick={() => toggleDropdown("Avulso")}>
//           <Image
//             className={styles.icon_menus}
//             src="/icon/calendar.png"
//             height={20}
//             width={20}
//             alt="Description of the image"
//           />
//           {!collapsed && <span>Avulsos</span>}
//           {collapsed && <span className={styles.tooltiptext}>Avulsos</span>}
//           {dropdown.Avulso ? (
//             <FaChevronUp className={styles.icon} />
//           ) : (
//             <FaChevronDown className={styles.icon} />
//           )}
//         </li>
//         {dropdown.Avulso && !collapsed && (
//           <ul className={styles.dropdown}>
//             <li>
//               <Link href="/bot/loose/datas" className={styles.link}>
//                 Datas
//               </Link>
//             </li>
//             <li>
//               <Link href="/bot/teste" className={styles.link}>
//                 Ajuste AV1
//               </Link>
//             </li>
//             <li>
//               <Link href="/bot/teste" className={styles.link}>
//                 Ajuste AV2
//               </Link>
//             </li>
//             <li>
//               <Link href="/bot/teste" className={styles.link}>
//                 Remove S.M.
//               </Link>
//             </li>
//             <li>
//               <Link href="/bot/teste" className={styles.link}>
//                 Link E-Book
//               </Link>
//             </li>
//             <li>
//               <Link href="/bot/teste" className={styles.link}>
//                 Open Mescla
//               </Link>
//             </li>
//           </ul>
//         )}
//         <li>
//           <Link href="/bot/bq" className={styles.link}>
//             <Image
//               className={styles.icon_menus}
//               src="/icon/fill.png"
//               height={20}
//               width={20}
//               alt="Description of the image"
//             />
//             {!collapsed && <span>BQ</span>}
//             {collapsed && <span className={styles.tooltiptext}>BQ</span>}
//           </Link>
//         </li>
//         <li>
//           <Link href="/bot/x9" className={styles.link}>
//             <Image
//               className={styles.icon_menus}
//               src="/icon/detective.png"
//               height={20}
//               width={20}
//               alt="Description of the image"
//             />
//             {!collapsed && <span>X9</span>}
//             {collapsed && <span className={styles.tooltiptext}>X9</span>}
//           </Link>
//         </li>
//         <li>
//           <Link href="/bot/teste" className={styles.link}>
//             <Image
//               className={styles.icon_menus}
//               src="/icon/experiment.png"
//               height={20}
//               width={20}
//               alt="Description of the image"
//             />
//             {!collapsed && <span>Teste</span>}
//             {collapsed && <span className={styles.tooltiptext}>Teste</span>}
//           </Link>
//         </li>
//         <li className={styles.plan}>
//           <Link href="#" className={styles.link} onClick={openExcelFile}>
//             <Image
//               className={styles.icon_menus}
//               src="/icon/spreadsheet.png"
//               height={20}
//               width={20}
//               alt="Description of the image"
//             />
//             {!collapsed && <span>Planilha</span>}
//             {collapsed && <span className={styles.tooltiptext}>Planilha</span>}
//           </Link>
//         </li>
//       </ul>
//       <div className={styles.settings_container}>
//         <li className={styles.settings}>
//           <Link href="/settings" className={styles.link}>
//             <Image
//               className={styles.icon_menus}
//               src="/icon/settings.png"
//               height={20}
//               width={20}
//               alt="Description of the image"
//             />
//             {!collapsed && <span>Configuração</span>}
//             {collapsed && (
//               <span className={styles.tooltiptext}>Configuração</span>
//             )}
//           </Link>
//         </li>
//       </div>
//     </div>
//   );
// };

// export default AppSideBar;

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
    <li className={styles.menu}>
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