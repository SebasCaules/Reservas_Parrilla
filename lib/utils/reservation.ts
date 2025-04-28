// Función para generar un código de cancelación aleatorio de 6 dígitos
export function generateCancellationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Función para enviar un correo electrónico con los detalles de la reserva
export async function sendReservationEmail(
  email: string,
  reservation: any,
  cancellationCode: string,
): Promise<{ success: boolean; message?: string }> {
  try {
    // Llamar a la API route para enviar el correo
    const response = await fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        reservation,
        cancellationCode,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error("Error al enviar el correo:", data.error)
      return {
        success: false,
        message: data.message || "Error al enviar el correo",
      }
    }

    return {
      success: true,
      message: data.message || "Correo enviado exitosamente",
    }
  } catch (error) {
    console.error("Error al enviar el correo:", error)
    return {
      success: false,
      message: "Error al intentar enviar el correo",
    }
  }
}
