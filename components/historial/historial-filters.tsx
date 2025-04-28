"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

// Departamentos disponibles
const DEPARTAMENTOS = ["PB A", "PB B", "1C", "1D", "2E", "2F", "3G"]

// Meses en español
const MESES = [
  { value: "0", label: "Enero" },
  { value: "1", label: "Febrero" },
  { value: "2", label: "Marzo" },
  { value: "3", label: "Abril" },
  { value: "4", label: "Mayo" },
  { value: "5", label: "Junio" },
  { value: "6", label: "Julio" },
  { value: "7", label: "Agosto" },
  { value: "8", label: "Septiembre" },
  { value: "9", label: "Octubre" },
  { value: "10", label: "Noviembre" },
  { value: "11", label: "Diciembre" },
]

// Generar años desde 2023 hasta el año actual + 1
const currentYear = new Date().getFullYear()
const AÑOS = Array.from({ length: currentYear - 2022 }, (_, i) => (2023 + i).toString())

interface HistorialFiltersProps {
  onFilterChange: (filters: {
    departamento: string | null
    mes: string | null
    año: string | null
  }) => void
}

export function HistorialFilters({ onFilterChange }: HistorialFiltersProps) {
  const [departamento, setDepartamento] = useState<string | null>(null)
  const [mes, setMes] = useState<string | null>(null)
  const [año, setAño] = useState<string | null>(null)

  const handleDepartamentoChange = (value: string) => {
    const newValue = value === "todos" ? null : value
    setDepartamento(newValue)
    onFilterChange({ departamento: newValue, mes, año })
  }

  const handleMesChange = (value: string) => {
    const newValue = value === "todos" ? null : value
    setMes(newValue)
    onFilterChange({ departamento, mes: newValue, año })
  }

  const handleAñoChange = (value: string) => {
    const newValue = value === "todos" ? null : value
    setAño(newValue)
    onFilterChange({ departamento, mes, año: newValue })
  }

  const resetFilters = () => {
    setDepartamento(null)
    setMes(null)
    setAño(null)
    onFilterChange({ departamento: null, mes: null, año: null })
  }

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="departamento">Departamento</Label>
            <Select value={departamento || "todos"} onValueChange={handleDepartamentoChange}>
              <SelectTrigger id="departamento">
                <SelectValue placeholder="Todos los departamentos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los departamentos</SelectItem>
                {DEPARTAMENTOS.map((depto) => (
                  <SelectItem key={depto} value={depto}>
                    {depto}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mes">Mes</Label>
            <Select value={mes || "todos"} onValueChange={handleMesChange}>
              <SelectTrigger id="mes">
                <SelectValue placeholder="Todos los meses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los meses</SelectItem>
                {MESES.map((mes) => (
                  <SelectItem key={mes.value} value={mes.value}>
                    {mes.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="año">Año</Label>
            <Select value={año || "todos"} onValueChange={handleAñoChange}>
              <SelectTrigger id="año">
                <SelectValue placeholder="Todos los años" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los años</SelectItem>
                {AÑOS.map((año) => (
                  <SelectItem key={año} value={año}>
                    {año}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button variant="outline" onClick={resetFilters} className="w-full">
              Limpiar Filtros
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
