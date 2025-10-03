// Глобальная переменная для хранения данных
let servicesData = {};

// Главная функция инициализации
document.addEventListener('DOMContentLoaded', function() {
    console.log('Сайт загружен! Загружаем данные...');
    
    // Загружаем данные из JSON файла
    loadServicesData();
});

// Функция загрузки данных из JSON
async function loadServicesData() {
    try {
        const response = await fetch('data/prices.json');
        if (!response.ok) {
            throw new Error('Ошибка загрузки данных');
        }
        
        const data = await response.json();
        servicesData = data.services;
        
        console.log('Данные услуг загружены:', servicesData);
        
        // Инициализируем компоненты после загрузки данных
        initializeComponents();
        
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        // Загружаем fallback данные
        loadFallbackData();
    }
}

// Fallback данные на случай ошибки загрузки JSON
function loadFallbackData() {
    servicesData = {
        electrical_installation: {
            name: "Монтаж электропроводки",
            icon: "bolt",
            description: "Полный комплекс работ по монтажу электропроводки любой сложности",
            services: [
                { name: "Монтаж электропроводки в квартире", price: "от 40 руб./м²", calcPrice: 40, unit: "m2" }
            ]
        },
        sockets_switches: {
            name: "Розетки и выключатели",
            icon: "plug",
            description: "Установка и замена всех видов электроустановочных изделий",
            services: [
                { name: "Установка розетки/выключателя", price: "12 руб./шт.", calcPrice: 12, unit: "item" }
            ]
        }
    };
    initializeComponents();
}

// Инициализация всех компонентов после загрузки данных
function initializeComponents() {
    // 1. Загрузка контента услуг
    loadServicesContent();
    
    // 2. Загрузка калькулятора
    loadCalculatorServices();
    
    // 3. Инициализация главных вкладок
    initMainTabs();
    
    // 4. Инициализация калькулятора
    initCalculatorEventListeners();
    
    // 5. Загрузка цен (если нужно)
    loadPrices();
    
    // 6. Загрузка портфолио
    loadPortfolio();
    
    // 7. Инициализация фильтра портфолио
    initPortfolioFilter();
    
    // 8. Инициализация формы
    initForm();
    
    console.log('Все компоненты инициализированы!');
}

// Функция загрузки услуг в раздел "Услуги"
function loadServicesContent() {
    const servicesContainer = document.getElementById('servicesTabsContent');
    if (!servicesContainer || !servicesData) return;

    let html = '';
    
    Object.keys(servicesData).forEach((serviceKey, index) => {
        const service = servicesData[serviceKey];
        const isActive = index === 0 ? 'show active' : '';
        
        html += `
            <div class="tab-pane fade ${isActive}" id="${serviceKey}" role="tabpanel" aria-labelledby="${serviceKey}-tab">
                <div class="service-content">
                    <div class="d-flex align-items-center mb-4">
                        <i class="fas fa-${service.icon} text-primary fa-2x me-3"></i>
                        <div>
                            <h3 class="mb-1">${service.name}</h3>
                            <p class="text-muted mb-0">${service.description}</p>
                        </div>
                    </div>
                    
                    <div class="row">
                        <div class="col-md-8">
                            <div class="table-responsive">
                                <table class="table table-hover">
                                    <thead class="table-light">
                                        <tr>
                                            <th>Наименование работы</th>
                                            <th class="text-end" style="width: 150px;">Стоимость</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${service.services.map(item => `
                                            <tr>
                                                <td>${item.name}</td>
                                                <td class="text-end fw-bold text-primary">${item.price}</td>
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="card bg-primary text-white">
                                <div class="card-body text-center">
                                    <i class="fas fa-info-circle fa-2x mb-3"></i>
                                    <h5>Важная информация</h5>
                                    <p class="small mb-3">Окончательная стоимость определяется после осмотра объекта мастером</p>
                                    <a href="#calculator" class="tab-link btn btn-warning btn-sm" data-tab="calculator">
                                        Рассчитать стоимость
                                    </a>
                                </div>
                            </div>
                            
                            <div class="card mt-3">
                                <div class="card-body">
                                    <h6 class="card-title">Преимущества:</h6>
                                    <ul class="list-unstyled small">
                                        <li><i class="fas fa-check text-success me-2"></i>Гарантия 3 года</li>
                                        <li><i class="fas fa-check text-success me-2"></i>Опытные мастера</li>
                                        <li><i class="fas fa-check text-success me-2"></i>Качественные материалы</li>
                                        <li><i class="fas fa-check text-success me-2"></i>Аккуратный монтаж</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    servicesContainer.innerHTML = html;
}

// Функция загрузки услуг в калькулятор
function loadCalculatorServices() {
    const calculatorContainer = document.getElementById('calculator-services');
    if (!calculatorContainer || !servicesData) return;

    let html = '';
    
    Object.keys(servicesData).forEach(serviceKey => {
        const service = servicesData[serviceKey];
        
        html += `
            <div class="calculator-category mb-4">
                <div class="category-header bg-light p-3 rounded">
                    <h6 class="category-title mb-0">
                        <i class="fas fa-${service.icon} text-primary me-2"></i>${service.name}
                    </h6>
                    <small class="text-muted">${service.description}</small>
                </div>
                <div class="row g-2 mt-2">
                    ${service.services.map((item, index) => `
                        <div class="col-md-6">
                            <div class="calculator-service-item border rounded p-3 mb-2">
                                <div class="form-check">
                                    <input class="form-check-input service-checkbox" type="checkbox" 
                                           id="calc-${serviceKey}-${index}" 
                                           data-price="${item.calcPrice}" 
                                           data-unit="${item.unit}"
                                           data-name="${item.name}">
                                    <label class="form-check-label w-100" for="calc-${serviceKey}-${index}">
                                        <div class="fw-medium">${item.name}</div>
                                        <small class="text-primary fw-bold">${item.price}</small>
                                    </label>
                                </div>
                                <div class="quantity-input mt-2" style="display: none;">
                                    <div class="input-group input-group-sm">
                                        <input type="number" class="form-control" 
                                               min="1" max="1000" value="1" 
                                               data-service="calc-${serviceKey}-${index}"
                                               placeholder="Количество">
                                        <span class="input-group-text">${getUnitLabel(item.unit)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    });
    
    calculatorContainer.innerHTML = html;
}

// Вспомогательная функция для подписей единиц измерения
function getUnitLabel(unit) {
    const units = {
        'm2': 'м²',
        'mp': 'м.п.',
        'item': 'шт.'
    };
    return units[unit] || 'шт.';
}

// Инициализация обработчиков калькулятора
function initCalculatorEventListeners() {
    // Обработчики для чекбоксов
    document.querySelectorAll('.service-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const quantityInput = this.closest('.calculator-service-item').querySelector('.quantity-input');
            if (this.checked) {
                quantityInput.style.display = 'block';
            } else {
                quantityInput.style.display = 'none';
                quantityInput.querySelector('input').value = 1;
            }
        });
    });
    
    // Обработчик кнопки расчета
    const calculateBtn = document.getElementById('calculate-btn');
    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculateTotal);
    }
}

