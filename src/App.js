import React, {useEffect, useState} from 'react';
import './App.css';
import Tmdb from './Tmdb';
import MovieRow from './components/MovieRow';
import FeaturedMovie from './components/FeaturedMovie';
import Header from './components/Header';

export default () => {

  const [movieList, setMovieList] = useState([]);
  const [featuredData, setFeaturedData] = useState(null);
  const [blackHeader, setBlackHeader] = useState(false);

  useEffect(() => {
    const loadAll = async () => {
      // Pegando a lista total
      let list = await Tmdb.getHomeList();
      setMovieList(list);

      // Pegando o Featured
      let originals = list.filter(i=>i.slug === 'originals');
      let randomChosen = Math.floor(Math.random() * (originals[0].items.results.length - 1));
      let chosen = originals[0].items.results[randomChosen];
      let chosenInfo = await Tmdb.getMovieInfo(chosen.id, 'tv');
      setFeaturedData(chosenInfo);
    }

    setTimeout(async () => {
      loadAll()
    }, 1000)
  }, [])

  useEffect(() => {
    const scrollListener = () => {
      if(window.scrollY > 10) {
        setBlackHeader(true)
      } else {
        setBlackHeader(false)
      }
    }

    window.addEventListener('scroll', scrollListener);

    return () => {
      window.removeEventListener('scroll', scrollListener);
    }
  }, [])

  return (
    <div className="page">

      <Header black={blackHeader}/>

      {featuredData &&
        <FeaturedMovie item={featuredData} />
      }
      <section className="lists">
        {movieList.map((item, key) => (
          console.log(item),
          <MovieRow key={key} title={item.title} items={item.items} />
        ))}
      </section>
      <footer>
        Feito com <span role="img" aria-label="coração">♥</span> por Carlos Ridolfi<br />
        Direitos de imagem para Netflix<br />
        Dados pegos do site Themoviedb.org
      </footer>
      {movieList.length <= 0 &&
        <div className="loading">
          <img src="https://media.wired.com/photos/592744d3f3e2356fd800bf00/master/w_2560%2Cc_limit/Netflix_LoadTime.gif" alt="Carregando"/>
        </div>
      }
    </div>
  )
}