import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";
import useScrollbarSize from "react-scrollbar-size";

export default function Modal({
  isOpen,
  close,
  children,
}: {
  isOpen: boolean;
  close: () => void;
  children: React.ReactNode;
}) {
  const { width } = useScrollbarSize();
  // prevent body from being scrollable while modal is present
  // See: https://stackoverflow.com/questions/54989513/react-prevent-scroll-when-modal-is-open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden", `pr-[${width}px]`);
    } else {
      document.body.classList.remove("overflow-hidden", `pr-[${width}px]`);
    }
  }, [isOpen, width]);

  if (!isOpen) {
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center">
          {/* backdrop */}
          <div
            onClick={close}
            className="fixed inset-0 z-[1000] bg-black/60"></div>

          {/* main content */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="z-[1001] rounded-xl bg-stone-600">
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
