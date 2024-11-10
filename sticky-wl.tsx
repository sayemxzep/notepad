'use client'

import * as React from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { Menu, Plus, Search, Settings, LogOut, X, Trash2, Edit, Archive, Sun, Moon, FileText, PenTool, Eye, HelpCircle, Image as ImageIcon, Lock, Unlock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

type Note = {
  id: string
  title: string
  content: string[]
  color: 'yellow' | 'blue' | 'pink' | 'orange'
  tags: string[]
  archived: boolean
  image?: string
}

export default function Component() {
  const [notes, setNotes] = React.useState<Note[]>(() => {
    const savedNotes = typeof window !== 'undefined' ? localStorage.getItem('sticky-notes') : null
    return savedNotes ? JSON.parse(savedNotes) : [
      {
        id: '1',
        title: 'Social Media',
        content: [
          'Plan social content',
          'Build content calendar',
          'Plan promotion and distribution'
        ],
        color: 'yellow',
        tags: ['marketing', 'social'],
        archived: false
      },
      {
        id: '2',
        title: 'Content Strategy',
        content: [
          'Would need time to get insights (goals, personas, budget, audits)',
          'Set up the 3 month growth framework',
          'Plan with SEO specialist, then perhaps an email marketer?). Also need to brainstorm on hosting'
        ],
        color: 'blue',
        tags: ['marketing', 'content'],
        archived: false
      },
      {
        id: '3',
        title: 'Email A/B Tests',
        content: [
          'Subject lines',
          'CTAs',
          'Sending times'
        ],
        color: 'pink',
        tags: ['marketing', 'email'],
        archived: false
      },
      {
        id: '4',
        title: 'Banner Ads',
        content: [
          'Notes from the workshop',
          'Sizing matters',
          'Choose distinctive imagery',
          'The landing page must match the display ad'
        ],
        color: 'orange',
        tags: ['marketing', 'ads'],
        archived: false
      }
    ]
  })
  const [isAddingNote, setIsAddingNote] = React.useState(false)
  const [newNoteTitle, setNewNoteTitle] = React.useState('')
  const [newNoteContent, setNewNoteContent] = React.useState('')
  const [newNoteColor, setNewNoteColor] = React.useState<Note['color']>('yellow')
  const [newNoteTags, setNewNoteTags] = React.useState('')
  const [newNoteImage, setNewNoteImage] = React.useState<string | undefined>(undefined)
  const [searchTerm, setSearchTerm] = React.useState('')
  const [showArchived, setShowArchived] = React.useState(false)
  const [darkMode, setDarkMode] = React.useState(false)
  const [isLocked, setIsLocked] = React.useState(true)
  const [pin, setPin] = React.useState('')
  const [storedPin, setStoredPin] = React.useState(() => {
    return typeof window !== 'undefined' ? localStorage.getItem('sticky-notes-pin') : null
  })
  const [lockEnabled, setLockEnabled] = React.useState(() => {
    return typeof window !== 'undefined' ? localStorage.getItem('sticky-notes-lock-enabled') === 'true' : false
  })

  React.useEffect(() => {
    localStorage.setItem('sticky-notes', JSON.stringify(notes))
  }, [notes])

  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  React.useEffect(() => {
    localStorage.setItem('sticky-notes-lock-enabled', lockEnabled.toString())
  }, [lockEnabled])

  const filteredNotes = notes.filter(note => 
    (showArchived ? note.archived : !note.archived) &&
    (note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     note.content.some(item => item.toLowerCase().includes(searchTerm.toLowerCase())) ||
     note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
  )

  const onDragEnd = (result: any) => {
    if (!result.destination) return
    
    const items = Array.from(filteredNotes)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)
    
    setNotes(prevNotes => {
      const updatedNotes = prevNotes.map(note => {
        const matchingItem = items.find(item => item.id === note.id)
        return matchingItem || note
      })
      return updatedNotes
    })
  }

  const addNote = () => {
    if (newNoteTitle.trim() === '' || newNoteContent.trim() === '') return

    const newNote: Note = {
      id: Date.now().toString(),
      title: newNoteTitle,
      content: newNoteContent.split('\n').filter(line => line.trim() !== ''),
      color: newNoteColor,
      tags: newNoteTags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
      archived: false,
      image: newNoteImage
    }
    setNotes([...notes, newNote])
    setNewNoteTitle('')
    setNewNoteContent('')
    setNewNoteColor('yellow')
    setNewNoteTags('')
    setNewNoteImage(undefined)
    setIsAddingNote(false)
  }

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, ...updates } : note
    ))
  }

  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id))
  }

  const archiveNote = (id: string) => {
    updateNote(id, { archived: true })
  }

  const unarchiveNote = (id: string) => {
    updateNote(id, { archived: false })
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setNewNoteImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUnlock = () => {
    if (pin === storedPin) {
      setIsLocked(false)
      setPin('')
    } else {
      alert('Incorrect PIN')
    }
  }

  const handleLock = () => {
    setIsLocked(true)
    setPin('')
  }

  const handleSetPin = () => {
    if (pin.length === 4) {
      setStoredPin(pin)
      localStorage.setItem('sticky-notes-pin', pin)
      setPin('')
      alert('PIN set successfully')
    } else {
      alert('PIN must be 4 digits')
    }
  }

  if (isLocked && lockEnabled) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="w-full max-w-md p-8 space-y-4 bg-card rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-center text-foreground">Unlock Sticky Wall</h1>
          <Input
            type="password"
            placeholder="Enter PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            maxLength={4}
            className="text-center text-2xl"
          />
          <Button onClick={handleUnlock} className="w-full">Unlock</Button>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col h-screen bg-background text-foreground", darkMode ? "dark" : "")}>
      {/* Menu Bar */}
      <div className="flex items-center p-2 bg-secondary">
        <MenuBarItem title="File">
          <DropdownMenuItem onClick={() => setIsAddingNote(true)}>
            <FileText className="mr-2 h-4 w-4" />
            <span>New Note</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Exit</span>
          </DropdownMenuItem>
        </MenuBarItem>
        <MenuBarItem title="Edit">
          <DropdownMenuItem>
            <PenTool className="mr-2 h-4 w-4" />
            <span>Edit Note</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Delete Note</span>
          </DropdownMenuItem>
        </MenuBarItem>
        <MenuBarItem title="View">
          <DropdownMenuItem onClick={() => setShowArchived(!showArchived)}>
            <Eye className="mr-2 h-4 w-4" />
            <span>{showArchived ? 'Hide' : 'Show'} Archived</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
            <span>{darkMode ? 'Light' : 'Dark'} Mode</span>
          </DropdownMenuItem>
        </MenuBarItem>
        <MenuBarItem title="Help">
          <DropdownMenuItem>
            <HelpCircle className="mr-2 h-4 w-4" />
            <span>About</span>
          </DropdownMenuItem>
        </MenuBarItem>
        <div className="ml-auto">
          <Button variant="ghost" size="icon" onClick={handleLock}>
            <Lock className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SidebarContent
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              showArchived={showArchived}
              setShowArchived={setShowArchived}
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              lockEnabled={lockEnabled}
              setLockEnabled={setLockEnabled}
              pin={pin}
              setPin={setPin}
              handleSetPin={handleSetPin}
            />
          </SheetContent>
        </Sheet>

        <div className="hidden lg:flex w-64 flex-col bg-background border-r">
          <SidebarContent
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            showArchived={showArchived}
            setShowArchived={setShowArchived}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            lockEnabled={lockEnabled}
            setLockEnabled={setLockEnabled}
            pin={pin}
            setPin={setPin}
            handleSetPin={handleSetPin}
          />
        </div>

        {/* Notes Grid */}
        <div className="flex-1 p-6 overflow-auto">
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="notes" direction="horizontal">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                  {filteredNotes.map((note, index) => (
                    <Draggable key={note.id} draggableId={note.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <NoteCard
                            key={note.id}
                            note={note}
                            onUpdate={updateNote}
                            onDelete={deleteNote}
                            onArchive={archiveNote}
                            onUnarchive={unarchiveNote}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  <Dialog open={isAddingNote} onOpenChange={setIsAddingNote}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="h-[200px] flex flex-col gap-2"
                      >
                        <Plus className="h-6 w-6" />
                        Add Note
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Note</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <label htmlFor="title" className="text-right">
                            Title
                          </label>
                          <Input
                            id="title"
                            value={newNoteTitle}
                            onChange={(e) => setNewNoteTitle(e.target.value)}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <label htmlFor="content" className="text-right">
                            Content
                          </label>
                          <textarea
                            id="content"
                            value={newNoteContent}
                            onChange={(e) => setNewNoteContent(e.target.value.slice(0, 500))}
                            className="col-span-3 h-32 p-2 rounded border resize-none"
                            maxLength={500}
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <label htmlFor="color" className="text-right">
                            Color
                          </label>
                          <Select value={newNoteColor} onValueChange={(value: Note['color']) => setNewNoteColor(value)}>
                            <SelectTrigger className="col-span-3">
                              <SelectValue placeholder="Select a color" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="yellow">Yellow</SelectItem>
                              <SelectItem value="blue">Blue</SelectItem>
                              <SelectItem value="pink">Pink</SelectItem>
                              <SelectItem value="orange">Orange</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <label htmlFor="tags" className="text-right">
                            Tags
                          </label>
                          <Input
                            id="tags"
                            value={newNoteTags}
                            onChange={(e) => setNewNoteTags(e.target.value)}
                            placeholder="Comma-separated tags"
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <label htmlFor="image" className="text-right">
                            Image
                          </label>
                          <Input
                            id="image"
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="col-span-3"
                          />
                        </div>
                        {newNoteImage && (
                          <div className="col-span-4">
                            <img src={newNoteImage} alt="Uploaded" className="max-w-full h-auto" />
                          </div>
                        )}
                      </div>
                      <DialogFooter>
                        <Button onClick={addNote}>Add Note</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>
    </div>
  )
}

function MenuBarItem({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">{title}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function SidebarContent({
  searchTerm,
  setSearchTerm,
  showArchived,
  setShowArchived,
  darkMode,
  setDarkMode,
  lockEnabled,
  setLockEnabled,
  pin,
  setPin,
  handleSetPin
}: {
  searchTerm: string
  setSearchTerm: (term: string) => void
  showArchived: boolean
  setShowArchived: (show: boolean) => void
  darkMode: boolean
  setDarkMode: (mode: boolean) => void
  lockEnabled: boolean
  setLockEnabled: (enabled: boolean) => void
  pin: string
  setPin: (pin: string) => void
  handleSetPin: () => void
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h1 className="text-xl font-semibold mb-4">Sticky Wall</h1>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search"
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Tasks</h2>
          <div className="space-y-1">
            <Button variant="ghost" className="w-full justify-start">
              Upcoming
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              Today
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              Calendar
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              Sticky Wall
            </Button>
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Lists</h2>
          <div className="space-y-1">
            <Button variant="ghost" className="w-full justify-start">
              Personal
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              Work
            </Button>
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Tags</h2>
          <div className="space-y-1">
            <Button variant="ghost" className="w-full justify-start">
              Tag 1
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              Tag 2
            </Button>
          </div>
        </div>
      </div>
      <div className="border-t p-3">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="show-archived"
              checked={showArchived}
              onCheckedChange={setShowArchived}
            />
            <Label htmlFor="show-archived">Show Archived</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="dark-mode"
              checked={darkMode}
              onCheckedChange={setDarkMode}
            />
            <Label htmlFor="dark-mode">Dark Mode</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="lock-enabled"
              checked={lockEnabled}
              onCheckedChange={setLockEnabled}
            />
            <Label htmlFor="lock-enabled">Enable Lock Screen</Label>
          </div>
          {lockEnabled && (
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Set 4-digit PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                maxLength={4}
              />
              <Button onClick={handleSetPin} className="w-full">Set PIN</Button>
            </div>
          )}
          <Button variant="ghost" className="w-full justify-start">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </Button>
        </div>
      </div>
    </div>
  )
}

function NoteCard({ 
  note, 
  onUpdate,
  onDelete,
  onArchive,
  onUnarchive
}: { 
  note: Note
  onUpdate: (id: string, updates: Partial<Note>) => void
  onDelete: (id: string) => void
  onArchive: (id: string) => void
  onUnarchive: (id: string) => void
}) {
  const bgColors = {
    yellow: 'bg-yellow-100 dark:bg-yellow-900',
    blue: 'bg-blue-100 dark:bg-blue-900',
    pink: 'bg-pink-100 dark:bg-pink-900',
    orange: 'bg-orange-100 dark:bg-orange-900'
  }

  const [isEditing, setIsEditing] = React.useState(false)
  const [editedTitle, setEditedTitle] = React.useState(note.title)
  const [editedContent, setEditedContent] = React.useState(note.content ? note.content.join('\n') : '')
  const [editedTags, setEditedTags] = React.useState(note.tags ? note.tags.join(', ') : '')
  const [editedColor, setEditedColor] = React.useState<Note['color']>(note.color)
  const [editedImage, setEditedImage] = React.useState<string | undefined>(note.image)

  const handleSave = () => {
    onUpdate(note.id, {
      title: editedTitle,
      content: editedContent.split('\n').filter(line => line.trim() !== ''),
      tags: editedTags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
      color: editedColor,
      image: editedImage
    })
    setIsEditing(false)
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setEditedImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const wordCount = editedContent.trim().split(/\s+/).length

  return (
    <div
      className={cn(
        "p-4 rounded-lg shadow-md min-h-[200px] relative",
        bgColors[note.color]
      )}
    >
      {isEditing ? (
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Note</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="edit-title" className="text-right">
                  Title
                </label>
                <Input
                  id="edit-title"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="edit-content" className="text-right">
                  Content
                </label>
                <textarea
                  id="edit-content"
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value.slice(0, 500))}
                  className="col-span-3 h-32 p-2 rounded border resize-none"
                  maxLength={500}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="edit-tags" className="text-right">
                  Tags
                </label>
                <Input
                  id="edit-tags"
                  value={editedTags}
                  onChange={(e) => setEditedTags(e.target.value)}
                  placeholder="Comma-separated tags"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="edit-color" className="text-right">
                  Color
                </label>
                <Select value={editedColor} onValueChange={(value: Note['color']) => setEditedColor(value)}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a color" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yellow">Yellow</SelectItem>
                    <SelectItem value="blue">Blue</SelectItem>
                    <SelectItem value="pink">Pink</SelectItem>
                    <SelectItem value="orange">Orange</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="edit-image" className="text-right">
                  Image
                </label>
                <Input
                  id="edit-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="col-span-3"
                />
              </div>
              {editedImage && (
                <div className="col-span-4">
                  <img src={editedImage} alt="Uploaded" className="max-w-full h-auto" />
                </div>
              )}
              <div className="col-span-4 text-right text-sm text-muted-foreground">
                Word count: {wordCount}
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSave}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : (
        <>
          <h3 className="font-semibold mb-2">{note.title}</h3>
          <ul className="space-y-1">
            {note.content && note.content.map((item, index) => (
              <li key={index} className="text-sm">
                • {item}
              </li>
            ))}
          </ul>
          {note.image && (
            <img src={note.image} alt="Note" className="mt-2 max-w-full h-auto rounded" />
          )}
          <div className="mt-2 space-x-1">
            {note.tags && note.tags.map((tag, index) => (
              <Badge key={index} variant="secondary">{tag}</Badge>
            ))}
          </div>
          <div className="absolute top-2 right-2 flex space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditing(true)}
              className="h-8 w-8 p-0"
            >
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit note</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => note.archived ? onUnarchive(note.