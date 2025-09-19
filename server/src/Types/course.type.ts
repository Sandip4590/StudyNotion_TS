export interface ICourse {
  courseName: string;
  courseDescription: string;
  whatYouWillLearn: string;
  price: number;
  tag: string; 
  thumbnail?: string;
  instructor: string;
}