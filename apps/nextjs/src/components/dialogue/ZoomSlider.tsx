"use client";

import * as React from "react";
import { EmblaCarouselType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import throttle from "lodash.throttle";
import { useStore } from "reactflow";

import { cn } from "@aura/ui";

import { FORCE_GRAPH } from "~/constant/force-graph";

const SLIDES_STEP = 0.1;

export const ZoomSlider = () => {
  const zoom = useStore((state) => state.transform[2]);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    axis: "y",
    dragFree: true,

    // Clear leading and trailing empty space that causes excessive scrolling
    containScroll: false,
  });

  const slides = Array.from(
    {
      length: (FORCE_GRAPH.maxZoom - FORCE_GRAPH.minZoom) / SLIDES_STEP + 1,
    },
    (_, i) => {
      if (i === 0) {
        return FORCE_GRAPH.minZoom;
      } else {
        return FORCE_GRAPH.minZoom + i * SLIDES_STEP;
      }
    },
  );

  const throttledUpdateEmblaScroll = React.useCallback(
    throttle((emblaApi: EmblaCarouselType | undefined, index: number) => {
      if (emblaApi) {
        if (index !== -1) {
          emblaApi.scrollTo(index);
        }
      }
    }, 50),
    [],
  );

  React.useEffect(() => {
    if (!emblaApi) {
      return;
    }

    const targetSlideIndex = slides.findIndex(
      (e) => e === Math.floor(zoom * 10) / 10,
    );

    throttledUpdateEmblaScroll(emblaApi, targetSlideIndex);
  }, [emblaApi, zoom, slides]);

  return (
    <div className="flex h-full">
      <div
        className="embla pointer-events-none flex h-full min-w-full overflow-hidden"
        ref={emblaRef}
      >
        <div className="flex h-full w-full flex-col">
          {slides.map((slide, i) => (
            <div
              className="slide flex flex-row items-center gap-x-1 pl-4"
              style={{ flex: "0 0 10%" }}
              key={slide}
            >
              <div
                className={cn(
                  "h-0.5 border-b border-border",
                  (slide * 10) % 5 === 0 ? "w-1/4" : "w-1/6",
                  slides.findIndex((e) => e === Math.floor(zoom * 10) / 10) ===
                    i
                    ? "border-primary"
                    : "",
                )}
              />
              <p className="font-sans text-xs text-secondary">
                {(slide * 10) % 5 === 0 ? slide : ""}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
