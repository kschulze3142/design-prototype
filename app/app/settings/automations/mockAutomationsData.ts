export type TriggerType = 'fax_received' | 'fax_sent' | 'referral_status_change'

export type Condition = {
  id: string
  field: string
  operator: string
  value: string
}

export type Action = {
  id: string
  type: string
  config: Record<string, string>
}

export type Automation = {
  id: string
  name: string
  description: string
  triggerType: TriggerType
  isActive: boolean
  conditions: Condition[]
  actions: Action[]
  runCount: number
  lastRunAt: string | null
}

export const mockAutomations: Automation[] = [
  {
    id: 'a1',
    name: 'Auto-acknowledge new referrals',
    description: 'Sends a confirmation fax to the referring physician when a new referral is received.',
    triggerType: 'fax_received',
    isActive: true,
    conditions: [
      { id: 'c1', field: 'Fax type', operator: 'is', value: 'Referral' },
    ],
    actions: [
      { id: 'ac1', type: 'Send fax', config: { to: 'Referring physician', template: 'Acknowledgment' } },
      { id: 'ac2', type: 'Start SLA timer', config: { duration: '4 hours' } },
    ],
    runCount: 142,
    lastRunAt: '2 hours ago',
  },
  {
    id: 'a2',
    name: 'SLA breach alert',
    description: 'Notifies the assigned coordinator when a referral SLA is about to be breached.',
    triggerType: 'referral_status_change',
    isActive: true,
    conditions: [
      { id: 'c2', field: 'SLA status', operator: 'is', value: 'At risk' },
      { id: 'c3', field: 'Time remaining', operator: 'less than', value: '1 hour' },
    ],
    actions: [
      { id: 'ac3', type: 'Notify user', config: { recipient: 'Assigned coordinator', channel: 'Email' } },
    ],
    runCount: 18,
    lastRunAt: '1 day ago',
  },
  {
    id: 'a3',
    name: 'Accepted → send POC fax',
    description: 'Automatically sends plan of care to patient when referral is moved to Accepted.',
    triggerType: 'referral_status_change',
    isActive: false,
    conditions: [
      { id: 'c4', field: 'Referral status', operator: 'changes to', value: 'Accepted' },
    ],
    actions: [
      { id: 'ac4', type: 'Send fax', config: { to: 'Patient', template: 'Plan of Care' } },
      { id: 'ac5', type: 'Notify user', config: { recipient: 'Scheduler', channel: 'Email' } },
    ],
    runCount: 0,
    lastRunAt: null,
  },
]

export const TRIGGER_OPTIONS: { type: TriggerType; label: string; description: string; icon: string }[] = [
  { type: 'fax_received',           label: 'Fax received',            description: 'Fires when any inbound fax is received',           icon: '📥' },
  { type: 'fax_sent',               label: 'Fax sent',                description: 'Fires when an outbound fax is successfully sent',   icon: '📤' },
  { type: 'referral_status_change', label: 'Referral status change',  description: 'Fires when a referral moves to a new pipeline stage', icon: '🔄' },
]

export const FIELD_OPTIONS = [
  'Fax type', 'Fax number', 'Referring org', 'SLA status', 'Time remaining',
  'Referral status', 'Insurance', 'Assigned to',
]

export const OPERATOR_OPTIONS = ['is', 'is not', 'contains', 'changes to', 'less than', 'greater than']

export const ACTION_TYPE_OPTIONS = ['Send fax', 'Notify user', 'Start SLA timer', 'Add tag', 'Assign to']

export const generatePlainEnglish = (automation: Partial<Automation>): string => {
  const trigger = TRIGGER_OPTIONS.find(t => t.type === automation.triggerType)
  if (!trigger) return 'Define a trigger to preview this rule.'

  const conditionText = automation.conditions?.length
    ? 'when ' + automation.conditions.map(c => `${c.field} ${c.operator} "${c.value}"`).join(' AND ')
    : ''

  const actionText = automation.actions?.length
    ? automation.actions.map(a => {
        const configStr = Object.entries(a.config).map(([k, v]) => `${k}: "${v}"`).join(', ')
        return `${a.type} (${configStr})`
      }).join(', then ')
    : 'no actions defined'

  return `When a ${trigger.label} occurs${conditionText ? ' ' + conditionText : ''}, then ${actionText}.`
}
