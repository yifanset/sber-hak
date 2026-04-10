import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import classes from './DemoPage.module.css';

interface UserData {
    money: string;
    level: number;
    name?: string;
    bonus?: string;
    contract?: boolean;
}

const DemoPage = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState<UserData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isAddingMoney, setIsAddingMoney] = useState(false);
    const [isAddingBonus, setIsAddingBonus] = useState(false);
    const [isLevelingUp, setIsLevelingUp] = useState(false);

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
            setUserData(data.user);
        } catch (err) {
            setError('Не удалось загрузить данные пользователя');
            console.error('Ошибка:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const handleAddMoney = async () => {
        setIsAddingMoney(true);
        try {
            const userId = localStorage.getItem('userId');
            const token = localStorage.getItem('token');

            if (!userId || !token) {
                alert('Пользователь не авторизован');
                return;
            }

            const response = await fetch('http://localhost:3000/api/users/money/add', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: parseInt(userId),
                    amount: 10000
                })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                await fetchUserData();
                console.log('Деньги успешно добавлены');
            } else {
                alert(data.message || 'Ошибка при добавлении денег');
            }
        } catch (err) {
            console.error('Ошибка:', err);
            alert('Не удалось подключиться к серверу');
        } finally {
            setIsAddingMoney(false);
        }
    };

    const handleAddBonus = async () => {
        setIsAddingBonus(true);
        try {
            const userId = localStorage.getItem('userId');
            const token = localStorage.getItem('token');

            if (!userId || !token) {
                alert('Пользователь не авторизован');
                return;
            }

            const response = await fetch('http://localhost:3000/api/users/bonus/add', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: parseInt(userId),
                    amount: 10000
                })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                await fetchUserData();
                console.log('Бонусы успешно добавлены');
            } else {
                alert(data.message || 'Ошибка при добавлении бонусов');
            }
        } catch (err) {
            console.error('Ошибка:', err);
            alert('Не удалось подключиться к серверу');
        } finally {
            setIsAddingBonus(false);
        }
    };

    const handleLevelUp = async () => {
        setIsLevelingUp(true);
        try {
            const userId = localStorage.getItem('userId');
            const token = localStorage.getItem('token');

            if (!userId || !token) {
                alert('Пользователь не авторизован');
                return;
            }

            const response = await fetch('http://localhost:3000/api/users/level', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: parseInt(userId),
                    levelup: true
                })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                await fetchUserData();
                console.log('Уровень успешно повышен');
            } else {
                alert(data.message || 'Ошибка при повышении уровня');
            }
        } catch (err) {
            console.error('Ошибка:', err);
            alert('Не удалось подключиться к серверу');
        } finally {
            setIsLevelingUp(false);
        }
    };

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

    const balance = parseFloat(userData.money) || 0;
    const level = userData.level || 0;

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

                        <div className={classes.divider} />

                        <button
                            className={classes.sidebarButton}
                            onClick={handleAddMoney}
                            disabled={isAddingMoney}
                        >
                            {isAddingMoney ? 'Добавление...' : 'Добавить 10000 ₽'}
                        </button>
                        <button
                            className={classes.sidebarButton}
                            onClick={handleAddBonus}
                            disabled={isAddingBonus}
                        >
                            {isAddingBonus ? 'Добавление...' : 'Добавить 10000 бонусов'}
                        </button>
                        <button
                            className={classes.sidebarButton}
                            onClick={handleLevelUp}
                            disabled={isLevelingUp || level >= 3}
                        >
                            {isLevelingUp ? 'Повышение...' : `Повысить уровень ${level >= 3 ? '(макс.)' : ''}`}
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
                            <span className={classes.balanceAmount}>{balance} ₽</span>
                        </div>
                        <div className={classes.accountFooter}>
                            <span className={classes.accountNumber}>•••• 4589</span>
                            <span className={classes.accountStatus}>Активен</span>
                        </div>
                    </div>

                    {/* Карточка престижности - показываем только если уровень > 0 */}
                    {level > 0 && (
                        <div className={classes.prestigeCard}>
                            <div className={classes.prestigeHeader}>
                                <p className={classes.prestigeLabel}>Уровень клиента</p>
                                <p className={classes.prestigeLevel}>{level}/3</p>
                            </div>
                            <div className={classes.progressBar}>
                                <div
                                    className={classes.progressFill}
                                    style={{ width: `${getProgressWidth(level)}%` }}
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