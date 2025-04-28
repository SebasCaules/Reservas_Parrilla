import { NextResponse } from "next/server"
import { formatDateTime } from "@/lib/utils/date"
import { Resend } from "resend"

// Inicializar Resend con la API key
// En producción, esta clave debe estar en las variables de entorno
const resend = new Resend(process.env.RESEND_API_KEY || "")

export async function POST(request: Request) {
  try {
    const { email, reservation, cancellationCode } = await request.json()

    if (!email || !reservation || !cancellationCode) {
      return NextResponse.json(
        { error: "Se requiere email, datos de reserva y código de cancelación" },
        { status: 400 },
      )
    }

    // Crear el contenido del correo
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #ea580c; text-align: center;">Confirmación de Reserva de Parrilla</h2>
        <p>Hola ${reservation.name},</p>
        <p>Tu reserva ha sido confirmada exitosamente. Aquí están los detalles:</p>
        
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <p><strong>Evento:</strong> ${reservation.title}</p>
          <p><strong>Fecha y hora:</strong> ${formatDateTime(reservation.start_time)} a ${formatDateTime(reservation.end_time)}</p>
          <p><strong>Apartamento:</strong> ${reservation.apartment_number}</p>
          ${reservation.description ? `<p><strong>Descripción:</strong> ${reservation.description}</p>` : ""}
        </div>
        
        <div style="background-color: #fff3e0; padding: 15px; border-radius: 5px; border-left: 4px solid #ea580c; margin: 15px 0;">
          <p style="font-weight: bold; margin-bottom: 10px;">Código de Cancelación:</p>
          <p style="font-size: 24px; text-align: center; font-family: monospace; letter-spacing: 3px; background-color: #ffedd5; padding: 10px; border-radius: 3px;">${cancellationCode}</p>
          <p style="font-size: 12px; color: #666; margin-top: 10px;">Guarda este código. Lo necesitarás si deseas cancelar tu reserva.</p>
        </div>
        
        <p>Si necesitas cancelar tu reserva, puedes hacerlo desde el calendario en nuestra aplicación utilizando el código de cancelación proporcionado.</p>
        
        <p style="margin-top: 20px; font-size: 12px; color: #666; text-align: center;">Este es un correo automático, por favor no respondas a este mensaje.</p>
      </div>
    `

    // Verificar si estamos en producción (con API key de Resend configurada)
    if (process.env.RESEND_API_KEY) {
      try {
        // Enviar correo usando Resend
        const { data, error } = await resend.emails.send({
          from: process.env.EMAIL_FROM || "Reservas de Parrilla <reservas@tudominio.com>",
          to: email,
          subject: `Confirmación de Reserva: ${reservation.title}`,
          html: emailContent,
        })

        if (error) {
          console.error("Error al enviar correo con Resend:", error)
          return NextResponse.json(
            {
              success: false,
              message:
                "Error al enviar el correo, pero tu reserva ha sido creada. Por favor, guarda el código de cancelación.",
              error: error.message,
            },
            { status: 500 },
          )
        }

        console.log("Correo enviado exitosamente con Resend:", data)
        return NextResponse.json({
          success: true,
          message: "Correo enviado exitosamente",
          emailId: data?.id,
        })
      } catch (resendError: any) {
        console.error("Error al enviar correo con Resend:", resendError)
        return NextResponse.json(
          {
            success: false,
            message:
              "Error al enviar el correo, pero tu reserva ha sido creada. Por favor, guarda el código de cancelación.",
            error: resendError.message,
          },
          { status: 500 },
        )
      }
    } else {
      // En desarrollo, simular el envío
      console.log("Simulando envío de correo en desarrollo:")
      console.log("Para:", email)
      console.log("Asunto:", `Confirmación de Reserva: ${reservation.title}`)
      console.log("Código de cancelación:", cancellationCode)
      console.log("Contenido HTML:", emailContent.substring(0, 100) + "...")

      return NextResponse.json({
        success: true,
        message: "En desarrollo: El correo se simula. En producción, se enviará un correo real.",
        development: true,
      })
    }
  } catch (error: any) {
    console.error("Error al procesar la solicitud de correo:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
