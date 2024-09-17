// import React, { useState, useEffect } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import styles from "./AppSideBar.module.css";
// import { withTranslation } from '../lib/withTranslation.js';
// import { FaChevronDown, FaChevronUp } from "react-icons/fa";
// // import { ipcRenderer } from 'electron';

// export const getServerSideProps = withTranslation('common');

// const AppSideBar = () => {
//   const { t } = useTranslation('common');
//   const [dropdown, setDropdown] = useState({
//     DoubleCheck: false,
//     Cópia: false,
//     Data: false,
//   });

//   const [collapsed, setCollapsed] = useState(false);
//   const [result, setResult] = useState('');

//   const openExcelFile = async () => {
//     window.ipc.send("open-excel-file", "../../BB_Py_Automation/Planilhas/SALAS.xlsx");
//   };

//   // Function to run Python script
//   const runPython = () => {
//     window.ipc.send('run-python', 'Main_Test.py');
//     window.ipc.on('python-result', (event, data) => {
//       setResult(data);
//     });
//     window.ipc.on('python-error', (event, error) => {
//       console.error(error);
//     });
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
//     const body = document.querySelector('body');
//     if (collapsed) {
//       body.classList.add('collapsedBody');
//     } else {
//       body.classList.remove('collapsedBody');
//     }
//   }, [collapsed]);

//   return (
//     <div className={`${styles.sideMenu} ${collapsed ? styles.collapsed : ""}`}>
//       <ul className={styles.header}>
//         <li className={styles.titleHead}>
//           <Image
//             className={styles.icon_menus}
//             src="/icon/automated-process.png"
//             height={20}
//             width={20}
//           />
//           {!collapsed && <p>{t('sidebar.blackBot')}</p>}
//         </li>
//         <li className={styles.menu} onClick={toggleSidebar}>
//           {collapsed ? (
//             <Image
//               className={styles.icon_menu}
//               src="/icon/menu-bar.png"
//               height={20}
//               width={20}
//             />
//           ) : (
//             <Image
//               className={styles.icon_menu}
//               src="/icon/menu-bar.png"
//               height={20}
//               width={20}
//             />
//           )}
//         </li>
//       </ul>
//       <ul>
//         <li className={styles.home}>
//           <Link href="/home" className={styles.link}>
//             <Image
//               className={styles.icon_menus}
//               src="/icon/home.png"
//               height={20}
//               width={20}
//             />
//             {!collapsed && <span>{t('sidebar.home')}</span>}
//             {collapsed && <span className={styles.tooltiptext}>{t('sidebar.home')}</span>}
//           </Link>
//         </li>
//         <li onClick={() => toggleDropdown("DoubleCheck")}>
//           <Image
//             className={styles.icon_menus}
//             src="/icon/double-check.png"
//             height={20}
//             width={20}
//           />
//           {!collapsed && <span>{t('sidebar.doubleCheck')}</span>}
//           {collapsed && <span className={styles.tooltiptext}>{t('sidebar.doubleCheck')}</span>}
//           {dropdown.DoubleCheck ? (
//             <FaChevronUp className={styles.icon} />
//           ) : (
//             <FaChevronDown className={styles.icon} />
//           )}
//         </li>
//         {dropdown.DoubleCheck && !collapsed && (
//           <ul className={styles.dropdown}>
//             <li>
//               <Link href="/master" className={styles.link}>
//                 {t('dropdown.doubleCheck.items.master')}
//               </Link>
//             </li>
//             <li>
//               <Link href="/veteranos" className={styles.link}>
//                 {t('dropdown.doubleCheck.items.veteranos')}
//               </Link>
//             </li>
//             <li>
//               <Link href="/digital" className={styles.link}>
//                 {t('dropdown.doubleCheck.items.digital')}
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
//           />
//           {!collapsed && <span>{t('sidebar.copy')}</span>}
//           {collapsed && <span className={styles.tooltiptext}>{t('sidebar.copy')}</span>}
//           {dropdown.Cópia ? (
//             <FaChevronUp className={styles.icon} />
//           ) : (
//             <FaChevronDown className={styles.icon} />
//           )}
//         </li>
//         {dropdown.Cópia && !collapsed && (
//           <ul className={styles.dropdown}>
//             <li>
//               <Link href="/material" className={styles.link}>
//                 {t('dropdown.copy.items.material')}
//               </Link>
//             </li>
//             <li>
//               <Link href="/sala" className={styles.link}>
//                 {t('dropdown.copy.items.salaNova')}
//               </Link>
//             </li>
//           </ul>
//         )}
//         <li onClick={() => toggleDropdown("Data")}>
//           <Image
//             className={styles.icon_menus}
//             src="/icon/calendar.png"
//             height={20}
//             width={20}
//           />
//           {!collapsed && <span>{t('sidebar.avulsos')}</span>}
//           {collapsed && <span className={styles.tooltiptext}>{t('sidebar.avulsos')}</span>}
//           {dropdown.Data ? (
//             <FaChevronUp className={styles.icon} />
//           ) : (
//             <FaChevronDown className={styles.icon} />
//           )}
//         </li>
//         {dropdown.Data && !collapsed && (
//           <ul className={styles.dropdown}>
//             <li>
//               <Link href="/datas" className={styles.link}>
//                 {t('dropdown.date.items.datas')}
//               </Link>
//             </li>
//             <li>
//               <Link href="/teste" className={styles.link}>
//                 {t('dropdown.date.items.ajusteAV1')}
//               </Link>
//             </li>
//             <li>
//               <Link href="/teste" className={styles.link}>
//                 {t('dropdown.date.items.ajusteAV2')}
//               </Link>
//             </li>
//             <li>
//               <Link href="/teste" className={styles.link}>
//                 {t('dropdown.date.items.removeSM')}
//               </Link>
//             </li>
//             <li>
//               <Link href="/teste" className={styles.link}>
//                 {t('dropdown.date.items.linkEBook')}
//               </Link>
//             </li>
//             <li>
//               <Link href="/teste" className={styles.link}>
//                 {t('dropdown.date.items.openMescla')}
//               </Link>
//             </li>
//           </ul>
//         )}
//         <li>
//           <Link href="/bq" className={styles.link}>
//             <Image
//               className={styles.icon_menus}
//               src="/icon/fill.png"
//               height={20}
//               width={20}
//             />
//             {!collapsed && <span>{t('sidebar.bq')}</span>}
//             {collapsed && <span className={styles.tooltiptext}>{t('sidebar.bq')}</span>}
//           </Link>
//         </li>
//         <li>
//           <Link href="/x9" className={styles.link}>
//             <Image
//               className={styles.icon_menus}
//               src="/icon/detective.png"
//               height={20}
//               width={20}
//             />
//             {!collapsed && <span>{t('sidebar.x9')}</span>}
//             {collapsed && <span className={styles.tooltiptext}>{t('sidebar.x9')}</span>}
//           </Link>
//         </li>
//         <li>
//           <Link href="/teste" className={styles.link} onClick={runPython}>
//             <Image
//               className={styles.icon_menus}
//               src="/icon/experiment.png"
//               height={20}
//               width={20}
//             />
//             {!collapsed && <span>{t('sidebar.test')}</span>}
//             {collapsed && <span className={styles.tooltiptext}>{t('sidebar.test')}</span>}
//           </Link>
//         </li>
//         <li className={styles.plan}>
//           <Link href="#" className={styles.link} onClick={openExcelFile}>
//             <Image
//               className={styles.icon_menus}
//               src="/icon/spreadsheet.png"
//               height={20}
//               width={20}
//             />
//             {!collapsed && <span>{t('sidebar.planilha')}</span>}
//             {collapsed && <span className={styles.tooltiptext}>{t('sidebar.planilha')}</span>}
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
//             />
//             {!collapsed && <span>{t('sidebar.settings')}</span>}
//             {collapsed && <span className={styles.tooltiptext}>{t('sidebar.settings')}</span>}
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
// import { withTranslation } from '../lib/withTranslation.js';
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
// import { ipcRenderer } from 'electron';

