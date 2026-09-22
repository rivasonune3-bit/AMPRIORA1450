import DashboardShell from '../components/DashboardShell'
import DashboardClientContent from './DashboardClientContent'

export const metadata = {
  title: 'AMPRIORA — Dashboard',
}

export default function Dashboard(){
  return (
    <DashboardShell>
      <DashboardClientContent />
    </DashboardShell>
  )
}
