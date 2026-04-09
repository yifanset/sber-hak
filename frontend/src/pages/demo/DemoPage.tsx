import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import classes from './DemoPage.module.css';

interface UserData {
    balance: number;
    prestigeLevel: number;
    name?: string;
    accountNumber?: string;
}

const DemoPage = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState<UserData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userId = localStorage.getItem('userId');
                const token = localStorage.getItem('token');

                if (!userId || !token) {
                    setError('Пользователь не авторизован');
                    setIsLoading(false);
                    return;
                }

                const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Ошибка при получении данных');
                }

                const data = await response.json();
                setUserData(data);
            } catch (err) {
                setError('Не удалось загрузить данные пользователя');
                console.error('Ошибка:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const getProgressWidth = (level: number) => {
        return (level / 3) * 100;
    };

    if (isLoading) {
        return (
            <div className={classes.page}>
                <div className={classes.loading}>Загрузка...</div>
            </div>
        );
    }

    if (error || !userData) {
        return (
            <div className={classes.page}>
                <div className={classes.error}>
                    <p>{error || 'Данные не найдены'}</p>
                </div>
            </div>
        );
    }

    return (
        <div className={classes.page}>
            {/* Боковая панель */}
            <aside className={classes.sidebar}>
                <div className={classes.sidebarContent}>
                    <h2 className={classes.sidebarTitle}>Меню</h2>
                    <nav className={classes.sidebarNav}>
                        <button
                            className={classes.sidebarButton}
                            onClick={() => navigate('/demo/contract')}
                        >
                            Подписать зарплатный договор
                        </button>
                        <button
                            className={classes.sidebarButton}
                            onClick={() => navigate('/demo/bonus')}
                        >
                            Бонусы Спасибо
                        </button>
                    </nav>
                </div>
            </aside>

            {/* Основной контент */}
            <main className={classes.main}>
                <div className={classes.content}>
                    <h1 className={classes.title}>
                        {userData.name ? `Добро пожаловать, ${userData.name}!` : 'Демоверсия продукта'}
                    </h1>

                    {/* Карточка счета */}
                    <div className={classes.accountCard}>
                        <p className={classes.accountLabel}>Текущий счет</p>
                        <div className={classes.accountBalance}>
                            <span className={classes.balanceAmount}>{userData.balance || 0} ₽</span>
                        </div>
                        <div className={classes.accountFooter}>
              <span className={classes.accountNumber}>
                {userData.accountNumber || '•••• 4589'}
              </span>
                            <span className={classes.accountStatus}>Активен</span>
                        </div>
                    </div>

                    {/* Карточка престижности - показываем только если уровень > 0 */}
                    {userData.prestigeLevel > 0 && (
                        <div className={classes.prestigeCard}>
                            <div className={classes.prestigeHeader}>
                                <p className={classes.prestigeLabel}>Уровень клиента</p>
                                <p className={classes.prestigeLevel}>{userData.prestigeLevel}/3</p>
                            </div>
                            <div className={classes.progressBar}>
                                <div
                                    className={classes.progressFill}
                                    style={{ width: `${getProgressWidth(userData.prestigeLevel)}%` }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default DemoPage;