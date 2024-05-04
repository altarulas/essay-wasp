import { cn } from "@/lib/utils";
import styles from "./HomePage.module.scss";
import { HomeContent } from "@/components/core/HomeContent/HomeContent";

const HomePage = () => {
  return (
    <div className={cn(styles.container)}>
      <div className={styles.contentWrapper}>
        <HomeContent />
      </div>
    </div>
  );
};

export default HomePage;
