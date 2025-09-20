// Главный скрипт для управления вкладками
document.addEventListener('DOMContentLoaded', function() {
    console.log('Документ загружен, инициализируем вкладки...');
    
    // 1. Управление главными горизонтальными вкладками
    function initMainTabs() {
        const tabLinks = document.querySelectorAll('.tab-link');
        const tabContents = document.querySelectorAll('.tab-content');
        
        console.log('Найдено ссылок вкладок:', tabLinks.length);
        console.log('Найдено контента вкладок:', tabContents.length);
        
        // Функция переключения вкладок
        function switchMainTab(tabId) {
            console.log('Переключаем на вкладку:', tabId);
            
            // Скрываем весь контент
            tabContents.forEach(content => {
                content.classList.remove('active');
            });
            
            // Показываем выбранный контент
            const targetContent = document.getElementById(tabId + '-content');
            if (targetContent) {
                targetContent.classList.add('active');
                console.log('Показан контент:', tabId + '-content');
            }
            
            // Обновляем активные ссылки
            tabLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('data-tab') === tabId) {
                    link.classList.add('active');
                }
            });
        }
        
        // Вешаем обработчики на ссылки
        tabLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const tabId = this.getAttribute('data-tab');
                switchMainTab(tabId);
                
                // Прокрутка к верху страницы
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        });
        
        // Активируем первую вкладку
        if (tabLinks.length > 0) {
            const firstTab = tabLinks[0].getAttribute('data-tab');
            switchMainTab(firstTab);
        }
    }
    
    // 2. Управление вертикальными вкладками
    function initVerticalTabs() {
        const verticalTabs = document.querySelectorAll('.vertical-tabs');
        
        verticalTabs.forEach(verticalTabContainer => {
            const verticalLinks = verticalTabContainer.querySelectorAll('.vertical-tab-link');
            const verticalPanes = verticalTabContainer.querySelectorAll('.vertical-tab-pane');
            
            function switchVerticalTab(tabId, container) {
                // Скрываем все панели в этом контейнере
                verticalPanes.forEach(pane => {
                    if (pane.closest('.vertical-tabs') === container) {
                        pane.classList.remove('active');
                    }
                });
                
                // Показываем выбранную панель
                const targetPane = document.getElementById(tabId);
                if (targetPane && targetPane.closest('.vertical-tabs') === container) {
                    targetPane.classList.add('active');
                }
                
                // Обновляем активные кнопки
                verticalLinks.forEach(link => {
                    if (link.closest('.vertical-tabs') === container) {
                        link.classList.remove('active');
                        if (link.getAttribute('data-vertical-tab') === tabId) {
                            link.classList.add('active');
                        }
                    }
                });
            }
            
            // Вешаем обработчики
            verticalLinks.forEach(link => {
                link.addEventListener('click', function() {
                    const tabId = this.getAttribute('data-vertical-tab');
                    const container = this.closest('.vertical-tabs');
                    switchVerticalTab(tabId, container);
                });
            });
            
            // Активируем первую вкладку в каждом контейнере
            if (verticalLinks.length > 0) {
                const firstTab = verticalLinks[0].getAttribute('data-vertical-tab');
                switchVerticalTab(firstTab, verticalTabContainer);
            }
        });
    }
    
    // 3. Фильтрация портфолио
    function initPortfolioFilter() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const portfolioItems = document.querySelectorAll('.portfolio-item');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');
                
                // Обновляем активную кнопку
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Фильтруем элементы
                portfolioItems.forEach(item => {
                    if (filter === 'all' || item.getAttribute('data-category') === filter) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }
    
    // 4. Калькулятор стоимости
    function initCalculator() {
        const calculateBtn = document.getElementById('calculate-btn');
        
        if (calculateBtn) {
            calculateBtn.addEventListener('click', function() {
                const baseRate = 40;
                const roomType = parseFloat(document.getElementById('room-type').value) || 1;
                const area = parseInt(document.getElementById('area').value) || 50;
                const urgency = parseFloat(document.getElementById('urgency').value) || 1;
                
                let additionalServices = 0;
                document.querySelectorAll('input[name="services"]:checked').forEach(checkbox => {
                    additionalServices += parseInt(checkbox.value) || 0;
                });
                
                const totalCost = baseRate * area * roomType * urgency + additionalServices;
                
                const resultSum = document.getElementById('result-sum');
                if (resultSum) {
                    resultSum.textContent = totalCost.toLocaleString('ru-RU') + ' руб.';
                }
            });
        }
    }
    
    // 5. Плавная прокрутка для обычных якорных ссылок
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            // Пропускаем ссылки-вкладки
            if (anchor.classList.contains('tab-link')) return;
            
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const headerHeight = document.querySelector('header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    // Инициализируем все компоненты
    initMainTabs();
    initVerticalTabs();
    initPortfolioFilter();
    initCalculator();
    initSmoothScroll();
    
    console.log('Все компоненты инициализированы');
});

// Простой обработчик для hash URL
window.addEventListener('hashchange', function() {
    const hash = window.location.hash.substring(1);
    if (hash) {
        const tabLink = document.querySelector(`.tab-link[data-tab="${hash}"]`);
        if (tabLink) {
            tabLink.click();
        }
    }
});