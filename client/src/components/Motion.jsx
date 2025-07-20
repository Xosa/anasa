import { motion } from "framer-motion";

function Motion({
  key,
  animate,
  transition,
  style = {},
  className = "",
  children,
}) {
  return (
    <motion.div
      key={key}
      animate={animate}
      transition={transition}
      style={style}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default Motion;
