class Calculator {
    constructor() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.memory = 0;
        this.shouldResetScreen = false;
        
        this.displayElement = document.querySelector('.current-operand');
        this.previousOperandElement = document.querySelector('.previous-operand');
        this.memoryIndicator = document.querySelector('.memory-indicator');
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        document.querySelectorAll('.btn').forEach(button => {
            button.addEventListener('click', () => {
                this.handleButtonClick(button);
                playClickSound();
                this.addPressAnimation(button);
            });
        });

        document.addEventListener('keydown', (e) => this.handleKeyboardInput(e));
    }

    addPressAnimation(button) {
        button.classList.add('pressed');
        setTimeout(() => button.classList.remove('pressed'), 100);
    }

    handleButtonClick(button) {
        if (button.classList.contains('number')) {
            this.appendNumber(button.textContent);
        } else if (button.classList.contains('operator')) {
            const action = button.dataset.action;
            if (action === 'calculate') {
                this.calculate();
            } else {
                this.setOperation(action);
            }
        } else if (button.classList.contains('function')) {
            const action = button.dataset.action;
            switch(action) {
                case 'clear':
                    this.clear();
                    break;
                case 'delete':
                    this.delete();
                    break;
                case 'memory-clear':
                    this.memoryClear();
                    break;
            }
        }
        this.updateDisplay();
    }

    handleKeyboardInput(e) {
        if (e.key >= '0' && e.key <= '9' || e.key === '.') {
            this.appendNumber(e.key);
        } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
            this.setOperation(e.key);
        } else if (e.key === 'Enter' || e.key === '=') {
            this.calculate();
        } else if (e.key === 'Backspace') {
            this.delete();
        } else if (e.key === 'Escape') {
            this.clear();
        }
        this.updateDisplay();
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.shouldResetScreen) {
            this.currentOperand = '';
            this.shouldResetScreen = false;
        }
        this.currentOperand = this.currentOperand === '0' && number !== '.' 
            ? number 
            : this.currentOperand + number;
    }

    setOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.calculate();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
    }

    calculate() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case 'add':
            case '+':
                computation = prev + current;
                break;
            case 'subtract':
            case '-':
                computation = prev - current;
                break;
            case 'multiply':
            case '*':
                computation = prev * current;
                break;
            case 'divide':
            case '/':
                if (current === 0) {
                    alert('Cannot divide by zero');
                    return;
                }
                computation = prev / current;
                break;
            default:
                return;
        }

        this.currentOperand = computation.toString();
        this.operation = undefined;
        this.previousOperand = '';
        this.shouldResetScreen = true;
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
    }

    delete() {
        if (this.currentOperand.length === 1) {
            this.currentOperand = '0';
        } else {
            this.currentOperand = this.currentOperand.slice(0, -1);
        }
    }

    memoryClear() {
        this.memory = 0;
        this.memoryIndicator.classList.remove('active');
    }

    updateDisplay() {
        this.displayElement.textContent = this.currentOperand;
        if (this.operation) {
            this.previousOperandElement.textContent = 
                `${this.previousOperand} ${this.getOperationSymbol(this.operation)}`;
        } else {
            this.previousOperandElement.textContent = '';
        }
    }

    getOperationSymbol(operation) {
        const symbols = {
            'add': '+',
            'subtract': '-',
            'multiply': '×',
            'divide': '÷',
            '+': '+',
            '-': '-',
            '*': '×',
            '/': '÷'
        };
        return symbols[operation] || '';
    }
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Calculator();
});
