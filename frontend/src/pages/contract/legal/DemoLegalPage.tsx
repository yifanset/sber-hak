import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import classes from '../Benefit.module.css';

const DemoLegalPage = () => {
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
                }),
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
            navigate('/demo');
        }
    };

    return (
        <div className={classes.page}>
            <div className={classes.container}>
                <h1 className={classes.title}>Договор для юридических лиц</h1>

                {error && <div className={classes.error}>{error}</div>}

                <div className={classes.sections}>
                    <div className={classes.section}>
                        <h2 className={classes.sectionTitle}>Подключение за 1 день</h2>
                        <p className={classes.sectionText}>
                            Сотрудники сразу получат карты<br/> и доступ к сервисам
                        </p>
                    </div>

                    <div className={classes.section}>
                        <h2 className={classes.sectionTitle}>Интеграция с CRM</h2>
                        <p className={classes.sectionText}>
                            Запустив ведомости и налоговые отчеты будут формироваться автоматически.
                        </p>
                    </div>
                </div>

                <div className={classes.sectionRules}>
                    <h2 className={classes.sectionTitle}>Выгодные условия</h2>
                    <p className={classes.sectionText}>
                        Автоматически перечисляйте выплаты сотрудникам <br/>любых объёмов с заниженной комиссией
                    </p>
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

export default DemoLegalPage;