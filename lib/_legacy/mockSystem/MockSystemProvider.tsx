'use client'

// =============================================================================
// MockSystemProvider — React context + mutation API for the Phase 9 mock data.
// =============================================================================
//
// State lives in a single provider mounted at the root layout so signup
// (outside /app/*) and the app shell share one instance. The `currentUser`
// is Amelia Park for the whole prototype — no auth.
//
// Each mutation: (1) updates the relevant slice immutably, (2) bumps the
// affected work item's `updatedAt`, (3) emits an appropriate ThreadEvent.
// React 18+ batches multiple set* calls inside one mutation automatically.
// =============================================================================

import { createContext, useContext, useState, type ReactNode } from 'react'
import {
  mockAutomations,
  mockDepartments,
  mockPatients,
  mockThreadEvents,
  mockUsers,
  mockWorkItems,
  mockWorkspace,
} from './mockData'
import { practiceTypeTemplates, templatesByType } from './templates'
import type {
  AutomationRule,
  Department,
  DepartmentTemplate,
  DepartmentType,
  Patient,
  PracticeType,
  ThreadEvent,
  User,
  WorkItem,
  Workspace,
} from './types'

// DistributiveOmit preserves discriminated union narrowing — built-in Omit
// would erase per-type payload typing across WorkItem/ThreadEvent members.
// `Omit<A|B, K>` collapses through `keyof (A|B)` (intersection of keys),
// dropping per-variant fields like `payload`. The `T extends unknown ?`
// conditional distributes the Omit over each union member instead.
type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never

export type AddThreadEventInput =
  DistributiveOmit<ThreadEvent, 'id' | 'timestamp'> & { timestamp?: string }

export type MockSystemContextValue = {
  workspace: Workspace
  currentUser: User
  users: User[]
  departments: Department[]
  workItems: WorkItem[]
  patients: Patient[]
  threadEvents: ThreadEvent[]
  automations: AutomationRule[]
  templates: Record<DepartmentType, DepartmentTemplate>

  // Mutations
  claimItem: (itemId: string) => void
  unclaimItem: (itemId: string) => void
  assignItem: (itemId: string, userId: string) => void
  advanceItem: (itemId: string, toStatus?: string) => void
  declineItem: (itemId: string, reason: string, notes?: string) => void
  updateItemStatus: (itemId: string, status: string) => void
  addThreadEvent: (event: AddThreadEventInput) => void
  addNote: (workItemId: string, body: string) => void
  setPracticeType: (type: PracticeType) => void
  resetDemoData: () => void
}

const MockSystemContext = createContext<MockSystemContextValue | null>(null)

const CURRENT_USER_ID = 'u-amelia'

