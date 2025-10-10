'use client'

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react'
import {
  NotificationContainer,
  NotificationProps,
  NotificationType,
} from '@/components/ui/Notification'

interface NotificationContextType {
  notify: (
    type: NotificationType,
    title: string,
    message?: string,
    duration?: number
  ) => void
  notifyError: (title: string, message?: string) => void
  notifySuccess: (title: string, message?: string) => void
  notifyInfo: (title: string, message?: string) => void
  removeNotification: (id: string) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationProps[]>([])

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }, [])

  const notify = useCallback(
    (
      type: NotificationType,
      title: string,
      message?: string,
      duration: number = 5000
    ) => {
      const id = crypto.randomUUID()
      const newNotification: NotificationProps = {
        id,
        type,
        title,
        message,
        duration,
        onClose: removeNotification,
      }

      setNotifications((prev) => [...prev, newNotification])
    },
    [removeNotification]
  )

  const notifyError = useCallback(
    (title: string, message?: string) => {
      notify('error', title, message)
    },
    [notify]
  )

  const notifySuccess = useCallback(
    (title: string, message?: string) => {
      notify('success', title, message)
    },
    [notify]
  )

  const notifyInfo = useCallback(
    (title: string, message?: string) => {
      notify('info', title, message)
    },
    [notify]
  )

  const value = {
    notify,
    notifyError,
    notifySuccess,
    notifyInfo,
    removeNotification,
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationContainer
        notifications={notifications}
        onClose={removeNotification}
      />
    </NotificationContext.Provider>
  )
}

export function useNotification() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider')
  }
  return context
}
