export type UrgencyLevel = 'overdue' | 'soon' | 'normal'
export type FaxType = 'Referral Rx' | 'Lab Results' | 'Insurance Card' | 'H&P' | 'Prior Auth' | 'Other'

export type IntakeFax = {
  id: string
  senderName: string
  senderFax: string
  receivedAt: string
  subject: string
  pages: number
  type: FaxType
  owner: { name: string; initials: string }
  status: 'unread' | 'in_review' | 'resolved' | 'waiting'
  slaLevel: UrgencyLevel
  slaDueLabel: string
  patientName: string | null
}

export const mockIntakeFaxes: IntakeFax[] = [
  {
    id: 'f1', senderName: "St. Mark's Hospital", senderFax: '(801) 555-0188',
    receivedAt: '9:14 AM', subject: 'Referral — Eleanor Vance',
    pages: 4, type: 'Referral Rx',
    owner: { name: 'Amelia Park', initials: 'AP' },
    status: 'unread', slaLevel: 'overdue', slaDueLabel: 'Overdue',
    patientName: 'Eleanor Vance',
  },
  {
    id: 'f2', senderName: 'Mercy Regional', senderFax: '(801) 555-0199',
    receivedAt: '8:47 AM', subject: 'Lab Results — Henry Tobias',
    pages: 2, type: 'Lab Results',
    owner: { name: 'Amelia Park', initials: 'AP' },
    status: 'in_review', slaLevel: 'soon', slaDueLabel: '1h 20m',
    patientName: 'Henry Tobias',
  },
  {
    id: 'f3', senderName: 'Foothill Clinic', senderFax: '(801) 555-0177',
    receivedAt: 'Yesterday', subject: 'Referral — Marcus Whitfield',
    pages: 6, type: 'Referral Rx',
    owner: { name: 'Amelia Park', initials: 'AP' },
    status: 'waiting', slaLevel: 'normal', slaDueLabel: '4h remaining',
    patientName: 'Marcus Whitfield',
  },
  {
    id: 'f4', senderName: 'Cascade IM', senderFax: '(801) 555-0166',
    receivedAt: 'Yesterday', subject: 'Prior Auth Request — Beatrice Lindgren',
    pages: 3, type: 'Prior Auth',
    owner: { name: 'Amelia Park', initials: 'AP' },
    status: 'resolved', slaLevel: 'normal', slaDueLabel: '',
    patientName: 'Beatrice Lindgren',
  },
  {
    id: 'f5', senderName: 'University Hospital', senderFax: '(801) 555-0155',
    receivedAt: 'Mon', subject: 'H&P — Rosalind Okafor',
    pages: 8, type: 'H&P',
    owner: { name: 'Amelia Park', initials: 'AP' },
    status: 'resolved', slaLevel: 'normal', slaDueLabel: '',
    patientName: 'Rosalind Okafor',
  },
]

export const mockActivityFeed = [
  { id: 'e1', icon: 'received',    label: 'Fax received from St. Mark\'s Hospital',  time: '9:14 AM' },
  { id: 'e2', icon: 'assigned',    label: 'Assigned to Amelia Park',                  time: '9:15 AM' },
  { id: 'e3', icon: 'viewed',      label: 'Opened by Amelia Park',                    time: '9:22 AM' },
  { id: 'e4', icon: 'template',    label: 'Acknowledgment fax sent',                  time: '9:23 AM' },
  { id: 'e5', icon: 'note',        label: 'Note: Referred to pipeline as new referral', time: '9:31 AM' },
]
