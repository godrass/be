const currentInput = document.getElementById("currentInput");
const previousOperation = document.getElementById("previousOperation");
const buttons = document.querySelectorAll(".btn");
const historyList = document.getElementById("historyList");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");

let expression = "";
let history = [];

function updateDisplay() {
    currentInput.textContent = expression || "0";
}

function appendValue(value) {
    if (value === ".") {
        const parts = expression.split(/[\+\-\*\/]/);
        const lastPart = parts[parts.length - 1];

        if (lastPart.includes(".")) {
            return;
        }

        if (
            expression === "" ||
            /[\+\-\*\/]$/.test(expression)
        ) {
            expression += "0.";
        } else {
            expression += ".";
        }
    } else {
        expression += value;
    }

    updateDisplay();
}

function clearAll() {
    expression = "";
    previousOperation.textContent = "";
    updateDisplay();
}

function deleteLast() {
    expression = expression.slice(0, -1);
    updateDisplay();
}

function calculatePercent() {
    try {
        if (expression.trim() === "") return;

        const value = eval(expression);
        const result = value / 100;

        previousOperation.textContent = `${expression}%`;
        addToHistory(`${expression}%`, result);

        expression = result.toString();
        updateDisplay();
    } catch {
        currentInput.textContent = "Error";
        expression = "";
    }
}

function calculateResult() {
    try {
        if (expression.trim() === "") return;

        const safeExpression = expression.replace(/÷/g, "/").replace(/×/g, "*");
        const result = eval(safeExpression);

        if (!isFinite(result)) {
            currentInput.textContent = "Error";
            expression = "";
            return;
        }

        previousOperation.textContent = `${expression} =`;
        addToHistory(expression, result);

        expression = result.toString();
        updateDisplay();
    } catch {
        currentInput.textContent = "Error";
        expression = "";
    }
}

function addToHistory(operation, result) {
    history.unshift(`${operation} = ${result}`);

    if (history.length > 10) {
        history.pop();
    }

    renderHistory();
}

function renderHistory() {
    historyList.innerHTML = "";

    if (history.length === 0) {
        historyList.innerHTML = `<li class="empty-history">Історія порожня</li>`;
        return;
    }

    history.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        historyList.appendChild(li);
    });
}

buttons.forEach(button => {
    button.addEventListener("click", () => {
        const value = button.dataset.value;
        const action = button.dataset.action;

        if (value !== undefined) {
            appendValue(value);
        }

        if (action === "clear") {
            clearAll();
        }

        if (action === "delete") {
            deleteLast();
        }

        if (action === "calculate") {
            calculateResult();
        }

        if (action === "percent") {
            calculatePercent();
        }
    });
});

document.addEventListener("keydown", (event) => {
    const key = event.key;

    if (!isNaN(key) || ["+", "-", "*", "/", "."].includes(key)) {
        appendValue(key);
    } else if (key === "Enter" || key === "=") {
        calculateResult();
    } else if (key === "Backspace") {
        deleteLast();
    } else if (key === "Escape" || key.toLowerCase() === "c") {
        clearAll();
    } else if (key === "%") {
        calculatePercent();
    }
});

clearHistoryBtn.addEventListener("click", () => {
    history = [];
    renderHistory();
});

updateDisplay();
renderHistory();