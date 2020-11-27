import css from './Home.module.css';
import Genetic from './Genetic'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Pagination, EffectCoverflow } from 'swiper';
import 'swiper/swiper.scss';
import 'swiper/components/navigation/navigation.scss';
import 'swiper/components/pagination/pagination.scss';
import 'swiper/components/scrollbar/scrollbar.scss';
import 'swiper/components/effect-coverflow/effect-coverflow.scss';

function Home(props) {

    SwiperCore.use([EffectCoverflow, Pagination]);

    function GameSwiper() {
        return (
            <Swiper effect='coverflow'
                    spaceBetween={30}
                    slidesPerView={3}
                    pagination={{ clickable: true }}
                    centeredSlides={true}
                    loop={true}
                    >
                <SwiperSlide>
                    <Link to='/snake'>
                        <div className={css.square}>
                            Snake
                        </div>
                    </Link>
                </SwiperSlide>
                <SwiperSlide>
                    <Link to='/pong'>
                        <div className={css.square}>
                            Pong
                        </div>
                    </Link>
                </SwiperSlide>
                <SwiperSlide>
                    <Link to='/flappybird'>
                        <div className={css.square}>
                            Flappy Bird
                        </div>
                    </Link>
                </SwiperSlide>
            </Swiper>
        )
    }

    function GameModes(prop) {
        return (
            <div className={css.grid}>
                <div className={css.smallsquare}>
                    {prop.name}
                </div>
                <div className={css.smallsquare} onClick={()=>{props.history.push('/' + prop.name + '/genetic')}} >
                    Genetic
                </div>
                <div className={css.smallsquare} onClick={()=>{props.history.push('/' + prop.name + '/reinforcement')}} >
                    Reinforcement Learning
                </div>
                <div className={css.smallsquare} onClick={()=>{props.history.push('/' + prop.name + '/battle')}} >
                    Battle
                </div>
            </div>
        )
    }

    return (
        <Router>
            <div className={css.container}>
                <h1 className={css.name}>
                    <Link to='/'>
                        AlphaGame
                    </Link>
                </h1>
                <div className={css.background}>
                    <div className={css.screen}>
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
        </Router>
    );
    }

export default Home;
