import { useState } from 'react';
import classes from './FeedbackTransferPage.module.css';

interface Question {
    id: number;
    question: string;
    options: string[];
}

const questions: Question[] = [
    {
        id: 1,
        question: 'Рассматриваете ли вы перевод зарплаты в другой банк?',
        options: ['Да, активно рассматриваю', 'Думаю об этом', 'Нет, не рассматриваю', 'Затрудняюсь ответить']
    },
    {
        id: 2,
        question: 'Что для вас наиболее важно при выборе зарплатного банка?',
        options: ['Низкие проценты по кредитам', 'Высокий кешбэк', 'Удобное мобильное приложение', 'Надежность банка', 'Близость отделений']
    },
    {
        id: 3,
        question: 'Какие условия могли бы побудить вас сменить зарплатный банк?',
        options: ['Повышенный кешбэк', 'Бесплатное обслуживание', 'Выгодные условия по ипотеке', 'Бонусы за перевод зарплаты', 'Улучшенный сервис']
    },
    {
        id: 4,
        question: 'Как часто вы пользуетесь мобильным приложением банка?',
        options: ['Ежедневно', 'Несколько раз в неделю', 'Раз в неделю', 'Редко', 'Не пользуюсь']
    },
    {
        id: 5,
        question: 'Готовы ли вы порекомендовать наш банк коллегам?',
        options: ['Определенно да', 'Скорее да', 'Затрудняюсь ответить', 'Скорее нет', 'Определенно нет']
    }
];

const FeedbackTransferPage = () => {
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleAnswerSelect = (questionId: number, answer: string) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: answer
        }));
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const handleSubmit = () => {
        setIsSubmitted(true);
        console.log('Ответы опроса:', answers);
    };

    const currentQuestion = questions[currentQuestionIndex];
    const isCurrentQuestionAnswered = answers[currentQuestion.id] !== undefined;
    const allQuestionsAnswered = questions.every(q => answers[q.id] !== undefined);
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    if (isSubmitted) {
        return (
            <div className={classes.page}>
                <div className={classes.content}>
                    <div className={classes.successCard}>
                        <div className={classes.successIcon}>✓</div>
                        <h1 className={classes.successTitle}>Спасибо за участие!</h1>
                        <p className={classes.successMessage}>
                            Ваши ответы помогут нам стать лучше
                        </p>
                        <button
                            className={classes.backButton}
                            onClick={() => window.history.back()}
                        >
                            Вернуться назад
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={classes.page}>
            <div className={classes.content}>
                <h1 className={classes.title}>Опрос о переводе зарплаты</h1>

                {/* Прогресс бар */}
                <div className={classes.progressContainer}>
                    <div className={classes.progressBar}>
                        <div
                            className={classes.progressFill}
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <div className={classes.progressText}>
                        Вопрос {currentQuestionIndex + 1} из {questions.length}
                    </div>
                </div>

                {/* Карточка с вопросом */}
                <div className={classes.questionCard}>
                    <h2 className={classes.question}>{currentQuestion.question}</h2>

                    <div className={classes.options}>
                        {currentQuestion.options.map((option, index) => (
                            <label key={index} className={classes.option}>
                                <input
                                    type="radio"
                                    name={`question-${currentQuestion.id}`}
                                    value={option}
                                    checked={answers[currentQuestion.id] === option}
                                    onChange={() => handleAnswerSelect(currentQuestion.id, option)}
                                    className={classes.radio}
                                />
                                <span className={classes.optionText}>{option}</span>
                            </label>
                        ))}
                    </div>

                    {/* Навигация */}
                    <div className={classes.navigation}>
                        {currentQuestionIndex > 0 && (
                            <button
                                className={classes.navButton}
                                onClick={handlePrevious}
                            >
                                ← Назад
                            </button>
                        )}

                        {currentQuestionIndex < questions.length - 1 ? (
                            <button
                                className={`${classes.navButton} ${classes.nextButton}`}
                                onClick={handleNext}
                                disabled={!isCurrentQuestionAnswered}
                            >
                                Далее →
                            </button>
                        ) : (
                            <button
                                className={`${classes.submitButton}`}
                                onClick={handleSubmit}
                                disabled={!allQuestionsAnswered}
                            >
                                Отправить
                            </button>
                        )}
                    </div>
                </div>

                {/* Индикатор отвеченных вопросов */}
                <div className={classes.questionsIndicator}>
                    {questions.map((q, index) => (
                        <div
                            key={q.id}
                            className={`${classes.indicatorDot} ${
                                answers[q.id] ? classes.answered : ''
                            } ${index === currentQuestionIndex ? classes.active : ''}`}
                            onClick={() => setCurrentQuestionIndex(index)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FeedbackTransferPage;