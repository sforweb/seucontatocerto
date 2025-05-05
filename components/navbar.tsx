"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ShieldCheck, Menu, X, ArrowRight } from "lucide-react"

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled ? "bg-white/95 backdrop-blur-md shadow-sm border-b" : "bg-transparent",
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-7 w-7 text-primary" />
          <Link href="/" className="text-xl font-semibold">
            <span className="gradient-text">Canal de Denúncias</span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden z-50 text-foreground p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary relative after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-[2px] after:bg-primary after:scale-x-0 after:origin-left after:transition-transform hover:after:scale-x-100",
              pathname === "/" && "text-primary after:scale-x-100",
            )}
          >
            Home
          </Link>
          <Link
            href="/consultar"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary relative after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-[2px] after:bg-primary after:scale-x-0 after:origin-left after:transition-transform hover:after:scale-x-100",
              pathname === "/consultar" && "text-primary after:scale-x-100",
            )}
          >
            Consultar Protocolo
          </Link>
          <Link
            href="/admin/login"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary relative after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-[2px] after:bg-primary after:scale-x-0 after:origin-left after:transition-transform hover:after:scale-x-100",
              pathname === "/admin/login" && "text-primary after:scale-x-100",
            )}
          >
            Área Administrativa
          </Link>
          <Link
            href="/denunciar"
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary text-white text-base font-medium px-6 py-2.5 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Registrar Denúncia
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </nav>

        {/* Mobile navigation */}
        <div
          className={cn(
            "fixed inset-0 bg-white/95 backdrop-blur-md flex flex-col items-center justify-center gap-8 transition-all duration-300 md:hidden",
            isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none",
          )}
        >
          <Link href="/" className="text-lg font-medium" onClick={() => setIsMenuOpen(false)}>
            Home
          </Link>
          <Link href="/consultar" className="text-lg font-medium" onClick={() => setIsMenuOpen(false)}>
            Consultar Protocolo
          </Link>
          <Link href="/admin/login" className="text-lg font-medium" onClick={() => setIsMenuOpen(false)}>
            Área Administrativa
          </Link>
          <Button asChild variant="gradient" className="mt-4 w-48" onClick={() => setIsMenuOpen(false)}>
            <Link href="/denunciar">Registrar Denúncia</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
