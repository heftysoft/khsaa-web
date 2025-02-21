import { CalendarCheck, GraduationCap, Users } from 'lucide-react';
import CountUp from 'react-countup';
import { MotionDiv } from '@/components/motion';

export default function Statistics() {
  const stats = [
    { icon: <GraduationCap />, value: 10000, suffix: '+', label: 'Alumni Members' },
    { icon: <Users />, value: 50, suffix: '+', label: 'Countries' },
    { icon: <CalendarCheck />, value: 200, suffix: '+', label: 'Annual Events' },
  ];

  return (
    <section className="py-16 bg-primary/10 container-wrapper">
      <div className="container">
        <div className="grid md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <MotionDiv
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="flex flex-col items-center text-center p-8 bg-background rounded-xl shadow-sm"
            >
              <div className="mb-4 text-primary">{stat.icon}</div>
              <h3 className="text-4xl font-bold mb-2">
                <CountUp
                  end={stat.value}
                  duration={2.5}
                  separator=","
                  suffix={stat.suffix}
                  enableScrollSpy
                  scrollSpyOnce
                />
              </h3>
              <p className="text-muted-foreground">{stat.label}</p>
            </MotionDiv>
          ))}
        </div>
      </div>
    </section>
  );
}