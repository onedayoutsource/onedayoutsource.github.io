// Главный скрипт для управления сайтом
document.addEventListener('DOMContentLoaded', function() {
    // 1. Загрузка цен из JSON файла
    function loadPrices() {
        fetch('data/prices.json')
            .then(response => response.json())
            .then(prices => {
                renderPrices(prices);
            })
            .catch(error => {
                console.error('Ошибка загрузки цен:', error);
                renderPrices(getFallbackPrices());
            });
    }

    // 2. Рендер цен в таблицы
    function renderPrices(prices) {
        const priceSections = {
            'electrical-installation-prices': prices.electrical_installation,
            'sockets-switches-prices': prices.sockets_switches,
            'lighting-prices': prices.lighting,
            'electrical-shields-prices': prices.electrical_shields,
            'emergency-prices': prices.emergency
        };

        for (const [sectionId, priceData] of Object.entries(priceSections)) {
            const section = document.getElementById(sectionId);
            if (section) {
                section.innerHTML = generatePriceTable(priceData);
            }
        }
    }

    // 3. Генерация HTML для таблицы цен
    function generatePriceTable(prices) {
        return `
            <table>
                ${prices.map(item => `
                    <tr>
                        <td>${item.name}</td>
                        <td>${item.price}</td>
                    </tr>
                `).join('')}
            </table>
        `;
    }

    // 4. Запасные цены
    function getFallbackPrices() {
        return {
            electrical_installation: [
                {"name": "Штробление стен (кирпич)", "price": "15 руб./м.п."},
                {"name": "Штробление стен (бетон)", "price": "25 руб./м.п."}
            ],
            sockets_switches: [
                {"name": "Установка розетки/выключателя", "price": "12 руб./шт."}
            ],
            lighting: [
                {"name": "Установка люстры", "price": "30 руб./шт."}
            ],
            electrical_shields: [
                {"name": "Сборка электрощита", "price": "100 руб."}
            ],
            emergency: [
                {"name": "Выезд electrician", "price": "30 руб."}
            ]
        };
    }

    // 5. Управление главными вкладками
    function initMainTabs() {
        const tabLinks = document.querySelectorAll('.tab-link');
        const tabContents = document.querySelectorAll('.tab-content');

        function switchTab(tabId) {
            // Скрыть все вкладки
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Показать выбранную вкладку
            const targetTab = document.getElementById(`${tabId}-content`);
            if (targetTab) targetTab.classList.add('active');
            
            // Обновить активные ссылки
            tabLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('data-tab') === tabId) {
                    link.classList.add('active');
                }
            });
        }

        // Обработчики кликов
        tabLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const tabId = this.getAttribute('data-tab');
                switchTab(tabId);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        });

        // Активная вкладка по умолчанию
        switchTab('main');
    }

    // 6. Управление вертикальными вкладками
    function initVerticalTabs() {
        const verticalTabLinks = document.querySelectorAll('.vertical-tab-link');
        const verticalTabPanes = document.querySelectorAll('.vertical-tab-pane');

        function switchVerticalTab(tabId) {
            // Скрыть все панели
            verticalTabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Показать выбранную панель
            const targetPane = document.getElementById(tabId);
            if (targetPane) targetPane.classList.add('active');
            
            // Обновить активные кнопки
            verticalTabLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('data-vertical-tab') === tabId) {
                    link.classList.add('active');
                }
            });
        }

        // Обработчики кликов
        verticalTabLinks.forEach(link => {
            link.addEventListener('click', function() {
                const tabId = this.getAttribute('data-vertical-tab');
                switchVerticalTab(tabId);
            });
        });

        // Активная вкладка по умолчанию
        if (verticalTabLinks.length > 0) {
            switchVerticalTab('electro-wiring');
        }
    }

    // 7. Инициализация формы
    function initForm() {
        const form = document.getElementById('contactForm');
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                alert('Заявка отправлена! Мы свяжемся с вами в ближайшее время.');
                form.reset();
            });
        }
    }

    // Запуск всех функций
    loadPrices();
    initMainTabs();
    initVerticalTabs();
    initForm();
});