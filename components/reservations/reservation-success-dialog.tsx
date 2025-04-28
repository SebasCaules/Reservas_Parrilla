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
import { formatDate, formatTime } from "@/lib/utils/date"
import { Check, Copy, Mail, MessageCircle } from "lucide-react"
import { shareCancellationCode } from "@/lib/utils/reservation"
import { motion, AnimatePresence } from "framer-motion"
import { AnimatedButton } from "@/components/ui/animated-button"

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
  } | null
  cancellationCode: string
}

export function ReservationSuccessDialog({
  open,
  onOpenChange,
  reservation,
  cancellationCode,
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

  const handleShare = (method: "email" | "whatsapp") => {
    shareCancellationCode(method, cancellationCode, {
      title: reservation.title,
      name: reservation.name,
      start_time: reservation.start_time,
      end_time: reservation.end_time,
    })
  }

  // Extraer la fecha y hora para el formato solicitado
  const startDate = new Date(reservation.start_time)
  const endDate = new Date(reservation.end_time)
  const dateStr = formatDate(startDate)
  const startTimeStr = formatTime(startDate)
  const endTimeStr = formatTime(endDate)

  return (
    <AnimatePresence>
      {open && (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <DialogTitle>¡Reserva Creada Exitosamente!</DialogTitle>
                <DialogDescription>
                  Tu reserva ha sido creada. Guarda el código de cancelación para futuras referencias.
                </DialogDescription>
              </motion.div>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="rounded-lg border p-4 space-y-2"
              >
                <div>
                  <span className="font-medium">Evento:</span> {reservation.title}
                </div>
                <div>
                  <span className="font-medium">Reservado por:</span> {reservation.name} (Unidad{" "}
                  {reservation.apartment_number})
                </div>
                <div>
                  <span className="font-medium">Fecha:</span> {dateStr}
                </div>
                <div>
                  <span className="font-medium">Horario:</span> {startTimeStr} - {endTimeStr}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <AlertMessage variant="warning" className="flex flex-col items-center">
                  <div className="text-center mb-2">
                    <strong>Código de Cancelación</strong>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="text-3xl font-mono tracking-wider bg-amber-100 dark:bg-amber-900/50 px-6 py-3 rounded-md"
                    >
                      {cancellationCode}
                    </motion.div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={copyToClipboard}
                      className="h-10 w-10"
                      title="Copiar código"
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <div className="text-center mt-2 text-sm">
                    Guarda este código. Lo necesitarás si deseas cancelar tu reserva.
                  </div>
                </AlertMessage>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="flex justify-center gap-3 mt-4"
              >
                <AnimatedButton
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => handleShare("email")}
                >
                  <Mail className="h-4 w-4" />
                  Enviar por correo
                </AnimatedButton>
                <AnimatedButton
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => handleShare("whatsapp")}
                >
                  <MessageCircle className="h-4 w-4" />
                  Enviar por WhatsApp
                </AnimatedButton>
              </motion.div>
            </div>
            <DialogFooter>
              <AnimatedButton
                onClick={() => onOpenChange(false)}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white"
              >
                Entendido
              </AnimatedButton>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  )
}
