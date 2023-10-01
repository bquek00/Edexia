"use client";
import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react';




export default function NavBar() {
    const [mobNav, setMobNav] = useState(false);
    const genericHamburgerLine = `h-1 w-6 my-1 rounded-full bg-black transition ease transform duration-300`;

    const toggleMobNav = () => {
        mobNav ? setMobNav(false): setMobNav(true);
    }
   

    return (
       
<nav className=" dark:bg-gray-900 fixed z-20 top-0 left-0 text-white w-full">
  <div className="w-full flex flex-wrap items-center justify-between mx-auto py-4">
  <a href="/" className="flex items-center ml-4">
    <Image
        src="/logo.png"
        width={50}
        height={50}
        alt="logo"
        />
      <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Edexia</span>
  </a>
  <div className="flex mr-4">
  <button
        className="flex flex-col h-12 w-12 border-2 border-black rounded justify-center items-center group"
        onClick={() => toggleMobNav()}
    >
        <div
            className={`${genericHamburgerLine} ${
                mobNav
                    ? "rotate-45 translate-y-3 opacity-50 group-hover:opacity-100"
                    : "opacity-50 group-hover:opacity-100"
            }`}
        />
        <div className={`${genericHamburgerLine} ${mobNav ? "opacity-0" : "opacity-50 group-hover:opacity-100"}`} />
        <div
            className={`${genericHamburgerLine} ${
                mobNav
                    ? "-rotate-45 -translate-y-3 opacity-50 group-hover:opacity-100"
                    : "opacity-50 group-hover:opacity-100"
            }`}
        />
    </button>
  </div>
  <div className={`transition ease transform duration-300 ${mobNav ? 'opacity-100 ' : 'opacity-0 '} items-center justify-between w-full " id="navbar-sticky`}>
    <ul className="flex flex-col font-medium border rounded-lg bg-gray-800">
      <li>
        <Link href="#" className="block py-2 pl-3 pr-4 hover:bg-white/[.1] rounded " aria-current="page">Demo</Link>
      </li>
      <li>
        <Link href="#" className="block py-2 pl-3 pr-4  rounded  hover:bg-white/[.1] rounded">Workspace</Link>
      </li>
      <li>
        <Link href="#" className="block py-2 pl-3 pr-4 rounded   hover:bg-white/[.1] rounded">Contact</Link>
      </li>

    </ul>
  </div>
  </div>
</nav>


    )
}
    