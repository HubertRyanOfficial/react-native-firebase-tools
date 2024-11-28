export interface PostType {
  id: string;
  audioId?: string;
  audioURL: string;
  createdAt: number;
  duration: number;
  extension: string;
  tags: string[];
  totalLoves: number;
  totalPlays: number;
  totalShared: 0;
  userId: string;
  username: string;
  profileURL: string;
}
