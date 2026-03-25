import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Plane, Book, Flower2, Coffee, BrainCircuit } from 'lucide-react';
import { motion } from 'motion/react';

interface InterestsProps {
  interests: string[];
}

const Interests = ({ interests }: InterestsProps) => {
  const items = [
    { name: interests[0] ?? 'AI', icon: <BrainCircuit className="w-4 h-4 mr-2" /> },
    { name: interests[1] ?? '旅行', icon: <Plane className="w-4 h-4 mr-2" /> },
    { name: interests[2] ?? '读书', icon: <Book className="w-4 h-4 mr-2" /> },
    { name: interests[3] ?? '插花', icon: <Flower2 className="w-4 h-4 mr-2" /> },
    { name: interests[4] ?? '喝茶', icon: <Coffee className="w-4 h-4 mr-2" /> },
  ];

  return (
    <section className="py-8 px-6 max-w-4xl mx-auto mt-[2px] mb-[2px]">
      <motion.h2
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-2xl font-semibold text-center mb-6"
      >
        兴趣爱好
      </motion.h2>
      <div className="flex flex-wrap justify-center gap-4">
        {items.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1, duration: 0.4 }}
          >
            <Badge
              variant="secondary"
              className="px-6 py-3 text-base rounded-full shadow-sm transition-all hover:bg-primary/10 hover:border-primary border-dashed border border-primary/25 bg-primary/10 text-primary"
            >
              {item.icon}
              <span>{item.name}</span>
            </Badge>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Interests;
