import { type ReactNode, useEffect } from "react";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  width?: "sm" | "md" | "lg" | "xl" | "xxl";
};

const widthMap = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  xxl: "max-w-2xl",
};

export const Modal = ({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  width = "md",
}: ModalProps) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className={`relative w-full ${widthMap[width]} mx-4 bg-white rounded-2xl shadow-xl border border-gray-200`}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {(title || description) && (
              <div className="px-6 pt-6 pb-4 border-b border-gray-200">
                <div className="flex items-start justify-between">
                  <div>
                    {title && (
                      <h2 className="text-lg font-bold text-black">{title}</h2>
                    )}
                    {description && (
                      <p className="text-sm text-gray-600 mt-1">
                        {description}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-black transition cursor-pointer"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            )}

            <div className="px-6 py-5">{children}</div>

            {footer && (
              <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-2">
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
