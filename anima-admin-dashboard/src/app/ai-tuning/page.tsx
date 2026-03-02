"use client"

import { useState } from "react";
import { CLINICAL_ROUTES } from "@/lib/constants";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { BrainCircuit, Save, History, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";

export default function AITuningPage() {
  const routes = Object.values(CLINICAL_ROUTES);
  const [activeTab, setActiveTab] = useState(routes[0].id);

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <BrainCircuit className="w-8 h-8 text-blue-400" />
            AI Tuning Studio
          </h2>
          <p className="text-zinc-400 mt-1">
            Configura la personalidad y los prompts del sistema de Lumi por cada ruta emocional.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-white/10 text-white bg-white/5 hover:bg-white/10">
            <History className="mr-2 h-4 w-4" />
            Historial
          </Button>
          <Button className="bg-white text-black hover:bg-zinc-200 shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-all border-0">
            <Save className="mr-2 h-4 w-4" />
            Guardar Cambios
          </Button>
        </div>
      </div>

      <Tabs 
        defaultValue={routes[0].id} 
        onValueChange={(val) => setActiveTab(val as typeof routes[0]["id"])} 
        className="w-full"
      >
        <TabsList className="bg-zinc-950/50 border border-white/5 w-full flex justify-start p-1 h-auto mb-6">
          {routes.map((route) => (
            <TabsTrigger 
              key={route.id} 
              value={route.id}
              className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-zinc-400 rounded-md transition-all"
            >
              <div className="flex items-center gap-2">
                <div 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: route.color }} 
                />
                {route.name}
              </div>
            </TabsTrigger>
          ))}
        </TabsList>

        {routes.map((route) => (
          <TabsContent key={route.id} value={route.id}>
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="grid gap-6 md:grid-cols-3"
            >
              {/* Left Column: Prompt System */}
              <Card className="md:col-span-2 bg-zinc-950/60 border-white/10 backdrop-blur-md shadow-xl">
                <CardHeader>
                  <CardTitle className="text-xl text-white">Instrucción de Sistema (System Prompt)</CardTitle>
                  <CardDescription className="text-zinc-400">
                    Define la identidad base de Lumi para la ruta <strong style={{ color: route.color }}>{route.name}</strong>.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea 
                    className="min-h-[300px] bg-black/40 border-white/10 text-zinc-200 focus-visible:ring-1 focus-visible:ring-white/20 font-mono text-sm leading-relaxed"
                    placeholder="Eres Lumi, un bot de compañía clínica."
                    defaultValue={`Eres Lumi, un asistente terapéutico amigable.
Tu objetivo principal actual es el enfoque en ${route.name}.
Debes responder con empatía, validación activa, y sugerir herramientas como la respiración o los diarios si el usuario lo necesita.
No debes emitir diagnósticos.
Mantén tus respuestas breves (máximo 3 párrafos).
Añade un toque sutil de calidez al final.
`}
                  />
                  <div className="flex justify-end">
                    <Button variant="ghost" className="text-zinc-400 hover:text-white">
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Restaurar Predefinido
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Right Column: Parameters */}
              <div className="space-y-6">
                <Card className="bg-zinc-950/60 border-white/10 backdrop-blur-md shadow-xl flex flex-col">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl text-white">Parámetros Clínicos</CardTitle>
                    <CardDescription className="text-zinc-400">
                      Reglas de comportamiento y sugerencias de la IA.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label htmlFor={`humor-${route.id}`} className="text-base font-medium text-zinc-200">
                           Permitir tono humorístico
                        </Label>
                        <p className="text-sm text-zinc-500">Lumi usará chistes muy suaves y emojis en contexto.</p>
                      </div>
                      <Switch className="scale-125" id={`humor-${route.id}`} defaultChecked={route.id === "renacer"} />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label htmlFor={`advice-${route.id}`} className="text-base font-medium text-zinc-200">
                          Dar consejos directos
                        </Label>
                        <p className="text-sm text-zinc-500">Aumenta la directividad dejando la validación pasiva.</p>
                      </div>
                      <Switch className="scale-125" id={`advice-${route.id}`} defaultChecked={false} />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label htmlFor={`tools-${route.id}`} className="text-base font-medium text-zinc-200">
                          Proponer herramientas
                        </Label>
                        <p className="text-sm text-zinc-500">Enlazará la actividad de respiración o diarios al chat.</p>
                      </div>
                      <Switch className="scale-125" id={`tools-${route.id}`} defaultChecked={true} />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-zinc-950/60 border-white/10 backdrop-blur-md shadow-xl flex flex-col">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl text-white">Parámetros del LLM</CardTitle>
                    <CardDescription className="text-zinc-400">
                      Ajustes del motor subyacente de generación.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-10 pt-2">
                    <div className="space-y-4">
                      <div className="flex justify-between items-end">
                        <div className="space-y-1">
                          <Label className="text-base font-medium text-zinc-200">Temperature (Creatividad)</Label>
                          <p className="text-sm text-zinc-500">Más alto = más libre/variado, más bajo = predecible.</p>
                        </div>
                        <span className="text-lg text-blue-400 font-mono font-bold bg-blue-500/10 px-3 py-1 rounded-md">0.7</span>
                      </div>
                      <Slider className="w-full" defaultValue={[0.7]} max={2} step={0.1} />
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-end">
                         <div className="space-y-1">
                          <Label className="text-base font-medium text-zinc-200">Max Tokens</Label>
                          <p className="text-sm text-zinc-500">Límite absoluto de palabras/tokens por cada respuesta.</p>
                        </div>
                        <span className="text-lg text-blue-400 font-mono font-bold bg-blue-500/10 px-3 py-1 rounded-md">250</span>
                      </div>
                      <Slider className="w-full" defaultValue={[250]} max={1000} step={50} />
                    </div>
                  </CardContent>
                </Card>
              </div>

            </motion.div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
