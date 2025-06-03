"use client"

import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, X, AlertCircle, Info } from "lucide-react"
import { useEffect, useState } from "react"

export interface Toast {
  id: string
  type: "success" | "error" | "info" | "warning"
  title: string
  description?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

interface ToastNotificationProps {
  toast: Toast
  onRemove: (id: string) => void
}

const toastIcons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertCircle,
}

const toastColors = {
  success: {
    bg: "from-emerald-500 to-green-600",
    border: "border-emerald-200",
    text: "text-emerald-800",
    icon: "text-emerald-600",
  },
  error: {
    bg: "from-red-500 to-red-600",
    border: "border-red-200",
    text: "text-red-800",
    icon: "text-red-600",
  },
  info: {
    bg: "from-blue-500 to-blue-600",
    border: "border-blue-200",
    text: "text-blue-800",
    icon: "text-blue-600",
  },
  warning: {
    bg: "from-yellow-500 to-orange-600",
    border: "border-yellow-200",
    text: "text-yellow-800",
    icon: "text-yellow-600",
  },
}

export function ToastNotification({ toast, onRemove }: ToastNotificationProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [progress, setProgress] = useState(100)
  const Icon = toastIcons[toast.type]
  const colors = toastColors[toast.type]
  const duration = toast.duration || 4000

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev - 100 / (duration / 50)
        if (newProgress <= 0) {
          setIsVisible(false)
          setTimeout(() => onRemove(toast.id), 300)
          return 0
        }
        return newProgress
      })
    }, 50)

    return () => clearInterval(progressInterval)
  }, [duration, toast.id, onRemove])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => onRemove(toast.id), 300)
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 300, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 300, scale: 0.8 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="relative"
        >
          <div
            className={`bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border ${colors.border} p-4 min-w-[320px] max-w-md overflow-hidden`}
          >
            {/* Progress bar */}
            <div className="absolute top-0 left-0 h-1 bg-gray-200 w-full">
              <motion.div
                className={`h-full bg-gradient-to-r ${colors.bg}`}
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.05 }}
              />
            </div>

            <div className="flex items-start space-x-3">
              {/* Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", damping: 15 }}
                className={`flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r ${colors.bg} flex items-center justify-center shadow-lg`}
              >
                <Icon className="w-5 h-5 text-white" />
              </motion.div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <motion.h4
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className={`text-sm font-semibold ${colors.text}`}
                >
                  {toast.title}
                </motion.h4>
                {toast.description && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-sm text-gray-600 mt-1"
                  >
                    {toast.description}
                  </motion.p>
                )}
                {toast.action && (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    onClick={toast.action.onClick}
                    className={`text-sm font-medium ${colors.icon} hover:underline mt-2`}
                  >
                    {toast.action.label}
                  </motion.button>
                )}
              </div>

              {/* Close button */}
              <motion.button
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                onClick={handleClose}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
