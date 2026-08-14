import { useRef, useState } from "react";
import { motion } from "motion/react";

interface VideoCardProps {
  src: string;
  index: number;
  registerVideo: (el: HTMLVideoElement | null, index: number) => void;
  onPlay: (index: number) => void;
}

function VideoCard({ src, index, registerVideo, onPlay }: VideoCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayClick = () => {
    const video = videoRef.current;
    if (!video) return;
    onPlay(index);
    video.play();
    setIsPlaying(true);
  };

  return (
    <div className="relative flex-shrink-0 snap-start w-[82%] sm:w-[62%] md:w-[46%] lg:w-[31%]">
      <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 bg-surface-container-low">
        <video
          ref={(el) => {
            videoRef.current = el;
            registerVideo(el, index);
          }}
          src={src}
          preload="metadata"
          playsInline
          controls={isPlaying}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
          className="w-full h-full object-cover"
        />
        {!isPlaying && (
          <motion.button
            type="button"
            onClick={handlePlayClick}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Reproducir video"
            className="absolute inset-0 flex items-center justify-center bg-black/25 cursor-pointer group"
          >
            <span className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary text-background flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.25)] group-hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] transition-shadow">
              <span className="material-symbols-outlined text-4xl sm:text-5xl">play_arrow</span>
            </span>
          </motion.button>
        )}
      </div>
    </div>
  );
}

interface VideoTestimonialCarouselProps {
  videos: string[];
}

export function VideoTestimonialCarousel({ videos }: VideoTestimonialCarouselProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const registerVideo = (el: HTMLVideoElement | null, index: number) => {
    videoRefs.current[index] = el;
  };

  const handlePlay = (index: number) => {
    videoRefs.current.forEach((video, i) => {
      if (video && i !== index && !video.paused) {
        video.pause();
      }
    });
  };

  const scrollByCard = (direction: 1 | -1) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const card = scroller.querySelector<HTMLElement>(":scope > div");
    const amount = card ? card.getBoundingClientRect().width + 24 : scroller.clientWidth * 0.8;
    scroller.scrollBy({ left: direction * amount, behavior: "smooth" });
  };

  return (
    <div>
      <div
        ref={scrollerRef}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 -mx-margin-mobile px-margin-mobile md:mx-0 md:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {videos.map((src, i) => (
          <VideoCard key={src} src={src} index={i} registerVideo={registerVideo} onPlay={handlePlay} />
        ))}
      </div>

      <div className="flex gap-4 justify-center mt-8">
        <motion.button
          type="button"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => scrollByCard(-1)}
          className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center cursor-pointer text-primary transition-colors hover:border-white/20 select-none"
          aria-label="Video anterior"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </motion.button>
        <motion.button
          type="button"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => scrollByCard(1)}
          className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center cursor-pointer text-primary transition-colors hover:border-white/20 select-none"
          aria-label="Siguiente video"
        >
          <span className="material-symbols-outlined">arrow_forward</span>
        </motion.button>
      </div>
    </div>
  );
}
