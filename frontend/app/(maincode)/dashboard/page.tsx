import { ModeToggle } from '@/components/Toggle'
import React from 'react'
import DashboardCard from './_components/DashboardCard'

function page() {
  return (
    <div className='w-full h-screen overflow-x-hidden'>
      <div className=' h-15 border rounded shadow flex items-center justify-between w-full sticky top-0 p-3 bg-card z-50'>
        <div className="left ">
          <h1 className='font-bold md:text-xl tracking-tighter'>Hamidi Real Time Face Attendance System</h1>
        </div>
        <div className="right">
          <main>
            <ModeToggle/>
          </main>
        </div>

      </div>

      <div className="carts">
        <DashboardCard/>
      </div>
      
   
    </div>
  )
}

export default page
