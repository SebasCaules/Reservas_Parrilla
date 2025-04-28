// Función para generar un código de cancelación aleatorio de 4 dígitos
export function generateCancellationCode(): string {
  return Math.floor(1000 + Math.random() * 9000).toString()
}

// Función para compartir el código de cancelación
export function shareCancellationCode(
  method: "email" | "whatsapp",
  code: string,
  reservationDetails: {
    title: string
    name: string
    start_time: string
    end_time: string
  },
): void {
  // Formatear fechas para el mensaje
  const startDate = new Date(reservationDetails.start_time)
  const endDate = new Date(reservationDetails.end_time)

  // Formatear la fecha
  const dateOptions: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  }
  const dateStr = startDate.toLocaleDateString("es-ES", dateOptions)

  // Formatear las horas
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }
  const startTimeStr = startDate.toLocaleTimeString("es-ES", timeOptions)
  const endTimeStr = endDate.toLocaleTimeString("es-ES", timeOptions)

  // Crear el mensaje
  const subject = `Código de Cancelación para Reserva: ${reservationDetails.title}`
  const message = `
Hola ${reservationDetails.name},

Aquí está tu código de cancelación para la reserva "${reservationDetails.title}":

${code}

Detalles de la reserva:
- Fecha: ${dateStr}
- Horario: ${startTimeStr} - ${endTimeStr}
- Reservado por: ${reservationDetails.name}

Guarda este código. Lo necesitarás si deseas cancelar tu reserva.
`

  // Compartir según el método elegido
  if (method === "email") {
    // Abrir cliente de correo
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`)
  } else if (method === "whatsapp") {
    // Abrir WhatsApp
    window.open(`https://wa.me/?text=${encodeURIComponent(subject + "\n\n" + message)}`)
  }
}
