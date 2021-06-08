import Image from "next/image";
import { useContext, useRef,useEffect, useState } from "react";
import { PlayerContext, usePlayer } from "../../context/PlayerContext";
import styles from "./styles.module.scss";
import Head from "next/head";

import Slider from "rc-slider";
import 'rc-slider/assets/index.css';
import { convertDurationToTimeString } from "../../utils/convertDuration";

export function Player() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0);

  const { episodeList, currentEpisodeIndex, isPlaying, isLooping, isShuffling, togglePlay, toggleLoop, toggleShuffle, setPlayingState, playNext, playPrev, clearPlayerState, hasNext, hasPrevious } = usePlayer();

  useEffect(() => {
    if(!audioRef.current){
      return;
    }

    if(isPlaying){
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying])

  function setupProgressListener(){
    audioRef.current.currentTime = 0;

    audioRef.current.addEventListener('timeupdate', () => {
      setProgress(Math.floor(audioRef.current.currentTime));
    })
  }

  function handleSeek(amount: number){
    audioRef.current.currentTime = amount;
    setProgress(amount);
  }

  function handleEpisodeEnded(){
    if(hasNext){
      playNext()
    } else {
      clearPlayerState();
    }
  }

  const episode = episodeList[currentEpisodeIndex];

  return (
    <div className={styles.playerContainer}>
      <header>
        <img src="/playing.svg" />
        <strong>Tocando Agora</strong>
      </header>

      {episode ? (
        <div className={styles.currentEpisode}>
          <Image width={592} height={592} src={episode.thumbnail} objectFit="cover"/>
          <strong>{episode.title}</strong>
          <span>{episode.members}</span> 
        </div>
      ) : (
        <div className={styles.emptyPlayer}>
          <strong>Selecione um podcast para ouvir</strong>
        </div>
      )}

      <footer className={!episode ? styles.empty : ''}>
        <div className={styles.progress}>
          <span>{convertDurationToTimeString(progress)}</span>
          <div className={styles.slider}>
            { episode ? (
            <Slider 
              max={episode.duration}
              value={progress}
              onChange={handleSeek}
              trackStyle={{backgroundColor: '#04d361'}}
              railStyle={{backgroundColor: '#9f75ff'}}
              handleStyle={{borderColor: '#04d361', borderWidth: 4}}/> ) : 
              ( <div className={styles.emptySlider} />)}
          </div>
          <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
        </div>

        { episode && (<audio src={episode.url} ref={audioRef} onLoadedMetadata={setupProgressListener}
          autoPlay onEnded={handleEpisodeEnded} loop={isLooping} onPlay={() => setPlayingState(true)} onPause={() => setPlayingState(false)}/> )}

        <div className={styles.buttons}>
          <button type="button" onClick={toggleShuffle} className={isShuffling ? styles.isActive : ''} disabled={!episode || episodeList.length === 1}>
            <img src="/shuffle.svg" />
          </button>
          <button type="button" onClick={playPrev} disabled={!episode || !hasPrevious}>
            <img src="/play-previous.svg" />
          </button>
          <button type="button" className={styles.playButton} disabled={!episode} onClick={togglePlay}>
            { isPlaying ? <img src="/pause.svg"/> : <img src="/play.svg"/>}
          </button>
          <button type="button" onClick={playNext} disabled={!episode || !hasNext}>
            <img src="/play-next.svg" />
          </button>
          <button type="button" onClick={toggleLoop} className={isLooping ? styles.isActive : ''} disabled={!episode}>
            <img src="/repeat.svg"/>
          </button>
        </div>
      </footer>
    </div>
  );
}
