import { ModeToggle } from '@/components/Toggle'
import React from 'react'
import DashboardCard from './_components/DashboardCard'
import Image from 'next/image'

function page() {
  return (
    <div className='w-full h-screen overflow-x-hidden'>
      <div className=' h-15 border rounded shadow flex items-center justify-between w-full sticky top-0 p-3 bg-card z-50'>
        <div className="left ">
          <Image src={'/Logo.svg'} alt='Logo' width={40} height={40}/>
        
        </div>
        <div className="middle">
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
