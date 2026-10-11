import React from 'react'

export default function Welcome({name}:{name:string}){
  return (
    <section className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">Welcome back, {name} 👋</h2>
          <p className="text-sm text-slate-500">Here's your personalized roadmap and next steps.</p>
        </div>
        <div className="text-sm text-slate-500">Last login: 2 days ago</div>
      </div>
    </section>
  )
}
