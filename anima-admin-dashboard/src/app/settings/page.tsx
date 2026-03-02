"use client"

import { useState } from "react"
import { Settings, Save, Bell, ShieldCheck, Database, Smartphone, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"security" | "notifications" | "database" | "mobile">("security");

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <Settings className="w-8 h-8 text-indigo-400" />
            Configuración Global
          </h2>
          <p className="text-zinc-400 mt-1">
            Parámetros del sistema, seguridad y notificaciones Push (Aníma App).
          </p>
        </div>
        <div className="flex items-center gap-2">
           <Button className="bg-white text-black hover:bg-zinc-200 shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-all border-0">
            <Save className="mr-2 h-4 w-4" />
            Guardar Configuración
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Column: Navigation/Sections */}
        <Card className="bg-zinc-950/60 border-white/10 backdrop-blur-md shadow-xl h-fit">
           <CardContent className="p-4 space-y-2">
             <Button 
                onClick={() => setActiveTab("security")}
                variant="ghost" 
                className={`w-full justify-start h-11 ${activeTab === 'security' ? 'bg-white/10 text-white' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
             >
               <ShieldCheck className="mr-3 h-5 w-5 text-emerald-400" /> Seguridad
             </Button>
             <Button 
                onClick={() => setActiveTab("notifications")}
                variant="ghost" 
                className={`w-full justify-start h-11 ${activeTab === 'notifications' ? 'bg-white/10 text-white' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
             >
               <Bell className="mr-3 h-5 w-5 text-blue-400" /> Notificaciones Push
             </Button>
             <Button 
                onClick={() => setActiveTab("database")}
                variant="ghost" 
                className={`w-full justify-start h-11 ${activeTab === 'database' ? 'bg-white/10 text-white' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
             >
               <Database className="mr-3 h-5 w-5 text-purple-400" /> Base de Datos
             </Button>
             <Button 
                onClick={() => setActiveTab("mobile")}
                variant="ghost" 
                className={`w-full justify-start h-11 ${activeTab === 'mobile' ? 'bg-white/10 text-white' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
             >
               <Smartphone className="mr-3 h-5 w-5 text-zinc-400" /> App Móvil
             </Button>
           </CardContent>
        </Card>

        {/* Right Column: Settings Form */}
        <div className="md:col-span-2 space-y-6">
          {activeTab === "security" && (
            <>
              <Card className="bg-zinc-950/60 border-white/10 backdrop-blur-md shadow-xl">
                <CardHeader>
                  <CardTitle className="text-xl text-white">Privacidad y Seguridad</CardTitle>
                  <CardDescription className="text-zinc-400">
                    Políticas de retención de datos clínicos (Cumplimiento de estándares terapéuticos).
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label className="text-base font-medium text-zinc-200">Enmascarar identidad real</Label>
                        <p className="text-sm text-zinc-500">Muestra alias (Ej: "Búho") en todo el panel en lugar de correos, por seguridad del paciente.</p>
                      </div>
                      <Switch defaultChecked={true} className="scale-110" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label className="text-base font-medium text-zinc-200">Requerir MFA para Admins</Label>
                        <p className="text-sm text-zinc-500">Autenticación de 2 pasos para entrar a este dashboard.</p>
                      </div>
                      <Switch defaultChecked={true} className="scale-110" />
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-white/5">
                    <Label className="text-base font-medium text-zinc-200">Días de retención de Diarios Ciegos</Label>
                    <div className="flex items-center gap-4">
                      <Input type="number" defaultValue={30} className="w-24 bg-black/40 border-white/10 text-white font-mono" />
                      <span className="text-sm text-zinc-500">Días antes del purgado automático de servidores.</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-zinc-950/60 border-white/10 backdrop-blur-md shadow-xl">
                <CardHeader>
                  <CardTitle className="text-xl text-white">Variables de App Móvil</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-base font-medium text-zinc-200">Enlace a API Principal (Producción)</Label>
                    <Input defaultValue="https://api.anima-app.com/v1" className="bg-black/40 border-white/10 text-blue-400 font-mono" />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-base font-medium text-zinc-200">Intervalo de Sync (Milisegundos)</Label>
                    <Input type="number" defaultValue={15000} className="bg-black/40 border-white/10 text-white font-mono" />
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {activeTab !== "security" && (
            <Card className="bg-zinc-950/60 border-dashed border-2 border-white/10 backdrop-blur-md shadow-xl h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8">
               <AlertCircle className="w-12 h-12 text-zinc-500 mb-4 opacity-50" />
               <CardTitle className="text-xl text-white mb-2">Sección en Desarrollo</CardTitle>
               <CardDescription className="text-zinc-400 max-w-sm">
                 Esta sección aún no recibe datos desde el servidor. Una vez que la API Backend esté conectada, podrás administrar {
                   activeTab === 'notifications' ? 'las alertas y recordatorios de usuario.' 
                   : activeTab === 'database' ? 'las migraciones y métricas de peso de la Base de Datos.' 
                   : 'los controles directos de la App Móvil.'
                 }
               </CardDescription>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
