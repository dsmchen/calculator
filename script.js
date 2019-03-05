const prevDisp = document.querySelector("#prevDisp");
const currDisp = document.querySelector("#currDisp");
let currDispVal = "";
let expression = "";
let ans = "";

const equals = () => {
  prevDisp.textContent = currDispVal;
  if (/^\d+(\.\d+)?$/.test(expression)) {
    ans = expression;
    currDisp.textContent = `= ${ans}`;
  } else if (/^\d+(\.\d+)?(\s[+\-*/]\s\d+(\.\d+)?)+$/.test(expression)) {
    ans = solvePostfix();
    if (!isFinite(ans)) {
      ans = "Undefined";
    } else if (ans < -1e7 || ans > 1e7) {
      ans = ans.toExponential(7);
    } else {
      ans = ans.toPrecision(8).replace(/\.?0+$/, "");
    }
    currDisp.textContent = `= ${ans}`;
  } else {
    clear();
    currDisp.textContent = "Error";
  }
};

const solvePostfix = postfix => {
  postfix = infixToPostfix(expression)
    .trim()
    .split(" ");
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
};

const infixToPostfix = infix => {
  let outputQueue = "";
  let operatorStack = [];
  const order = {
    "*": 2,
    "/": 2,
    "+": 1,
    "-": 1
  };
  infix = infix.replace(/\s+/g, "").split(/([+\-*/])/);
  infix.forEach(token => {
    if (/\d+(\.\d+)?/.test(token)) {
      outputQueue += token + " ";
    } else if ("*/+-".indexOf(token) !== -1) {
      let o1 = token;
      let o2 = operatorStack[operatorStack.length - 1];
      while ("*/+-".indexOf(o2) !== -1 && order[o1] <= order[o2]) {
        outputQueue += operatorStack.pop() + " ";
        o2 = operatorStack[operatorStack.length - 1];
      }
      operatorStack.push(o1);
    }
  });
  while (operatorStack.length > 0) {
    outputQueue += operatorStack.pop() + " ";
  }
  return outputQueue;
};

const operate = (a, o, b) => {
  switch (o) {
    case "+":
      return a + b;
    case "-":
      return b - a;
    case "*":
      return a * b;
    case "/":
      return b / a;
  }
};

const clear = () => {
  prevDisp.textContent = "";
  currDisp.textContent = "";
  currDispVal = "";
  expression = "";
  ans = "";
};

const del = () => {
  if (ans) return clear();
  currDispVal = currDispVal.replace(/\s?.\s?$/, "");
  expression = expression.replace(/\s?.\s?$/, "");
  currDisp.textContent = currDispVal;
};

const createDisp = function(e) {
  let data = this;
  if (this === window) {
    data = e;
  }
  if (data.id === "equals") return equals();
  if (data.id === "clear") return clear();
  if (data.id === "del") return del();
  if (
    (data.className === "digit" && /(^|\s)0$/.test(expression)) ||
    (data.className === "operator" && /(^|\.)$/.test(expression)) ||
    (data.id === "." && /\.(\d+)?$/.test(expression))
  )
    return;
  if (data.className === "operator" && /\s$/.test(expression)) {
    del();
  } else if (data.id === "." && /(^|[^\d])$/.test(expression)) {
    currDispVal += 0;
    expression += 0;
  } else if (ans) {
    if (data.className === "digit" || data.id === ".") {
      clear();
    } else {
      currDispVal = ans;
      expression = ans;
      ans = "";
      prevDisp.textContent = "";
    }
  }
  currDisp.textContent = `${(currDispVal += data.textContent)}`;
  expression += data.id;
};

const checkKey = e => {
  if (/^([\d+\-*\/=\.]|Backspace|Escape)$/.test(e.key)) {
    createDisp(document.querySelector(`[data-key=${CSS.escape(e.key)}]`));
  } else if (/^Enter$/.test(e.key)) {
    createDisp(document.querySelector(`[data-key='=']`));
  }
};

const buttons = document.querySelectorAll("button");
buttons.forEach(button => button.addEventListener("click", createDisp));
window.addEventListener("keydown", checkKey);
