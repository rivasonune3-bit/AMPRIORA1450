import { NextResponse } from 'next/server'
import HACKATHONS from '../../../data/hackathons'

export async function GET(req: Request){
  try{
    const { searchParams } = new URL(req.url)
    const q = (searchParams.get('q') || '').toLowerCase()
    let results = HACKATHONS
    if(q) {
      results = results.filter(h => 
        (h.title + ' ' + h.organization + ' ' + (h.description || '')).toLowerCase().includes(q)
      )
    }
    return NextResponse.json({ data: results })
  }catch(err:any){
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 })
  }
}
