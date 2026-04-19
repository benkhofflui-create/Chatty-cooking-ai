import { motion, AnimatePresence } from "motion/react";
import { X, ExternalLink, Timer, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const ADS = [
  {
    title: "Maldon Sea Salt",
    description: "Finishing salt for the elite. Flaky, crunchy, essential.",
    cta: "Elevate your kitchen",
    image: "https://picsum.photos/seed/salt/800/400"
  },
  {
    title: "Vitis Olive Oil",
    description: "Cold-pressed from the heart of Tuscany. Pure liquid gold.",
    cta: "Taste the heritage",
    image: "https://picsum.photos/seed/oliveoil/800/400"
  },
  {
    title: "Global Knives",
    description: "The sharpest vision for your culinary skills.",
    cta: "Modern Craftsmanship",
    image: "https://picsum.photos/seed/knives/800/400"
  }
];

export default function AdOverlay({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [ad] = useState(() => ADS[Math.floor(Math.random() * ADS.length)]);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (isOpen) {
      setCountdown(5);
      const timer = setInterval(() => {
        setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-xl bg-black/60"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-full max-w-lg bg-card border border-border rounded-[32px] overflow-hidden shadow-2xl relative"
          >
            <div className="absolute top-6 left-6 z-10 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
               <Sparkles className="w-3 h-3 text-brand" />
               <span className="text-[10px] font-bold text-white uppercase tracking-widest">Sponsored Preview</span>
            </div>

            <div className="aspect-video w-full overflow-hidden relative">
               <img src={ad.image} alt={ad.title} className="w-full h-full object-cover grayscale-[30%] hover:grayscale-0 transition-all duration-700" referrerPolicy="no-referrer" />
               <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            </div>

            <div className="p-8 space-y-6">
              <div>
                <h4 className="text-3xl font-extrabold tracking-tight serif italic mb-2">{ad.title}</h4>
                <p className="text-muted-foreground leading-relaxed">{ad.description}</p>
              </div>

              <div className="flex items-center justify-between gap-4">
                 <Button className="flex-1 bg-foreground text-background hover:bg-brand hover:text-white rounded-2xl h-14 font-bold text-sm tracking-wide uppercase transition-all">
                    {ad.cta} <ExternalLink className="w-4 h-4 ml-2" />
                 </Button>
                 
                 <button 
                  onClick={() => countdown === 0 && onClose()}
                  disabled={countdown > 0}
                  className={`h-14 px-6 rounded-2xl border border-border font-bold text-xs uppercase tracking-widest transition-all
                    ${countdown > 0 ? 'text-muted-foreground/30' : 'text-foreground hover:bg-muted'}`}
                 >
                    {countdown > 0 ? (
                      <div className="flex items-center gap-2">
                        <Timer className="w-3 h-3 animate-pulse" /> {countdown}s
                      </div>
                    ) : 'Skip'}
                 </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
