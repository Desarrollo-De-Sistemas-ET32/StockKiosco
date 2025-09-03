export default function InfoCard({title, icon, data, percentage, description, color}:
    {title: string, icon: React.ReactNode, data: number, percentage: number, description: string, color: string}) {
    return (
        <div className={`w-[20rem] flex flex-col ${color} rounded-2xl p-5 items-stretch justify-between gap-5`}>
            <div className="flex flex-row justify-between items-center">
                <p className="text-lg font-bold">{title}</p>
                {icon}
            </div>
            <div className="flex flex-row justify-between items-center gap-5">
                <p className="text-4xl font-bold">{data}</p>
                <p>{description}</p>
            </div>
            <div className="flex flex-row items-center gap-5">
                <p className={percentage >= 50 ? "text-confirm" : "text-danger"}>{percentage + `%`}</p>
                <p>desde ayer</p>
            </div>
        </div>
    )
}