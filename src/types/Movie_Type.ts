export type MovieType = {
  name: string;
  slug: string;
  original_name: string;
  thumb_url: string;
  poster_url: string;
  created: string; // ISO Date String
  modified: string; // ISO Date String
  description: string;
  total_episodes: number;
  current_episode: string;
  time: string | null;
  quality: string;
  language: string;
  director: string | null;
  casts: string | null;
};

export interface IMovie {
  name: string;
  slug: string;
  original_name: string;
  poster_url: string;
  created: string;
  modified: string;
  description: string;
  total_episodes: number;
  current_episode: string;
  time?: string | null;
  quality: string;
  language: string;
}
