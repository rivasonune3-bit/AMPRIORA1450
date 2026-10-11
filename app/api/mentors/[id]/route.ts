import { NextResponse } from 'next/server'
import MENTORS from '../../../../data/mentors'

export async function GET(req: Request, context: any){
  try{
    const params = await context.params
    const id = params?.id
    const m = MENTORS.find((x:any)=> x.id === id)
    if(!m) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ data: m })
  }catch(err:any){
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 })
  }
}
