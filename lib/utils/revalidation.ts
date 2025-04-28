import { revalidatePath, revalidateTag } from "next/cache"

// Rutas principales de la aplicación
const MAIN_ROUTES = ["/", "/calendar", "/historial", "/reserve"]

// Tags para revalidación
export const RESERVATION_TAG = "reservations"

/**
 * Revalida todas las rutas principales de la aplicación
 */
export function revalidateAllRoutes() {
  // Revalidar por ruta
  MAIN_ROUTES.forEach((route) => {
    revalidatePath(route)
  })

  // Revalidar por tag
  revalidateTag(RESERVATION_TAG)
}
