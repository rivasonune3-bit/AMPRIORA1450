import { NextResponse } from 'next/server'
import INTERNSHIPS from '../../../data/internships'

export async function GET(req: Request){
  try{
    const { searchParams } = new URL(req.url)
    const q = (searchParams.get('q') || '').toLowerCase()
    const location = (searchParams.get('location') || '').toLowerCase()
    const mode = (searchParams.get('mode') || '').toLowerCase()

    let results = INTERNSHIPS
    if(q) results = results.filter(i => (i.title + ' ' + i.organization + ' ' + (i.description||'')).toLowerCase().includes(q))
    if(location) results = results.filter(i => (i.location||'').toLowerCase().includes(location))
    if(mode) results = results.filter(i => (i.mode||'').toLowerCase().includes(mode))

    return NextResponse.json({ data: results })
  }catch(err:any){
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 })
  }
}
