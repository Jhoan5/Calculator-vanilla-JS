// View *************************************************
//
const d = document;
class size {
  static size(element, width, height) {
    element.style.width = width;
    element.style.height = height;
  }
}
class maker extends size {
  static button(content, id, clas = "", type = "button") {
    const btn = d.createElement("button");
    if (clas !== "") btn.classList.add(clas);
    btn.innerHTML = content;
    btn.id = id;
    btn.type = type;
    return btn;
  }
  static contain(tag, width, height) {
    const contain = d.createElement(tag);
    this.size(contain, width, height);
    return contain;
  }
}
class style extends size {
  static allStyle(tag, color, background, border, borderRadius, shadow) {
    if (color) this.color(tag, color);
    if (background) this.background(tag, background);
    if (border) this.border(tag, border, borderRadius);
    if (shadow) this.shadow(tag, shadow);
  }
  static color(tag, color) {
    tag.style.color = color;
  }
  static background(tag, background) {
    tag.style.background = background;
  }
  static border(tag, border, borderRadius) {
    tag.style.border = border;
    if (borderRadius) tag.style.borderRadius = borderRadius;
  }
  static shadow(tag, shadow) {
    tag.style.shadow = shadow;
  }
  static size(element, width, height, margin, padding) {
    super.size(element, width, height);
    element.style.margin = margin;
    element.style.padding = padding;
  }
  static fontWeight(element, bold) {
    element.style.fontWeight = bold;
  }
}
class display {
  static grid(tag, areas, elementsChild, gap) {
    // arr
    const allAreas = this.getAreas(areas),
      // string `"area""area"` => css
      area = areas
        .map((v) => v.join(" "))
        .map((v) => `"${v}"`)
        .join("");
    // areas => elemntsChild
    allAreas.forEach((v, i) => {
      if (elementsChild[i]) elementsChild[i].style.gridArea = v;
    });
    // grid
    tag.style.display = "grid";
    tag.style.gridTemplateAreas = area;
    tag.style.gap = gap;
  }
  static getAreas(areas) {
    let allAreas = new Set();
    areas.forEach((arr) => arr.forEach((value) => allAreas.add(value)));
    return Array.from(allAreas);
  }
}
// start section calculator // ************************************************
//
// calculator screen
const calculatorScreen = maker.contain("div", "200px", "70px"),
  //
  screenOne = maker.contain("div", "100%", "50%"),
  screenTwo = maker.contain("div", "100%", "50%");
//
calculatorScreen.style.marginBottom = "5px";
style.allStyle(screenOne, "#444", "#ffa");
style.allStyle(screenTwo, "#444", "#ffa");
//
calculatorScreen.appendChild(screenOne);
calculatorScreen.appendChild(screenTwo);

// calculator btns
const calculatorBtn = maker.contain("div", "200px", "300px");
//
const calculatorBtns = [
  maker.button("CE", "ce"),
  maker.button("delete", "delete"),

  maker.button("(", "leftParenthesis"),
  maker.button(")", "rightParenthesis"),
  maker.button("%", "percent"),
  maker.button("/", "division"),

  maker.button("7", "seven"),
  maker.button("8", "eight"),
  maker.button("9", "nine"),
  maker.button("*", "multiply"),

  maker.button("4", "four"),
  maker.button("5", "five"),
  maker.button("6", "six"),
  maker.button("-", "sustraction"),

  maker.button("1", "one"),
  maker.button("2", "two"),
  maker.button("3", "three"),
  maker.button("+", "addition"),

  maker.button("+/-", "sign"),
  maker.button("0", "zero"),
  maker.button(".", "point"),
  maker.button("=", "equal"),
];
calculatorBtns.forEach((v) => {
  calculatorBtn.appendChild(v);
  style.allStyle(v, "#000", "lightblue", "0", "5px");
  style.fontWeight(v, "bold");
});
display.grid(
  calculatorBtn,
  [
    ["btn-Ce", "btn-Ce", "btn-delete", "btn-delete"],
    ["btn-1", "btn-2", "btn-3", "btn-4"],
  ],
  calculatorBtns,
  "5px"
);
// hover button
calculatorBtn.addEventListener("mouseover", (e) => {
  if (e.target.matches("button")) {
    e.target.style.opacity = ".8";
    e.target.style.color = "white";
    e.target.style.cursor = "pointer";
  }
});
calculatorBtn.addEventListener("mouseout", (e) => {
  if (e.target.matches("button")) {
    e.target.style.color = "black";
    e.target.style.opacity = "";
  }
});

//
const calculator = maker.contain("div");
//
style.allStyle(calculator, "#000", "rgb(100,100,100)", "0", "5px");
style.size(calculator, "200px", "auto", "10px", "10px");
//
calculator.appendChild(calculatorScreen);
calculator.appendChild(calculatorBtn);
//
// end section calculator // **************************************************

