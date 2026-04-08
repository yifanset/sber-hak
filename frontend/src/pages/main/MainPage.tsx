import { useNavigate } from 'react-router-dom';
import classes from './MainPage.module.css';

const MainPage = () => {
    const navigate = useNavigate();

    return (
        <div className={classes.page}>
            <div className={classes.content}>
                <h1 className={classes.title}>Добро пожаловать</h1>
                <div className={classes.buttons}>
                    <button
                        className={classes.buttonPrimary}
                        onClick={() => navigate('/feedback')}
                    >
                        Оставить обратную связь
                    </button>
                    <button
                        className={classes.buttonSecondary}
                        onClick={() => navigate('/demo')}
                    >
                        Демоверсия продукта
                    </button>
                    <button
                        className={classes.buttonTertiary}
                        onClick={() => navigate('/stats')}
                    >
                        Статистика
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MainPage;