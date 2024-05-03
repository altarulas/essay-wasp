import { AppContent } from "@/components/core/AppContent/AppContent";
import { Navbar } from "@/components/core/Navbar/Navbar";
import styles from "./AppPage.module.scss";

const AppPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.navbar}>
        <Navbar />
      </div>
      <div className={styles.content}>
        <AppContent />
      </div>
    </div>
  );
};

export default AppPage;
