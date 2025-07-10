"use client"
import React from 'react'
import { GiHabitatDome } from "react-icons/gi";
import { IoLogIn } from "react-icons/io5";
import { FaGithub } from "react-icons/fa";

import { useTheme } from '@/components/ThemeProvider';
import { Moon, Sun } from 'lucide-react';
import Link from 'next/link';


const Navbar = () => {
   const { theme, toggleTheme } = useTheme();
  return (
    <nav className='flex justify-between items-center'>



<Link href="/"><div className='flex gap-2 mt-4 ml-2'>
<GiHabitatDome className=' size-9' />
<span className='text-black font-bold font-mono text-3xl'>Whabitr</span>
</div></Link>


<div className='flex gap-5  mr-5 mt-3'>
<FaGithub className='size-7 cursor-pointer hover:scale-110 transition-transform duration-200 ' />
<span className='text-black flex font-semibold text-xl cursor-pointer hover:scale-110 transition-transform duration-200'>
    <IoLogIn className='size-7' />
</span>
 <button
      onClick={toggleTheme}
      className="p-1 rounded-full bg-gray-200 dark:bg-black text-gray-800 dark:text-gray-200 transition"
      aria-label="Toggle Dark Mode"
    >
      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </button>
</div>



</nav>

  )
}

export default Navbar
