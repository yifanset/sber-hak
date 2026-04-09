import { useNavigate } from 'react-router-dom';
import classes from '../Benefit.module.css';

const DemoIndividualPage = () => {
    const navigate = useNavigate();

    return (
        <div className={classes.page}>
            <div className={classes.container}>
                <h1 className={classes.title}>Договор для физических лиц</h1>

                <div className={classes.sections}>
                    <div className={classes.section}>
                        <h2 className={classes.sectionTitle}>Копите «СберСпасибо»</h2>
                        <p className={classes.sectionText}>Тратите в партнёрах банка</p>
                    </div>

                    <div className={classes.section}>
                        <h2 className={classes.sectionTitle}>Копите сбережения</h2>
                        <p className={classes.sectionText}>
                            Чем выше баланс, тем больше <br/> точек для траты баллов
                        </p>
                </div>

                </div>

                <div className={classes.sectionRules}>
                    <h2 className={classes.sectionTitle}>Система уровней</h2>
                    <p className={classes.sectionText}>
                        Держите на счёте от 30% зарплаты в месяц и повышайте уровень
                    </p>

                    <div className={classes.levelsContainer}>
                        <div className={classes.levelCard}>
                            <div className={classes.levelHeader}>
                                <span className={classes.levelNumber}>1-й уровень</span>
                            </div>
                            <div className={classes.levelContent}>
                                <span className={classes.shopCount}>1 магазин</span>
                            </div>
                        </div>

                        <div className={classes.levelCard}>
                            <div className={classes.levelHeader}>
                                <span className={classes.levelNumber}>2-й уровень</span>
                            </div>
                            <div className={classes.levelContent}>
                                <span className={classes.shopCount}>2 магазина</span>
                            </div>
                        </div>

                        <div className={classes.levelCard}>
                            <div className={classes.levelHeader}>
                                <span className={classes.levelNumber}>3-й уровень</span>
                            </div>
                            <div className={classes.levelContent}>
                                <span className={classes.shopCount}>3 магазина</span>
                            </div>
                        </div>
                    </div>
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

export default DemoIndividualPage;