const tg = window.Telegram.WebApp;
tg.expand();

// Инициализация баланса (берем из памяти или ставим 1000)
// Используем parseFloat, чтобы игры с центами (как колесо) не ломали баланс
let balance = parseFloat(localStorage.getItem("casino_balance"));
if (isNaN(balance)) {
    balance = 1000;
    localStorage.setItem("casino_balance", balance);
}

// Скрываем кнопку назад в главном меню (она нужна только внутри игр)
tg.BackButton.hide();

const balanceElem = document.getElementById("balance");
const userNameElem = document.querySelector(".profile-name");
const userPhotoElem = document.querySelector(".profile img");

/**
 * Обновление отображения баланса и сохранение в память
 */
function updateBalanceDisplay() {
    if (balanceElem) {
        // Выводим целое число, если нет копеек, или 2 знака после запятой
        balanceElem.textContent = (Number.isInteger(balance) ? balance : balance.toFixed(2)) + " 💰";
    }
    localStorage.setItem("casino_balance", balance);
}

/**
 * Получение данных профиля из Telegram
 */
function initProfile() {
    const user = tg.initDataUnsafe?.user;
    if (user) {
        if (userNameElem) userNameElem.textContent = user.first_name;
        if (userPhotoElem && user.photo_url) {
            userPhotoElem.src = user.photo_url;
        }
    }
    updateBalanceDisplay();
}

/**
 * Функция пополнения баланса (через ввод суммы)
 */
function topUp() {
    let amount = prompt("Сумма пополнения:");
    if (amount && !isNaN(amount)) {
        balance += parseFloat(amount);
        updateBalanceDisplay();
        tg.HapticFeedback.notificationOccurred('success');
    }
}

/**
 * Логика перехода в игры
 */
function play(game) {
    tg.HapticFeedback.impactOccurred('light');
    
    if (game === 'wheel') {
        // Переход на страницу Колеса Фортуны
        window.location.href = "wheel.html";
    } 
    else if (game === 'dice') {
        // Переход на страницу Кубика (Dice)
        window.location.href = "dice.html";
    } 
    else {
        // Для кнопок "Мины" и "Краш"
        tg.showAlert("Игра " + game + " пока недоступна! Мы работаем над ней.");
    }
}

/**
 * Логика ежедневного бонуса
 */
function raffle() {
    // Можно добавить проверку времени, но пока оставляем твой текст
    tg.showAlert("Розыгрыши будут доступны завтра! Заходите чаще.");
    tg.HapticFeedback.selectionChanged();
}

// Запуск инициализации при загрузке страницы
initProfile();