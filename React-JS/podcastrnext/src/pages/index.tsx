// SPA
// SSR
// SSG

import { useRouter } from "next/router";

import { GetStaticProps } from "next";
import { api } from "../services/api";

import Link from "next/link";

import { format, parseISO } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import { convertDurationToTimeString } from "../utils/convertDuration";

import styles from "./home.module.scss";

import Image from "next/image";

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
  published_at: string;
  // ...
};

//Props obj episodes(dados)
type HomeProps = {
  latestEpisodes: Episode[];
  allEpisodes: Episode[];
};

//acesso a api de podcasts server.json
export default function Home({ latestEpisodes, allEpisodes }: HomeProps) {
  return (
    <div className={styles.homepage}>
      <section className={styles.latestEpisodes}>
        <h2>Ultimos lançamentos</h2>
        <ul>
          {latestEpisodes.map((episode) => {
            return (
              <li key={episode.id}>
                {/* <img src={episode.thumbnail} alt={episode.title}/> */}
                <Image
                  layout="fixed"
                  width={300}
                  height={150}
                  src={episode.thumbnail}
                  alt={episode.title}
                />

                <div className={styles.episodeDetails}>
                  <Link href={`/episodes/${episode.id}`}>
                    <a>{episode.title}</a>
                  </Link>
                  <p>{episode.members}</p>
                  <span>{episode.published_at}</span>
                  <span>{episode.durationAsString}</span>
                </div>

                <button type="button">
                  <img src="/play-green.svg" />
                </button>
              </li>
            );
          })}
        </ul>
      </section>
      <section className={styles.allEpisodes}>
        <h2>todos episodios</h2>

        <table cellSpacing={0}>
          <thead>
            <tr>
              <th></th>
              <th>Podcast</th>
              <th>Integrantes</th>
              <th>Data</th>
              <th>Duração</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {allEpisodes.map((episode) => {
              return (
                <tr key={episode.id}>
                  <td>
                    <img
                      style={{ width: 100 }}
                      src={episode.thumbnail}
                      alt={episode.title}
                    />
                  </td>
                  <td>
                    <Link href={`/episodes/${episode.id}`}>
                      <a>{episode.title}</a>
                    </Link>
                  </td>
                  <td>{episode.members}</td>
                  <td style={{ width: 100 }}>{episode.published_at}</td>
                  <td>{episode.durationAsString}</td>
                  <td>
                    <button type="button">
                      <img src="/play-green.svg" alt="Tocar episodio"/>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
}

//chamada API
export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get("episodes", {
    //parametros da rota
    params: {
      _limit: 12,
      _sort: "published_at",
      _order: "desc",
    },
  });

  // formatação
  const episodes = data.map((episode) => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      published_at: format(parseISO(episode.published_at), "d MMM yy", {
        locale: ptBR,
      }),
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(
        Number(episode.file.duration)
      ),
      description: episode.description,
      url: episode.file.url,
    };
  });

  const latestEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length);

  return {
    props: {
      latestEpisodes,
      allEpisodes,
    },
    revalidate: 60 * 60 * 8,
  };
};
