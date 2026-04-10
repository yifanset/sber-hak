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
        question: 'Насколько вам интересна новая фича программы лояльности (например, повышенный кэшбэк за регулярные операции)?',
        options: ['Очень интересно, сразу бы использовал', 'Скорее интересно', 'Нейтрально, посмотрю', 'Скорее неинтересно', 'Совсем неинтересно']
    },
    {
        id: 2,
        question: 'Как часто вы бы пользовались этой новой возможностью в программе лояльности?',
        options: ['Ежедневно', 'Несколько раз в неделю', 'Раз в месяц', 'Очень редко', 'Никогда']
    },
    {
        id: 3,
        question: 'Что для вас самое важное при внедрении такой фичи в банке?',
        options: ['Прозрачные условия начисления', 'Моментальное зачисление бонусов', 'Высокий процент кэшбэка', 'Простота активации', 'Долгий срок действия бонусов']
    },
];

const FeedbackIdeaPage = () => {
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

            const statsData = {
                userId: parseInt(userId),
                question1: getAnswerValue(1, answers[1]),
                question2: getAnswerValue(2, answers[2]),
                question3: getAnswerValue(3, answers[3])
            };

            const response = await fetch('http://localhost:3000/api/stats', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(statsData)
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setIsSubmitted(true);
                console.log('Статистика успешно отправлена:', data);
            } else {
                setError(data.message || 'Ошибка при отправке данных');
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
                        <div className={classes.successIcon}>💡</div>
                        <h1 className={classes.successTitle}>Спасибо за ваши идеи!</h1>
                        <p className={classes.successMessage}>
                            Ваше мнение поможет нам развиваться
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
                <h1 className={classes.title}>Обратная связь по идее команды</h1>

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

export default FeedbackIdeaPage;