export interface Attendance {
  id: number;
  clock_in: Date;
  clock_out?: Date | null;
  photo_url?: string;
}
