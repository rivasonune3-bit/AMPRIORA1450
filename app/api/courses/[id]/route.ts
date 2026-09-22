import { NextResponse } from 'next/server'
import COURSES from '../../../../data/courses'

export async function GET(req: Request, context: any){
  try{
    const params = await context.params
    const id = params?.id
    const course = COURSES.find((c:any) => c.id === id)
    if(!course) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ data: course })
  }catch(err:any){
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 })
  }
}
