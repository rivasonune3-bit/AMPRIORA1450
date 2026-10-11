import { NextResponse } from 'next/server'
import JOBS from '../../../data/jobs'

export async function GET(req: Request){
  try{
    const { searchParams } = new URL(req.url)
    const q = (searchParams.get('q') || '').toLowerCase()
    const location = (searchParams.get('location') || '').toLowerCase()
    const mode = (searchParams.get('mode') || '').toLowerCase()

    let results = JOBS
    if(q) results = results.filter(j => (j.title + ' ' + j.organization + ' ' + (j.description||'')).toLowerCase().includes(q))
    if(location) results = results.filter(j => (j.location||'').toLowerCase().includes(location))
    if(mode) results = results.filter(j => (j.mode||'').toLowerCase().includes(mode))

    return NextResponse.json({ data: results })
  }catch(err:any){
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 })
  }
}
