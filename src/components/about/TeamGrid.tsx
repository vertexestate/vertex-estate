import React from 'react';
import { motion } from 'framer-motion';
import { LinkedinIcon, TwitterIcon, MailIcon } from 'lucide-react';
import { teamMembers } from '../../data/properties';
export function TeamGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {teamMembers.map((member, index) =>
      <motion.div
        key={member.id}
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
        className="group">
        
          <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-navy-800 shadow-lg hover:shadow-gold-glow transition-all duration-300">
            <div className="relative h-80 overflow-hidden">
              <motion.img
              whileHover={{
                scale: 1.1
              }}
              transition={{
                duration: 0.4
              }}
              src={member.photo}
              alt={member.name}
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300" />
            
              <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <motion.div
              initial={{
                y: 20,
                opacity: 0
              }}
              whileHover={{
                y: 0,
                opacity: 1
              }}
              className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              
                <div className="flex gap-3">
                  {member.linkedin &&
                <a
                  href={member.linkedin}
                  className="p-2 bg-white/20 hover:bg-gold-500 rounded-lg transition-colors">
                  
                      <LinkedinIcon className="w-5 h-5" />
                    </a>
                }
                  {member.twitter &&
                <a
                  href={member.twitter}
                  className="p-2 bg-white/20 hover:bg-gold-500 rounded-lg transition-colors">
                  
                      <TwitterIcon className="w-5 h-5" />
                    </a>
                }
                  <a
                  href={`mailto:${member.email}`}
                  className="p-2 bg-white/20 hover:bg-gold-500 rounded-lg transition-colors">
                  
                    <MailIcon className="w-5 h-5" />
                  </a>
                </div>
              </motion.div>
            </div>

            <div className="p-6">
              <h3 className="text-xl font-display font-bold text-navy-900 dark:text-cream mb-1">
                {member.name}
              </h3>
              <p className="text-gold-500 font-semibold mb-3">{member.role}</p>
              <p className="text-navy-600 dark:text-navy-400 text-sm">
                {member.bio}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>);

}