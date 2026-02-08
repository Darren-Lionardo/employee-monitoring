export interface GeneralResponse<T = any> {
  success: boolean;
  message: string;
  data: T | null;
}
