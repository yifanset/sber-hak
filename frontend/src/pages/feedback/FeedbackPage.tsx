import { useNavigate } from 'react-router-dom';
import classes from './FeedbackPage.module.css';

const FeedbackPage = () => {
    const navigate = useNavigate();

    return (
        <div className={classes.page}>
            <div className={classes.content}>
                <h1 className={classes.title}>Обратная связь</h1>
                <p className={classes.subtitle}>Выберите тип обращения</p>

                <div className={classes.buttons}>
                    <button
                        className={classes.buttonTransfer}
                        onClick={() => navigate('/feedback/transfer')}
                    >
                        Опрос о переводе зарплаты в другой банк
                    </button>
                    <button
                        className={classes.buttonIdea}
                        onClick={() => navigate('/feedback/idea')}
                    >
                        Обратная связь по идее команды
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FeedbackPage;