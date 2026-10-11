import { NextResponse } from 'next/server'
import INTERNSHIPS from '../../../../data/internships'

export async function GET(req: Request, context: any){
  try{
    const params = await context.params
    const id = params?.id
    const internship = INTERNSHIPS.find((i: any) => i.id === id)
    if(!internship) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ data: internship })
  }catch(err:any){
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 })
  }
}
