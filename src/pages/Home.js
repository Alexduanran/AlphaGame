import css from './Home.module.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function Home() {
  return (
    <div className={css.container}>
        <h1 className={css.name}>
            AlphaGame
        </h1>
        <div className={css.background}>
            some
        </div>
    </div>
  );
}

export default Home;
