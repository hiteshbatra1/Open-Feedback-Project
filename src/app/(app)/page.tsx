"use client";
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import messages from "@/messages.json";
import { Mail } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button"; // Added Button for the Call to Action

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center px-4 md:px-24 py-12 text-gray-900">
        <section className="text-center mb-12 md:mb-16 space-y-6 px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 max-w-4xl mx-auto leading-tight">
            Dive into the World of <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
              Anonymous Feedback
            </span>
          </h1>
          <p className="mt-4 text-base md:text-xl text-gray-600 max-w-2xl mx-auto">
            Open Feedback — Where your identity remains a secret. Collect
            honest, unfiltered thoughts from your audience effortlessly.
          </p>

          <div className="pt-4">
            <Link href="/sign-up">
              <Button
                size="lg"
                className="rounded-full px-8 py-6 text-lg shadow-lg shadow-primary/25 transition-transform hover:scale-105"
              >
                Start for free today
              </Button>
            </Link>
          </div>
        </section>

        <div className="w-full max-w-lg md:max-w-2xl relative px-8 md:px-0">
          <Carousel
            plugins={[Autoplay({ delay: 3000 })]}
            className="w-full"
            opts={{
              loop: true,
            }}
          >
            <CarouselContent>
              {messages.map((message, index) => (
                <CarouselItem key={index} className="p-2 md:p-4">
                  <Card className="rounded-2xl shadow-xl shadow-black/5 border-gray-100 bg-white h-full transition-all duration-300 hover:shadow-2xl hover:shadow-black/10">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg md:text-xl font-bold text-gray-800">
                        {message.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-5">
                      <div className="bg-primary/10 p-3 rounded-full shrink-0">
                        <Mail className="w-6 h-6 text-primary" />
                      </div>

                      <div className="space-y-2 w-full">
                        <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                          "{message.content}"
                        </p>
                        <div className="flex justify-between items-center pt-2">
                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                            {message.received}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>

            <div className="hidden sm:block">
              <CarouselPrevious className="bg-white border-gray-200 shadow-sm hover:bg-gray-50 hover:text-primary" />
              <CarouselNext className="bg-white border-gray-200 shadow-sm hover:bg-gray-50 hover:text-primary" />
            </div>
          </Carousel>
        </div>
      </main>
    </div>
  );
};

export default Home;
