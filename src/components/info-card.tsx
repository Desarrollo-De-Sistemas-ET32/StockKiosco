export default function InfoCard({title, icon, data, percentage, description,}:
    {title: string, icon: React.ReactNode, data: number, percentage: number, description: string}) {
    return (
        <div className={`w-xs flex flex-col bg-light-60 dark:bg-dark-30 rounded-lg p-5 justify-between gap-5`}>
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