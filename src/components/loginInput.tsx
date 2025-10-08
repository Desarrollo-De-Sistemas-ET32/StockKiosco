import React from "react"

interface LoginInputProps{
    label: string,
    icon: React.ReactNode,
    type: string,
    id: string,
    placeholder: string
}


export default function LoginInput({label, icon, type, id, placeholder}: LoginInputProps) {
    return (
        <div>
            <label htmlFor="username" className="block mb-1 text-sm font-medium text-black dark:text-white">{label}</label>
            <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none bg-foreground p-1 rounded-4xl">
                    {icon}
                </div>
                <input
                    type={type}
                    id={id}
                    className="w-full h-[3rem] bg-var5 dark:bg-var1 pl-12 pr-10 py-2 outline-0 focus:outline-2 dark:focus:outline-foreground rounded-4xl text-var3 dark:text-var3"
                    placeholder={placeholder}
                />
            </div>
        </div>
    )
}