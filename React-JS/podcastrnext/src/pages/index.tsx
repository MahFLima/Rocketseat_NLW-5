// SPA
// SSR
// SSG
import { GetStaticProps } from 'next';
import { Image } from 'next';
import { api } from "../sevices/api";

import {format, parseISO} from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { convertDurationToTimeString } from '../utils/convertDuration';

import styles from './home.module.scss';

//obj episodes(dados)
type Episode = {
  id: string;
  title: string;
  thumbnail: string;
  description: string;
  members: string;
  duration: number;
  durationAsString: string;
  url: string;
  publishet_at: string;
  // ...
}

//Props obj episodes(dados)
type HomeProps = {
  lastestEpisodes: Episode[];
  allEpisodes: Episode[];
}

//acesso a api de podcasts server.json
export default function Home({lastestEpisodes, allEpisodes}: HomeProps) {
  return (
    <div className={styles.homepage}> 
      <section className={styles.lastestEpisodes}>
        <h2>Ultimos lançamentos</h2>
        <ul>{lastestEpisodes.map(episode =>{
          return(
            <li key={episode.id}>
              <Image width={192} height={192} src={episode.thumbnail} alt={episode.title}/>
              <div className={styles.episodeDetails}>
                <a href="#">{episode.title}</a>
                <p>{episode.members}</p>
                <span>{episode.publishedAt}</span>
                <span>{episode.durationAsString}</span>
              </div>

              <button type="button">
                <img src="/play-green.svg"/>
              </button>
            </li> 
          )
        })}</ul>
      </section>
      <section className={styles.allEpisodes}></section>
     </div> 
  )
}

//chamada API
export const getStaticProps : GetStaticProps = async() => {
  const { data } = await api.get('episodes', {
    params: {
      _limit: 12,
      _sort: 'publishet_at',
      _order: 'desc'
    }
  })

  // formatação

  const episodes = data.map(episode => {
    return{
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBR}),
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
      description: episode.description,
      url: episode.file.url,
    }
  })

  const lastestEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length);

  return {
    props: {
      lastestEpisodes,
      allEpisodes
    },
    revalidate: 60 * 60 * 8
  }
}
