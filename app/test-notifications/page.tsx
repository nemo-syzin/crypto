'use client'

import { useNotification } from '@/hooks/useNotification'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, CheckCircle2, Info } from 'lucide-react'

export default function TestNotificationsPage() {
  const { notifyError, notifySuccess, notifyInfo } = useNotification()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-2xl border-2 border-gray-200 dark:border-gray-700">
          <CardHeader className="bg-gradient-to-r from-[#001D8D] to-blue-600 text-white">
            <CardTitle className="text-3xl font-bold">
              Тестирование системы уведомлений
            </CardTitle>
            <p className="text-white/90 mt-2">
              Нажмите на кнопки ниже, чтобы увидеть различные типы уведомлений
            </p>
          </CardHeader>

          <CardContent className="p-8 space-y-8">
            {/* Error Notifications */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                Ошибки
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  onClick={() =>
                    notifyError(
                      'Ошибка подключения к чату',
                      'Время ожидания подключения истекло. Пожалуйста, попробуйте еще раз.'
                    )
                  }
                  variant="destructive"
                  className="w-full"
                >
                  Ошибка подключения
                </Button>

                <Button
                  onClick={() =>
                    notifyError(
                      'Ошибка отправки сообщения',
                      'Не удалось отправить сообщение в чат'
                    )
                  }
                  variant="destructive"
                  className="w-full"
                >
                  Ошибка отправки
                </Button>

                <Button
                  onClick={() =>
                    notifyError('Короткая ошибка')
                  }
                  variant="destructive"
                  className="w-full"
                >
                  Простая ошибка
                </Button>

                <Button
                  onClick={() =>
                    notifyError(
                      'Ошибка аутентификации',
                      'Ваша сессия истекла. Пожалуйста, войдите в систему снова.'
                    )
                  }
                  variant="destructive"
                  className="w-full"
                >
                  Ошибка авторизации
                </Button>
              </div>
            </div>

            {/* Success Notifications */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                Успешные действия
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  onClick={() =>
                    notifySuccess(
                      'Сообщение отправлено',
                      'Ваше сообщение успешно отправлено в службу поддержки'
                    )
                  }
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Сообщение отправлено
                </Button>

                <Button
                  onClick={() =>
                    notifySuccess(
                      'Чат подключен',
                      'Вы подключены к службе поддержки KenigSwap'
                    )
                  }
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Чат подключен
                </Button>

                <Button
                  onClick={() =>
                    notifySuccess('Операция выполнена')
                  }
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Простой успех
                </Button>

                <Button
                  onClick={() =>
                    notifySuccess(
                      'Данные сохранены',
                      'Все изменения успешно сохранены в базе данных'
                    )
                  }
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Данные сохранены
                </Button>
              </div>
            </div>

            {/* Info Notifications */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Info className="h-5 w-5 text-[#3B6DFF]" />
                Информационные
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  onClick={() =>
                    notifyInfo(
                      'Подключение установлено',
                      'Соединение с сервером установлено успешно'
                    )
                  }
                  className="w-full bg-[#3B6DFF] hover:bg-[#3B6DFF]/90"
                >
                  Подключение установлено
                </Button>

                <Button
                  onClick={() =>
                    notifyInfo(
                      'Новое обновление',
                      'Доступна новая версия приложения. Обновите страницу.'
                    )
                  }
                  className="w-full bg-[#3B6DFF] hover:bg-[#3B6DFF]/90"
                >
                  Новое обновление
                </Button>

                <Button
                  onClick={() =>
                    notifyInfo('Информация')
                  }
                  className="w-full bg-[#3B6DFF] hover:bg-[#3B6DFF]/90"
                >
                  Простое инфо
                </Button>

                <Button
                  onClick={() =>
                    notifyInfo(
                      'Оператор печатает',
                      'Оператор набирает ответ на ваше сообщение...'
                    )
                  }
                  className="w-full bg-[#3B6DFF] hover:bg-[#3B6DFF]/90"
                >
                  Оператор печатает
                </Button>
              </div>
            </div>

            {/* Multiple Notifications Test */}
            <div className="space-y-4 pt-4 border-t-2 border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Тесты
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  onClick={() => {
                    notifyInfo('Первое уведомление')
                    setTimeout(() => notifySuccess('Второе уведомление'), 500)
                    setTimeout(() => notifyError('Третье уведомление'), 1000)
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Показать несколько уведомлений
                </Button>

                <Button
                  onClick={() => {
                    for (let i = 1; i <= 5; i++) {
                      setTimeout(() => {
                        notifyInfo(
                          `Уведомление ${i}`,
                          `Это тестовое уведомление номер ${i}`
                        )
                      }, i * 300)
                    }
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Показать 5 уведомлений подряд
                </Button>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-6 mt-8">
              <h4 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
                Как использовать в коде:
              </h4>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`import { useNotification } from '@/hooks/useNotification';

function MyComponent() {
  const { notifyError, notifySuccess, notifyInfo } = useNotification();

  // Показать ошибку
  notifyError('Заголовок', 'Описание ошибки');

  // Показать успех
  notifySuccess('Заголовок', 'Описание успеха');

  // Показать информацию
  notifyInfo('Заголовок', 'Информация');
}`}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
