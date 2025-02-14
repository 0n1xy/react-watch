export interface IMovie {
  name: string;
  slug: string;
  original_name: string;
  poster_url: string;
  thumb_url?: string; // Không bắt buộc
  created: string; // ISO Date String
  modified: string; // ISO Date String
  description: string;
  total_episodes: number;
  current_episode: string;
  time?: string | null;
  quality: string;
  language: string;
  director?: string | null; // Không bắt buộc
  casts?: string | null; // Không bắt buộc
}

export type MovieType = IMovie; // `MovieType` chỉ là alias cho `IMovie`
