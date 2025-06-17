import { showSnackbar } from "@/utils/show-snackbar";
import { CheckIcon, LinkIcon } from "@phosphor-icons/react";
import { LabelButton } from "@synergycodes/axiom";
import { useState } from "react";
import styles from "./top-navbar.module.css";
import { useSyncedRoomId } from "@/hooks/use-synced-room-id";

const AUTO_HIDE_DURATION = 2000;

export function ShareButton() {
  const [copied, setCopied] = useState(false);
  const roomId = useSyncedRoomId();

  const handleCopy = async () => {
    if (!roomId) {
      return;
    }

    const shareLink = `${window.location.href}`;

    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), AUTO_HIDE_DURATION);
      showSnackbar({
        title: "Link Copied!",
        variant: "success",
        autoHideDuration: AUTO_HIDE_DURATION,
      });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      showSnackbar({
        title: "Unknown error! Cannot copy link!",
        variant: "error",
        autoHideDuration: AUTO_HIDE_DURATION,
      });
    }
  };

  return (
    <LabelButton
      className={styles.shareButton}
      //@ts-expect-error-with-label
      label={
        copied ? (
          <span className={styles.shareButtonLabel}>
            {"Link copied!"}
            <CheckIcon weight="bold" size={15} />
          </span>
        ) : (
          <span className={styles.shareButtonLabel}>
            <LinkIcon weight="bold" size={15} />
            {"Copy link"}
          </span>
        )
      }
      disabled={!roomId}
      onClick={handleCopy}
    />
  );
}
