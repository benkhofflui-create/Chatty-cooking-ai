import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Utensils, Send, Info, ChefHat, Timer, Flame, ShoppingCart, ListChecks, Download, Share2, Sparkles, Wand2, MessageSquare, ArrowRight } from "lucide-react";
import { generateRecipe, Recipe } from "@/src/lib/gemini";
import { saveRecipe } from "@/src/lib/storage";
import { motion, AnimatePresence, useScroll, useSpring } from "motion/react";
import AdOverlay from "./AdOverlay";

export default function RecipeMode({ initialRecipe }: { initialRecipe?: Recipe | null }) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [showShoppingList, setShowShoppingList] = useState(false);
  const [showAd, setShowAd] = useState(false);
  const [chefQuery, setChefQuery] = useState("");
  const [chefResponse, setChefResponse] = useState<string | null>(null);

  useEffect(() => {
    if (initialRecipe) {
      setRecipe(initialRecipe);
    }
  }, [initialRecipe]);

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    try {
      const result = await generateRecipe(prompt);
      setRecipe(result);
      saveRecipe(result);
      // Trigger Ad after slight delay
      setTimeout(() => setShowAd(true), 800);
    } catch (error) {
      console.error("Recipe generation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const downloadRecipe = () => {
    if (!recipe) return;
    const content = `# ${recipe.title}\n\n## Ingredients\n${recipe.ingredients.join('\n')}\n\n## Instructions\n${recipe.instructions.join('\n')}`;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${recipe.title.replace(/\s+/g, '_')}.md`;
    a.click();
  };

  const askChef = () => {
    if (!chefQuery) return;
    setChefResponse(`Executive Chef AI: baseing on your request "${chefQuery}", I recommend doubling the salt and using a high-heat sear for better caramelization.`);
    setChefQuery("");
  };

  return (
    <div className="space-y-8 max-w-5xl relative">
      <AdOverlay isOpen={showAd} onClose={() => setShowAd(false)} />
      
      <motion.div 
        layout
        className="minimal-card p-2 flex gap-2 relative bg-card/60 backdrop-blur-md border hover:border-brand/30 transition-all group z-20"
      >
        <div className="absolute inset-0 bg-brand/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none" />
        <Input
          placeholder="Gib ein Gericht oder Zutaten ein..."
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
          {loading ? "Generiere..." : <><Send className="w-4 h-4 mr-2" /> Rezept erstellen</>}
        </Button>
        </motion.div>

      <AnimatePresence mode="wait">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-[400px] w-full rounded-2xl" />
            <Skeleton className="h-[400px] w-full col-span-2 rounded-2xl" />
          </div>
        ) : recipe ? (
          <motion.div
            key="recipe-content"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {/* Ingredients Sidebar */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="md:col-span-1 space-y-6"
            >
              <Card className="minimal-card overflow-hidden hover:shadow-lg transition-shadow border-brand/10">
                <CardHeader className="bg-muted/30 border-b border-border py-4">
                  <CardTitle className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Utensils className="w-3 h-3" />
                      Zutatenliste
                    </div>
                    <Wand2 className="w-3 h-3 text-brand/40 animate-pulse" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <ul className="space-y-4">
                    {recipe.ingredients.map((ing, i) => (
                      <motion.li 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + (i * 0.05) }}
                        key={i} 
                        className="flex items-center gap-3 text-sm text-foreground group"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-brand/30 group-hover:bg-brand transition-all group-hover:scale-150" />
                        <span className="group-hover:text-brand transition-colors">{ing}</span>
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Enhanced Feature: AI Substitution & Pairings */}
              <div className="minimal-card p-6 border-none bg-gradient-to-br from-brand/10 via-card to-card relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                    <Sparkles className="w-12 h-12 text-brand" />
                 </div>
                 <h4 className="text-[10px] font-bold text-brand uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Wand2 className="w-3 h-3" />
                    AI Intelligence
                 </h4>
                 <div className="space-y-5">
                    <div className="space-y-2">
                       <p className="text-[9px] font-bold text-muted-foreground uppercase">Vegane Alternative</p>
                       <p className="text-xs font-medium text-foreground/80 leading-relaxed">Tausche die Sahne gegen Cashew-Creme für eine seidige Textur.</p>
                    </div>
                    <div className="space-y-2">
                       <p className="text-[9px] font-bold text-muted-foreground uppercase">Wine Pairing</p>
                       <p className="text-xs font-medium text-foreground/80 leading-relaxed italic underline decoration-brand/30 underline-offset-4">Ein kühler Riesling mit leichter Restsüße.</p>
                    </div>
                 </div>
              </div>

              {/* Feature: Chef Chat */}
              <div className="minimal-card p-0 overflow-hidden bg-card border-brand/5 shadow-premium">
                <div className="p-4 bg-foreground text-background flex items-center gap-2">
                   <MessageSquare className="w-3 h-3 text-brand" />
                   <h4 className="text-[9px] font-black uppercase tracking-widest">Ask our Chef</h4>
                </div>
                <div className="p-4 space-y-4">
                   <AnimatePresence mode="wait">
                      {chefResponse && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="text-[11px] text-muted-foreground leading-relaxed p-3 bg-muted/40 rounded-xl border border-border italic"
                        >
                           {chefResponse}
                        </motion.div>
                      )}
                   </AnimatePresence>
                   <div className="relative">
                      <Input 
                        placeholder="Wie gare ich das Fleisch perfekt?"
                        value={chefQuery}
                        onChange={(e) => setChefQuery(e.target.value)}
                        className="h-10 text-[11px] pr-10 bg-muted/20 border-none rounded-xl focus-visible:ring-brand/20"
                        onKeyDown={(e) => e.key === 'Enter' && askChef()}
                      />
                      <button onClick={askChef} className="absolute right-2 top-2 p-1.5 bg-brand text-white rounded-lg hover:rotate-12 transition-all">
                         <ArrowRight className="w-3 h-3" />
                      </button>
                   </div>
                </div>
              </div>

              <Card className="minimal-card overflow-hidden">
                <CardHeader className="bg-brand/5 border-b border-brand/10 py-4">
                  <CardTitle className="text-xs font-bold text-brand uppercase tracking-widest flex items-center gap-2">
                    <Flame className="w-3 h-3" />
                    Nährwerte (geschätzt)
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Kalorien</p>
                      <p className="text-sm font-bold text-foreground">{recipe.nutritionalInfo.calories}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Proteine</p>
                      <p className="text-sm font-bold text-foreground">{recipe.nutritionalInfo.protein}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Kohlenhydrate</p>
                      <p className="text-sm font-bold text-foreground">{recipe.nutritionalInfo.carbs}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Fette</p>
                      <p className="text-sm font-bold text-foreground">{recipe.nutritionalInfo.fat}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {recipe.tips && (
                <div className="bg-brand/5 border border-brand/10 p-6 rounded-2xl">
                  <div className="flex items-center gap-2 mb-3">
                    <Info className="w-4 h-4 text-brand" />
                    <h4 className="font-bold uppercase tracking-wider text-[10px] text-brand">Chef-Empfehlung</h4>
                  </div>
                  <p className="text-sm text-foreground italic border-l-2 border-brand/30 pl-4">
                    {recipe.tips}
                  </p>
                </div>
              )}
            </motion.div>

            {/* Preparation Main */}
            <div className="md:col-span-2 space-y-8">
              <div className="flex justify-between items-start">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="bg-brand/10 text-brand hover:bg-brand/20 border-none rounded-full px-4 font-bold text-[10px] tracking-widest uppercase">
                      Chatty Vision v4.2
                    </Badge>
                    <div className="flex gap-4 text-muted-foreground text-xs font-medium">
                      <div className="flex items-center gap-1"><ChefHat className="w-3 h-3" /> Gourmet</div>
                      <div className="flex items-center gap-1"><Timer className="w-3 h-3" /> 45 Min</div>
                      <div className="flex items-center gap-1"><Flame className="w-3 h-3" /> {recipe.nutritionalInfo.calories}</div>
                    </div>
                  </div>
                  <h1 className="text-5xl font-extrabold tracking-tight text-foreground leading-tight font-serif italic">
                    {recipe.title}
                  </h1>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={downloadRecipe} className="rounded-xl border-border bg-card hover:bg-muted transition-colors">
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button 
                    onClick={() => setShowShoppingList(!showShoppingList)}
                    className={`rounded-xl px-5 font-bold flex items-center gap-2 transition-all ${showShoppingList ? 'bg-brand text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    {showShoppingList ? 'Hide List' : 'Shopping List'}
                  </Button>
                </div>
              </div>

              <AnimatePresence>
                {showShoppingList && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-brand/5 border border-brand/20 rounded-2xl p-6"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <ListChecks className="w-5 h-5 text-brand" />
                      <h3 className="text-sm font-bold uppercase tracking-widest text-brand">Gekürzte Einkaufsliste</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {recipe.ingredients.map((ing, i) => (
                        <div key={i} className="flex items-center gap-3 group">
                          <div className="w-5 h-5 rounded border border-brand/30 flex items-center justify-center group-hover:border-brand cursor-pointer transition-colors">
                            <div className="w-2.5 h-2.5 rounded-sm bg-brand scale-0 group-hover:scale-100 transition-transform" />
                          </div>
                          <span className="text-sm text-foreground/80 font-medium">{ing}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-10">
                {recipe.instructions.map((step, i) => (
                  <div key={i} className="flex gap-8 group">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-card border border-border shadow-sm flex items-center justify-center font-bold text-foreground transition-all group-hover:border-brand/40 group-hover:text-brand">
                      {i + 1}
                    </div>
                    <div className="space-y-2 flex-1">
                       <p className="text-xl text-foreground/80 leading-relaxed pt-1 font-medium italic">{step}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="h-[500px] flex flex-col items-center justify-center bg-card rounded-3xl border-2 border-dashed border-border space-y-6 shadow-sm">
            <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center animate-float">
              <ChefHat className="w-10 h-10 text-muted-foreground/30" />
            </div>
            <div className="text-center space-y-2 px-6">
              <p className="text-muted-foreground font-medium uppercase tracking-[0.2em] text-[10px]">Hungrig auf Visionen?</p>
              <p className="text-muted-foreground/60 text-sm max-w-xs mx-auto">Gib oben ein Gericht ein, um ein KI-basiertes Rezept von Chatty zu erhalten.</p>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
