import { useNavigate } from 'react-router-dom';
import classes from '../Benefit.module.css';

const DemoLegalPage = () => {
    const navigate = useNavigate();

    return (
        <div className={classes.page}>
            <div className={classes.container}>
                <h1 className={classes.title}>Договор для юридических лиц</h1>

                <div className={classes.sections}>
                    <div className={classes.section}>
                        <h2 className={classes.sectionTitle}>Подключение за 1 день</h2>
                        <p className={classes.sectionText}>
                            Сотрудники сразу получат карты<br/> и доступ к сервисам
                        </p>
                    </div>

                    <div className={classes.section}>
                        <h2 className={classes.sectionTitle}>Интеграция с 1С бесплатно</h2>
                        <p className={classes.sectionText}>
                            Запустив ведомости и налоговые отчеты будут формироваться автоматически.
                        </p>
                    </div>
                </div>

                <div className={classes.sectionRules}>
                    <h2 className={classes.sectionTitle}>Зарплата без комиссии</h2>
                    <p className={classes.sectionText}>
                        Автоматически перечисляйте выплаты сотрудникам <br/>любых объёмов без банковских сборов
                    </p>
                </div>

                <button
                    className={classes.submitButton}
                    onClick={() => navigate('/demo')}
                >
                    Оформить договор
                </button>
            </div>
        </div>
    );
};

export default DemoLegalPage;