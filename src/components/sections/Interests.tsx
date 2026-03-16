import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Plane, Book, Flower2, Coffee, BrainCircuit } from 'lucide-react';
import { motion } from 'motion/react';

const Interests = () => {
  const interests = [
    { name: "AI", icon: <BrainCircuit className="w-4 h-4 mr-2" /> },
    { name: "旅行", icon: <Plane className="w-4 h-4 mr-2" /> },
    { name: "读书", icon: <Book className="w-4 h-4 mr-2" /> },
    { name: "插花", icon: <Flower2 className="w-4 h-4 mr-2" /> },
    { name: "喝茶", icon: <Coffee className="w-4 h-4 mr-2" /> },
  ];

  return (
    <section className="py-12 px-6 max-w-4xl mx-auto">
      <motion.h2
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-2xl font-semibold text-center mb-8"
      >
        兴趣爱好
      </motion.h2>
      <div className="flex flex-wrap justify-center gap-4">
        {interests.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1, duration: 0.4 }}
          >
            <Badge
              variant="secondary"
              className="px-6 py-3 text-base rounded-full shadow-sm transition-all hover:bg-primary/10 hover:border-primary border-dashed border-[rgba(41,153,163,0.2)] bg-[#0d3b3f1a] bg-none border-[1px] border-[rgba(41,153,163,0.2)]"
            >
              {item.icon}
              {item.name}
            </Badge>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Interests;
