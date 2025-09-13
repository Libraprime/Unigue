import React from 'react'
import  ForgotPassword  from './forgot'
import Sidebar from '@/components/sidebar'

function page() {
  return (
    <div className='flex flex-col-reverse md:grid md:grid-cols-3 bg-amber-100'>
      <div className='grid-cols-1'>
        <Sidebar /> 
      </div>
      <div className='w-full col-span-2'>
        <ForgotPassword />
      </div>
    </div>
  )
}

export default page