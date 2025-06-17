import { closeSnackbar, enqueueSnackbar } from "notistack";
import { Snackbar, SnackbarProps } from "@synergycodes/axiom";

export const AUTO_HIDE_DURATION_TIME = 3000;

export type ShowSnackbarProps = SnackbarProps & {
  autoHideDuration?: number;
  preventDuplicate?: boolean;
};

export function showSnackbar({
  title,
  variant,
  subtitle,
  buttonLabel,
  onButtonClick,
  close = true,
  autoHideDuration = AUTO_HIDE_DURATION_TIME,
  preventDuplicate = true,
}: ShowSnackbarProps) {
  enqueueSnackbar(variant, {
    content: (key) => (
      <Snackbar
        title={title}
        variant={variant}
        subtitle={subtitle}
        buttonLabel={buttonLabel}
        onButtonClick={() => {
          onButtonClick?.();
          closeSnackbar(key);
        }}
        close={close}
        onClose={() => closeSnackbar(key)}
      />
    ),
    autoHideDuration,
    preventDuplicate,
    anchorOrigin: { horizontal: "center", vertical: "bottom" },
  });
  return { showSnackbar };
}
