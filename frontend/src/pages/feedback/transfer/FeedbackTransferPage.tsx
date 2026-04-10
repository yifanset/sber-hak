import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classes from '../Survay.module.css';

interface Question {
    id: number;
    question: string;
    options: string[];
}

const questions: Question[] = [
    {
        id: 1,
        question: 'Какая причина стала для вас основной при принятии решения о смене банка для зарплатного проекта?',
        options: ['Не устраивает мобильное приложение', 'Высокая стоимость обслуживания', 'Низкое качество обслуживания в отделениях и службе поддержки', 'Более выгодные условия в другом банке', 'Технические проблемы с зачислением зарплаты']
    },
    {
        id: 2,
        question: 'Насколько для вас важны были тарифы и комиссии при смене зарплатного банка?',
        options: ['Очень важно', 'Важно, но не главное', 'Средне', 'Мало важно', 'Совсем не важно']
    },
    {
        id: 3,
        question: 'Какие бонусные программы или дополнительные услуги повлияли на ваш выбор нового банка?',
        options: ['Кешбэк рублями за любые покупки', 'Процент на остаток по зарплатной карте', 'Бесплатное обслуживание и снятие наличных в любых банкоматах', 'Выгодные условия по кредитам', 'Никакие бонусы не повлияли']
    }
];

const FeedbackTransferPage = () => {
    const navigate = useNavigate();
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

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

    const getAnswerValue = (questionId: number, answer: string): number => {
        const question = questions.find(q => q.id === questionId);
        if (!question) return 0;

        const optionIndex = question.options.indexOf(answer);
        return optionIndex + 1; // Возвращаем значение от 1 до 5
    };

    const handleSubmit = async () => {
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

            const feedbackData = {
                userId: parseInt(userId),
                question1: getAnswerValue(1, answers[1]),
                question2: getAnswerValue(2, answers[2]),
                question3: getAnswerValue(3, answers[3])
            };

            const response = await fetch('http://localhost:3000/api/feedback', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(feedbackData)
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setIsSubmitted(true);
                console.log('Опрос успешно отправлен:', data);
            } else {
                setError(data.message || 'Ошибка при отправке опроса');
            }
        } catch (err) {
            setError('Не удалось подключиться к серверу');
            console.error('Ошибка:', err);
        } finally {
            setIsLoading(false);
        }
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
                            onClick={() => navigate('/')}
                        >
                            Вернуться на главную
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

                {error && <div className={classes.error}>{error}</div>}

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
                                disabled={isLoading}
                            >
                                ← Назад
                            </button>
                        )}

                        {currentQuestionIndex < questions.length - 1 ? (
                            <button
                                className={`${classes.navButton} ${classes.nextButton}`}
                                onClick={handleNext}
                                disabled={!isCurrentQuestionAnswered || isLoading}
                            >
                                Далее →
                            </button>
                        ) : (
                            <button
                                className={`${classes.submitButton}`}
                                onClick={handleSubmit}
                                disabled={!allQuestionsAnswered || isLoading}
                            >
                                {isLoading ? 'Отправка...' : 'Отправить'}
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
                            onClick={() => !isLoading && setCurrentQuestionIndex(index)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FeedbackTransferPage;