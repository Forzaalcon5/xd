"use client";

import { useEffect } from "react";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Activity, Heart, ShieldAlert, Loader2 } from "lucide-react";
import { MoodTrendsChart } from "@/components/dashboard/mood-trends-chart";
import { ActiveRoutesChart } from "@/components/dashboard/active-routes-chart";
import { useAdminStore } from "@/store/useAdminStore";

export default function DashboardOverview() {
  const { analytics, isLoadingAnalytics, fetchAnalytics } = useAdminStore();

  useEffect(() => {
    if (!analytics) {
      fetchAnalytics();
    }
  }, [analytics, fetchAnalytics]);
  const containerVars: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      }
    }
  };

  const itemVars: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0.4 } }
  };

  return (
    <div className="w-full h-full max-w-7xl mx-auto space-y-8">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tight">Overview</h1>
          <p className="text-zinc-400 mt-1">Monitorea el estado general de la comunidad Aníma.</p>
        </div>
      </motion.div>

      {/* Hero Welcome Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="w-full relative rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-indigo-900/40 via-purple-900/20 to-black/60 shadow-2xl backdrop-blur-md mb-8 flex flex-col md:flex-row items-center p-8 gap-8"
      >
         <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
         <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
         
         <div className="relative w-32 h-32 md:w-40 md:h-40 shrink-0 rounded-full bg-gradient-to-tr from-indigo-500/20 to-pink-500/20 p-1 shadow-[0_0_30px_rgba(168,85,247,0.3)] animate-[pulse_4s_ease-in-out_infinite]">
            <div className="w-full h-full relative rounded-full overflow-hidden bg-black/50 backdrop-blur-sm border border-white/10">
               <Image src="/assets/Lumi-admin.png" alt="Lumi AI Companion" unoptimized={true} fill className="object-cover scale-[1.15] hover:scale-125 transition-transform duration-700" />
            </div>
         </div>
         
         <div className="relative z-10 flex-col space-y-3 md:text-left text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-2">
               <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
               Monitoreo Activo
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">El ecosistema de Aníma está en equilibrio.</h2>
            <p className="text-zinc-300 max-w-2xl text-sm md:text-base leading-relaxed">
               Lumi está monitoreando activamente tu comunidad. Los flujos de interacción diarios y los registros clínicos reflejan una tendencia positiva de acompañamiento exitoso hacia los usuarios.
            </p>
         </div>
      </motion.div>

      <motion.div 
        variants={containerVars}
        initial="hidden"
        animate="show"
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
      >
        {[
          { title: "Usuarios Activos (MAU)", icon: Users, value: analytics?.overviewStats.activeUsers || "-", sub: "+12% este mes" },
          { title: "Registros Emocionales", icon: Heart, value: analytics?.overviewStats.dailyActivities || "-", sub: "Check-ins diarios procesados" },
          { title: "Uso de SOS (Global)", icon: ShieldAlert, value: analytics?.overviewStats.sosSaves || "-", sub: "-4% vs mes anterior" },
          { title: "Actividades Diarias", icon: Activity, value: "1,204", sub: "+5% vs ayer" },
        ].map((stat, i) => (
          <motion.div key={i} variants={itemVars}>
            <Card className="bg-zinc-950/40 border-white/10 backdrop-blur-md shadow-2xl">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-zinc-300">
                  {stat.title}
                </CardTitle>
                <stat.icon className="w-4 h-4 text-zinc-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{stat.value}</div>
                <p className="text-xs text-zinc-500 mt-1">{stat.sub}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 mt-8"
      >
        {/* Loading overlay inside cards gracefully handling the latency */}
        {isLoadingAnalytics ? (
           <div className="col-span-4 md:col-span-7 h-[400px] flex items-center justify-center flex-col gap-4 text-zinc-400">
             <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
             <p>Cargando métricas de la API...</p>
           </div>
        ) : (
          <>
            <Card className="col-span-4 bg-zinc-950/40 border-white/10 backdrop-blur-md shadow-2xl h-[400px] flex flex-col">
              <CardHeader className="pb-2">
                <CardTitle className="text-white">Volumen de Registros Emocionales (7 días)</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 min-h-0 pl-2">
                <MoodTrendsChart />
              </CardContent>
            </Card>

            <Card className="col-span-3 bg-zinc-950/40 border-white/10 backdrop-blur-md shadow-2xl h-[400px] flex flex-col">
              <CardHeader className="pb-2">
                <CardTitle className="text-white">Rutas Activas (Global)</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 min-h-0 flex flex-col">
                 <div className="flex-1 min-h-0 min-w-0 pb-4">
                   <ActiveRoutesChart />
                 </div>
                 
                 {/* Leyenda manual rápida */}
                 <div className="flex flex-wrap justify-center gap-4 mt-auto pt-2 border-t border-white/5">
                    <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-[#4ADE80]"></div><span className="text-xs text-zinc-400">Renacer</span></div>
                    <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-[#F472B6]"></div><span className="text-xs text-zinc-400">Autocompasión</span></div>
                    <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-[#60A5FA]"></div><span className="text-xs text-zinc-400">Balance</span></div>
                    <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-[#FBBF24]"></div><span className="text-xs text-zinc-400">Descubrimiento</span></div>
                    <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-[#A78BFA]"></div><span className="text-xs text-zinc-400">Soledad</span></div>
                 </div>
              </CardContent>
            </Card>
          </>
        )}
      </motion.div>
    </div>
  );
}
