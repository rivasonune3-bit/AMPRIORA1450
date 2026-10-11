import { NextResponse } from 'next/server'
import JOBS from '../../../../data/jobs'

export async function GET(req: Request, context: any){
  try{
    const params = await context.params
    const id = params?.id
    const job = JOBS.find((j: any) => j.id === id)
    if(!job) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ data: job })
  }catch(err:any){
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 })
  }
}
