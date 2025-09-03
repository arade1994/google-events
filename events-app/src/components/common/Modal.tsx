import {
  cloneElement,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { HiXMark } from "react-icons/hi2";
import useOutsideClick from "../../hooks/useOutsideClick";
import styles from "./Modal.module.scss";

const ModalContext = createContext<{
  openName: string;
  close: () => void;
  open: (name: string) => void;
}>({
  openName: "",
  close: () => {},
  open: () => {},
});

function Modal({ children }: { children: React.ReactNode }) {
  const [openName, setOpenName] = useState("");

  const close = useCallback(() => setOpenName(""), []);

  const open = setOpenName;

  return (
    <ModalContext.Provider value={{ openName, close, open }}>
      {children}
    </ModalContext.Provider>
  );
}

function Open({
  children,
  opens: opensWindowName,
}: {
  children: React.ReactNode;
  opens: string;
}) {
  const { open } = useContext(ModalContext) as { open: (name: string) => void };

  if (!isValidElement(children)) return children;

  return cloneElement(children, {
    onClick: () => open(opensWindowName),
  } as React.HTMLAttributes<HTMLElement>);
}

function Window({
  name,
  children,
}: {
  name: string;
  children: React.ReactNode;
}) {
  const { openName, close } = useContext(ModalContext);
  const ref = useOutsideClick(close);

  if (name !== openName) return null;

  return createPortal(
    <div className={styles.overlay}>
      <div ref={ref} className={styles.modal}>
        <button onClick={close} className={styles.button}>
          <HiXMark />
        </button>
        <div>
          {isValidElement(children)
            ? cloneElement(children, {
                onClose: close,
              } as React.HTMLAttributes<HTMLElement>)
            : children}
        </div>
      </div>
    </div>,
    document.body
  );
}

Modal.Open = Open;
Modal.Window = Window;

export default Modal;
