const prevDisp = document.querySelector('#prevDisp');
const currDisp = document.querySelector('#currDisp');
let currDispVal = ''
let expression = '';
let ans = '';

const buttons = document.querySelectorAll('button')
buttons.forEach(button => {
    button.addEventListener('click', e => {
        if (button.id === 'equals') return equals();
        if (button.id === 'clear') return clear();
        if (button.id === 'del') return del();
        if (button.className === 'digit' && /(^|\s)0$/.test(expression)
            || button.className === 'operator' && /(^|\.)$/.test(expression)
            || button.id === '.' && /\.(\d+)?$/.test(expression))
            return;
        if (button.className === 'operator' && /\s$/.test(expression)) {
            del();
        }
        if (button.id === '.' && /(^|[^\d])$/.test(expression)) {
            currDispVal += 0;
            expression += 0;
        }        
        if (ans) {
            if (button.className === 'digit' || button.id === '.') {
                clear();        
            } else {
                currDispVal = ans;
                expression = ans;
                ans = '';
                prevDisp.textContent = '';               
            }
        }
        currDisp.textContent = `${currDispVal += button.textContent}`;
        expression += button.id;
    });
});

const equals = () => {
    prevDisp.textContent = currDispVal;
    if (/^\d+(\.\d+)?$/.test(expression)) {
        currDisp.textContent = `= ${expression}`;
    } else if (/^\d+(\.\d+)?(\s[+\-*/]\s\d+(\.\d+)?)+$/.test(expression)) {
        ans = solvePostfix();
        if (!isFinite(ans)) {
            ans = 'Undefined';
        } else if (ans < -1e+7 || ans > 1e+7) {
            ans = ans.toExponential(7);
        } else {
            ans = ans.toPrecision(8).replace(/\.?0+$/, '');
        }
        currDisp.textContent = `= ${ans}`;
    } else {
        clear();
        currDisp.textContent = 'Error';
    }
}

const solvePostfix = postfix => {
    postfix = infixToPostfix(expression).trim().split(' ');
    let postfixStack = [];
    postfix.forEach(element => {
        if (/[+\-*/]/.test(element)) {
            let a = Number(postfixStack.pop());
            let o = element;
            let b = Number(postfixStack.pop());
            postfixStack.push(operate(a, o, b));
        } else {
            postfixStack.push(element);
        }
    });
    return postfixStack[0];
}

const infixToPostfix = infix => {
    let outputQueue = '';
    let operatorStack = [];
    const precedence = {
        '*': 2,
        '/': 2,
        '+': 1,
        '-': 1
    }
    infix = infix.replace(/\s+/g, '').split(/([+\-*/])/);
    infix.forEach(token => {
        if (/\d+(\.\d+)?/.test(token)) {
            outputQueue += token + ' ';
        } else if ('*/+-'.indexOf(token) !== -1) {
            let o1 = token;
            let o2 = operatorStack[operatorStack.length - 1];
            while ('*/+-'.indexOf(o2) !== -1 && precedence[o1] <= precedence[o2]) {
                outputQueue += operatorStack.pop() + ' ';
                o2 = operatorStack[operatorStack.length - 1];
            }
            operatorStack.push(o1);
        }
    });
    while (operatorStack.length > 0) {
        outputQueue += operatorStack.pop() + ' ';
    }
    return outputQueue;
}

const operate = (a, o, b) => {
    switch (o) {
        case '+': return a + b;
        case '-': return b - a;
        case '*': return a * b;
        case '/': return b / a;
    }
}

const clear = () => {
    prevDisp.textContent = '';
    currDisp.textContent = '';
    currDispVal = '';
    expression = '';
    ans = '';  
}

const del = () => {
    if (ans) return clear();
    currDispVal = currDispVal.replace(/\s?.\s?$/, '');
    expression = expression.replace(/\s?.\s?$/, '');
    currDisp.textContent = currDispVal;
}