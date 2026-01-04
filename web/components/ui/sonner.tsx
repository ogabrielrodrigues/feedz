"use client"

import {
  IconAlertTriangle,
  IconCircleCheck,
  IconInfoCircle,
  IconLoader,
  IconXboxX,
} from "@tabler/icons-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      className="toaster group"
      icons={{
        success: <IconCircleCheck className="size-4" />,
        info: <IconInfoCircle className="size-4" />,
        warning: <IconAlertTriangle className="size-4" />,
        error: <IconXboxX className="size-4" />,
        loading: <IconLoader className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--color-background)",
          "--normal-text": "var(--color-secondary)",
          "--normal-border": "var(--color-border)",
          "--border-radius": "0.625rem",
        } as React.CSSProperties
      }
      theme={theme as ToasterProps["theme"]}
      {...props}
    />
  )
}

export { Toaster }
