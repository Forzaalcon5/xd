"use client"

import { useState, useEffect } from "react"
import { Users, Shield, MoreHorizontal, Search, Loader2 } from "lucide-react"
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
import { supabase } from "@/lib/supabase"

interface AppUser {
  id: string
  email: string
  username: string | null
  plan: string | null
  role: string | null
  created_at: string
}

export default function UsersPage() {
  const [search, setSearch] = useState("")
  const [users, setUsers] = useState<AppUser[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from("profiles")
        .select("id, email, username, plan, role, created_at")
        .order("created_at", { ascending: false })
      if (error) {
        console.error("Error cargando usuarios:", error.message)
      } else {
        setUsers(data ?? [])
      }
      setLoading(false)
    }
    loadUsers()
  }, [])

  const filtered = users.filter((u) => {
    const q = search.toLowerCase()
    return (
      u.id.toLowerCase().includes(q) ||
      (u.username ?? "").toLowerCase().includes(q) ||
      (u.email ?? "").toLowerCase().includes(q)
    )
  })

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString("es-ES", {
        day: "2-digit", month: "short", year: "numeric",
      })
    } catch {
      return "-"
    }
  }

  const shortId = (id: string) => `USR-${id.slice(0, 6).toUpperCase()}`

  const displayName = (u: AppUser) =>
    u.username ?? u.email?.split("@")[0] ?? "Anónimo"

  const RoleBadge = ({ role }: { role: string | null }) => {
    switch (role) {
      case "admin":
        return (
          <Badge variant="outline" className="border-indigo-500/30 text-indigo-400 bg-indigo-500/10">
            <Shield className="w-3 h-3 mr-1" /> Admin
          </Badge>
        )
      case "tester":
        return (
          <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10">
            Tester
          </Badge>
        )
      default:
        return <span className="text-zinc-500 text-sm">Usuario</span>
    }
  }

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
            <br />
            <span className="text-xs text-amber-500/80">
              Nota de privacidad: No se exponen diarios clínicos.
            </span>
          </p>
        </div>
        <Button className="bg-white text-black hover:bg-zinc-200">
          Exportar Registro CSV
        </Button>
      </div>

      <Card className="bg-zinc-950/60 border-white/10 backdrop-blur-md shadow-xl flex flex-col">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl text-white">Directorio de Usuarios</CardTitle>
              <CardDescription className="text-zinc-400">
                Total de cuentas:{" "}
                <span className="text-white font-medium">{users.length.toLocaleString()}</span>
                {" · "}
                <span className="text-indigo-400">
                  {users.filter(u => u.role === "admin").length} admins
                </span>
              </CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
              <Input
                placeholder="Buscar por nombre, email o ID..."
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
                  <TableHead className="text-zinc-300 font-medium">ID</TableHead>
                  <TableHead className="text-zinc-300 font-medium">Nombre</TableHead>
                  <TableHead className="text-zinc-300 font-medium">Email</TableHead>
                  <TableHead className="text-zinc-300 font-medium">Rol</TableHead>
                  <TableHead className="text-zinc-300 font-medium hidden md:table-cell">Ruta activa</TableHead>
                  <TableHead className="text-zinc-300 font-medium hidden md:table-cell">Registro</TableHead>
                  <TableHead className="text-zinc-300 font-medium text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12">
                      <div className="flex items-center justify-center gap-2 text-zinc-500">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Cargando usuarios...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-zinc-500">
                      {search ? "Sin resultados para esa búsqueda." : "No hay usuarios registrados aún."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((user) => (
                    <TableRow key={user.id} className="border-white/5 hover:bg-white/5 transition-colors">
                      <TableCell className="font-mono text-xs text-zinc-400">
                        {shortId(user.id)}
                      </TableCell>
                      <TableCell className="font-medium text-zinc-200">
                        {displayName(user)}
                      </TableCell>
                      <TableCell className="text-zinc-400 text-sm">
                        {user.email ?? "-"}
                      </TableCell>
                      <TableCell>
                        <RoleBadge role={user.role} />
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {user.plan ? (
                          <Badge variant="outline" className="border-indigo-500/30 text-indigo-400 bg-indigo-500/10 capitalize">
                            {user.plan}
                          </Badge>
                        ) : (
                          <span className="text-zinc-600 text-sm">Sin ruta</span>
                        )}
                      </TableCell>
                      <TableCell className="text-zinc-400 text-sm hidden md:table-cell">
                        {formatDate(user.created_at)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}