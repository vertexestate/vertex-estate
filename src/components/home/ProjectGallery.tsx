import { motion } from 'framer-motion';
import { MARGALLA_GALLERY } from '../../config/margallaAssets';

function GalleryImage({
  src,
  fallback,
  alt,
  className = '',
}: {
  src: string;
  fallback?: string;
  alt: string;
  className?: string;
}) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={className}
      onError={(e) => {
        if (fallback && e.currentTarget.src !== fallback) {
          e.currentTarget.src = fallback;
        }
      }}
    />
  );
}

export function ProjectGallery() {
  const [hero, ...rest] = MARGALLA_GALLERY;

  return (
    <div className="grid gap-4 sm:gap-5 lg:grid-cols-12 lg:grid-rows-2">
      <motion.figure
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="group relative overflow-hidden rounded-3xl lg:col-span-7 lg:row-span-2"
      >
        <GalleryImage
          src={hero.src}
          fallback={'fallback' in hero ? hero.fallback : undefined}
          alt={hero.title}
          className="aspect-[4/3] h-full w-full object-cover transition duration-700 group-hover:scale-[1.03] lg:aspect-auto lg:min-h-[480px]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/75 via-navy-950/10 to-transparent" />
        <figcaption className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-gold-300">
            {hero.caption}
          </p>
          <p className="mt-1 font-display text-2xl font-bold text-white sm:text-3xl">
            {hero.title}
          </p>
        </figcaption>
      </motion.figure>

      <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:col-span-5 lg:row-span-2 lg:grid-cols-2">
        {rest.map((item, i) => (
          <motion.figure
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className={`group relative overflow-hidden rounded-2xl ${i === 0 ? 'col-span-2 lg:col-span-2' : ''}`}
          >
            <GalleryImage
              src={item.src}
              alt={item.title}
              className={`w-full object-cover transition duration-700 group-hover:scale-[1.05] ${i === 0 ? 'aspect-[21/9] min-h-[140px]' : 'aspect-[4/3] min-h-[160px]'}`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent opacity-90" />
            <figcaption className="absolute bottom-0 left-0 right-0 p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-gold-300/95">
                {item.caption}
              </p>
              <p className="mt-0.5 text-sm font-semibold text-white">{item.title}</p>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </div>
  );
}
