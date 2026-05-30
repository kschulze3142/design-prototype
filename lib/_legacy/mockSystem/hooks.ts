'use client'

// =============================================================================
// Read hooks for the mock system. Each hook wraps its derivation in useMemo
// keyed on the relevant state slice + arguments. 36 work items × 74 thread
// events is small enough that this is "enough" memoization — don't reach for
// reselect/Zustand-style memoization until the dataset grows.
// =============================================================================

import { useMemo } from 'react'
import { useMockSystem } from './MockSystemProvider'
import type {
  AutomationRule,
  Department,
  DepartmentTemplate,
  DepartmentType,
  Patient,
  ThreadEvent,
  User,
  WorkItem,
  Workspace,
} from './types'

export function useWorkspace(): Workspace {
  return useMockSystem().workspace
}

export function useCurrentUser(): User {
  return useMockSystem().currentUser
}

export function useUsers(): User[] {
  return useMockSystem().users
}

export function useUser(userId: string | null): User | null {
  const { users } = useMockSystem()
  return useMemo(() => {
    if (!userId) return null
    return users.find(u => u.id === userId) ?? null
  }, [users, userId])
}

export function useTemplate(type: DepartmentType): DepartmentTemplate {
  return useMockSystem().templates[type]
}

export function useDepartment(type: DepartmentType): Department | null {
  const { departments } = useMockSystem()
  return useMemo(() => departments.find(d => d.type === type) ?? null, [departments, type])
}

/** Returns only enabled departments. Use `useAllDepartments` for settings UIs. */
export function useDepartments(): Department[] {
  const { departments } = useMockSystem()
  return useMemo(() => departments.filter(d => d.enabled), [departments])
}

/** Returns every department instance, including disabled ones — for settings/toggle UIs. */
export function useAllDepartments(): Department[] {
  return useMockSystem().departments
}

export function useWorkItem(id: string): WorkItem | null {
  const { workItems } = useMockSystem()
  return useMemo(() => workItems.find(i => i.id === id) ?? null, [workItems, id])
}

export function useWorkItemsByDepartment(
  type: DepartmentType,
  filters?: { status?: string; assignedTo?: string | null; patientId?: string },
): WorkItem[] {
  const { workItems } = useMockSystem()
  const status = filters?.status
  const assignedTo = filters?.assignedTo
  const patientId = filters?.patientId
  return useMemo(() => {
    let result = workItems.filter(i => i.departmentType === type)
    if (status !== undefined) result = result.filter(i => i.status === status)
    if (assignedTo !== undefined) result = result.filter(i => i.assignedTo === assignedTo)
    if (patientId !== undefined) result = result.filter(i => i.patientId === patientId)
    return result
  }, [workItems, type, status, assignedTo, patientId])
}

export function useWorkItemsByPatient(patientId: string): WorkItem[] {
  const { workItems } = useMockSystem()
  return useMemo(() => workItems.filter(i => i.patientId === patientId), [workItems, patientId])
}

/**
 * Resolves an item's `linkedItems` array into the actual WorkItem records.
 * Defensively skips any linked id that doesn't resolve — link targets can
 * disappear during a demo reset or a future delete flow, and consumers
 * should render the items that exist rather than crash on a missing ref.
 */
export function useLinkedWorkItems(itemId: string): WorkItem[] {
  const { workItems } = useMockSystem()
  return useMemo(() => {
    const source = workItems.find(i => i.id === itemId)
    if (!source) return []
    return source.linkedItems
      .map(link => workItems.find(i => i.id === link.itemId))
      .filter((i): i is WorkItem => i !== undefined)
  }, [workItems, itemId])
}

export function usePatient(id: string): Patient | null {
  const { patients } = useMockSystem()
  return useMemo(() => patients.find(p => p.id === id) ?? null, [patients, id])
}

export function usePatients(): Patient[] {
  return useMockSystem().patients
}

/** Alias of `useWorkItemsByPatient`; kept as a named export for ergonomic reads inside patient pages. */
export function usePatientWorkItems(patientId: string): WorkItem[] {
  return useWorkItemsByPatient(patientId)
}

/**
 * Thread events for a single work item, sorted by `timestamp` ascending.
 * ISO 8601 timestamps sort lexicographically, so `localeCompare` on the
 * raw strings is sufficient — no Date construction per comparison.
 */
export function useThreadEvents(workItemId: string): ThreadEvent[] {
  const { threadEvents } = useMockSystem()
  return useMemo(
    () => threadEvents
      .filter(e => e.workItemId === workItemId)
      .sort((a, b) => a.timestamp.localeCompare(b.timestamp)),
    [threadEvents, workItemId],
  )
}

export function useAutomations(departmentType?: DepartmentType): AutomationRule[] {
  const { automations } = useMockSystem()
  return useMemo(() => {
    if (!departmentType) return automations
    return automations.filter(a => a.departmentType === departmentType)
  }, [automations, departmentType])
}
