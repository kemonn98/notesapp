import { useState, useRef, useEffect } from 'react'
import { Sun, Moon, Edit2, Trash2 } from 'lucide-react'

export default function Component() {
  const [notes, setNotes] = useState<string[]>([])
  const [currentNote, setCurrentNote] = useState('')
  const [isDarkTheme, setIsDarkTheme] = useState(false)
  const canvasRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (canvasRef.current && !canvasRef.current.contains(event.target as Node)) {
        setCurrentNote('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleNoteChange = (e: React.ChangeEvent<HTMLDivElement>) => {
    setCurrentNote(e.target.textContent || '')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (currentNote.trim()) {
        setNotes([currentNote.trim(), ...notes])
        setCurrentNote('')
        if (canvasRef.current) {
          canvasRef.current.textContent = ''
        }
      }
    }
  }

  const deleteNote = (index: number) => {
    const newNotes = notes.filter((_, i) => i !== index)
    setNotes(newNotes)
  }

  const editNote = (index: number) => {
    setCurrentNote(notes[index])
    deleteNote(index)
    if (canvasRef.current) {
      canvasRef.current.textContent = notes[index]
      canvasRef.current.focus()
    }
  }

  return (
    <div className={`min-h-screen p-8 transition-colors duration-200 ${isDarkTheme ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Notes App</h1>
          <button
            onClick={() => setIsDarkTheme(!isDarkTheme)}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            {isDarkTheme ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
          </button>
        </div>
        <div
          ref={canvasRef}
          className="min-h-[100px] mb-8 relative focus:outline-none"
          contentEditable
          onInput={handleNoteChange}
          onKeyDown={handleKeyDown}
          onClick={() => canvasRef.current?.focus()}
        />
        {notes.length === 0 && currentNote === '' && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            Type to add notes
          </div>
        )}
        <div className="space-y-4">
          {notes.map((note, index) => (
            <div
              key={index}
              className="border rounded-lg p-4 relative group"
            >
              <p className="break-words">{note}</p>
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  onClick={() => editNote(index)}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full mr-1 transition-colors duration-200"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteNote(index)}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors duration-200"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}