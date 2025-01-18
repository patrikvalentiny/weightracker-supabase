interface WeeklyProgressCardProps {
    progress: number;
    hasLastWeekValue: boolean;
}

export const WeeklyProgressCard = ({ progress, hasLastWeekValue }: WeeklyProgressCardProps) => {
    return (
        <div className="card bg-base-200">
            <div className="card-body">
                <h2 className="card-title">Weekly Progress</h2>
                {hasLastWeekValue ? (
                    <>
                        <p className={`text-3xl font-bold ${progress <= 0 ? 'text-success' : 'text-error'}`}>
                            {progress > 0 ? '+' : ''}{progress} kg
                        </p>
                        <progress 
                            className={`progress ${progress <= 0 ? 'progress-success' : 'progress-error'}`} 
                            value={Math.abs(progress)} 
                            max={2}
                        ></progress>
                    </>
                ) : (
                    <p className="text-base-content/70">Not enough data yet</p>
                )}
            </div>
        </div>
    );
};
