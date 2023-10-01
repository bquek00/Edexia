import { useRef, useEffect } from 'react';


export default function UploadCard({title, onUpload, loading}) {
    const inputFileRef = useRef(null);

    useEffect(() => {
        // Reset the input value every time the component re-renders
        if (inputFileRef.current) {
            inputFileRef.current.value = '';
        }
    }, []);

    return (


        <div className={`${loading ? "hidden": "block"} h-full flex flex-col justify-center items-center w-4/12 border-2 rounded-lg w-fit px-10 gap-x-80`}>
            <p className="text-center">{title}</p>

            <input className="w-56"
                ref={inputFileRef}
                type="file"
                name="file"
                onChange={onUpload}
            />

        </div>

    )
}
    