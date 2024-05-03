import { Settings } from "@/components/core/SettingsContent/SettingsContent";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import styles from "./SettingsPage.module.scss";

const SettingsPage = () => {
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
          <Settings />
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
