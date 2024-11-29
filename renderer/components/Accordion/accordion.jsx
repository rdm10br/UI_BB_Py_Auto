import React, { useState } from "react";
import styles from "../SideBar/AppSideBar.module.css";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const Accordion = ({title="Tutorial", pageProps}) => {
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  return (
    <>
      <div id={title} className={styles.accordeon}>
        <h3 onClick={() => setIsAccordionOpen(!isAccordionOpen)}>
          {title}
          {!isAccordionOpen ? (
            <FaChevronDown className={styles.icon} />
          ) : (
            <FaChevronUp className={styles.icon} />
          )}
        </h3>
        {isAccordionOpen && <>{pageProps}</>}
      </div>
    </>
  );
};

export default Accordion;
