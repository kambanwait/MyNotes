export interface Note {
  id: number;
  userId: number;
  createdAt: string | Date
  updatedAt: string | Date
  text: string
}