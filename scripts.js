// Простой и надежный скрипт для вкладок
document.addEventListener('DOMContentLoaded', function() {
    console.log('Сайт загружен!');
    
    // 1. Загрузка цен из JSON файла
    function loadPrices() {
        fetch('data/prices.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Ошибка загрузки файла');
                }
                return response.json();
            })
            .then(prices => {
                console.log('Цены загружены:', prices);
                renderPrices(prices);
            })
            .catch(error => {
                console.error('Ошибка загрузки цен:', error);
                console.log('Используем резервные цены');
                renderPrices(getFallbackPrices());
            });
    }

    function renderPrices(prices) {
        const sections = {
            'electrical-installation-prices': prices.electrical_installation,
            'sockets-switches-prices': prices.sockets_switches,
            'lighting-prices': prices.lighting,
            'electrical-shields-prices': prices.electrical_shields,
            'emergency-prices': prices.emergency
        };

        for (const [sectionId, priceData] of Object.entries(sections)) {
            const section = document.getElementById(sectionId);
            if (section) {
                let html = '';
                priceData.forEach(item => {
                    html += `
                        <tr>
                            <td>${item.name}</td>
                            <td class="text-end fw-bold text-primary">${item.price}</td>
                        </tr>
                    `;
                });
                section.innerHTML = html;
                console.log(`Цены загружены в секцию: ${sectionId}`);
            } else {
                console.warn(`Секция не найдена: ${sectionId}`);
            }
        }
    }

    function getFallbackPrices() {
        return {
            electrical_installation: [
                {"name": "Штробление стен (кирпич)", "price": "15 руб./м.п."},
                {"name": "Штробление стен (бетон)", "price": "25 руб./м.п."},
                {"name": "Прокладка кабеля открытым способом", "price": "10 руб./м.п."}
            ],
            sockets_switches: [
                {"name": "Установка розетки/выключателя", "price": "12 руб./шт."},
                {"name": "Установка TV/интернет розетки", "price": "15 руб./шт."}
            ],
            lighting: [
                {"name": "Установка люстры", "price": "30 руб./шт."},
                {"name": "Установка бра/светильника", "price": "20 руб./шт."}
            ],
            electrical_shields: [
                {"name": "Сборка электрощита", "price": "100 руб."},
                {"name": "Установка автомата/УЗО", "price": "8 руб./шт."}
            ],
            emergency: [
                {"name": "Выезд electrician", "price": "30 руб."},
                {"name": "Диагностика неисправностей", "price": "50 руб."}
            ]
        };
    }

    // 2. Простой переключатель главных вкладок
    function initMainTabs() {
        const tabLinks = document.querySelectorAll('.tab-link');
        const tabContents = document.querySelectorAll('.tab-content');

        console.log('Найдено ссылок вкладок:', tabLinks.length);
        console.log('Найдено контента вкладок:', tabContents.length);

        function showTab(tabName) {
            console.log('Переключаем на вкладку:', tabName);
            
            // Скрыть все вкладки
            tabContents.forEach(tab => {
                tab.style.display = 'none';
                tab.classList.remove('active');
            });
            
            // Показать выбранную вкладку
            const targetTab = document.getElementById(tabName + '-content');
            if (targetTab) {
                targetTab.style.display = 'block';
                targetTab.classList.add('active');
                console.log('Показана вкладка:', tabName + '-content');
            } else {
                console.error('Вкладка не найдена:', tabName + '-content');
            }
            
            // Обновить активные ссылки
            tabLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('data-tab') === tabName) {
                    link.classList.add('active');
                }
            });
        }

        // Обработчики кликов
        tabLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const tabName = this.getAttribute('data-tab');
                showTab(tabName);
                window.scrollTo(0, 0);
            });
        });

        // Показать первую вкладку
        showTab('main');
    }

    // 3. Форма обратной связи
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
    initForm();
    
    console.log('Все функции инициализированы');
}

)
;