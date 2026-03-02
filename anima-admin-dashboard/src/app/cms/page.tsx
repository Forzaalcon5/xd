"use client"

import { useState } from "react";
import { CLINICAL_ACTIVITIES, CLINICAL_ROUTES } from "@/lib/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit2, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

export default function CMSPage() {
  const [activities] = useState(CLINICAL_ACTIVITIES);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-white">Actividades Clínicas (CMS)</h2>
        <Button className="bg-white/10 text-white hover:bg-white/20 border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)] transition-all">
          <PlusCircle className="mr-2 h-4 w-4" />
          Nueva Actividad
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {activities.map((activity, index) => {
          // Determinate the visual color based on the actual Route mapping
          let routeColor = "#52525b"; // Default gray
          let routeName = "Universal";
          
          if (activity.route !== "all" && CLINICAL_ROUTES[activity.route as keyof typeof CLINICAL_ROUTES]) {
            routeColor = CLINICAL_ROUTES[activity.route as keyof typeof CLINICAL_ROUTES].color;
            routeName = CLINICAL_ROUTES[activity.route as keyof typeof CLINICAL_ROUTES].name;
          }

          return (
            <motion.div 
              key={activity.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="bg-zinc-950/60 border-white/10 backdrop-blur-md shadow-xl hover:border-white/20 transition-colors">
                <CardHeader className="flex flex-row items-start justify-between pb-2">
                  <div className="space-y-1">
                    <CardTitle className="text-lg font-semibold text-white">
                      {activity.title}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-2 h-2 rounded-full" 
                        style={{ backgroundColor: routeColor }} 
                      />
                      <span className="text-xs text-zinc-400 font-medium">
                        Ruta: {routeName}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-white/10">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-red-400 hover:bg-red-400/10">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-zinc-500 mt-2">
                    Duración estimada: <span className="text-zinc-300">{activity.duration}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
