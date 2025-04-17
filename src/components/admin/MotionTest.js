import React from 'react';
import { motion } from 'framer-motion';

const MotionTest = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        width: '100px',
        height: '100px',
        background: 'blue',
        borderRadius: '10px'
      }}
    >
      Test
    </motion.div>
  );
};

export default MotionTest; 