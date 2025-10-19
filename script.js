// Quiz functionality
document.addEventListener('DOMContentLoaded', function() {
    let currentQuestion = 1;
    let score = 0;
    let answeredQuestions = new Set();
    const totalQuestions = 10;

    const prevButton = document.getElementById('prev-question');
    const nextButton = document.getElementById('next-question');
    const quizResults = document.getElementById('quiz-results');
    const restartButton = document.getElementById('restart-quiz');

    // Initialize quiz
    updateNavigationButtons();

    // Handle quiz option clicks
    document.querySelectorAll('.quiz-option').forEach(button => {
        button.addEventListener('click', function() {
            const questionDiv = this.closest('.quiz-question');
            const questionNumber = parseInt(questionDiv.dataset.question);
            const isCorrect = this.dataset.answer === 'correct';
            const feedback = questionDiv.querySelector('.quiz-feedback');

            // Disable all options in this question
            questionDiv.querySelectorAll('.quiz-option').forEach(opt => {
                opt.disabled = true;
            });

            // Mark the selected answer
            this.classList.add('selected');
            
            // Add correct/incorrect class
            if (isCorrect) {
                this.classList.add('correct');
                feedback.textContent = '✓ ¡Correcto! Excelente respuesta.';
                feedback.className = 'quiz-feedback show correct';
                
                // Only add to score if not previously answered correctly
                if (!answeredQuestions.has(questionNumber)) {
                    score++;
                    answeredQuestions.add(questionNumber);
                }
            } else {
                this.classList.add('incorrect');
                
                // Show which answer was correct
                questionDiv.querySelectorAll('.quiz-option').forEach(opt => {
                    if (opt.dataset.answer === 'correct') {
                        opt.classList.add('correct');
                    }
                });
                
                feedback.textContent = '✗ Incorrecto. La respuesta correcta está marcada en verde.';
                feedback.className = 'quiz-feedback show incorrect';
                
                // Mark as answered even if incorrect
                answeredQuestions.add(questionNumber);
            }

            // Show next button or results
            if (currentQuestion < totalQuestions) {
                nextButton.style.display = 'inline-block';
            } else {
                // Show results after a short delay
                setTimeout(() => {
                    showResults();
                }, 1500);
            }
        });
    });

    // Previous button
    prevButton.addEventListener('click', function() {
        if (currentQuestion > 1) {
            currentQuestion--;
            showQuestion(currentQuestion);
            updateNavigationButtons();
        }
    });

    // Next button
    nextButton.addEventListener('click', function() {
        if (currentQuestion < totalQuestions) {
            currentQuestion++;
            showQuestion(currentQuestion);
            updateNavigationButtons();
        }
    });

    // Restart button
    restartButton.addEventListener('click', function() {
        // Reset quiz state
        currentQuestion = 1;
        score = 0;
        answeredQuestions.clear();

        // Reset all questions
        document.querySelectorAll('.quiz-question').forEach(q => {
            q.querySelectorAll('.quiz-option').forEach(opt => {
                opt.disabled = false;
                opt.classList.remove('selected', 'correct', 'incorrect');
            });
            q.querySelector('.quiz-feedback').className = 'quiz-feedback';
        });

        // Hide results and show first question
        quizResults.style.display = 'none';
        showQuestion(1);
        updateNavigationButtons();
    });

    function showQuestion(questionNumber) {
        document.querySelectorAll('.quiz-question').forEach(q => {
            q.classList.remove('active');
        });
        
        const targetQuestion = document.querySelector(`[data-question="${questionNumber}"]`);
        if (targetQuestion) {
            targetQuestion.classList.add('active');
        }
    }

    function updateNavigationButtons() {
        // Show/hide previous button
        if (currentQuestion > 1) {
            prevButton.style.display = 'inline-block';
        } else {
            prevButton.style.display = 'none';
        }

        // Hide next button until answer is selected
        nextButton.style.display = 'none';
    }

    function showResults() {
        // Hide all questions
        document.querySelectorAll('.quiz-question').forEach(q => {
            q.classList.remove('active');
        });

        // Show results
        quizResults.style.display = 'block';
        document.getElementById('final-score').textContent = score;

        // Generate message based on score
        let message = '';
        const percentage = (score / totalQuestions) * 100;

        if (percentage === 100) {
            message = '¡Perfecto! Tienes un dominio excelente de los microservicios. ¡Felicitaciones!';
        } else if (percentage >= 80) {
            message = '¡Muy bien! Tienes un buen conocimiento sobre microservicios. Sigue así.';
        } else if (percentage >= 60) {
            message = 'Buen trabajo. Tienes una base sólida, pero hay espacio para mejorar.';
        } else if (percentage >= 40) {
            message = 'Has aprendido algunos conceptos, pero te recomendamos revisar el contenido nuevamente.';
        } else {
            message = 'Te sugerimos revisar el material con más detalle para fortalecer tus conocimientos.';
        }

        document.getElementById('results-message').textContent = message;

        // Hide navigation buttons
        prevButton.style.display = 'none';
        nextButton.style.display = 'none';

        // Scroll to results
        quizResults.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add scroll animation for sections
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe sections for animation
    document.querySelectorAll('.step-card, .architecture-card, .stack-category, .lifecycle-phase').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Mobile menu toggle (if needed in future)
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }

    // Add active state to navigation based on scroll position
    window.addEventListener('scroll', function() {
        let current = '';
        const sections = document.querySelectorAll('section[id]');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
});

