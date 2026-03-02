"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ShieldPlus, Mail, Lock, User, FileBadge } from "lucide-react"

export default function RegisterPage() {
  return (
    <div className="flex h-full min-h-[80vh] w-full items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
        className="w-full max-w-lg"
      >
        <Card className="border-white/10 bg-black/40 shadow-2xl backdrop-blur-xl">
          <CardHeader className="space-y-4 text-center pb-6">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-purple-500/20 to-pink-500/20 border border-white/10">
              <ShieldPlus className="h-8 w-8 text-purple-400" />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold tracking-tight text-white">
                Solicitud de Acceso Clínico
              </CardTitle>
              <CardDescription className="text-zinc-400">
                Únete al equipo administrativo de Aníma. Sujeto a aprobación manual.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                  <Label htmlFor="name" className="text-zinc-300">Nombre Completo</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                    <Input
                      id="name"
                      placeholder="Dra. Gómez"
                      className="pl-10 bg-black/50 border-white/10 text-white placeholder:text-zinc-600 focus-visible:ring-purple-500"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="license" className="text-zinc-300">Licencia (Opcional)</Label>
                  <div className="relative">
                    <FileBadge className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                    <Input
                      id="license"
                      placeholder="RMP-123456"
                      className="pl-10 bg-black/50 border-white/10 text-white placeholder:text-zinc-600 focus-visible:ring-purple-500"
                    />
                  </div>
                </div>
             </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-300">Correo Institucional</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@anima-app.com"
                  className="pl-10 bg-black/50 border-white/10 text-white placeholder:text-zinc-600 focus-visible:ring-purple-500"
                />
              </div>
            </div>
            
            <div className="space-y-2">
               <Label htmlFor="password" className="text-zinc-300">Contraseña Segura</Label>
               <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••••••"
                  className="pl-10 bg-black/50 border-white/10 text-white placeholder:text-zinc-600 focus-visible:ring-purple-500"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 pt-4">
            <Link href="/login" className="w-full">
               <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500 shadow-lg shadow-purple-500/25 border-0 h-11">
                 Enviar Solicitud
               </Button>
            </Link>
            <div className="text-center text-sm text-zinc-500">
              ¿Ya tienes una cuenta operativa?{" "}
              <Link href="/login" className="text-purple-400 hover:text-purple-300 font-medium">
                Inicia sesión aquí
              </Link>
            </div>
            <div className="mt-4 text-center text-xs text-zinc-600">
               Todas las cuentas nuevas deben ser aprobadas por un SuperAdmin.
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