// Функция расчета общей стоимости
function calculateTotal() {
    let total = 0;
    const roomType = parseFloat(document.getElementById('room-type').value) || 1;
    const area = parseInt(document.getElementById('area').value) || 50;
    const urgency = parseFloat(document.getElementById('urgency').value) || 1;
    
    const selectedServices = [];
    
    document.querySelectorAll('.service-checkbox:checked').forEach(checkbox => {
        const price = parseFloat(checkbox.getAttribute('data-price'));
        const unit = checkbox.getAttribute('data-unit');
        const name = checkbox.getAttribute('data-name');
        const quantityInput = checkbox.closest('.calculator-service-item').querySelector('.quantity-input input');
        const quantity = parseInt(quantityInput.value) || 1;
        
        let serviceTotal = 0;
        
        if (unit === 'm2') {
            serviceTotal = price * area;
        } else {
            serviceTotal = price * quantity;
        }
        
        total += serviceTotal;
        selectedServices.push({
            name: name,
            quantity: quantity,
            unit: unit,
            price: price,
            total: serviceTotal
        });
    });
    
    // Применяем коэффициенты
    total = total * roomType * urgency;
    
    // Обновляем интерфейс
    updateCalculationResult(total, selectedServices);
}

// Функция обновления результатов расчета
function updateCalculationResult(total, services) {
    const resultSum = document.getElementById('result-sum');
    const detailsContainer = document.getElementById('calculation-details');
    
    if (resultSum) {
        resultSum.textContent = Math.round(total).toLocaleString('ru-RU') + ' руб.';
    }
    
    if (detailsContainer && services.length > 0) {
        let detailsHtml = `
            <div class="calculation-breakdown">
                <h6 class="mb-3">Состав работ:</h6>
                <div class="breakdown-list">
                    ${services.map(service => `
                        <div class="breakdown-item d-flex justify-content-between align-items-center py-2 border-bottom">
                            <div class="service-name">
                                <small>${service.name}</small>
                                <br>
                                <small class="text-muted">${service.quantity} ${getUnitLabel(service.unit)} × ${service.price} руб.</small>
                            </div>
                            <div class="service-total fw-bold">
                                ${service.total.toLocaleString('ru-RU')} руб.
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        detailsContainer.innerHTML = detailsHtml;
    } else {
        detailsContainer.innerHTML = '<p class="text-muted">Выберите необходимые работы</p>';
    }
}

// Остальные функции из вашего оригинального кода
function initMainTabs() {
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');

    function showTab(tabName) {
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
        }
        
        // Обновить активные ссылки
        tabLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-tab') === tabName) {
                link.classList.add('active');
            }
        });

        // Плавная прокрутка к верху с учетом шапки
        setTimeout(() => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }, 100);
    }

    // Обработчики кликов
    tabLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const tabName = this.getAttribute('data-tab');
            showTab(tabName);
        });
    });

    // Показать первую вкладку
    showTab('main');
}

function loadPrices() {
    // Ваша существующая функция загрузки цен
    console.log('Prices loaded');
}

function loadPortfolio() {
    // Ваша существующая функция загрузки портфолио
    console.log('Portfolio loaded');
}

function initPortfolioFilter() {
    // Ваша существующая функция фильтра портфолио
    console.log('Portfolio filter initialized');
}

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