import { useNavigate } from 'react-router-dom';
import classes from './MainPage.module.css';

const MainPage = () => {
    const navigate = useNavigate();

    return (
        <div className={classes.page}>
            <div className={classes.content}>
                <h1 className={classes.title}>Добро пожаловать!</h1>
                <div className={classes.buttons}>
                    <button
                        className={classes.button}
                        onClick={() => navigate('/demo')}
                    >
                        Демоверсия продукта
                    </button>
                    <button
                        className={classes.button}
                        onClick={() => navigate('/feedback')}
                    >
                        Оставить обратную связь
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MainPage;