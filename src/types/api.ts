export interface ApiSuccess<T> {
  success: true;
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
}

export interface ApiFailure {
  success: false;
  statusCode: number;
  message: string;
  errors?: string[];
  timestamp?: string;
}
