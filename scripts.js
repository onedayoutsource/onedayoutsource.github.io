// Управление вкладками
document.addEventListener('DOMContentLoaded', function() {
    // Функция для переключения вкладок
    function switchTab(tabId) {
        // Скрываем все содержимое вкладок
        const tabContents = document.querySelectorAll('.tab-content');
        tabContents.forEach(content => {
            content.classList.remove('active');
        });
        
        // Показываем выбранную вкладку
        const selectedTab = document.getElementById(`${tabId}-content`);
        if (selectedTab) {
            selectedTab.classList.add('active');
        }
        
        // Обновляем активную ссылку в навигации
        const tabLinks = document.querySelectorAll('.tab-link');
        tabLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-tab') === tabId) {
                link.classList.add('active');
            }
        });
    }
    
    // Обработчики для главных вкладок
    const tabLinks = document.querySelectorAll('.tab-link');
    tabLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const tabId = this.getAttribute('data-tab');
            switchTab(tabId);
            
            // Плавная прокрутка к верху
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    });
    
    // Функция для вертикальных вкладок
    function switchVerticalTab(tabId) {
        // Скрываем все содержимое вертикальных вкладок
        const verticalPanes = document.querySelectorAll('.vertical-tab-pane');
        verticalPanes.forEach(pane => {
            pane.classList.remove('active');
        });
        
        // Показываем выбранную вкладку
        const selectedPane = document.getElementById(tabId);
        if (selectedPane) {
            selectedPane.classList.add('active');
        }
        
        // Обновляем активную кнопку
        const verticalLinks = document.querySelectorAll('.vertical-tab-link');
        verticalLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-vertical-tab') === tabId) {
                link.classList.add('active');
            }
        });
    }
    
    // Обработчики для вертикальных вкладок
    const verticalTabLinks = document.querySelectorAll('.vertical-tab-link');
    verticalTabLinks.forEach(link => {
        link.addEventListener('click', function() {
            const tabId = this.getAttribute('data-vertical-tab');
            switchVerticalTab(tabId);
        });
    });
    
    // Фильтрация портфолио
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Убираем активный класс у всех кнопок
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Добавляем активный класс текущей кнопке
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
    
    // Калькулятор стоимости
    const calculateBtn = document.getElementById('calculate-btn');
    if (calculateBtn) {
        calculateBtn.addEventListener('click', function() {
            // Базовая стоимость за квадратный метр
            const baseRate = 40;
            
            // Получаем значения из формы
            const roomType = parseFloat(document.getElementById('room-type').value);
            const area = parseInt(document.getElementById('area').value);
            const urgency = parseFloat(document.getElementById('urgency').value);
            
            // Считаем стоимость дополнительных услуг
            let additionalServices = 0;
            const serviceCheckboxes = document.querySelectorAll('input[name="services"]:checked');
            serviceCheckboxes.forEach(checkbox => {
                additionalServices += parseInt(checkbox.value);
            });
            
            // Рассчитываем общую стоимость
            let totalCost = baseRate * area * roomType * urgency + additionalServices;
            
            // Форматируем и отображаем результат
            const resultSum = document.getElementById('result-sum');
            if (resultSum) {
                resultSum.textContent = totalCost.toLocaleString('ru-RU') + ' руб.';
            }
        });
    }
    
    // Плавная прокрутка для обычных якорных ссылок (не вкладок)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        if (!anchor.classList.contains('tab-link')) {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const headerHeight = document.querySelector('header').offsetHeight;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        }
    });
    
    // Активируем первую вкладку при загрузке
    switchTab('main');
});