import { Suspense } from 'react';
import { motion } from 'framer-motion';
import FloatingCakes from './components/three/FloatingCakes';

// Loading fallback for 3D scene
function Loader() {
  return (
    <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary-50 via-background to-primary-100" />
  );
}

// Animated text variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const buttonVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
      delay: 0.8,
    },
  },
  hover: {
    scale: 1.05,
    boxShadow: '0 20px 40px -15px rgba(224, 187, 228, 0.5)',
    transition: {
      duration: 0.3,
    },
  },
  tap: {
    scale: 0.98,
  },
};

function App() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 3D Background */}
      <Suspense fallback={<Loader />}>
        <FloatingCakes />
      </Suspense>

      {/* Gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background/50 -z-5" />

      {/* Hero Content */}
      <main className="relative min-h-screen flex flex-col items-center justify-center px-4">
        <motion.div
          className="text-center max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="mb-6">
            <span className="inline-block px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sm font-medium text-primary-600 shadow-soft">
              Welcome to Our Bakery
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-text-main mb-6 leading-tight"
          >
            <span className="block">Sai Sana</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-500 via-primary to-primary-400">
              Cakes & Bakes
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-text-light font-light mb-10 max-w-2xl mx-auto"
          >
            Delicious cakes made with{' '}
            <span className="text-primary-500 font-medium">love</span> and the finest ingredients
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              className="btn btn-primary btn-lg group"
            >
              <span>Explore Our Menu</span>
              <motion.span
                className="inline-block ml-2"
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                →
              </motion.span>
            </motion.button>

            <motion.button
              variants={buttonVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="btn btn-secondary btn-lg"
            >
              View Gallery
            </motion.button>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.5 }}
          >
            <motion.div
              className="w-6 h-10 border-2 border-primary-300 rounded-full p-1"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <motion.div
                className="w-1.5 h-2.5 bg-primary rounded-full mx-auto"
                animate={{ y: [0, 12, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </main>

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary-200/30 rounded-full blur-2xl" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-primary-300/20 rounded-full blur-3xl" />
      <div className="absolute top-1/3 right-20 w-16 h-16 bg-accent/20 rounded-full blur-xl" />
    </div>
  );
}

export default App;
