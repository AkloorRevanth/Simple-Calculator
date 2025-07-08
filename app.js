let inputBox = document.getElementById('inputBox'); // Fixed typo: inputNox -> inputBox
let buttons = document.querySelectorAll('button');

let string = '';

// Function to safely evaluate a mathematical expression
function safeEval(expression) {
  // Only allow digits, operators, and decimal points
  if (!/^[0-9+\-*/%.() ]*$/.test(expression)) {
    throw new Error('Invalid characters in expression');
  }
  try {
    // Use Function constructor instead of eval for safer evaluation
    return new Function('return ' + expression)();
  } catch (e) {
    return 'Error';
  }
}

buttons.forEach(element => {
  element.addEventListener('click', (b) => {
    let buttonText = b.target.innerText.trim(); // Trim to handle any extra spaces
    // Clear if last result was 'Error' or 'undefined'
    if (string === 'Error' || string === 'undefined') {
      string = '';
      inputBox.value = '';
    }

    if (buttonText === '=') {
      try {
        string = String(safeEval(string));
        inputBox.value = string;
      } catch (e) {
        string = 'Error';
        inputBox.value = string;
      }
    } else if (buttonText === 'AC') {
      string = '';
      inputBox.value = string;
    } else if (buttonText === 'DEL') {
      string = string.substring(0, string.length - 1);
      inputBox.value = string;
    } else if (b.target.id === 'plusMinus') {
      // Toggle sign of the last number or entire expression
      if (string) {
        try {
          // If the string is a valid number, negate it
          if (!isNaN(parseFloat(string))) {
            string = String(-parseFloat(string));
          } else {
            // Wrap the expression in parentheses and negate
            string = string.startsWith('-(') && string.endsWith(')') 
              ? string.slice(2, -1) 
              : `-(${string})`;
          }
          inputBox.value = string;
        } catch (e) {
          string = 'Error';
          inputBox.value = string;
        }
      }
    } else {
      // Basic validation to prevent multiple operators or decimal points
      if (['+', '-', '*', '/', '%'].includes(buttonText)) {
        // Prevent multiple consecutive operators
        if (string && ['+', '-', '*', '/', '%'].includes(string.slice(-1))) {
          return; // Ignore if last character is already an operator
        }
      } else if (buttonText === '.') {
        // Prevent multiple decimal points in a number
        let lastNumber = string.split(/[\+\-\*\/%]/).pop();
        if (lastNumber.includes('.')) {
          return; // Ignore if the last number already has a decimal point
        }
      }
      string += buttonText;
      inputBox.value = string;
    }
  });
});
