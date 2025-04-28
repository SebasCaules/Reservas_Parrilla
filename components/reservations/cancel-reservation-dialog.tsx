"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Trash } from "lucide-react"
import { cancelReservationWithCode } from "@/lib/actions/reservation-actions"

interface CancelReservationDialogProps {
  reservationId: string
  reservationTitle: string
}

export function CancelReservationDialog({ reservationId, reservationTitle }: CancelReservationDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [code, setCode] = useState("")

  async function handleCancelReservation() {
    if (!code || code.length !== 4) {
      toast({
        title: "Error",
        description: "Por favor ingresa el código de 4 dígitos",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const result = await cancelReservationWithCode(reservationId, code)

      if (result.success) {
        toast({
          title: "Reserva cancelada",
          description: "La reserva ha sido cancelada exitosamente",
        })
        setIsOpen(false)
      } else {
        toast({
          title: "Error",
          description: result.message || "No se pudo cancelar la reserva",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Algo salió mal",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50">
          <Trash className="h-4 w-4" />
          <span className="sr-only">Cancelar reserva</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancelar Reserva</DialogTitle>
          <DialogDescription>
            Para cancelar la reserva "{reservationTitle}", ingresa el código de 4 dígitos que recibiste al hacer la
            reserva.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="cancellationCode">Código de cancelación</Label>
            <Input
              id="cancellationCode"
              placeholder="1234"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              maxLength={4}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleCancelReservation} disabled={isLoading || code.length !== 4}>
            {isLoading ? "Cancelando..." : "Confirmar Cancelación"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
