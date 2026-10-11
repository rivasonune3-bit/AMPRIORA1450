import { NextResponse } from 'next/server'
import HACKATHONS from '../../../../data/hackathons'

export async function GET(req: Request, context: any){
  try{
    const params = await context.params
    const id = params?.id
    const hack = HACKATHONS.find((h: any) => h.id === id)
    if(!hack) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ data: hack })
  }catch(err:any){
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 })
  }
}
