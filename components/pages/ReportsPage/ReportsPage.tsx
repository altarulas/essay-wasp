import Link from "next/link";
import { Button } from "../../ui/button";
import { FaArrowLeft } from "react-icons/fa";
import { Reports } from "../../core/ReportsContent/ReportsContent";
import styles from "./ReportsPage.module.scss";

const ReportsPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        <div className={styles.content}>
          <Link className="font-bold text-3xl" href="/">
            <Button
              className="bg-zinc-50 dark:bg-zinc-900"
              variant="outline"
              size="icon"
            >
              <FaArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <Reports />
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
