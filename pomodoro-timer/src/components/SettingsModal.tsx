"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  settings: {
    workTime: number
    shortBreakTime: number
    longBreakTime: number
    longBreakInterval: number
  }
  onSave: (settings: {
    workTime: number
    shortBreakTime: number
    longBreakTime: number
    longBreakInterval: number
  }) => void
}

export default function SettingsModal({ isOpen, onClose, settings, onSave }: SettingsModalProps) {
  const [formValues, setFormValues] = useState(settings)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormValues({
      ...formValues,
      [name]: Number.parseInt(value, 10) || 1, // Ensure we always have a valid number
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formValues)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Timer Settings</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="workTime" className="text-right">
                Work Time (min)
              </Label>
              <Input
                id="workTime"
                name="workTime"
                type="number"
                min="1"
                max="60"
                value={formValues.workTime}
                onChange={handleChange}
                className="col-span-2"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="shortBreakTime" className="text-right">
                Short Break (min)
              </Label>
              <Input
                id="shortBreakTime"
                name="shortBreakTime"
                type="number"
                min="1"
                max="30"
                value={formValues.shortBreakTime}
                onChange={handleChange}
                className="col-span-2"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="longBreakTime" className="text-right">
                Long Break (min)
              </Label>
              <Input
                id="longBreakTime"
                name="longBreakTime"
                type="number"
                min="1"
                max="60"
                value={formValues.longBreakTime}
                onChange={handleChange}
                className="col-span-2"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="longBreakInterval" className="text-right">
                Sessions before Long Break
              </Label>
              <Input
                id="longBreakInterval"
                name="longBreakInterval"
                type="number"
                min="1"
                max="10"
                value={formValues.longBreakInterval}
                onChange={handleChange}
                className="col-span-2"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
