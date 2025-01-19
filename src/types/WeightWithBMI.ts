export interface WeightWithBMIModel  {
  id: number;
  weight: number;
  created_on: string;
  user_id: string;
  bmi?: number;
  bmi_category?: string;
  recommendations?: string;
  description?: string;
  difference?: number;
  one_week_average?: number;
}
