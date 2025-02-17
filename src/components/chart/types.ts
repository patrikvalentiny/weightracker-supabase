export interface ChartDataPoint {
    date: string;
    dateValue: number;
    weight: number;
    weekAvg?: number;
    bmi: string;
}

export interface BMIZone {
    bmi1: number;
    bmi2: number;
    fill: string;
    opacity: number;
    label: string;
}

export const BMI_ZONES: BMIZone[] = [
    { bmi1: 0, bmi2: 18.5, fill: "#90caf9", opacity: 0.2, label: "Underweight" },
    { bmi1: 18.5, bmi2: 24.9, fill: "#81c784", opacity: 0.2, label: "Normal" },
    { bmi1: 24.9, bmi2: 29.9, fill: "#fff176", opacity: 0.2, label: "Overweight" },
    { bmi1: 29.9, bmi2: 100, fill: "#ef9a9a", opacity: 0.2, label: "Obese" }
];
