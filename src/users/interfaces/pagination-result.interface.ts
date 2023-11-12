import { User } from '../schemas/user.schema';

export interface PaginationResult {
  data: User[];
  page: number;
  limit: number;
  previousPage?: number;
  nextPage?: number;
}
