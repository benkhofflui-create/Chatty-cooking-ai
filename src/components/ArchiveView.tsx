import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Recipe, BusinessPlan } from "@/src/lib/gemini";
import { getSavedRecipes, getSavedBusinessPlans } from "@/src/lib/storage";
import { Utensils, Briefcase, Trash2, Calendar, ChevronRight, LayoutGrid } from "lucide-react";
import { motion, AnimatePresence, LayoutGroup } from "motion/react";
import { Badge } from "@/components/ui/badge";

export default function ArchiveView({ onSelectRecipe, onSelectPlan }: { 
  onSelectRecipe: (r: Recipe) => void, 
  onSelectPlan: (p: BusinessPlan) => void 
}) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [plans, setPlans] = useState<BusinessPlan[]>([]);

  useEffect(() => {
    setRecipes(getSavedRecipes());
    setPlans(getSavedBusinessPlans());
  }, []);

  const formatDate = (ts: number) => {
    return new Date(ts).toLocaleDateString('de-DE', { 
      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' 
    });
  };

  return (
    <div className="space-y-12">
      <LayoutGroup>
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-brand/10 rounded-2xl">
               <Utensils className="w-5 h-5 text-brand" />
            </div>
            <h3 className="text-xl font-bold italic serif tracking-tight">Chatty Rezepte</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {recipes.map((r, i) => (
                <motion.div
                  key={r.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: i * 0.05, type: "spring", stiffness: 200, damping: 25 }}
                  className="minimal-card p-6 cursor-pointer hover:border-brand/40 group active:scale-95 transition-all"
                  onClick={() => onSelectRecipe(r)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <Badge variant="outline" className="bg-muted/50 border-none text-[10px] uppercase font-bold tracking-widest">{formatDate(r.timestamp)}</Badge>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                  </div>
                  <h4 className="text-lg font-bold line-clamp-1 mb-2 italic serif">{r.title}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {r.ingredients.join(", ")}
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
            {recipes.length === 0 && (
              <div className="col-span-full py-12 text-center bg-muted/5 rounded-3xl border-2 border-dashed border-border italic text-muted-foreground/50">
                No recipes saved yet.
              </div>
            )}
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-brand/10 rounded-2xl">
               <Briefcase className="w-5 h-5 text-brand" />
            </div>
            <h3 className="text-xl font-bold italic serif tracking-tight">Business Tresor</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {plans.map((p, i) => (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: i * 0.05, type: "spring", stiffness: 200, damping: 25 }}
                  className="minimal-card p-6 cursor-pointer hover:border-brand/40 group active:scale-95 transition-all"
                  onClick={() => onSelectPlan(p)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <Badge variant="outline" className="bg-muted/50 border-none text-[10px] uppercase font-bold tracking-widest">{formatDate(p.timestamp)}</Badge>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                  </div>
                  <h4 className="text-lg font-bold line-clamp-1 mb-2 font-serif">{p.businessName}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {p.concept}
                  </p>
                  <div className="mt-4 flex gap-2">
                    <Badge className="bg-brand/5 text-brand text-[9px] uppercase border-none font-bold">{p.menu.length} Items</Badge>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {plans.length === 0 && (
              <div className="col-span-full py-12 text-center bg-muted/5 rounded-3xl border-2 border-dashed border-border italic text-muted-foreground/50">
                No business plans saved yet.
              </div>
            )}
          </div>
        </section>
      </LayoutGroup>
    </div>
  );
}
