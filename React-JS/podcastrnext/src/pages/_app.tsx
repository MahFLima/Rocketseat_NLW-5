import "../styles/GlobalStyles.scss"
import { Header } from "../components/Header/index";
import { Player } from "../components/Player";
import styles from '../styles/app.module.scss';

function MyApp({ Component, pageProps }) {
  return(
    <div className={styles.wrapper}> 
      <main> 
        <Header/>
        <Component {...pageProps} />
      </main> 
      <Player/>
    </div>
  )
}

export default MyApp