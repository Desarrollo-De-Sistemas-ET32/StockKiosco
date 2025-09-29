export default function StatCard({title, icon, data, percentage, description, color}:
    {title: string, icon: React.ReactNode, data: string, percentage: number, description: string, color: string}) {
    return (
        <div className={`w-full h-full flex flex-col rounded-xl p-5 items-stretch justify-between gap-5 ` + color}>
            <div className="flex flex-row justify-between items-center">
                <p className="text-lg font-bold text-white">{title}</p>
                {icon}
            </div>
            <div className="flex flex-row justify-between items-center gap-5">
                <p className="text-4xl font-bold text-white">{data}</p>
                <p className="text-white">{description}</p>
            </div>
            <div className="flex flex-row items-center gap-5">
                <p className={percentage >= 18 ? "text-confirm" : "text-gray-200"}>{percentage + `%`}</p>
                <p className="text-white">desde ayer</p>
            </div>
        </div>
    )
}