import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Briefcase, Send, LayoutGrid, Image as ImageIcon, Sparkles, Rocket, TrendingUp, DollarSign, PieChart, Lamp, Users, MapPin, Camera } from "lucide-react";
import { generateBusinessPlan, BusinessPlan, generateImage } from "@/src/lib/gemini";
import { saveBusinessPlan } from "@/src/lib/storage";
import { motion, AnimatePresence, LayoutGroup } from "motion/react";
import AdOverlay from "./AdOverlay";

export default function BusinessMode({ initialPlan }: { initialPlan?: BusinessPlan | null }) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<BusinessPlan | null>(null);
  const [generatingImage, setGeneratingImage] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [itemImages, setItemImages] = useState<Record<string, string>>({});
  const [generatingItem, setGeneratingItem] = useState<string | null>(null);
  const [showAd, setShowAd] = useState(false);

  useEffect(() => {
    if (initialPlan) {
      setPlan(initialPlan);
    }
  }, [initialPlan]);

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    try {
      const result = await generateBusinessPlan(prompt);
      setPlan(result);
      saveBusinessPlan(result);
      setTimeout(() => setShowAd(true), 1200);
    } catch (error) {
      console.error("Business plan generation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageGen = async (imagePrompt: string) => {
    setGeneratingImage(imagePrompt);
    try {
      const url = await generateImage(`${imagePrompt} for ${plan?.businessName}`);
      setGeneratedImages(prev => [url, ...prev]);
    } catch (error) {
      console.error("Image generation failed:", error);
    } finally {
      setGeneratingImage(null);
    }
  };

  const handleItemImageGen = async (itemName: string, description: string) => {
    setGeneratingItem(itemName);
    try {
      const url = await generateImage(`Professional food photography of ${itemName}: ${description}. White plate, high-end restaurant lighting, minimalist background.`);
      setItemImages(prev => ({ ...prev, [itemName]: url }));
    } catch (error) {
      console.error(`Image generation for ${itemName} failed:`, error);
    } finally {
      setGeneratingItem(null);
    }
  };

  return (
    <div className="space-y-8 pb-20 relative">
      <AdOverlay isOpen={showAd} onClose={() => setShowAd(false)} />
      
      <LayoutGroup>
        <motion.div layout className="minimal-card p-2 flex gap-2 bg-card/60 backdrop-blur-md border border-border/40 relative z-20">
        <Input
          placeholder="Beschreibe deine Business-Idee..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="border-none bg-card shadow-none h-12 text-base focus-visible:ring-0 relative z-20"
          onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
        />
        <Button 
          onClick={handleGenerate} 
          disabled={loading}
          className="bg-brand hover:opacity-90 text-white rounded-xl h-12 px-6 font-semibold transition-all relative z-20"
        >
          {loading ? "Planen..." : <><Rocket className="w-4 h-4 mr-2" /> Imperium planen</>}
        </Button>
      </motion.div>

      <AnimatePresence mode="wait">
        {loading ? (
          <div className="space-y-8">
            <Skeleton className="h-[200px] w-full rounded-2xl" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Skeleton className="h-[400px] w-full rounded-2xl" />
              <Skeleton className="h-[400px] w-full rounded-2xl" />
            </div>
          </div>
        ) : plan ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row gap-8"
          >
            {/* Strategy Column */}
            <aside className="w-full lg:w-1/3 space-y-6">
              <Card className="minimal-card p-6 space-y-6 relative overflow-hidden text-card-foreground">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                  <Briefcase className="w-24 h-24 rotate-12" />
                </div>
                
                <div className="relative z-10">
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">Identity</label>
                  <Badge className="mb-2 bg-brand/10 text-brand border-none px-2 py-0 rounded-full text-[8px] font-black tracking-tighter uppercase">Chatty Strategic Vision v1.0</Badge>
                  <h3 className="text-2xl font-extrabold text-foreground leading-tight">{plan.businessName}</h3>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{plan.concept}</p>
                </div>

                <Separator className="bg-border/50" />

                <div className="relative z-10">
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">Stategie</label>
                  <p className="text-sm text-foreground/80 leading-relaxed italic">{plan.marketingStrategy}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant="outline"
                    className="bg-card border-border text-[10px] font-bold uppercase tracking-wider h-10 hover:bg-muted transition-all"
                    onClick={() => handleImageGen("Logo Design Typography Minimalist Professional")}
                    disabled={generatingImage !== null}
                  >
                    Logo
                  </Button>
                  <Button 
                    variant="outline"
                    className="bg-card border-border text-[10px] font-bold uppercase tracking-wider h-10 hover:bg-muted transition-all"
                    onClick={() => handleImageGen("Product Packaging Box Design Luxury Minimalist")}
                    disabled={generatingImage !== null}
                  >
                    Packaging
                  </Button>
                  <Button 
                    variant="outline"
                    className="bg-card border-border text-[10px] font-bold uppercase tracking-wider h-10 hover:bg-muted transition-all"
                    onClick={() => handleImageGen("Restaurant Menu Graphic Design Visual")}
                    disabled={generatingImage !== null}
                  >
                    Graphics
                  </Button>
                  <Button 
                    variant="outline"
                    className="bg-card border-border text-[10px] font-bold uppercase tracking-wider h-10 hover:bg-muted transition-all"
                    onClick={() => handleImageGen("Food Photography Advertising Campaign High End")}
                    disabled={generatingImage !== null}
                  >
                    Campaign
                  </Button>
                </div>

                <Button 
                  className="w-full bg-foreground text-background hover:opacity-90 rounded-xl py-6 font-bold flex items-center justify-center gap-2 transition-all shadow-lg"
                  onClick={() => handleImageGen("Complete Brand Visual Asset Identity")}
                  disabled={generatingImage !== null}
                >
                  <Sparkles className="w-5 h-5 text-brand" />
                  Marken-Paket finalisieren
                </Button>
              </Card>

              <Card className="minimal-card p-6 bg-muted/20 border-brand/10">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-4 h-4 text-brand" />
                  <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Markt-Optimierung</h3>
                </div>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">Preisgestaltung</p>
                    <p className="text-xs text-foreground border-l-2 border-brand/30 pl-3 leading-relaxed">{plan.optimizations.pricingStrategy}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">Kombinationen</p>
                    <p className="text-xs text-foreground border-l-2 border-brand/30 pl-3 leading-relaxed">{plan.optimizations.dishCombinations}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">Saisonalität</p>
                    <p className="text-xs text-foreground border-l-2 border-brand/30 pl-3 leading-relaxed">{plan.optimizations.seasonalOffers}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">Trends</p>
                    <p className="text-xs text-foreground border-l-2 border-brand/30 pl-3 leading-relaxed">{plan.optimizations.trends}</p>
                  </div>
                </div>
              </Card>

              <Card className="minimal-card p-6 bg-brand text-white border-none shadow-xl shadow-brand/20 group">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-white" />
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em]">Finanz-Projektion</h3>
                  </div>
                  <PieChart className="w-4 h-4 opacity-40 group-hover:rotate-90 transition-transform duration-700" />
                </div>
                {/* ... (Finance content remains similar but better animated) */}
                <div className="space-y-6">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] uppercase font-bold opacity-60 mb-1">Ø Gerichtspreis</p>
                      <motion.p 
                        initial={{ opacity: 0, x: -10 }} 
                        animate={{ opacity: 1, x: 0 }}
                        className="text-2xl font-black"
                      >~14,50€</motion.p>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-white/20 text-white border-none text-[8px] uppercase font-bold px-2">+12% Trend</Badge>
                    </div>
                  </div>
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '75%' }}
                      transition={{ duration: 1.5, ease: "anticipate" }}
                      className="h-full bg-white"
                    />
                  </div>
                </div>
              </Card>

              {/* Enhanced Feature: AI Vibe Explorer */}
              <div className="minimal-card p-6 bg-muted/20 border-border/50 relative group cursor-pointer overflow-hidden">
                 <div className="absolute inset-0 bg-brand/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                 <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                       <Lamp className="w-4 h-4 text-brand" />
                       <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Interior Vibe AI</h4>
                    </div>
                    <p className="text-xs text-foreground/70 leading-relaxed mb-4">Generiere visuelle Moodboards für die Inneneinrichtung deines Konzepts.</p>
                    <Button 
                      variant="outline" 
                      className="w-full text-[9px] font-bold uppercase py-1 h-8 group-hover:bg-brand group-hover:text-white transition-all"
                      onClick={() => handleImageGen("Minimalist Restaurant Interior Scandinavian Design High End Lighting")}
                    >
                      Explore Aesthetics
                    </Button>
                 </div>
              </div>

              {/* Feature: Staffing Recommendation */}
              <div className="minimal-card p-5 bg-card border-brand/5">
                 <div className="flex items-center gap-2 mb-4">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Personal-Bedarf</h4>
                 </div>
                 <div className="flex flex-wrap gap-2">
                    {['2 Chef', '4 Service', '1 Host', '2 Commis'].map(tag => (
                      <Badge variant="outline" key={tag} className="text-[9px] border-border text-muted-foreground font-medium px-2 py-0.5">{tag}</Badge>
                    ))}
                 </div>
              </div>

              <div className="minimal-card p-6 bg-muted/10">
                <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">Generation Pipeline</h3>
                <div className="space-y-4">
                   <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-brand/10 rounded-lg flex items-center justify-center shrink-0">
                      <LayoutGrid className="w-5 h-5 text-brand" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-tight">Menüstruktur</p>
                      <p className="text-[10px] text-green-500 font-bold uppercase tracking-wider">Synchronisiert</p>
                    </div>
                  </div>
                  {generatingImage && (
                    <div className="flex items-center gap-4 animate-pulse">
                      <div className="w-10 h-10 bg-muted rounded-lg shrink-0"></div>
                      <div>
                        <p className="text-xs font-bold uppercase text-muted-foreground truncate w-32">{generatingImage}</p>
                        <div className="w-24 h-1 bg-muted rounded-full mt-1 overflow-hidden">
                          <div className="h-full bg-brand w-2/3"></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </aside>

            {/* Preview Column */}
            <section className="flex-1 space-y-8 bg-muted/10 rounded-3xl border-2 border-dashed border-border p-8 min-h-[600px]">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em]">Canvas / <span className="text-foreground italic font-serif">Visual Preview</span></h2>
                <div className="flex gap-2">
                   <Badge variant="outline" className="bg-card border-border text-muted-foreground font-mono text-[10px] rounded-lg">A4</Badge>
                   <Badge variant="outline" className="bg-card border-border text-muted-foreground font-mono text-[10px] rounded-lg">High Res</Badge>
                </div>
              </div>

              <div className="flex flex-col xl:flex-row gap-8 h-full">
                {/* Menu Preview */}
                <div className="w-full xl:w-1/2 bg-white text-slate-900 shadow-2xl rounded-sm p-12 flex flex-col font-serif relative">
                   <div className="text-center border-b border-slate-100 pb-8 mb-10">
                      <h1 className="text-3xl tracking-[0.2em] uppercase font-light text-slate-900 leading-none">{plan.businessName}</h1>
                      <p className="text-[11px] tracking-widest text-slate-400 uppercase mt-4">Haute Cuisine AI Framework</p>
                   </div>
                   
                   <div className="space-y-8 flex-1">
                      {plan.menu.map((item, i) => (
                        <div key={i} className="group">
                          <div className="flex justify-between items-baseline mb-2">
                            <span className="text-sm font-bold text-slate-900 uppercase tracking-tighter">{item.itemName}</span>
                            <div className="flex-1 border-b border-dotted border-slate-100 mx-4"></div>
                            <span className="text-xs font-medium text-slate-400 font-sans tracking-wide">{item.price}</span>
                          </div>
                          <div className="flex gap-4">
                            <p className="text-[11px] text-slate-500 leading-relaxed italic flex-1">{item.description}</p>
                            {itemImages[item.itemName] ? (
                              <div className="w-14 h-14 rounded-lg overflow-hidden border border-slate-100 shrink-0 shadow-sm">
                                <img src={itemImages[item.itemName]} alt={item.itemName} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                              </div>
                            ) : (
                              <button 
                                onClick={() => handleItemImageGen(item.itemName, item.description)}
                                disabled={generatingItem !== null}
                                className="w-14 h-14 rounded-lg border border-dashed border-slate-200 flex flex-col items-center justify-center hover:bg-slate-50 transition-colors shrink-0 group/imgbtn"
                                title="Generate dish image"
                              >
                                {generatingItem === item.itemName ? (
                                  <div className="w-3 h-3 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  <>
                                    <ImageIcon className="w-4 h-4 text-slate-200 group-hover/imgbtn:text-brand" />
                                    <span className="text-[7px] text-slate-300 mt-1 uppercase font-bold tracking-tighter">Asset</span>
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                   </div>

                   <div className="mt-12 pt-8 border-t border-slate-100 text-center">
                      <p className="text-[10px] text-slate-300 tracking-[0.3em] uppercase">Berlin • Studio AI Vision</p>
                   </div>
                </div>

                {/* Imagery Preview */}
                <div className="w-full xl:w-1/2 flex flex-col gap-6">
                  {generatedImages.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6">
                       {generatedImages.slice(0, 2).map((url, i) => (
                         <motion.div 
                          key={url + i} 
                          initial={{ opacity: 0, scale: 0.95 }} 
                          animate={{ opacity: 1, scale: 1 }}
                          className="aspect-square relative rounded-2xl overflow-hidden border-4 border-card shadow-xl group"
                         >
                            <img src={url} alt="AI Asset" referrerPolicy="no-referrer" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-[2px]">
                               <Button className="bg-white text-slate-900 border-none hover:bg-slate-50 text-xs font-bold px-6 py-2 rounded-lg shadow-lg">VIEW ASSET</Button>
                            </div>
                         </motion.div>
                       ))}
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center bg-card/50 rounded-2xl border-2 border-dashed border-border">
                       <ImageIcon className="w-12 h-12 text-muted-foreground/20 mb-4" />
                       <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest text-center px-8">Generiere Assets für die Vorschau auf der Leinwand</p>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </motion.div>
        ) : (
          <div className="h-[500px] flex flex-col items-center justify-center bg-card rounded-3xl border-2 border-dashed border-border space-y-6 shadow-sm">
            <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center animate-float">
              <Briefcase className="w-10 h-10 text-muted-foreground/30" />
            </div>
            <div className="text-center space-y-2 px-6">
              <p className="text-muted-foreground font-medium uppercase tracking-[0.2em] text-[10px]">Chatty Business Vision</p>
              <p className="text-muted-foreground/60 text-sm max-w-xs mx-auto">Beschreibe deine Vision, um ein vollständiges Business-Framework von Chatty zu erhalten.</p>
            </div>
          </div>
        )}
      </AnimatePresence>
      </LayoutGroup>
    </div>
  );
}
