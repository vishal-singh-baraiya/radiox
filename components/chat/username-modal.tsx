"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"

interface UsernameModalProps {
  isOpen: boolean
  onClose: () => void
  onUsernameSet: (username: string) => void
  activeUsers: Record<string, string>
}

export function UsernameModal({ isOpen, onClose, onUsernameSet, activeUsers }: UsernameModalProps) {
  const [username, setUsername] = useState("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) {
      setError(null)
      setUsername("")
    }
  }, [isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const trimmedUsername = username.trim()

    if (!trimmedUsername) {
      setError("Username cannot be empty")
      return
    }

    if (trimmedUsername.length < 3) {
      setError("Username must be at least 3 characters")
      return
    }

    if (trimmedUsername.length > 15) {
      setError("Username must be less than 15 characters")
      return
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(trimmedUsername)) {
      setError("Username can only contain letters, numbers, underscores and hyphens")
      return
    }

    // Check if username is already taken
    if (Object.keys(activeUsers).includes(trimmedUsername)) {
      setError("Username is already taken")
      return
    }

    onUsernameSet(trimmedUsername)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="glass-card border-slate-800/50 sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Choose a username</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                autoComplete="off"
                className="glass-input"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value)
                  setError(null)
                }}
                placeholder="Enter a unique username"
                autoFocus
              />
              {error && (
                <div className="flex items-center gap-2 text-red-400 text-sm mt-1">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-emerald-500 hover:bg-emerald-600">
              Join Chat
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