// export const getServerSideProps = withTranslation('common');

const AppSideBar = () => {
  // const { t } = useTranslation('common');
  const [dropdown, setDropdown] = useState({
    DoubleCheck: false,
    Cópia: false,
    Data: false,
  });

  const [collapsed, setCollapsed] = useState(false);
  const [result, setResult] = useState('');

  const openExcelFile = async () => {
    window.ipc.send("open-excel-file", "../../BB_Py_Automation/Planilhas/SALAS.xlsx");
  };

  // Function to run Python script
  // const runPython = () => {
  //   window.ipc.send('run-python', 'Main_Test.py');
  //   window.ipc.on('python-result', (event, data) => {
  //     setResult(data);
  //   });
  //   window.ipc.on('python-error', (event, error) => {
  //     console.error(error);
  //   });
  // };

  // Toggle dropdown menus
  const toggleDropdown = (menu) => {
    setDropdown((prevState) => ({
      ...prevState,
      [menu]: !prevState[menu],
    }));
  };

  // Toggle between expanded and collapsed sidebar
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  useEffect(() => {
    const body = document.querySelector('body');
    if (collapsed) {
      body.classList.add('collapsedBody');
    } else {
      body.classList.remove('collapsedBody');
    }
  }, [collapsed]);

  return (
    <div className={`${styles.sideMenu} ${collapsed ? styles.collapsed : ""}`}>
      <ul className={styles.header}>
        <li className={styles.titleHead}>
          <Image
            className={styles.icon_menus}
            src="/icon/automated-process.png"
            height={20}
            width={20}
          />
          {!collapsed && <p>BlackBot</p>}
        </li>
        <li className={styles.menu} onClick={toggleSidebar}>
          {collapsed ? (
            <Image
              className={styles.icon_menu}
              src="/icon/menu-bar.png"
              height={20}
              width={20}
            />
          ) : (
            <Image
              className={styles.icon_menu}
              src="/icon/menu-bar.png"
              height={20}
              width={20}
            />
          )}
        </li>
      </ul>
      <ul>
        <li className={styles.home}>
          <Link href="/home" className={styles.link}>
            <Image
              className={styles.icon_menus}
              src="/icon/home.png"
              height={20}
              width={20}
            />
            {!collapsed && <span>Home</span>}
            {collapsed && <span className={styles.tooltiptext}>Home</span>}
          </Link>
        </li>
        <li onClick={() => toggleDropdown("DoubleCheck")}>
          <Image
            className={styles.icon_menus}
            src="/icon/double-check.png"
            height={20}
            width={20}
          />
          {!collapsed && <span>Double Check</span>}
          {collapsed && <span className={styles.tooltiptext}>Double Check</span>}
          {dropdown.DoubleCheck ? (
            <FaChevronUp className={styles.icon} />
          ) : (
            <FaChevronDown className={styles.icon} />
          )}
        </li>
        {dropdown.DoubleCheck && !collapsed && (
          <ul className={styles.dropdown}>
            <li>
              <Link href="/master" className={styles.link}>
                Master
              </Link>
            </li>
            <li>
              <Link href="/veteranos" className={styles.link}>
                Veteranos
              </Link>
            </li>
            <li>
              <Link href="/digital" className={styles.link}>
                Digital
              </Link>
            </li>
          </ul>
        )}
        <li onClick={() => toggleDropdown("Cópia")}>
          <Image
            className={styles.icon_menus}
            src="/icon/copy.png"
            height={20}
            width={20}
          />
          {!collapsed && <span>Cópia</span>}
          {collapsed && <span className={styles.tooltiptext}>Cópia</span>}
          {dropdown.Cópia ? (
            <FaChevronUp className={styles.icon} />
          ) : (
            <FaChevronDown className={styles.icon} />
          )}
        </li>
        {dropdown.Cópia && !collapsed && (
          <ul className={styles.dropdown}>
            <li>
              <Link href="/material" className={styles.link}>
                Material
              </Link>
            </li>
            <li>
              <Link href="/sala" className={styles.link}>
                Sala Nova
              </Link>
            </li>
          </ul>
        )}
        <li onClick={() => toggleDropdown("Data")}>
          <Image
            className={styles.icon_menus}
            src="/icon/calendar.png"
            height={20}
            width={20}
          />
          {!collapsed && <span>Avulsos</span>}
          {collapsed && <span className={styles.tooltiptext}>Avulsos</span>}
          {dropdown.Data ? (
            <FaChevronUp className={styles.icon} />
          ) : (
            <FaChevronDown className={styles.icon} />
          )}
        </li>
        {dropdown.Data && !collapsed && (
          <ul className={styles.dropdown}>
            <li>
              <Link href="/datas" className={styles.link}>
                Datas
              </Link>
            </li>
            <li>
              <Link href="/teste" className={styles.link}>
                Ajuste AV1
              </Link>
            </li>
            <li>
              <Link href="/teste" className={styles.link}>
                Ajuste AV2
              </Link>
            </li>
            <li>
              <Link href="/teste" className={styles.link}>
                Remove S.M.
              </Link>
            </li>
            <li>
              <Link href="/teste" className={styles.link}>
                Link E-Book
              </Link>
            </li>
            <li>
              <Link href="/teste" className={styles.link}>
                Open Mescla
              </Link>
            </li>
          </ul>
        )}
        <li>
          <Link href="/bq" className={styles.link}>
            <Image
              className={styles.icon_menus}
              src="/icon/fill.png"
              height={20}
              width={20}
            />
            {!collapsed && <span>BQ</span>}
            {collapsed && <span className={styles.tooltiptext}>BQ</span>}
          </Link>
        </li>
        <li>
          <Link href="/x9" className={styles.link}>
            <Image
              className={styles.icon_menus}
              src="/icon/detective.png"
              height={20}
              width={20}
            />
            {!collapsed && <span>X9</span>}
            {collapsed && <span className={styles.tooltiptext}>X9</span>}
          </Link>
        </li>
        <li>
          <Link href="/teste" className={styles.link} >
            <Image
              className={styles.icon_menus}
              src="/icon/experiment.png"
              height={20}
              width={20}
            />
            {!collapsed && <span>Teste</span>}
            {collapsed && <span className={styles.tooltiptext}>Teste</span>}
          </Link>
        </li>
        <li className={styles.plan}>
          <Link href="#" className={styles.link} onClick={openExcelFile}>
            <Image
              className={styles.icon_menus}
              src="/icon/spreadsheet.png"
              height={20}
              width={20}
            />
            {!collapsed && <span>Planilha</span>}
            {collapsed && <span className={styles.tooltiptext}>Planilha</span>}
          </Link>
        </li>
      </ul>
      <div className={styles.settings_container}>
        <li className={styles.settings}>
          <Link href="/settings" className={styles.link}>
            <Image
              className={styles.icon_menus}
              src="/icon/settings.png"
              height={20}
              width={20}
            />
            {!collapsed && <span>Configuração</span>}
            {collapsed && <span className={styles.tooltiptext}>Configuração</span>}
          </Link>
        </li>
      </div>
    </div>
  );
};

export default AppSideBar;