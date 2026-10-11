"use client"

import supabase from '../../lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'

export default function LogoutButton(){
  const router = useRouter()
  async function logout(){
    await supabase.auth.signOut()
    router.push('/')
  }
  return (
    <button 
      onClick={logout} 
      title="Logout"
      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
    >
      <LogOut className="w-4 h-4" />
    </button>
  )
}
