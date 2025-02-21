'use client';
import Image from "next/image";
import { Button } from "@/components/ui/button";
import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useState } from 'react';
import { MotionDiv } from "@/components/motion";
import Statistics from "@/components/statistics";
import Link from "next/link";
import { Mission } from "@/components/mission";
import { Responsibility } from "@/components/responsibility";

const slides = [
  {
    image: "/hero-image.jpg",
    title: "Welcome to KHSAA Alumni Association",
    description: "Connect with fellow alumni, stay updated with events, and be part of our growing community."
  },
  {
    image: "/hero-image-2.jpg", // Add more images to your public folder
    title: "Build Lasting Connections",
    description: "Network with alumni and create meaningful professional relationships."
  },
  {
    image: "/hero-image-3.jpg", // Add more images to your public folder
    title: "Join Our Community",
    description: "Be part of an active and engaging alumni network."
  }
];

export default function Home() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    // Auto-play
    const intervalId = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);

    return () => {
      emblaApi.off('select', onSelect);
      clearInterval(intervalId);
    };
  }, [emblaApi, onSelect]);
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[90vh]">
        <div className="overflow-hidden h-full" ref={emblaRef}>
          <div className="flex h-full">
            {slides.map((slide, index) => (
              <div key={index} className="flex-[0_0_100%] min-w-0 relative h-full">
                <Image
                  src={slide.image}
                  alt="Hero image"
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-black/40" />
                <MotionDiv
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: selectedIndex === index ? 1 : 0, y: selectedIndex === index ? 0 : 20 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="container px-4 md:px-6 text-center text-white">
                    <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none mb-4">
                      {slide.title}
                    </h1>
                    <p className="max-w-[600px] mx-auto text-xl mb-8">
                      {slide.description}
                    </p>
                    <div className="flex justify-center gap-4">
                      <Button asChild>
                        <Link href="/register">Join Now</Link>
                      </Button>
                      <Button variant="outline" asChild className="bg-transparent dark:bg-background">
                        <Link href="/about">Learn More</Link>
                      </Button>
                    </div>
                  </div>
                </MotionDiv>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                selectedIndex === index ? 'bg-white w-4' : 'bg-white/50'
              }`}
              onClick={() => scrollTo(index)}
            />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-background container-wrapper">
        <div className="container px-4 md:px-6">
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Our Features</h2>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Everything you need to stay connected with your alma mater
            </p>
          </MotionDiv>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <MotionDiv
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
                <div className="p-3 mb-4 rounded-full bg-primary/10">
                  {feature.icon}
                </div>
                <h3 className="mb-2 text-xl font-bold">{feature.title}</h3>
                <p className="text-gray-500 dark:text-gray-400">{feature.description}</p>
              </MotionDiv>
            ))}
          </div>
        </div>
      </section>
      {/* Statistics Section */}
      <Statistics />
      
      {/* Responsibility Section */}
      <Responsibility />
      
      {/* Mission Section */}
      <Mission />
    </>
  );
}

const features = [
  {
    title: "Student Directory",
    description: "Access our comprehensive alumni directory to connect with former classmates.",
    icon: (
      <svg
        className="w-6 h-6 text-primary"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
  },
  {
    title: "Events & Activities",
    description: "Stay updated with upcoming events, reunions, and networking opportunities.",
    icon: (
      <svg
        className="w-6 h-6 text-primary"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    title: "Membership Benefits",
    description: "Enjoy exclusive benefits and services available only to our members.",
    icon: (
      <svg
        className="w-6 h-6 text-primary"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
];
