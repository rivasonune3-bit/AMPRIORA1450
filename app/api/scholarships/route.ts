import { NextResponse } from 'next/server'

export async function GET(req: Request){
  try{
    const { searchParams } = new URL(req.url)
    const q = (searchParams.get('q') || '').toLowerCase()
    let results: any[] = [] // Empty for now (Phase 4: Remove Fake Data)
    if(q) {
      results = results.filter(h => 
        (h.title + ' ' + h.org + ' ' + (h.category || '')).toLowerCase().includes(q)
      )
    }
    return NextResponse.json({ data: results })
  }catch(err:any){
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 })
  }
}
