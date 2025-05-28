"use client"

import { useState, useEffect, useRef } from "react"
import { Settings, Play, Pause, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import SettingsModal from "@/components/SettingsModal"

export default function PomodoroTimer() {
  // Timer states
  const [timeLeft, setTimeLeft] = useState(25 * 60) // Default 25 minutes in seconds
  const [isActive, setIsActive] = useState(false)
  const [sessionType, setSessionType] = useState("Work")
  const [completedSessions, setCompletedSessions] = useState(0)
  const [showSettings, setShowSettings] = useState(false)

  // Timer settings
  const [settings, setSettings] = useState({
    workTime: 25,
    shortBreakTime: 5,
    longBreakTime: 15,
    longBreakInterval: 4,
  })

  // Audio reference for notification sound
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio("/notification.mp3")
  }, [])

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1)
      }, 1000)
    } else if (isActive && timeLeft === 0) {
      // Play notification sound
      if (audioRef.current) {
        audioRef.current.play().catch((error) => console.error("Audio play failed:", error))
      }

      // Handle session completion
      if (sessionType === "Work") {
        const newCompletedSessions = completedSessions + 1
        setCompletedSessions(newCompletedSessions)

        // Determine next break type
        if (newCompletedSessions % settings.longBreakInterval === 0) {
          setSessionType("Long Break")
          setTimeLeft(settings.longBreakTime * 60)
        } else {
          setSessionType("Short Break")
          setTimeLeft(settings.shortBreakTime * 60)
        }
      } else {
        // After any break, go back to work
        setSessionType("Work")
        setTimeLeft(settings.workTime * 60)
      }
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, timeLeft, sessionType, completedSessions, settings])

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Timer controls
  const toggleTimer = () => {
    setIsActive(!isActive)
  }

  const resetTimer = () => {
    setIsActive(false)
    setSessionType("Work")
    setTimeLeft(settings.workTime * 60)
    setCompletedSessions(0)
  }

  // Update timer when settings change
  const updateSettings = (newSettings: typeof settings) => {
    setSettings(newSettings)

    // Update current timer based on session type
    if (sessionType === "Work") {
      setTimeLeft(newSettings.workTime * 60)
    } else if (sessionType === "Short Break") {
      setTimeLeft(newSettings.shortBreakTime * 60)
    } else {
      setTimeLeft(newSettings.longBreakTime * 60)
    }

    setShowSettings(false)
  }

  // Get background color based on session type
  const getBgColor = () => {
    switch (sessionType) {
      case "Work":
        return "bg-rose-50"
      case "Short Break":
        return "bg-emerald-50"
      case "Long Break":
        return "bg-sky-50"
      default:
        return "bg-white"
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <Card className={`w-full max-w-md shadow-lg ${getBgColor()}`}>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Pomodoro Timer</CardTitle>
          <div className="flex justify-between items-center mt-2">
            <Badge
              variant={sessionType === "Work" ? "destructive" : sessionType === "Short Break" ? "secondary" : "default"}
              className="text-sm"
            >
              {sessionType}
            </Badge>
            <Badge variant="outline" className="text-sm">
              Sessions: {completedSessions}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-7xl font-mono font-bold my-8">{formatTime(timeLeft)}</div>

            <div className="flex justify-center gap-4 mt-6">
              <Button
                onClick={toggleTimer}
                variant="default"
                size="lg"
                className={isActive ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}
              >
                {isActive ? <Pause className="mr-2" /> : <Play className="mr-2" />}
                {isActive ? "Pause" : "Start"}
              </Button>

              <Button onClick={resetTimer} variant="outline" size="lg">
                <RotateCcw className="mr-2" size={18} />
                Reset
              </Button>

              <Button onClick={() => setShowSettings(true)} variant="outline" size="lg">
                <Settings className="mr-2" size={18} />
                Settings
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        onSave={updateSettings}
      />

      {/* Hidden audio element for notification */}
      <audio src="/notification.mp3" ref={audioRef} />
    </main>
  )
}