// section help
const helpBtn = maker.button("?", "help");
const help = maker.contain("div", "400px", "600px");

// section history
const historyBtn = maker.button("history", "history");
const history = maker.contain("div", "400px", "600px");

//
// model **************************************************
//
const solve = (stringArithmetic) => getResult(getExpression(stringArithmetic));
// example: '1+2(-3-3.05)+10%+(1*5-6.7' to ['1','+','2','*','(','-3','-3.05',')','+','10','/','100','+','(','1','*','5','-6.7',')']
function getExpression(stringExpression) {
  let exp = stringExpression;

  // replace the percent
  exp = exp.replace("%", "/100");

  // set Multiply
  exp = exp.replace(/(?<=[^+\-*/(])\(/g, "*("); // num( replace to num*(
  exp = exp.replace(/\)(?=[^+\-*/)])/g, ")*"); // )num replace to )*num

  // set parenthesis
  exp = exp.split("");
  let opens = exp.filter((v) => v == "(").length;
  let closes = exp.filter((v) => v == ")").length;
  while (opens > closes) {
    exp.push(")"), (closes += 1);
  }

  // get numbers and operators
  exp = exp.join("");
  exp = exp.match(/(-?\d+(\.\d+)?|[+\-*/()])/g);
  console.log("getExpresion: ", exp);
  return exp;
}
// example: '12+(34)' to ['12','+'(','34',')']
function getResult(arrExpression) {
  const opStack = [],
    numStack = [],
    basicOp = { "+": 1, "-": 1, "*": 2, "/": 2 };

  for (let el of arrExpression) {
    if (/[0-9]/.test(el)) {
      numStack.push(parseFloat(el));

      // add operator sustraction that not exist with addition
      let opCount = opStack.filter((v) => v !== ")" && v !== "(").length;

      if (!(opCount + 1 === numStack.length)) opStack.push("+");
    } else if (el in basicOp) {
      // callback: calculate()
      while (
        opStack.length > 0 &&
        opStack[opStack.length - 1] !== "(" &&
        basicOp[opStack[opStack.length - 1]] >= basicOp[el]
      ) {
        let operator = opStack.pop(),
          num2 = numStack.pop(),
          num1 = numStack.pop(),
          result = calculate(num1, num2, operator);

        numStack.push(result);
      }
      opStack.push(el);
    } else if (el === "(") {
      // acumulate ( in opStack.
      opStack.push(el);
    } else if (el === ")") {
      // callback: calculate()
      while (opStack.length > 0 && opStack[opStack.length - 1] !== "(") {
        let operator = opStack.pop(),
          num2 = numStack.pop(),
          num1 = numStack.pop(),
          result = calculate(num1, num2, operator);

        numStack.push(result);
      }
      opStack.pop(); // delete '('
    }
  }
  while (opStack.length > 0) {
    // callback: calculate(last operation)
    let operator = opStack.pop(),
      num2 = numStack.pop(),
      num1 = numStack.pop(),
      result = calculate(num1, num2, operator);

    numStack.push(result);
  }
  return numStack[0]; // result
}

function calculate(num1, num2, operator) {
  if (operator === "+") return num1 + num2;
  if (operator === "-") return num1 - num2;
  if (operator === "*") return num1 * num2;
  if (operator === "/") return num1 / num2;
}
/*
const expression = getExpression('1+2(-3-3.05)+10%+(1*5-6.7')
const result = getResult(expression)
console.log(result) // Resultado: 1.0
*/

