import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { AuthForm } from "@/components/auth/auth-form"
import { SiteHeader } from "@/components/layout/site-header"

export default async function AuthPage() {
  const supabase = createServerSupabaseClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader user={null} />
      <main className="flex-1 flex items-center justify-center p-4 md:p-8">
        <AuthForm />
      </main>
    </div>
  )
}
