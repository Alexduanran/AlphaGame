import React, {useState} from 'react';
import css from './Home.module.css';
import Genetic from './Genetic'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Pagination, Mousewheel, EffectCoverflow } from 'swiper';
import 'swiper/swiper.scss';
import 'swiper/components/navigation/navigation.scss';
import 'swiper/components/pagination/pagination.scss';
import 'swiper/components/scrollbar/scrollbar.scss';
import 'swiper/components/effect-coverflow/effect-coverflow.scss';
import snake_png from '../media/snake.png';
import pong_png from '../media/pong.png';
import flappybird_png from '../media/flappybird.png';
import home2_gif from '../media/home2_gif.gif';
import snake_gif from '../media/snake_gif.gif';
import pong_gif from '../media/pong_gif.gif';
import flappybird_gif from '../media/flappybird_gif.gif';

function Home(props) {
    const [background, setBackground] = useState(home2_gif);
    const [swipeIndex, setSwipeIndex] = useState(0);

    SwiperCore.use([EffectCoverflow, Pagination, Mousewheel]);

    function GameSwiper() {
        setBackground(home2_gif);
        return (
            <Swiper className={css.swiperContainer}
                    effect='coverflow'
                    spaceBetween={30}
                    slidesPerView={3}
                    dynamicBullets={true}
                    mousewheel={true}
                    pagination={{ clickable: true }}
                    centeredSlides={true}
                    loop={true}
                    initialSlide={swipeIndex}
                    >
                <SwiperSlide>
                    <Link to='/snake'>
                        <div className={css.square} style={{backgroundImage:`url(${snake_png})`}} />    
                    </Link>
                </SwiperSlide>
                <SwiperSlide>
                    <Link to='/pong'> 
                        <div className={css.square} style={{backgroundImage:`url(${pong_png})`}} />
                    </Link>
                </SwiperSlide>
                <SwiperSlide>
                    <Link to='/flappybird'>
                        <div className={css.square} style={{backgroundImage:`url(${flappybird_png})`}} />
                    </Link>
                </SwiperSlide>
            </Swiper>
        )
    }

    function GameModes(prop) {
        var image = null;
        if (prop.name === 'snake') {
            setBackground(snake_gif);
            setSwipeIndex(0);
            image = snake_png;
        }
        else if (prop.name === 'pong') {
            setBackground(pong_gif);
            setSwipeIndex(1);
            image = pong_png;
        }
        else if (prop.name === 'flappybird') {
            setBackground(flappybird_gif);
            setSwipeIndex(2);
            image = flappybird_png;
        }
        return (
            <div className={css.grid}>
                <div className={css.smallpic} style={{backgroundImage:`url(${image})`}} />
                <div className={css.smallsquare} onClick={()=>{console.log(process.env.PUBLIC_URL);props.history.push(process.env.PUBLIC_URL + '/' + prop.name + '/genetic')}} >
                    <h1 className={css.mode}>
                        Genetic
                        Algorithm
                    </h1>
                </div>
                <div className={css.smallsquare} onClick={()=>{props.history.push(process.env.PUBLIC_URL + '/' + prop.name + '/reinforcement')}} >
                    <h1 className={css.mode}>
                        Reinforce-
                        ment
                        Learning
                    </h1>
                </div>
                <div className={css.smallsquare} onClick={()=>{props.history.push(process.env.PUBLIC_URL + '/' + prop.name + '/battle')}} >
                    <h1 className={css.mode}>
                        Human
                        vs.
                        AI
                    </h1>
                </div>
            </div>
        )
    }

    return (
        <Router basename={process.env.PUBLIC_URL}>
            <div className={css.container}>
                <h1 className={css.name}>
                    <Link to='/' className={css.text}>
                        AlphaGame
                    </Link>
                </h1>
                <div className={css.background}>
                    <div className={css.screen} style={{backgroundImage:`url(${background})`}}>
                        <Switch>
                            <Route path='/snake' >
                                <GameModes name={'snake'} />
                            </Route>
                            <Route path='/pong'>
                                <GameModes name={'pong'} />
                            </Route>
                            <Route path='/flappybird'>
                                <GameModes name={'flappybird'} />
                            </Route>
                            <Route path='/'>
                                <GameSwiper className={css.swiper}/>
                            </Route>
                        </Switch>
                    </div>
                </div>
            </div>
            <footer className={css.footer}>
                Copyright © 2020 AlphaGame | 
                <a href='https://github.com/Alexduanran/AlphaGame' target='_blank' style={{textDecoration: 'none', color:'white'}}> Github</a>
            </footer>
        </Router>
    );
    }

export default Home;
