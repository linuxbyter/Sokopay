"use client"

import { ClerkProvider as ClerkProviderBase } from "@clerk/nextjs"
import { ReactNode } from "react"

interface ClerkProviderProps {
  children: ReactNode
}

export function ClerkProvider({ children }: ClerkProviderProps) {
  return (
    <ClerkProviderBase
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      appearance={{
        baseTheme: undefined,
        variables: {
          colorPrimary: "#4CAF50",
          colorBackground: "#0A0A0A",
          colorText: "#FAFAFA",
          colorInputBackground: "#111111",
          borderRadius: "0.625rem",
        },
        elements: {
          card: "bg-surface border border-border",
          formButtonPrimary: "bg-primary hover:bg-primary-hover text-primary-foreground",
          formFieldInput: "bg-input-bg border-border text-text-primary",
          headerTitle: "text-text-primary",
          headerSubtitle: "text-text-secondary",
        },
      }}
    >
      {children}
    </ClerkProviderBase>
  )
}
