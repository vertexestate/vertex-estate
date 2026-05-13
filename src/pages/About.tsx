import React from 'react';
import { motion } from 'framer-motion';
import { TeamGrid } from '../components/about/TeamGrid';
import { Stats } from '../components/home/Stats';
import { SectionHeading } from '../components/ui/SectionHeading';
import { TargetIcon, EyeIcon, HeartIcon, AwardIcon } from 'lucide-react';
export function About() {
  const values = [
  {
    icon: TargetIcon,
    title: 'Mission',
    description:
    'To revolutionize real estate by combining luxury, technology, and exceptional service.'
  },
  {
    icon: EyeIcon,
    title: 'Vision',
    description:
    "To be the world's most trusted platform for premium property transactions."
  },
  {
    icon: HeartIcon,
    title: 'Values',
    description:
    'Integrity, innovation, and unwavering commitment to client satisfaction.'
  }];

  const milestones = [
  {
    year: '2010',
    event: 'Vertex Estate Founded'
  },
  {
    year: '2013',
    event: 'Expanded to 10 Cities'
  },
  {
    year: '2016',
    event: 'Launched Digital Platform'
  },
  {
    year: '2019',
    event: 'Reached $1B in Transactions'
  },
  {
    year: '2022',
    event: 'Global Expansion to 50+ Cities'
  },
  {
    year: '2024',
    event: 'AI-Powered Property Matching'
  }];

  return (
    <div className="min-h-screen bg-cream dark:bg-navy-900 pt-24 pb-20">
      <div className="relative h-96 mb-20">
        <div className="absolute inset-0 bg-gradient-to-r from-navy-900/90 to-navy-900/70" />
        <img
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&h=600&fit=crop"
          alt="About Vertex Estate"
          className="w-full h-full object-cover" />
        
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{
              opacity: 0,
              y: 30
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              duration: 0.8
            }}
            className="text-center">
            
            <h1 className="text-5xl md:text-7xl font-display font-bold text-cream mb-6">
              About Vertex Estate
            </h1>
            <p className="text-xl md:text-2xl text-navy-200 max-w-3xl mx-auto px-4">
              Redefining luxury real estate through innovation and excellence
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="mb-20">
          <motion.div
            initial={{
              opacity: 0,
              y: 20
            }}
            whileInView={{
              opacity: 1,
              y: 0
            }}
            viewport={{
              once: true
            }}
            className="max-w-4xl mx-auto text-center mb-16">
            
            <h2 className="text-3xl md:text-4xl font-display font-bold text-navy-900 dark:text-cream mb-6">
              Our Story
            </h2>
            <p className="text-lg text-navy-700 dark:text-navy-300 leading-relaxed mb-6">
              Founded on the belief that finding your perfect property should be
              an exceptional experience, Vertex Estate has been at the forefront
              of luxury real estate for over a decade. We combine cutting-edge
              technology with personalized service to deliver unparalleled
              results.
            </p>
            <p className="text-lg text-navy-700 dark:text-navy-300 leading-relaxed">
              Our team of dedicated professionals brings together decades of
              experience in real estate, technology, and customer service. We're
              not just selling properties—we're helping people find where they
              belong.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) =>
            <motion.div
              key={index}
              initial={{
                opacity: 0,
                y: 20
              }}
              whileInView={{
                opacity: 1,
                y: 0
              }}
              viewport={{
                once: true
              }}
              transition={{
                duration: 0.5,
                delay: index * 0.1
              }}
              className="bg-white dark:bg-navy-800 rounded-2xl p-8 text-center shadow-lg">
              
                <div className="w-16 h-16 rounded-full bg-gold-500/10 flex items-center justify-center mx-auto mb-6">
                  <value.icon className="w-8 h-8 text-gold-500" />
                </div>
                <h3 className="text-2xl font-display font-bold text-navy-900 dark:text-cream mb-4">
                  {value.title}
                </h3>
                <p className="text-navy-600 dark:text-navy-400">
                  {value.description}
                </p>
              </motion.div>
            )}
          </div>
        </section>

        <section className="mb-20">
          <SectionHeading
            eyebrow="Our Impact"
            title="By the Numbers"
            subtitle="The results speak for themselves" />
          
          <div className="mt-16">
            <Stats />
          </div>
        </section>

        <section className="mb-20">
          <SectionHeading
            eyebrow="Meet the Team"
            title="Leadership & Expertise"
            subtitle="The talented people behind Vertex Estate" />
          
          <div className="mt-16">
            <TeamGrid />
          </div>
        </section>

        <section className="mb-20">
          <SectionHeading
            eyebrow="Our Journey"
            title="Milestones"
            subtitle="Key moments in our growth story" />
          
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gold-500/20" />
              {milestones.map((milestone, index) =>
              <motion.div
                key={index}
                initial={{
                  opacity: 0,
                  x: index % 2 === 0 ? -50 : 50
                }}
                whileInView={{
                  opacity: 1,
                  x: 0
                }}
                viewport={{
                  once: true
                }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1
                }}
                className={`relative flex items-center mb-12 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                
                  <div
                  className={`w-1/2 ${index % 2 === 0 ? 'pr-12 text-right' : 'pl-12'}`}>
                  
                    <div className="bg-white dark:bg-navy-800 rounded-xl p-6 shadow-lg">
                      <div className="text-3xl font-display font-bold text-gold-500 mb-2">
                        {milestone.year}
                      </div>
                      <p className="text-navy-700 dark:text-navy-300">
                        {milestone.event}
                      </p>
                    </div>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-gold-500 border-4 border-cream dark:border-navy-900" />
                </motion.div>
              )}
            </div>
          </div>
        </section>

        <section>
          <motion.div
            initial={{
              opacity: 0,
              y: 20
            }}
            whileInView={{
              opacity: 1,
              y: 0
            }}
            viewport={{
              once: true
            }}
            className="bg-gradient-to-r from-gold-500 to-gold-600 rounded-3xl p-12 text-center">
            
            <AwardIcon className="w-16 h-16 text-navy-900 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-display font-bold text-navy-900 mb-4">
              Award-Winning Service
            </h2>
            <p className="text-lg text-navy-800 max-w-2xl mx-auto">
              Recognized as one of the top real estate platforms globally, with
              numerous industry awards for innovation, customer service, and
              market leadership.
            </p>
          </motion.div>
        </section>
      </div>
    </div>);

}