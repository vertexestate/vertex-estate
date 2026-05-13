import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
interface LoadingScreenProps {
  onComplete?: () => void;
}
export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsVisible(false);
            onComplete?.();
          }, 400);
          return 100;
        }
        return prev + 2;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [onComplete]);
  return (
    <AnimatePresence>
      {isVisible &&
      <motion.div
        initial={{
          opacity: 1
        }}
        exit={{
          opacity: 0,
          scale: 1.1
        }}
        transition={{
          duration: 0.6,
          ease: 'easeInOut'
        }}
        className="fixed inset-0 z-[100] bg-navy-900 flex items-center justify-center overflow-hidden">
        
          {/* Animated city skyline silhouette */}
          <div className="absolute inset-0 flex items-end justify-center opacity-30">
            <svg
            viewBox="0 0 1200 400"
            className="w-full h-2/3"
            preserveAspectRatio="xMidYEnd slice">
            
              {[...Array(15)].map((_, i) => {
              const x = i * 80;
              const height = 100 + Math.random() * 250;
              return (
                <motion.rect
                  key={i}
                  initial={{
                    y: 400
                  }}
                  animate={{
                    y: 400 - height
                  }}
                  transition={{
                    duration: 1.2,
                    delay: i * 0.05,
                    ease: 'easeOut'
                  }}
                  x={x}
                  width={60}
                  height={400}
                  fill="#143d3d"
                  stroke="#d4ff3f"
                  strokeOpacity={0.2}
                  strokeWidth={1} />);


            })}
              {/* Building windows */}
              {[...Array(15)].map((_, i) =>
            [...Array(8)].map((_, j) =>
            <motion.rect
              key={`${i}-${j}`}
              initial={{
                opacity: 0
              }}
              animate={{
                opacity: Math.random() > 0.5 ? 0.8 : 0.2
              }}
              transition={{
                duration: 0.3,
                delay: 0.8 + Math.random() * 0.8
              }}
              x={i * 80 + 10 + j % 3 * 18}
              y={150 + Math.floor(j / 3) * 30}
              width={6}
              height={10}
              fill="#d4ff3f" />

            )
            )}
            </svg>
          </div>

          {/* Floating gold orbs */}
          {[...Array(6)].map((_, i) =>
        <motion.div
          key={i}
          initial={{
            x: Math.random() * 1000 - 500,
            y: Math.random() * 600 - 300,
            opacity: 0
          }}
          animate={{
            x: Math.random() * 1000 - 500,
            y: Math.random() * 600 - 300,
            opacity: [0, 0.6, 0]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.4
          }}
          className="absolute w-2 h-2 rounded-full bg-gold-500 blur-sm" />

        )}

          <div className="relative z-10 text-center">
            <motion.div
            initial={{
              scale: 0,
              rotate: -180
            }}
            animate={{
              scale: 1,
              rotate: 0
            }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 15
            }}
            className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gold-500 to-gold-600 rounded-2xl flex items-center justify-center shadow-gold-glow-lg">
            
              <span className="text-navy-900 font-display font-bold text-4xl">
                V
              </span>
            </motion.div>

            <motion.h1
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              delay: 0.3,
              duration: 0.6
            }}
            className="text-4xl md:text-5xl font-display font-bold text-cream mb-2">
            
              Vertex Estate
            </motion.h1>
            <motion.p
            initial={{
              opacity: 0
            }}
            animate={{
              opacity: 1
            }}
            transition={{
              delay: 0.5
            }}
            className="text-gold-500 text-sm uppercase tracking-[0.3em] mb-10">
            
              Luxury homes, Pakistan-wide
            </motion.p>

            {/* Progress bar */}
            <div className="w-64 mx-auto">
              <div className="h-[2px] bg-navy-700 rounded-full overflow-hidden">
                <motion.div
                className="h-full bg-gradient-to-r from-gold-600 to-gold-400"
                style={{
                  width: `${progress}%`
                }} />
              
              </div>
              <motion.p
              initial={{
                opacity: 0
              }}
              animate={{
                opacity: 1
              }}
              transition={{
                delay: 0.7
              }}
              className="text-navy-300 text-xs mt-3 tracking-widest">
              
                {progress}%
              </motion.p>
            </div>
          </div>
        </motion.div>
      }
    </AnimatePresence>);

}