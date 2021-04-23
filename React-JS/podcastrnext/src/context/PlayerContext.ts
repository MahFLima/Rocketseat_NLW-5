import { createContext } from 'react';

/*'formato dos dados'*/

type Episode = {
    title: string;
    members: string;
    thumbnail: string;
    duration: number;
    url: string;
}

type PlayerContextData = {
    episodeList: Episode[];
    currentEpisodeIndex: number;
    isPlaying: boolean;
    play: (episode: Episode) => void;
    setPlayingState: (episode: boolean) => void;
    togglePlay: () => void;
}

export const PlayerContext = createContext({} as PlayerContextData);