"use client";

import { TypeAnimation } from "react-type-animation";
import styles from "./HomeContent.module.scss";
import { Login } from "../Login/Login";

export const HomeContent = () => {
  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        <div className={styles.titleWrapper}>
          <h1 className={styles.title}>Essay Wasp</h1>
        </div>
        <TypeAnimation
          sequence={[
            "Get Your Essay's Band",
            3000,
            "Get Your Essay's Feedback",
            3000,
            "Get Your Essay's Improvements",
            3000,
          ]}
          speed={25}
          className={styles.titleAnimation}
          repeat={Infinity}
        />
        {/*  <Login /> */}
      </div>
    </div>
  );
};
