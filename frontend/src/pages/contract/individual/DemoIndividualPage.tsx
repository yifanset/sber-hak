import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import classes from '../Benefit.module.css';

const DemoIndividualPage = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSignContract = async () => {
        setIsLoading(true);
        setError('');

        try {
            const userId = localStorage.getItem('userId');
            const token = localStorage.getItem('token');

            if (!userId || !token) {
                setError('Пользователь не авторизован');
                setIsLoading(false);
                return;
            }

            const response = await fetch('http://localhost:3000/api/users/contract/sign', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: parseInt(userId)
                })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                console.log('Договор успешно подписан:', data);
                navigate('/demo');
            } else {
                setError(data.message || 'Ошибка при подписании договора');
            }
        } catch (err) {
            setError('Не удалось подключиться к серверу');
            console.error('Ошибка:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={classes.page}>
            <div className={classes.container}>
                <h1 className={classes.title}>Договор для физических лиц</h1>

                {error && <div className={classes.error}>{error}</div>}

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
                    onClick={handleSignContract}
                    disabled={isLoading}
                >
                    {isLoading ? 'Оформление...' : 'Оформить договор'}
                </button>
            </div>
        </div>
    );
};

export default DemoIndividualPage;