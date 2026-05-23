import { motion } from 'framer-motion';
import {
  HomeIcon,
  KeyIcon,
  BuildingIcon,
  TrendingUpIcon,
  ChevronRightIcon,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Categories() {
  const navigate = useNavigate();
  const categories = [
    {
      icon: HomeIcon,
      title: 'Buy property',
      description: 'Find your dream home from our extensive collection',
      color: 'from-sky-500 to-blue-700',
    },
    {
      icon: KeyIcon,
      title: 'Rent property',
      description: 'Discover perfect rental properties for your needs',
      color: 'from-emerald-500 to-teal-700',
    },
    {
      icon: TrendingUpIcon,
      title: 'Luxury estates',
      description: 'Exclusive high-end properties for discerning clients',
      color: 'from-gold-400 to-gold-700',
    },
    {
      icon: BuildingIcon,
      title: 'Commercial',
      description: 'Prime commercial spaces for your business',
      color: 'from-violet-500 to-purple-800',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
      {categories.map((category, index) => (
        <motion.div
          key={category.title}
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-32px' }}
          transition={{
            type: 'spring',
            stiffness: 280,
            damping: 22,
            delay: index * 0.07,
          }}
          whileHover={{ y: -8, scale: 1.01 }}
          onClick={() => navigate('/listings')}
          className="group cursor-pointer"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              navigate('/listings');
            }
          }}
        >
          <div className="relative h-full overflow-hidden rounded-3xl border border-navy-100/90 bg-white/90 p-7 shadow-xl shadow-black/[0.04] ring-1 ring-transparent backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:border-gold-500/40 hover:shadow-2xl hover:shadow-gold-500/15 hover:ring-gold-500/20 dark:border-navy-600 dark:bg-navy-800/85 dark:hover:border-gold-500/35">
            <div
              className={`absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br ${category.color} opacity-[0.14] blur-2xl transition-opacity duration-500 group-hover:opacity-[0.26]`}
            />
            <div className="pointer-events-none absolute inset-0 translate-x-[-120%] skew-x-[-12deg] bg-gradient-to-r from-transparent via-white/35 to-transparent opacity-0 transition duration-700 group-hover:translate-x-[120%] group-hover:opacity-100 dark:via-white/[0.08]" />
            <div
              className={`relative mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${category.color} shadow-lg transition-transform duration-300 group-hover:scale-105`}
            >
              <category.icon className="h-7 w-7 text-white" aria-hidden />
            </div>
            <h3 className="font-display text-xl font-bold text-navy-900 transition-colors group-hover:text-gold-600 dark:text-cream dark:group-hover:text-gold-400">
              {category.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-navy-600 dark:text-cream/70">
              {category.description}
            </p>
            <div className="mt-5 flex items-center gap-1 text-sm font-semibold text-gold-600 opacity-0 transition-all group-hover:opacity-100 dark:text-gold-400">
              Explore
              <ChevronRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
