export default function BasicCard({ title, text, left, image, children}) {
 

    return (
    
        <div className="w-11/12 lg:w-3/6 flex justify-center items-center bg-gray-100 w-3/6 rounded-2xl">
            <div className="w-4/5 py-10">
                <h2 className="mb-4 text-4xl font-semibold">{title}</h2>
                <p>{text}</p>
                {children}
            </div>
        </div>
    )
}
    