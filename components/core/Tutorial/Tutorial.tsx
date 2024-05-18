"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const tutorialSteps = [
  {
    imageSrc: "/step1.png",
    description: "Select an essay topic type first",
  },
  {
    imageSrc: "/step2.png",
    description: 'Click to "Create Topic" button',
  },
  {
    imageSrc: "/step3.png",
    description:
      'Click "Start Session" button and write your essay in the given time',
  },
  {
    imageSrc: "/step4.png",
    description: 'After finishing your essay click to "Finish Session"',
  },
  {
    imageSrc: "/step5.png",
    description: 'Finally get your feedback by clicking "Give Feedback"',
  },
];

export const Tutorial = () => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="rounded-sm h-8" variant="secondary">
          Quick Tutorial
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>How to use Essay Wasp?</AlertDialogTitle>
          <AlertDialogDescription className="flex w-full h-full justify-center items-center">
            <Carousel className="w-3/4 h-64 py-8">
              <CarouselContent>
                {tutorialSteps.map((step, index) => (
                  <CarouselItem
                    key={index}
                    className="flex flex-col gap-6 items-center justify-center text-black font-semibold text-center"
                  >
                    <Image
                      className="rounded-xl"
                      alt="step"
                      height={200}
                      width={250}
                      src={step.imageSrc}
                    />
                    {step.description}
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button className="bg-zinc-950 hover:bg-zinc-950/80 hover:text-white">
              Got it
            </Button>
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