const makeEventId = (): string =>
  `te-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

export function MockSystemProvider({ children }: { children: ReactNode }) {
  // Lazy initializers with structuredClone so the provider owns a fresh copy
  // of the mock data — direct mutation of state won't leak back into the
  // module-level exports, and `resetDemoData` can re-seed from them.
  const [workspace, setWorkspace] = useState<Workspace>(() => structuredClone(mockWorkspace))
  const [departments, setDepartments] = useState<Department[]>(() => structuredClone(mockDepartments))
  const [workItems, setWorkItems] = useState<WorkItem[]>(() => structuredClone(mockWorkItems))
  const [patients, setPatients] = useState<Patient[]>(() => structuredClone(mockPatients))
  const [threadEvents, setThreadEvents] = useState<ThreadEvent[]>(() => structuredClone(mockThreadEvents))
  const [automations, setAutomations] = useState<AutomationRule[]>(() => structuredClone(mockAutomations))

  // `users` and `templates` are read-only references to the source exports.
  // No FE-045 mutation writes to either; wrapping them in useState would just
  // burn a render slot. Promote to state when a future ticket adds user
  // editing (team management) or per-workspace template overrides (FE-072).
  const users: User[] = mockUsers
  const templates: Record<DepartmentType, DepartmentTemplate> = templatesByType
  const currentUser = users.find(u => u.id === CURRENT_USER_ID) as User

  const claimItem = (itemId: string) => {
    const nowIso = new Date().toISOString()
    const prev = workItems.find(i => i.id === itemId)
    const fromUserId = prev?.assignedTo ?? null
    setWorkItems(items => items.map(item =>
      item.id === itemId
        ? { ...item, assignedTo: currentUser.id, updatedAt: nowIso }
        : item,
    ))
    setThreadEvents(events => [...events, {
      id: makeEventId(),
      workItemId: itemId,
      type: 'assignment',
      actor: currentUser.id,
      timestamp: nowIso,
      payload: { fromUserId, toUserId: currentUser.id, reason: 'Self-claimed' },
    } as ThreadEvent])
  }

  const unclaimItem = (itemId: string) => {
    const nowIso = new Date().toISOString()
    const prev = workItems.find(i => i.id === itemId)
    const fromUserId = prev?.assignedTo ?? null
    setWorkItems(items => items.map(item =>
      item.id === itemId
        ? { ...item, assignedTo: null, updatedAt: nowIso }
        : item,
    ))
    setThreadEvents(events => [...events, {
      id: makeEventId(),
      workItemId: itemId,
      type: 'assignment',
      actor: currentUser.id,
      timestamp: nowIso,
      payload: { fromUserId, toUserId: null, reason: 'Unclaimed' },
    } as ThreadEvent])
  }

  const assignItem = (itemId: string, userId: string) => {
    const nowIso = new Date().toISOString()
    const prev = workItems.find(i => i.id === itemId)
    const fromUserId = prev?.assignedTo ?? null
    setWorkItems(items => items.map(item =>
      item.id === itemId
        ? { ...item, assignedTo: userId, updatedAt: nowIso }
        : item,
    ))
    setThreadEvents(events => [...events, {
      id: makeEventId(),
      workItemId: itemId,
      type: 'assignment',
      actor: currentUser.id,
      timestamp: nowIso,
      payload: { fromUserId, toUserId: userId, reason: null },
    } as ThreadEvent])
  }

  const advanceItem = (itemId: string, toStatus?: string) => {
    const item = workItems.find(i => i.id === itemId)
    if (!item) return
    const template = templatesByType[item.departmentType]
    let nextStatus: string
    if (toStatus !== undefined) {
      if (!template.statuses.includes(toStatus)) {
        console.warn(`[MockSystem] advanceItem(${itemId}): toStatus "${toStatus}" not in template.statuses`)
        return
      }
      nextStatus = toStatus
    } else {
      const idx = template.statuses.indexOf(item.status)
      // Already at last status, or current status isn't in the template
      // (e.g. terminal 'declined'). Treat both as no-op, but log so FE-054
      // kanban work doesn't have to debug silent failures.
      if (idx < 0 || idx >= template.statuses.length - 1) {
        console.warn(`[MockSystem] advanceItem(${itemId}): no advance possible (current status: ${item.status})`)
        return
      }
      nextStatus = template.statuses[idx + 1]
    }
    const fromStatus = item.status
    const nowIso = new Date().toISOString()
    setWorkItems(items => items.map(i =>
      i.id === itemId ? { ...i, status: nextStatus, updatedAt: nowIso } : i,
    ))
    setThreadEvents(events => [...events, {
      id: makeEventId(),
      workItemId: itemId,
      type: 'status_change',
      actor: currentUser.id,
      timestamp: nowIso,
      payload: { fromStatus, toStatus: nextStatus, transitionActions: [], notes: null },
    } as ThreadEvent])
  }

  const declineItem = (itemId: string, reason: string, notes?: string) => {
    const item = workItems.find(i => i.id === itemId)
    if (!item) return
    const template = templatesByType[item.departmentType]
    if (!template.supportsDecline) return
    const nowIso = new Date().toISOString()
    setWorkItems(items => items.map(i => {
      if (i.id !== itemId) return i
      // Boundary cast: only departments with supportsDecline=true reach here,
      // and ReferralMetadata is the only metadata variant that declares
      // declineReason/declineNotes. The spread is type-erased; cast the
      // rebuilt item back to WorkItem to re-narrow the discriminated union.
      return {
        ...i,
        status: 'declined',
        updatedAt: nowIso,
        metadata: { ...i.metadata, declineReason: reason, declineNotes: notes },
      } as WorkItem
    }))
    setThreadEvents(events => [...events, {
      id: makeEventId(),
      workItemId: itemId,
      type: 'decline',
      actor: currentUser.id,
      timestamp: nowIso,
      payload: { reason, notes: notes ?? null, courtesyFaxSent: false },
    } as ThreadEvent])
  }

  const updateItemStatus = (itemId: string, status: string) => {
    const item = workItems.find(i => i.id === itemId)
    if (!item) return
    const fromStatus = item.status
    const nowIso = new Date().toISOString()
    setWorkItems(items => items.map(i =>
      i.id === itemId ? { ...i, status, updatedAt: nowIso } : i,
    ))
    setThreadEvents(events => [...events, {
      id: makeEventId(),
      workItemId: itemId,
      type: 'status_change',
      actor: currentUser.id,
      timestamp: nowIso,
      payload: { fromStatus, toStatus: status, transitionActions: [], notes: null },
    } as ThreadEvent])
  }

  const addThreadEvent = (event: AddThreadEventInput) => {
    setThreadEvents(events => [...events, {
      ...event,
      id: makeEventId(),
      timestamp: event.timestamp ?? new Date().toISOString(),
    } as ThreadEvent])
  }

  const addNote = (workItemId: string, body: string) => {
    const nowIso = new Date().toISOString()
    setWorkItems(items => items.map(i =>
      i.id === workItemId ? { ...i, updatedAt: nowIso } : i,
    ))
    setThreadEvents(events => [...events, {
      id: makeEventId(),
      workItemId,
      type: 'note',
      actor: currentUser.id,
      timestamp: nowIso,
      payload: { bodyText: body, tags: [] },
    } as ThreadEvent])
  }

  const setPracticeType = (type: PracticeType) => {
    setWorkspace(ws => ({ ...ws, practiceType: type }))
    const enabledTypes = practiceTypeTemplates[type]
    setDepartments(depts => depts.map(d => ({ ...d, enabled: enabledTypes.includes(d.type) })))
  }

  const resetDemoData = () => {
    setWorkspace(structuredClone(mockWorkspace))
    setDepartments(structuredClone(mockDepartments))
    setWorkItems(structuredClone(mockWorkItems))
    setPatients(structuredClone(mockPatients))
    setThreadEvents(structuredClone(mockThreadEvents))
    setAutomations(structuredClone(mockAutomations))
  }

  const value: MockSystemContextValue = {
    workspace,
    currentUser,
    users,
    departments,
    workItems,
    patients,
    threadEvents,
    automations,
    templates,
    claimItem,
    unclaimItem,
    assignItem,
    advanceItem,
    declineItem,
    updateItemStatus,
    addThreadEvent,
    addNote,
    setPracticeType,
    resetDemoData,
  }

  return <MockSystemContext.Provider value={value}>{children}</MockSystemContext.Provider>
}

export function useMockSystem(): MockSystemContextValue {
  const ctx = useContext(MockSystemContext)
  if (!ctx) throw new Error('useMockSystem must be used within MockSystemProvider')
  return ctx
}
