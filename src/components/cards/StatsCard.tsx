interface StatsCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    progress?: number;
    children?: React.ReactNode;
}

export const StatsCard = ({ title, value, subtitle, progress, children }: StatsCardProps) => {
    const isEmpty = value === 0;

    return (
        <div className="card bg-base-200">
            <div className="card-body">
                <div className="flex items-center gap-2">
                    <h2 className="card-title">{title}</h2>
                    {children}
                </div>
                {isEmpty ? (
                    <p className="text-3xl font-bold opacity-50">--</p>
                ) : (
                    <>
                        <p className="text-3xl font-bold">{value}</p>
                        {progress !== undefined && (
                            <progress className="progress progress-success" value={progress} max={100}></progress>
                        )}
                        {subtitle && <p className="text-sm opacity-80">{subtitle}</p>}
                    </>
                )}
            </div>
        </div>
    );
};
