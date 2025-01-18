interface CurrentWeightCardProps {
    weight?: number;
    date?: string;
}

export const CurrentWeightCard = ({ weight, date }: CurrentWeightCardProps) => {
    return (
        <div className="card bg-base-200 md:col-span-2">
            <div className="card-body">
                <h2 className="card-title text-2xl">Current Weight</h2>
                {weight && date ? (
                    <>
                        <p className="text-5xl font-bold">{weight.toFixed(1)} kg</p>
                        <p className="text-sm opacity-80">Last updated: {date}</p>
                    </>
                ) : (
                    <p className="text-xl opacity-70">No weight data recorded yet</p>
                )}
            </div>
        </div>
    );
};
