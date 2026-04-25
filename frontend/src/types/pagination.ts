export interface Page<T> {
  items: T[];
  total: number;
  skip: number;
  limit: number;
  has_next: boolean;
}
