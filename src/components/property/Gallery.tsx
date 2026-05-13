import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
interface GalleryProps {
  images: string[];
  title: string;
}
export function Gallery({ images, title }: GalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % images.length);
  };
  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
  };
  return (
    <>
      <div className="space-y-4">
        <motion.div
          whileHover={{
            scale: 1.02
          }}
          className="relative h-96 md:h-[600px] rounded-2xl overflow-hidden cursor-pointer group"
          onClick={() => setIsLightboxOpen(true)}>
          
          <img
            src={images[selectedImage]}
            alt={`${title} - Image ${selectedImage + 1}`}
            className="w-full h-full object-cover" />
          
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
            <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-lg font-semibold">
              Click to view full size
            </span>
          </div>
        </motion.div>

        <div className="grid grid-cols-4 gap-4">
          {images.map((image, index) =>
          <motion.button
            key={index}
            whileHover={{
              scale: 1.05
            }}
            onClick={() => setSelectedImage(index)}
            className={`relative h-24 rounded-lg overflow-hidden ${selectedImage === index ? 'ring-4 ring-gold-500' : ''}`}>
            
              <img
              src={image}
              alt={`Thumbnail ${index + 1}`}
              className="w-full h-full object-cover" />
            
            </motion.button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isLightboxOpen &&
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
            <motion.div
            initial={{
              opacity: 0
            }}
            animate={{
              opacity: 1
            }}
            exit={{
              opacity: 0
            }}
            className="relative w-full h-full flex items-center justify-center">
            
              <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10">
              
                <XIcon className="w-6 h-6 text-white" />
              </button>

              <button
              onClick={prevImage}
              className="absolute left-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
              
                <ChevronLeftIcon className="w-8 h-8 text-white" />
              </button>

              <motion.img
              key={selectedImage}
              initial={{
                opacity: 0,
                scale: 0.9
              }}
              animate={{
                opacity: 1,
                scale: 1
              }}
              exit={{
                opacity: 0,
                scale: 0.9
              }}
              src={images[selectedImage]}
              alt={`${title} - Image ${selectedImage + 1}`}
              className="max-w-full max-h-full object-contain" />
            

              <button
              onClick={nextImage}
              className="absolute right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
              
                <ChevronRightIcon className="w-8 h-8 text-white" />
              </button>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white">
                {selectedImage + 1} / {images.length}
              </div>
            </motion.div>
          </div>
        }
      </AnimatePresence>
    </>);

}