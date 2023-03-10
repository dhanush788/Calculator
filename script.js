class Calculator {
  constructor(previousOperandTextElement, currentOperandTextElement) {
    this.previousOperandTextElement = previousOperandTextElement
    this.currentOperandTextElement = currentOperandTextElement
    this.clear()
  }

  sine(degree) {
    let x = Math.sin(degree * Math.PI / 180);
    return x.toFixed(2);   
    }
  cosine(degree) {
    // radians = degrees * PI / 180
    let x = Math.cos(degree * Math.PI / 180);
    return x.toFixed(2);   
    }
  Log(y) {
    return Math.log(y) / Math.log(10);
    }
  clear() {
    this.currentOperand = ''
    this.previousOperand = ''
    this.operation = undefined
  }

  delete() {
    if(this.currentOperand !== ''){
      this.currentOperand = this.currentOperand.toString().slice(0, -1)
    }
    else{ 
      this.currentOperand=this.previousOperand
      this.currentOperandTextElement.innerText =`${this.getDisplayNumber(this.currentOperand)}`
      this.operation=''
      this.previousOperand=''
    }
  }

  appendNumber(number) {
    if (number === '.' && this.currentOperand.includes('.')) return
    if (this.currentOperand =='' && number =='.' ) {
      this.currentOperand = 0 + number.toString()
    return this.currentOperand}
    if (this.currentOperand >=10000000000 )return
    this.currentOperand = this.currentOperand.toString() + number.toString()
  }

  chooseOperation(operation) {
    if(this.currentOperand!=='' && (this.operation=='sin'||this.operation=='cos'||this.operation=='ln')) {  
      this.compute()
      this.operation = operation
      this.previousOperand = this.currentOperand
      this.currentOperand = ''
    }
    if((this.operation == '%' || this.operation == '^2') && this.previousOperand!=='' ){
      this.compute()
      this.operation = operation
      this.previousOperand = this.currentOperand
      this.currentOperand = ''
    }

    if (this.currentOperand === '' && this.previousOperand==='' && (operation=='+'||operation=='-'||operation=='*'||operation=='÷'||operation=='^'||operation=='^2'||operation=='%')){ return }
    if (this.currentOperand === '' && this.previousOperand==='' && (operation=='sin'||operation=='cos'||operation=='ln')){
      this.operation = operation
     }
    if (this.previousOperand !== '' && this.currentOperand !== '' ) {  
      this.compute()
      this.operation = operation
      this.previousOperand = this.currentOperand
      this.currentOperand = ''
    }
    if(this.previousOperand !== '' && this.currentOperand === ''){
      this.operation = operation
      this.previousOperand = this.previousOperand
    }else{
      this.operation = operation
      this.previousOperand = this.currentOperand
      this.currentOperand = ''}
  }

  compute() {
    let computation
    const prev = parseFloat(this.previousOperand)
    const current = parseFloat(this.currentOperand)
    console.log(prev,current,this.operation);
    if (isNaN(prev) && isNaN(current)) return
    if ((this.operation=='sin' || this.operation=='cos' || this.operation=='ln')&& isNaN(current))return
   
   
    if ((this.operation=='%' || this.operation=='^2' )&& isNaN(current)){  
      console.log('hi');
      switch (this.operation) {
         //before
      case '^2':
        computation = prev * prev
        break
      case '%':
        computation = prev /100
        break
      }
      this.currentOperand = computation
    this.operation = undefined
    this.previousOperand = ''
    }
      
    if ((this.operation !=='%' || this.operation !=='^2' )&& isNaN(current))return
    if ((this.operation=='sin' || this.operation=='cos' || this.operation=='ln')&& isNaN(prev)){  
      switch (this.operation) {
        case 'sin':
          computation = this.sine(current)
          break
        case 'cos':
          computation = this.cosine(current)
          break
        case 'ln':
          computation = this.Log(current)
          break
          default:
        return
      }
    }
    else {switch (this.operation) {
      case '+':
        computation = prev + current
        break
      case '-':
        computation = prev - current
        break
      case '*':
        computation = prev * current
        break
      case '÷':
        computation = prev / current
        break
      case '^':
        let i = 0
        let x=1
        while (i < current) {
           x=x*prev
          i++;
        }
        computation =x
        break
     
      //after
      case 'sin':
        computation = prev*this.sine(current)
        break
      case 'cos':
        computation = prev*this.cosine(current)
        break
      case 'ln':
        computation = prev*this.Log(current)
        break
        default:
        return
    }}
    this.currentOperand = computation
    this.operation = undefined
    this.previousOperand = ''
  }



  getDisplayNumber(number) {
    const stringNumber = number.toString()
    const integerDigits = parseFloat(stringNumber.split('.')[0])
    const decimalDigits = stringNumber.split('.')[1]
    let integerDisplay
    if (integerDigits > 99999999999){
      integerDisplay=integerDigits.toExponential(3)
      if (integerDigits == 'Infinity' || integerDisplay=='∞'){
        this.currentOperandTextElement.innerText = 'Error'}
      else return `${integerDisplay}`}
    if (isNaN(integerDigits)) {
      integerDisplay = ''
    } else {
      integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 })
    }
    if (decimalDigits != null) {
    
      return `${integerDisplay}.${decimalDigits}`
    } else {
      return integerDisplay
    }
  }

  updateDisplay() {
    this.currentOperandTextElement.innerText =
      this.getDisplayNumber(this.currentOperand)
    if (this.operation != null) {
      this.previousOperandTextElement.innerText =
        `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`
    } else {
      this.previousOperandTextElement.innerText = ''
    }
  }
}


const numberButtons = document.querySelectorAll('[data-number]')
const operationButtons = document.querySelectorAll('[data-operation]')
var equalsButton = document.querySelector('[data-equals]')
const deleteButton = document.querySelector('[data-delete]')
const allClearButton = document.querySelector('[data-all-clear]')
const previousOperandTextElement = document.querySelector('[data-previous-operand]')
const currentOperandTextElement = document.querySelector('[data-current-operand]')
// const squareButton = document.querySelectorAll('[data-square]')
const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement)

numberButtons.forEach(button => {
  button.addEventListener('click', () => {
    calculator.appendNumber(button.innerText)
    calculator.updateDisplay()
  })
})

operationButtons.forEach(button => {
  button.addEventListener('click', () => {
    calculator.chooseOperation(button.innerText)
    calculator.updateDisplay()
  })
})

equalsButton.addEventListener('click', button => {
  calculator.compute()
  calculator.updateDisplay()
})

allClearButton.addEventListener('click', button => {
  calculator.clear()
  calculator.updateDisplay()
})

deleteButton.addEventListener('click', button => {
  calculator.delete()
  calculator.updateDisplay()
})


