import Link from 'next/link'

export default function NextAction({action}:{action:{title:string,href:string,desc?:string}}){
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <h4 className="font-semibold text-slate-800">Next Best Action</h4>
      <div className="mt-3">
        <div className="font-medium">{action.title}</div>
        <div className="text-sm text-slate-500">{action.desc}</div>
        <div className="mt-3">
          <Link href={action.href} className="px-3 py-2 bg-sky-600 text-white rounded-md">Take action</Link>
        </div>
      </div>
    </div>
  )
}
