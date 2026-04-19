import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Utensils, Briefcase, Zap, Github, Instagram, Twitter, Layout, BookOpen, User, Sun, Moon, LogOut, Archive, FolderHeart } from "lucide-react";
import RecipeMode from "./components/RecipeMode";
import BusinessMode from "./components/BusinessMode";
import ArchiveView from "./components/ArchiveView";
import { motion, AnimatePresence } from "motion/react";
import { Recipe, BusinessPlan } from "./lib/gemini";

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState("recipes");
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<BusinessPlan | null>(null);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  return (
    <div className="flex h-screen w-full bg-background text-foreground overflow-hidden font-sans relative">
      {/* AI Ambient Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-40">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            x: [0, 50, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-brand/5 rounded-full blur-[120px]"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, -45, 0],
            x: [0, -30, 0],
            y: [0, 50, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-[60%] left-[60%] w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-[150px]"
        />
      </div>

      {/* Sidebar Navigation */}
      <nav className="w-20 bg-card border-r border-border flex flex-col items-center py-8 gap-10 shrink-0 relative z-20">
        <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-brand/20">
          C
        </div>
        <div className="flex flex-col gap-6">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setActiveTab("recipes")}
            className={`p-3 rounded-lg cursor-pointer transition-all relative group ${activeTab === 'recipes' ? 'bg-brand text-white shadow-lg shadow-brand/20' : 'hover:bg-muted/50 text-muted-foreground'}`}
          >
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 rounded-lg blur-xl transition-opacity" />
            <Layout className="w-6 h-6 relative z-10" />
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.1, rotate: -5 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setActiveTab("business")}
            className={`p-3 rounded-lg cursor-pointer transition-all relative group ${activeTab === 'business' ? 'bg-brand text-white shadow-lg shadow-brand/20' : 'hover:bg-muted/50 text-muted-foreground'}`}
          >
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 rounded-lg blur-xl transition-opacity" />
            <Briefcase className="w-6 h-6 relative z-10" />
          </motion.div>
          <motion.div 
             whileHover={{ scale: 1.1, rotate: 12 }}
             whileTap={{ scale: 0.9 }}
             onClick={() => setActiveTab("archive")}
             className={`p-3 rounded-lg cursor-pointer transition-all relative group ${activeTab === 'archive' ? 'bg-brand text-white shadow-lg shadow-brand/20' : 'hover:bg-muted/50 text-muted-foreground'}`}
          >
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 rounded-lg blur-xl transition-opacity" />
            <Archive className="w-6 h-6 relative z-10" />
          </motion.div>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleDarkMode}
            className="p-3 hover:bg-muted/50 rounded-lg text-muted-foreground cursor-pointer transition-colors flex items-center justify-center border-t border-border mt-4 pt-8"
            title="Toggle Theme"
          >
            {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
          </motion.button>
        </div>
        <div className="mt-auto flex flex-col gap-4 items-center">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center border border-border overflow-hidden">
             <User className="w-5 h-5 text-muted-foreground" />
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative z-10 bg-transparent">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="h-20 bg-card/40 backdrop-blur-xl border-b border-white/10 px-8 flex items-center justify-between shrink-0 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-brand/5 via-transparent to-transparent pointer-events-none" />
            <div className="flex items-center gap-10 relative z-10">
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-2xl font-black flex items-center gap-3 tracking-tighter"
              >
                <div className="w-10 h-10 bg-brand rounded-2xl flex items-center justify-center text-white text-sm shadow-xl shadow-brand/40 rotate-12 group-hover:rotate-0 transition-transform duration-500">
                  C
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-black tracking-tighter leading-none">Chatty</span>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.4em] mt-1 italic">Vault Hub</span>
                </div>
              </motion.h1>
              
              <TabsList className="bg-muted/30 p-1.5 rounded-2xl border border-white/5 gap-1">
                <TabsTrigger value="recipes" className="px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all data-[state=active]:bg-brand data-[state=active]:text-white data-[state=active]:shadow-2xl data-[state=active]:shadow-brand/40 duration-500">
                  Kitchen
                </TabsTrigger>
                <TabsTrigger value="business" className="px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all data-[state=active]:bg-brand data-[state=active]:text-white data-[state=active]:shadow-2xl data-[state=active]:shadow-brand/40 duration-500">
                  Vision
                </TabsTrigger>
                <TabsTrigger value="archive" className="px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all data-[state=active]:bg-brand data-[state=active]:text-white data-[state=active]:shadow-2xl data-[state=active]:shadow-brand/40 duration-500">
                  Vault
                </TabsTrigger>
              </TabsList>
            </div>
            
            <div className="flex items-center gap-6 relative z-10">
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="flex items-center gap-3 px-5 py-2.5 bg-brand/10 rounded-full border border-brand/20 shadow-lg shadow-brand/5"
               >
                 <div className="w-2 h-2 bg-brand rounded-full animate-pulse shadow-[0_0_10px_rgba(255,99,33,0.8)]" />
                 <span className="text-[10px] font-black text-brand uppercase tracking-widest">Chatty AI Online</span>
               </motion.div>
            </div>
          </header>

          {/* Tab Content Scrolling Area */}
          <div className="flex-1 overflow-y-auto p-10 relative z-20">
            <div className="max-w-6xl mx-auto pb-32">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 40, scale: 0.95, filter: 'blur(15px)' }}
                  animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -40, scale: 0.95, filter: 'blur(20px)' }}
                  transition={{ 
                    type: "spring", 
                    damping: 30, 
                    stiffness: 150,
                    mass: 0.8
                  }}
                  className="outline-none"
                >
                  <TabsContent value="recipes" className="mt-0 focus-visible:outline-none">
                    <div className="mb-16">
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-4 mb-6"
                      >
                        <div className="w-12 h-12 bg-brand/10 rounded-2xl flex items-center justify-center animate-ai-pulse">
                          <Utensils className="w-6 h-6 text-brand" />
                        </div>
                        <span className="text-sm font-bold uppercase tracking-[0.5em] text-muted-foreground/60">Chatty Kitchen</span>
                      </motion.div>
                      <h2 className="text-8xl font-black tracking-tighter mb-8 serif italic leading-[0.9] text-foreground">
                        Kreiere <span className="text-brand">Meisterwerke.</span>
                      </h2>
                      <p className="text-muted-foreground text-2xl max-w-2xl font-light leading-relaxed border-l-2 border-brand/20 pl-8">Chatty verwandelt deine wildesten Ideen in exquisite kulinarische Realität.</p>
                    </div>
                    <RecipeMode initialRecipe={selectedRecipe} />
                  </TabsContent>
                  
                  <TabsContent value="business" className="mt-0 focus-visible:outline-none">
                    <div className="mb-16">
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-4 mb-6"
                      >
                        <div className="w-12 h-12 bg-brand/10 rounded-2xl flex items-center justify-center animate-ai-pulse">
                          <Briefcase className="w-6 h-6 text-brand" />
                        </div>
                        <span className="text-sm font-bold uppercase tracking-[0.5em] text-muted-foreground/60">Chatty Vision</span>
                      </motion.div>
                      <h2 className="text-8xl font-black tracking-tighter mb-8 serif italic leading-[0.9] text-foreground">
                        Baue dein <span className="text-brand">Imperium.</span>
                      </h2>
                      <p className="text-muted-foreground text-2xl max-w-2xl font-light leading-relaxed border-l-2 border-brand/20 pl-8">Von der Vision zur Marktmacht. Chatty plant jeden strategischen Zug.</p>
                    </div>
                    <BusinessMode initialPlan={selectedPlan} />
                  </TabsContent>

                  <TabsContent value="archive" className="mt-0 focus-visible:outline-none">
                    <div className="mb-16">
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-4 mb-6"
                      >
                        <div className="w-12 h-12 bg-brand/10 rounded-2xl flex items-center justify-center animate-ai-pulse">
                          <Archive className="w-6 h-6 text-brand" />
                        </div>
                        <span className="text-sm font-bold uppercase tracking-[0.5em] text-muted-foreground/60">Chatty Vault</span>
                      </motion.div>
                      <h2 className="text-8xl font-black tracking-tighter mb-8 serif italic leading-[0.9] text-foreground">
                        Deine <span className="text-brand">Essenz.</span>
                      </h2>
                      <p className="text-muted-foreground text-2xl max-w-2xl font-light leading-relaxed border-l-2 border-brand/20 pl-8">Sicher verwahrt in deinem lokalen Tresor. Deine Ideen, deine Daten.</p>
                    </div>
                    <ArchiveView 
                      onSelectRecipe={(r) => { setSelectedRecipe(r); setActiveTab("recipes"); }}
                      onSelectPlan={(p) => { setSelectedPlan(p); setActiveTab("business"); }}
                    />
                  </TabsContent>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </Tabs>
      </main>

      {/* AI Ambient Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-[-5] opacity-60">
        <motion.div 
          animate={{ 
            scale: [1, 1.5, 1],
            rotate: [0, 180, 0],
            x: [0, 100, 0],
            y: [0, 50, 0]
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -left-[20%] w-[60%] h-[60%] bg-brand/10 rounded-full blur-[150px]"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.8, 1],
            rotate: [0, -90, 0],
            x: [0, -100, 0],
            y: [0, 80, 0]
          }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute top-[50%] left-[50%] w-[70%] h-[70%] bg-blue-500/5 rounded-full blur-[180px]"
        />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] mix-blend-overlay" />
      </div>
    </div>
  );
}
