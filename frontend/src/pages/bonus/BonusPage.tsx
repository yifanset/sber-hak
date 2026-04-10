import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import classes from './BonusPage.module.css';

interface UserData {
    money: string;
    level: number;
    name?: string;
    bonus?: string;
    contract?: boolean;
}

const BonusPage = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState<UserData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const baseCategories = [
        { id: 1, name: 'Кафе', icon: '☕', color: '#ff6b6b' },
        { id: 2, name: 'Боулинг', icon: '🎳', color: '#4ecdc4' },
        { id: 3, name: 'Кино', icon: '🎬', color: '#a8e6cf' }
    ];

    const extraCategories = [
        { id: 4, name: 'Рестораны', icon: '🍽️', color: '#feca57' },
        { id: 5, name: 'Путешествия', icon: '✈️', color: '#ff9ff3' },
        { id: 6, name: 'SPA', icon: '💆', color: '#54a0ff' }
    ];

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
                setUserData(data.user);
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

    const getExtraCategories = () => {
        const level = userData?.level || 0;
        return extraCategories.slice(0, level);
    };

    const handleSpendBonus = async () => {
        try {
           console.log('Бонусы потрачены')
        } catch (err) {
            console.error('Ошибка при трате бонусов:', err);
        }
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
                    <button onClick={() => navigate('/demo')} className={classes.errorButton}>
                        Вернуться на главную
                    </button>
                </div>
            </div>
        );
    }

    const bonuses = parseFloat(userData.bonus || '0') || 0;
    const level = userData.level || 0;
    const allCategories = [...baseCategories, ...getExtraCategories()];

    return (
        <div className={classes.page}>
            <div className={classes.content}>
                <h1 className={classes.title}>Бонусы Спасибо</h1>

                {/* Карточка с бонусами */}
                <div className={classes.bonusCard}>
                    <p className={classes.bonusLabel}>Доступно бонусов</p>
                    <div className={classes.bonusAmount}>
                        <span className={classes.amount}>{bonuses}</span>
                        <span className={classes.currency}>бонусов</span>
                    </div>
                    <div className={classes.bonusStatus}>
                        <span className={classes.statusDot}></span>
                        <span>Активны до 31.12.2026</span>
                    </div>
                </div>

                {/* Карточка престижности */}
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

                {/* Список куда потратить */}
                <div className={classes.spendSection}>
                    <h2 className={classes.spendTitle}>Куда потратить бонусы?</h2>
                    <div className={classes.categoriesList}>
                        {allCategories.map((category) => {
                            const isExtra = category.id > 3;
                            return (
                                <div
                                    key={category.id}
                                    className={`${classes.categoryCard} ${isExtra ? classes.categoryCardExtra : ''}`}
                                >
                                    <div
                                        className={classes.categoryIcon}
                                        style={{ background: category.color }}
                                    >
                                        {category.icon}
                                    </div>
                                    <div className={classes.categoryInfo}>
                                        <h3 className={classes.categoryName}>
                                            {category.name}
                                            {isExtra && <span className={classes.extraBadge}>Premium</span>}
                                        </h3>
                                        <p className={classes.categoryDesc}>
                                            {isExtra ? 'Кешбэк до 15%' : 'Кешбэк до 10%'}
                                        </p>
                                    </div>
                                    <button
                                        className={`${classes.spendButton} ${isExtra ? classes.spendButtonExtra : ''}`}
                                        onClick={() => handleSpendBonus()}
                                    >
                                        Потратить
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BonusPage;