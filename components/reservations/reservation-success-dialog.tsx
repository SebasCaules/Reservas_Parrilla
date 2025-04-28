"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AlertMessage } from "@/components/ui/alert-message"
import { formatDateTime } from "@/lib/utils/date"
import { Check, Copy, Mail } from "lucide-react"

interface ReservationSuccessDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  reservation: {
    id: string
    title: string
    name: string
    apartment_number: string
    start_time: string
    end_time: string
    description?: string | null
  } | null
  cancellationCode: string
  emailSent: boolean
}

export function ReservationSuccessDialog({
  open,
  onOpenChange,
  reservation,
  cancellationCode,
  emailSent,
}: ReservationSuccessDialogProps) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => setCopied(false), 2000)
      return () => clearTimeout(timeout)
    }
  }, [copied])

  if (!reservation) return null

  const copyToClipboard = () => {
    navigator.clipboard.writeText(cancellationCode)
    setCopied(true)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>¡Reserva Creada Exitosamente!</DialogTitle>
          <DialogDescription>
            Tu reserva ha sido creada. Guarda el código de cancelación para futuras referencias.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="rounded-lg border p-4 space-y-2">
            <div>
              <span className="font-medium">Evento:</span> {reservation.title}
            </div>
            <div>
              <span className="font-medium">Reservado por:</span> {reservation.name} (Apto{" "}
              {reservation.apartment_number})
            </div>
            <div>
              <span className="font-medium">Horario:</span> {formatDateTime(reservation.start_time)} a{" "}
              {formatDateTime(reservation.end_time)}
            </div>
            {reservation.description && (
              <div>
                <span className="font-medium">Descripción:</span> {reservation.description}
              </div>
            )}
          </div>

          <AlertMessage variant="warning" className="flex flex-col items-center">
            <div className="text-center mb-2">
              <strong>Código de Cancelación</strong>
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="text-2xl font-mono tracking-wider bg-amber-100 dark:bg-amber-900/50 px-4 py-2 rounded-md">
                {cancellationCode}
              </div>
              <Button variant="outline" size="icon" onClick={copyToClipboard} className="h-8 w-8" title="Copiar código">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <div className="text-center mt-2 text-sm">
              Guarda este código. Lo necesitarás si deseas cancelar tu reserva.
            </div>
          </AlertMessage>

          {emailSent ? (
            <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-md p-4">
              <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                <Mail className="h-5 w-5" />
                <p className="text-sm">
                  Hemos enviado un correo electrónico a tu dirección con los detalles de la reserva y el código de
                  cancelación.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-md p-4">
              <div className="flex items-center gap-2 text-orange-700 dark:text-orange-400">
                <Mail className="h-5 w-5" />
                <p className="text-sm">
                  No se pudo enviar el correo electrónico. Por favor, asegúrate de guardar o copiar el código de
                  cancelación.
                </p>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} className="w-full bg-orange-600 hover:bg-orange-700 text-white">
            Entendido
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
