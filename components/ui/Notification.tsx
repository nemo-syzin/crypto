'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react'

export type NotificationType = 'error' | 'success' | 'info'

export interface NotificationProps {
  id: string
  type: NotificationType
  title: string
  message?: string
  duration?: number
  onClose: (id: string) => void
}

const notificationConfig = {
  error: {
    icon: AlertCircle,
    bgColor: 'bg-red-50 dark:bg-red-900/20',
    borderColor: 'border-red-200 dark:border-red-800',
    iconColor: 'text-red-600 dark:text-red-400',
    titleColor: 'text-red-900 dark:text-red-100',
    messageColor: 'text-red-700 dark:text-red-300',
    closeColor: 'text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200',
  },
  success: {
    icon: CheckCircle2,
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    borderColor: 'border-green-200 dark:border-green-800',
    iconColor: 'text-green-600 dark:text-green-400',
    titleColor: 'text-green-900 dark:text-green-100',
    messageColor: 'text-green-700 dark:text-green-300',
    closeColor: 'text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200',
  },
  info: {
    icon: Info,
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    borderColor: 'border-blue-200 dark:border-blue-800',
    iconColor: 'text-[#3B6DFF] dark:text-blue-400',
    titleColor: 'text-[#0A1630] dark:text-blue-100',
    messageColor: 'text-blue-700 dark:text-blue-300',
    closeColor: 'text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200',
  },
}

export function Notification({
  id,
  type,
  title,
  message,
  duration = 5000,
  onClose,
}: NotificationProps) {
  const config = notificationConfig[type]
  const Icon = config.icon

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id)
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [id, duration, onClose])

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`
        relative w-full max-w-sm overflow-hidden rounded-2xl border-2 shadow-2xl
        backdrop-blur-sm
        ${config.bgColor} ${config.borderColor}
      `}
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
      }}
    >
      {/* Прогресс бар */}
      {duration > 0 && (
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: duration / 1000, ease: 'linear' }}
          className={`absolute top-0 left-0 h-1 ${
            type === 'error'
              ? 'bg-red-500'
              : type === 'success'
              ? 'bg-green-500'
              : 'bg-[#3B6DFF]'
          }`}
        />
      )}

      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="flex-shrink-0 mt-0.5">
            <Icon className={`h-6 w-6 ${config.iconColor}`} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className={`text-sm font-semibold ${config.titleColor}`}>
              {title}
            </h3>
            {message && (
              <p className={`mt-1 text-sm ${config.messageColor}`}>
                {message}
              </p>
            )}
          </div>

          {/* Close Button */}
          <button
            onClick={() => onClose(id)}
            className={`
              flex-shrink-0 rounded-lg p-1 transition-colors duration-200
              ${config.closeColor}
              hover:bg-black/5 dark:hover:bg-white/5
            `}
            aria-label="Закрыть уведомление"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export interface NotificationContainerProps {
  notifications: NotificationProps[]
  onClose: (id: string) => void
}

export function NotificationContainer({
  notifications,
  onClose,
}: NotificationContainerProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence mode="popLayout">
        {notifications.map((notification) => (
          <div key={notification.id} className="pointer-events-auto">
            <Notification {...notification} onClose={onClose} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  )
}
