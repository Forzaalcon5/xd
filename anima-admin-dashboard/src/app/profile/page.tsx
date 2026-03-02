"use client"

import { useState } from "react"
import { ShieldCheck, User, Mail, Building, FileBadge, Save, KeyRound } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <User className="w-8 h-8 text-indigo-400" />
            Mi Perfil (Admin)
          </h2>
          <p className="text-zinc-400 mt-1">
            Gestiona tu información pública, licencia clínica y credenciales de acceso.
          </p>
        </div>
        <div className="flex items-center gap-2">
           {isEditing ? (
             <Button 
                onClick={() => setIsEditing(false)}
                className="bg-white text-black hover:bg-zinc-200 shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-all border-0"
             >
               <Save className="mr-2 h-4 w-4" />
               Guardar Cambios
             </Button>
           ) : (
             <Button 
                onClick={() => setIsEditing(true)}
                variant="outline" 
                className="border-white/10 text-white bg-white/5 hover:bg-white/10"
             >
               Editar Perfil
             </Button>
           )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Column: Avatar & Role Card */}
        <Card className="bg-zinc-950/60 border-white/10 backdrop-blur-md shadow-xl h-fit">
           <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
             <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 p-1 shadow-lg shadow-purple-500/20">
               <div className="w-full h-full rounded-full bg-zinc-900 border-2 border-zinc-950 flex flex-col items-center justify-center text-white font-bold text-2xl">
                 AD
               </div>
             </div>
             
             <div className="space-y-1">
               <h3 className="text-xl font-bold text-white">Administrador</h3>
               <div className="flex items-center justify-center gap-1.5 text-emerald-400 text-sm font-medium">
                 <ShieldCheck className="w-4 h-4" />
                 Super Administrador
               </div>
             </div>
             
             <div className="w-full pt-4 border-t border-white/10 space-y-3">
               <Button variant="outline" className="w-full border-white/10 text-zinc-300 bg-black/40 hover:bg-white/5 hover:text-white">
                 Cambiar Avatar
               </Button>
             </div>
           </CardContent>
        </Card>

        {/* Right Column: Settings Form */}
        <div className="md:col-span-2 space-y-6">
          <Card className="bg-zinc-950/60 border-white/10 backdrop-blur-md shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl text-white">Información Profesional</CardTitle>
              <CardDescription className="text-zinc-400">
                Esta información puede ser visible internamente en el registro de auditoría.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-zinc-300">Nombres</Label>
                  <Input 
                    id="firstName" 
                    defaultValue="Admin" 
                    disabled={!isEditing}
                    className="bg-black/40 border-white/10 text-white disabled:opacity-50 disabled:text-zinc-500" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-zinc-300">Apellidos</Label>
                  <Input 
                    id="lastName" 
                    defaultValue="Principal" 
                    disabled={!isEditing}
                    className="bg-black/40 border-white/10 text-white disabled:opacity-50 disabled:text-zinc-500" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="license" className="text-zinc-300">Registro Médico / Licencia Clínica (Opcional)</Label>
                <div className="relative">
                  <FileBadge className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                  <Input 
                    id="license" 
                    defaultValue="RMP-10293847" 
                    disabled={!isEditing}
                    className="pl-10 bg-black/40 border-white/10 text-white disabled:opacity-50 disabled:text-zinc-500 font-mono" 
                  />
                </div>
              </div>

               <div className="space-y-2">
                <Label htmlFor="org" className="text-zinc-300">Institución u Organización</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                  <Input 
                    id="org" 
                    defaultValue="Aníma Core Team" 
                    disabled={!isEditing}
                    className="pl-10 bg-black/40 border-white/10 text-white disabled:opacity-50 disabled:text-zinc-500" 
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-950/60 border-white/10 backdrop-blur-md shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl text-white">Seguridad de la Cuenta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label className="text-zinc-300">Correo Electrónico (Solo Lectura)</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                  <Input 
                    value="admin@anima-app.com" 
                    disabled 
                    className="pl-10 bg-black/40 border-white/10 text-zinc-500 disabled:opacity-50 font-mono" 
                  />
                </div>
              </div>
              
              <div className="pt-2">
                 <Button variant="outline" className="w-full sm:w-auto border-red-500/30 text-red-400 bg-red-500/10 hover:bg-red-500/20 hover:text-red-300">
                    <KeyRound className="mr-2 h-4 w-4" /> Volver a crear Contraseña
                 </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
