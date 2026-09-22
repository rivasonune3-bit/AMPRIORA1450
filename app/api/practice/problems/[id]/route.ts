import { NextResponse } from 'next/server'
import PROBLEMS from '../../../../../data/problems'

export async function GET(req: Request, context: any){
  try{
    const params = await context.params
    const id = params?.id
    const problem = PROBLEMS.find((p:any) => p.id === id)
    if(!problem) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ data: problem })
  }catch(err:any){
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 })
  }
}
