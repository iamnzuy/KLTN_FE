"use client";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import React, { useEffect } from "react";
import { createPortal } from "react-dom";

const variants = {
  open: { opacity: 1, transition: { duration: 0.08 } },
  closed: { opacity: 0 },
};
const WrapModal = ({ children, setOpen, isOpen, backdrop, iconClose }: any) => {
  const onClose = () => {
    setOpen(false);
  };
  const background = backdrop ? (
    React.cloneElement(backdrop, { onClick: onClose })
  ) : (
    <div onClick={onClose} className="w-screen h-screen backdrop-blur-[2px] bg-[black]/20"></div>
  );
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={variants}
          animate={"open"}
          exit={"closed"}
          initial={"closed"}
          className="fixed top-0 left-0 w-screen h-screen z-[10000] justify-center flex items-center"
        >
          <div className="absolute top-0 left-0">{background}</div>
          <div className="fixed px-4 w-full flex justify-center items-center">{children}</div>
          {iconClose && (
            <div
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 bg-primary hover:bg-primary/80 duration-200 cursor-pointer rounded-md p-2"
            >
              <X className="w-3 h-3 fill-white stroke-white" />
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
const Modal = ({ children, isOpen, setOpen = () => {}, backdrop, iconClose }: any) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    const handleKeyDown = (e: any) => {
      if (e.key === "Escape" && isOpen) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);
  if (typeof window === "undefined") return null;

  return createPortal(
    <WrapModal isOpen={isOpen} setOpen={setOpen} backdrop={backdrop} iconClose={iconClose}>
      {children}
    </WrapModal>,
    document.body,
  );
};

export default Modal;
