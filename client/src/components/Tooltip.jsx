import { motion } from "framer-motion";
import "./Tooltip.css";

const Tooltip = ({ children, position = "top-right" }) => (
  <motion.div
    className={`floating-tooltip ${position}`}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

export default Tooltip;
