"use client"

import { IconEye, IconEyeOff } from "@tabler/icons-react"
import { type ComponentProps, useState } from "react"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"

export function PasswordInput(props: ComponentProps<"input">) {
  const [showPassword, setShowPassword] = useState(false)
  const disabled = props.disabled

  function toggleInputType() {
    setShowPassword(state => !state)
  }

  return (
    <InputGroup>
      <InputGroupInput
        type={showPassword ? "text" : "password"}
        {...props}
        data-slot="input-group-control"
      />

      <InputGroupAddon align="inline-end">
        <InputGroupButton
          className="rounded-md"
          disabled={disabled}
          onClick={() => toggleInputType()}
          size="icon-xs"
          type="button"
          variant="ghost"
        >
          {showPassword ? <IconEye /> : <IconEyeOff />}
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  )
}
