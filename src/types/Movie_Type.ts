export interface IMovie {
  name: string;
  slug: string;
  original_name: string;
  poster_url: string;
  thumb_url?: string;
  created: string;
  modified: string;
  description: string;
  total_episodes: number;
  current_episode: string;
  episodes: IServer[]; // ✅ Sử dụng kiểu `Server[]` thay vì `any`
  time?: string | null;
  quality: string;
  language: string;
  director?: string | null;
  casts?: string | null;
}

export interface Movie extends IMovie {
  category: Record<
    string,
    { group: { id: string; name: string }; list: ICategory[] }
  >;
}
export interface IEpisodeItem {
  slug: string;
  name: string;
  embed: string;
}

export interface IServer {
  server_name: string;
  items: IEpisodeItem[];
}

export interface ICategory {
  id: string;
  name: string;
}

// `MovieType` chỉ là alias cho `IMovie`