//
// controller **************************************************
//
function writeOnCalculator(origin, output, result) {
  origin.addEventListener("click", (e) => {
    const lastChar = output.textContent.slice(-1)[0],
      isEmpy = lastChar == "",
      isNumLastChar = /[0-9]/.test(lastChar),
      isOpLastChar = /[+-\/*]/.test(lastChar),
      isOpenLastChar = /\(/.test(lastChar),
      isCloseLastChar = /\)/.test(lastChar),
      isPercentLastChar = /%/.test(lastChar);

    if (e.target.matches("button")) {
      if (
        e.target.matches(
          "#zero, #one, #two, #three, #four, #five, #six, #seven, #eight, #nine"
        )
      ) {
        output.textContent += e.target.textContent;
      } else if (e.target.matches("#ce")) {
        output.textContent = "";
        result.textContent = "";
      } else if (e.target.matches("#delete")) {
        !isEmpy
          ? (output.textContent = output.textContent.substring(
              0,
              output.textContent.length - 1
            ))
          : alert("valor no valido");
      } else if (e.target.matches("#leftParenthesis")) {
        output.textContent += "(";
      } else if (e.target.matches("#rightParenthesis")) {
        let arr = output.textContent.split(""),
          OpenChar = arr.filter((v) => v === "(").length,
          CloseChar = arr.filter((v) => v === ")").length;
        // validate
        !isOpLastChar && isNumLastChar && OpenChar > CloseChar
          ? (output.textContent += ")")
          : alert("valor no valido");
      } else if (e.target.matches("#percent")) {
        isNumLastChar || isCloseLastChar
          ? (output.textContent += "%")
          : alert("valor no valido");
      } else if (e.target.matches("#division")) {
        isNumLastChar || isCloseLastChar || isPercentLastChar
          ? (output.textContent += "/")
          : alert("valor no valido");
      } else if (e.target.matches("#multiply")) {
        isNumLastChar || isCloseLastChar || isPercentLastChar
          ? (output.textContent += "*")
          : alert("valor no valido");
      } else if (e.target.matches("#addition")) {
        isNumLastChar || isCloseLastChar || isPercentLastChar
          ? (output.textContent += "+")
          : alert("valor no valido");
      } else if (e.target.matches("#sustraction")) {
        isEmpy ||
        isNumLastChar ||
        isOpenLastChar ||
        isCloseLastChar ||
        isPercentLastChar
          ? (output.textContent += "-")
          : alert("valor no valido");
      } else if (e.target.matches("#sign")) {
        if (isNumLastChar) {
          let exp = output.textContent;
          // search the position
          let i = exp.length - 1;
          while (!/[+-\/*\(\)]/.test(exp[i]) && i > 0) {
            i--;
          }
          i === 0
            ? (output.textContent = "(-" + output.textContent)
            : (output.textContent =
                exp.substring(0, i + 1) + "(-" + exp.substring(i + 1));
        } else {
          alert("valor no valido");
        }
      } else if (e.target.matches("#point")) {
        let exp = output.textContent;
        // search the position
        let i = exp.length - 1;
        while (!/[+-\/*\(\)]/.test(exp[i]) && i > 0) {
          i--;
        }
        exp.substring(i).lastIndexOf(".") === -1
          ? (output.textContent += ".")
          : alert("valor no valido");
      } else if (e.target.matches("#equal")) {
        let solution = solve(output.textContent);
        isOpLastChar
          ? alert("valor no valido")
          : (result.textContent = solution);
      }
    }
  });
  // event to keyboard ********************************************************
  origin.addEventListener("keydown", (e) => {
    const lastChar = output.textContent.slice(-1)[0],
      isEmpy = lastChar === "",
      isNumLastChar = /[0-9]/.test(lastChar),
      isOpLastChar = /[+-\/*]/.test(lastChar),
      isOpenLastChar = /\(/.test(lastChar),
      isCloseLastChar = /\)/.test(lastChar),
      isPercentLastChar = /%/.test(lastChar);

    if (/[0-9]/.test(e.key)) {
      output.textContent += e.key;
    } else if (e.key === "Delete" || e.key === "Backspace") {
      if (!isEmpy) {
        output.textContent = output.textContent.substring(
          0,
          output.textContent.length - 1
        );
      }
    } else if (e.key === "(") {
      output.textContent += "(";
    } else if (e.key === ")") {
      let arr = output.textContent.split(""),
        OpenChar = arr.filter((v) => v === "(").length,
        CloseChar = arr.filter((v) => v === ")").length;
      // validate
      if (!isOpLastChar && isNumLastChar && OpenChar > CloseChar) {
        output.textContent += ")";
      }
    } else if (e.key === "%") {
      if (isNumLastChar || isCloseLastChar) {
        output.textContent += "%";
      }
    } else if (e.key === "/") {
      if (isNumLastChar || isCloseLastChar || isPercentLastChar) {
        output.textContent += "/";
      }
    } else if (e.key === "*") {
      if (isNumLastChar || isCloseLastChar || isPercentLastChar) {
        output.textContent += "*";
      }
    } else if (e.key === "+") {
      if (isNumLastChar || isCloseLastChar || isPercentLastChar) {
        output.textContent += "+";
      }
    } else if (e.key === "-") {
      if (
        isEmpy ||
        isNumLastChar ||
        isOpenLastChar ||
        isCloseLastChar ||
        isPercentLastChar
      ) {
        output.textContent += "-";
      }
    } else if (e.key === ".") {
      let exp = output.textContent;
      // search the position
      let i = exp.length - 1;
      while (!/[+-\/*\(\)]/.test(exp[i]) && i > 0) {
        i--;
      }
      if (exp.substring(i).lastIndexOf(".") === -1) {
        output.textContent += ".";
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      let solution = solve(output.textContent);
      isOpLastChar ? alert("valor no valido") : (result.textContent = solution);
    }
  });
}

//
// concection
//
// tag contain the calculator
const containCalculator = d.getElementById("box-calculator");
containCalculator.appendChild(calculator);

// function of calculator
document.addEventListener("DOMContentLoaded", (e) => {
  writeOnCalculator(containCalculator, screenOne, screenTwo);
});
