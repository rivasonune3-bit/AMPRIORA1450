import { NextResponse } from 'next/server'
import COURSES from '../../../data/courses'

export async function GET(req: Request){
  try{
    const { searchParams } = new URL(req.url)
    const q = (searchParams.get('q') || '').toLowerCase()
    let results = COURSES
    if(q) results = results.filter(c => (c.title + ' ' + c.provider + ' ' + (c.description||'')).toLowerCase().includes(q))
    return NextResponse.json({ data: results })
  }catch(err:any){
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 })
  }
}
