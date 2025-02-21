import { SessionProvider as NextSessionProvider } from "next-auth/react"
import React from "react"

export function SessionProvider({
  children,
  ...props
}: React.PropsWithChildren) {
  return <NextSessionProvider {...props}>{children}</NextSessionProvider>
}
