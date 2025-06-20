import { motion } from 'framer-motion';
import { Star, Quote, User } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Mr. Ravindra',
    role: 'Agricultural Professional',
    company: 'Farm Operations',
    content: 'The quad drone from Anantam Aerials and Robotics has been exceptional for my agricultural needs. The build quality and performance exceeded my expectations. Highly recommended for precision farming.',
    rating: 5
  },
  {
    id: 2,
    name: 'Mr. Manas',
    role: 'Drone Enthusiast',
    company: 'Tech Solutions',
    content: 'I purchased various drone components from Anantam Aerials and Robotics and the quality is outstanding. Their technical support helped me build exactly what I needed. Great service and products.',
    rating: 5
  },
  {
    id: 3,
    name: 'Mr. Rushikesh',
    role: 'Farm Owner',
    company: 'Agriculture Services',
    content: 'The drone spraying services provided by Anantam Aerials and Robotics have transformed my crop management. Efficient, precise, and cost-effective. My crop yield has improved significantly.',
    rating: 5
  },
  {
    id: 4,
    name: 'Amit Sharma',
    role: 'Construction Manager',
    company: 'Infrastructure Ltd',
    content: 'Their surveillance drones have made site monitoring so much easier. The real-time footage and mapping capabilities are incredible. Professional service from start to finish.',
    rating: 4
  },
  {
    id: 5,
    name: 'Pradeep Joshi',
    role: 'Event Photographer',
    company: 'Creative Studio',
    content: 'Rented aerial photography equipment from Anantam Aerials and Robotics for multiple events. The drone footage quality is cinema-grade and their team is very supportive.',
    rating: 5
  },
  {
    id: 6,
    name: 'Suresh Patil',
    role: 'Agricultural Consultant',
    company: 'AgriTech Consulting',
    content: 'The precision agriculture solutions and crop monitoring services have been game-changing for my clients. Accurate data and actionable insights every time.',
    rating: 5
  },
  {
    id: 7,
    name: 'Vikash Kumar',
    role: 'Security Manager',
    company: 'Industrial Safety Corp',
    content: 'We use their surveillance drones for perimeter security. The night vision capabilities and long flight time make them perfect for our security operations.',
    rating: 4
  },
  {
    id: 8,
    name: 'Rahul Deshmukh',
    role: 'Film Producer',
    company: 'Vision Films',
    content: 'Anantam Aerials and Robotics provided excellent aerial cinematography services for our project. The shots were breathtaking and delivered exactly as promised. Will definitely work with them again.',
    rating: 5
  }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const TestimonialSection = () => {
  return (
    <section id="testimonials" className="section-padding bg-dark-800">
      <div className="container-custom">
        <div className="section-title">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            What Our <span className="text-primary-500">Clients Say</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-400 max-w-2xl mx-auto"
          >
            Discover how Anantam Aerials and Robotics has transformed businesses across industries with our cutting-edge drone technology and exceptional service.
          </motion.p>
        </div>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-12"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              variants={item}
              className="card p-6 group"
            >
              <div className="flex flex-col h-full">
                {/* Quote Icon */}
                <div className="mb-4 text-primary-500 bg-primary-900/20 w-16 h-16 rounded-lg flex items-center justify-center group-hover:text-white group-hover:bg-primary-600 transition-all duration-300">
                  <Quote size={24} />
                </div>

                {/* Content */}
                <div className="mb-4 flex-grow">
                  <p className="text-gray-400 leading-relaxed text-sm italic">
                    "{testimonial.content}"
                  </p>
                </div>

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      size={16} 
                      className={`${
                        i < testimonial.rating 
                          ? 'text-yellow-400 fill-yellow-400' 
                          : 'text-gray-600'
                      } transition-colors duration-200`}
                    />
                  ))}
                </div>

                {/* Client Info */}
                <div className="flex items-center gap-3 border-t border-gray-700/50 pt-4">
                  <div className="w-12 h-12 bg-primary-900/20 rounded-lg flex items-center justify-center border border-gray-600/30">
                    <User size={20} className="text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-white text-sm truncate">
                      {testimonial.name}
                    </h4>
                    <p className="text-xs text-gray-400 truncate">
                      {testimonial.role}
                    </p>
                    <p className="text-xs text-primary-400 truncate">
                      {testimonial.company}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-12"
        >
          <div className="inline-flex items-center gap-2 text-sm text-gray-400">
            <div className="flex -space-x-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-8 h-8 bg-primary-600 rounded-full border-2 border-gray-800 flex items-center justify-center">
                  <Star size={12} className="text-white fill-white" />
                </div>
              ))}
            </div>
            <span>Join 500+ satisfied customers</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialSection;