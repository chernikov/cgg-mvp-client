import React, { useState, useEffect } from 'react'

interface LogEntry {
  timestamp: string
  level: 'info' | 'error' | 'warn' | 'success'
  message: string
  details?: unknown
}

export default function DebugLogger() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Зберігаємо оригінальні методи console
    const originalLog = console.log
    const originalError = console.error
    const originalWarn = console.warn

    // Перехоплюємо console методи
    console.log = (...args) => {
      originalLog(...args)
      addLog('info', args.join(' '), args)
    }

    console.error = (...args) => {
      originalError(...args)
      addLog('error', args.join(' '), args)
    }

    console.warn = (...args) => {
      originalWarn(...args)
      addLog('warn', args.join(' '), args)
    }

    // Відновлюємо оригінальні методи при демонтуванні
    return () => {
      console.log = originalLog
      console.error = originalError
      console.warn = originalWarn
    }
  }, [])

  const addLog = (level: LogEntry['level'], message: string, details?: unknown) => {
    const newLog: LogEntry = {
      timestamp: new Date().toLocaleTimeString(),
      level,
      message,
      details
    }

    setLogs(prev => {
      const updated = [newLog, ...prev]
      // Зберігаємо максимум 100 логів
      return updated.slice(0, 100)
    })
  }

  const clearLogs = () => {
    setLogs([])
  }

  const getLevelColor = (level: LogEntry['level']) => {
    switch (level) {
      case 'error': return 'text-red-600 bg-red-50 border-red-200'
      case 'warn': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'success': return 'text-green-600 bg-green-50 border-green-200'
      default: return 'text-blue-600 bg-blue-50 border-blue-200'
    }
  }

  const getLevelIcon = (level: LogEntry['level']) => {
    switch (level) {
      case 'error': return '❌'
      case 'warn': return '⚠️'
      case 'success': return '✅'
      default: return 'ℹ️'
    }
  }

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-700 z-50"
      >
        🐛 Debug Logs ({logs.length})
      </button>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 max-h-96 bg-white border border-gray-300 rounded-lg shadow-xl z-50">
      <div className="flex justify-between items-center p-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
        <h3 className="font-semibold text-gray-800">Debug Logs ({logs.length})</h3>
        <div className="flex gap-2">
          <button
            onClick={clearLogs}
            className="text-xs px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Clear
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="text-xs px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Hide
          </button>
        </div>
      </div>
      
      <div className="max-h-80 overflow-y-auto p-2">
        {logs.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No logs yet...</p>
        ) : (
          <div className="space-y-1">
            {logs.map((log, index) => (
              <div
                key={index}
                className={`p-2 rounded border text-xs ${getLevelColor(log.level)}`}
              >
                <div className="flex items-start gap-2">
                  <span>{getLevelIcon(log.level)}</span>
                  <div className="flex-1">                    <div className="font-mono text-xs text-gray-500">
                      {log.timestamp}
                    </div>
                    <div className="mt-1 break-words">
                      {log.message}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
