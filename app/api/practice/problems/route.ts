import { NextResponse } from 'next/server'
import PROBLEMS from '../../../../data/problems'

export async function GET(req: Request){
  try{
    const { searchParams } = new URL(req.url)
    const q = (searchParams.get('q') || '').toLowerCase()
    let results = PROBLEMS
    if(q) results = results.filter(p => (p.title + ' ' + (p.prompt||'')).toLowerCase().includes(q))
    return NextResponse.json({ data: results })
  }catch(err:any){
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 })
  }
}
