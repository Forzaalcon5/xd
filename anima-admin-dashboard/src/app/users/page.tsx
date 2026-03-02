"use client"

import { useState } from "react"
import { Users, Shield, UserX, UserCheck, MoreHorizontal, Search } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const mockUsers = [
  { id: "USR-001", name: "Anónimo (Lobo)", role: "User", status: "Active", route: "Renacer", joinDate: "2026-01-12" },
  { id: "USR-002", name: "Admin_Principal", role: "Admin", status: "Active", route: "Balance", joinDate: "2025-11-01" },
  { id: "USR-003", name: "Anónimo (Búho)", role: "User", status: "Warning", route: "Soledad", joinDate: "2026-02-28" },
  { id: "USR-004", name: "Test_Account_1", role: "Tester", status: "Inactive", route: "Autocompasión", joinDate: "2026-03-01" },
  { id: "USR-005", name: "Anónimo (Zorro)", role: "User", status: "Banned", route: "Ninguna", joinDate: "2025-12-15" },
]

export default function UsersPage() {
  const [search, setSearch] = useState("");

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <Users className="w-8 h-8 text-indigo-400" />
            Community & Access
          </h2>
          <p className="text-zinc-400 mt-1">
            Gestiona los roles, cuentas de prueba, e infracciones de la comunidad Aníma.  
            <br/><span className="text-xs text-amber-500/80">Nota de privacidad: No se exponen correos ni diarios clínicos.</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button className="bg-white text-black hover:bg-zinc-200">
            Exportar Registro CSV
          </Button>
        </div>
      </div>

      <Card className="bg-zinc-950/60 border-white/10 backdrop-blur-md shadow-xl flex flex-col">
        <CardHeader className="pb-4">
           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
             <div>
                <CardTitle className="text-xl text-white">Directorio de Usuarios</CardTitle>
                <CardDescription className="text-zinc-400">
                  Total de cuentas registradas: 12,450
                </CardDescription>
             </div>
             <div className="relative w-full sm:w-64">
               <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
               <Input 
                 placeholder="Buscar por ID o alias..." 
                 className="pl-9 bg-black/40 border-white/10 text-white focus-visible:ring-indigo-500/50"
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
               />
             </div>
           </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-white/5 bg-black/20 overflow-hidden">
            <Table>
              <TableHeader className="bg-white/5 hover:bg-white/5">
                <TableRow className="border-white/5">
                  <TableHead className="text-zinc-300 font-medium">ID del Perfil</TableHead>
                  <TableHead className="text-zinc-300 font-medium">Alias Público</TableHead>
                  <TableHead className="text-zinc-300 font-medium">Rol</TableHead>
                  <TableHead className="text-zinc-300 font-medium">Estado</TableHead>
                  <TableHead className="text-zinc-300 font-medium hidden md:table-cell">Ruta Actual</TableHead>
                  <TableHead className="text-zinc-300 font-medium text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockUsers.map((user) => (
                  <TableRow key={user.id} className="border-white/5 hover:bg-white/5 transition-colors">
                    <TableCell className="font-mono text-xs text-zinc-400">{user.id}</TableCell>
                    <TableCell className="font-medium text-zinc-200">{user.name}</TableCell>
                    <TableCell>
                      {user.role === "Admin" ? (
                        <Badge variant="outline" className="border-indigo-500/30 text-indigo-400 bg-indigo-500/10">
                          <Shield className="w-3 h-3 mr-1" /> Admin
                        </Badge>
                      ) : user.role === "Tester" ? (
                         <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10">
                          Banco de Pruebas
                        </Badge>
                      ) : (
                        <span className="text-zinc-500 text-sm">Usuario Regular</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {user.status === "Active" ? (
                        <div className="flex items-center gap-1.5 text-emerald-400 text-sm">
                          <UserCheck className="w-4 h-4" /> Activo
                        </div>
                      ) : user.status === "Warning" ? (
                        <div className="flex items-center gap-1.5 text-amber-400 text-sm">
                          <Shield className="w-4 h-4" /> Advertencia
                        </div>
                      ) : user.status === "Banned" ? (
                        <div className="flex items-center gap-1.5 text-red-500 text-sm">
                          <UserX className="w-4 h-4" /> Suspendido
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-zinc-500 text-sm">
                           Inactivo
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-zinc-400 text-sm hidden md:table-cell">{user.route}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
