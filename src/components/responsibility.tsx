import { GraduationCap, Users2, Building, Users } from 'lucide-react';
import { MotionDiv } from './motion';

const responsibilities = [
  {
    title: "Scholarship",
    description: "Supporting educational opportunities through financial assistance and mentorship programs",
    icon: <GraduationCap className="w-8 h-8" />,
    color: "bg-blue-100 dark:bg-blue-900/20",
    iconColor: "text-blue-500"
  },
  {
    title: "Help Current Students",
    description: "Providing guidance, resources, and support to enhance current students' experience",
    icon: <Users2 className="w-8 h-8" />,
    color: "bg-yellow-100 dark:bg-yellow-900/20",
    iconColor: "text-yellow-500"
  },
  {
    title: "Help Our University",
    description: "Contributing to university development and maintaining strong institutional connections",
    icon: <Building className="w-8 h-8" />,
    color: "bg-purple-100 dark:bg-purple-900/20",
    iconColor: "text-purple-500"
  },
  {
    title: "Build Our Community",
    description: "Fostering a strong alumni network through events, programs, and collaborative initiatives",
    icon: <Users className="w-8 h-8" />,
    color: "bg-green-100 dark:bg-green-900/20",
    iconColor: "text-green-500"
  }
];

export function Responsibility() {
  return (
    <section className="py-16 bg-background">
      <div className="container px-4 md:px-6">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Our Responsibility
          </h2>
        </MotionDiv>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {responsibilities.map((item, index) => (
            <MotionDiv
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center"
            >
              <div className={`w-24 h-24 rounded-full ${item.color} flex items-center justify-center mb-6`}>
                <div className={`${item.iconColor}`}>
                  {item.icon}
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-muted-foreground">{item.description}</p>
            </MotionDiv>
          ))}
        </div>
      </div>
    </section>
  );
}