import { NextResponse } from 'next/server'
import MENTORS from '../../../data/mentors'

export async function GET(){
  try{
    return NextResponse.json({ data: MENTORS })
  }catch(err:any){
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 })
  }
}
