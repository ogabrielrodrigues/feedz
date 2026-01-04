import Image from "next/image"
import Link from "next/link"
import Logo from "@/assets/logo.svg"
import { Separator } from "../ui/separator"

export function AuthLogo() {
  return (
    <Link
      className="self-center flex gap-4 items-center h-full outline-none focus:ring-[3px] ring-ring/30 rounded-md p-1"
      href="/"
      replace
    >
      <Image alt="Minerva Logo" className="w-28" src={Logo} />

      <Separator className="h-10! bg-secondary/40" orientation="vertical" />

      <strong className="text-[28px] text-secondary">
        feed<span className="text-primary">z</span>
      </strong>
    </Link>
  )
}
