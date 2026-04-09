import { useState } from 'react';
import classes from './BonusPage.module.css';

const BonusPage = () => {
    const [bonuses] = useState(300);
    const [prestigeLevel] = useState(3); // Уровень от 1 до 3

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

    // Получаем дополнительные категории в зависимости от уровня
    const getExtraCategories = () => {
        return extraCategories.slice(0, prestigeLevel);
    };

    const allCategories = [...baseCategories, ...getExtraCategories()];

    const getProgressWidth = (level: number) => {
        return (level / 3) * 100;
    };

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
                <div className={classes.prestigeCard}>
                    <div className={classes.prestigeHeader}>
                        <p className={classes.prestigeLabel}>Уровень клиента</p>
                        <p className={classes.prestigeLevel}>{prestigeLevel}/3</p>
                    </div>
                    <div className={classes.progressBar}>
                        <div
                            className={classes.progressFill}
                            style={{ width: `${getProgressWidth(prestigeLevel)}%` }}
                        />
                    </div>
                </div>

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
                                            {isExtra && <span className={classes.extraBadge}>Дополнительно</span>}
                                        </h3>
                                    </div>
                                    <button className={`${classes.spendButton} ${isExtra ? classes.spendButtonExtra : ''}`}>
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