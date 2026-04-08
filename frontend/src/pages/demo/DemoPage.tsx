import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import classes from './DemoPage.module.css';

const DemoPage = () => {
    const navigate = useNavigate();
    const [balance] = useState(50);
    const [prestigeLevel] = useState(3); // Уровень от 1 до 3

    const getProgressWidth = (level: number) => {
        return (level / 3) * 100;
    };

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
                    <h1 className={classes.title}>Демоверсия продукта</h1>

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

                    {/* Карточка престижности */}
                    <div className={classes.prestigeCard}>
                        <div className={classes.prestigeHeader}>
                            <p className={classes.prestigeLabel}>Престижность клиента</p>
                            <p className={classes.prestigeLevel}>Уровень {prestigeLevel}/3</p>
                        </div>
                        <div className={classes.progressBar}>
                            <div
                                className={classes.progressFill}
                                style={{ width: `${getProgressWidth(prestigeLevel)}%` }}
                            />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DemoPage;