import Link from "next/link"

export default function GetStarted({ title, text, redirect}) {
 

    return (
    
        <div className="text-white lg:w-2/5 text-center">
 
        <h2 className="mb-4 text-4xl font-semibold font-bold text-shadow-md">{title}</h2>
        <p className="mb-5 text-lg text-gray-100">{text}</p>
        <Link
        className="py-2 px-5 bg-violet-600 hover:bg-violet-700 shadow-md transition-all transform hover:scale-105 rounded-lg "
         href="/login">
            Get Started
         </Link>


        </div>
    )
}
    