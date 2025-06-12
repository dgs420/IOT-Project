import React from "react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CustomToast({ message, type, onClose }) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            setTimeout(onClose, 300);
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`w-full p-3 rounded-lg text-white font-medium text-center transition-all 
                        ${type === "success" ? "bg-green-500" : type === "error" ? "bg-red-500" : "bg-yellow-500"}`}
                >
                    {message}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
