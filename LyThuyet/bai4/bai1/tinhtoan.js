const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});
app.post('/tinhtoan1', (req, res) => {
    const { num1, num2, operation } = req.body;
    let result = calculate(num1, num2, operation);
    res.send("Kết quả là" + result);
  });
  
  app.post('/tinhtoan2', (req, res) => {
    const { num1, num2, operation } = req.body;
    let result = calculate(num1, num2, operation);
    console.log(req.body);
    res.json({ result });
  });
function calculate(num1, num2, operation) {
    num1 = parseFloat(num1);
    num2 = parseFloat(num2);
  
    let result;
  
    if (operation === 'add') {
      result = num1 + num2;
    } else if (operation === 'subtract') {
      result = num1 - num2;
    } else if (operation === 'multiply') {
      result = num1 * num2;
    } else if (operation === 'divide') {
      if (num2 !== 0) {
        result = num1 / num2;
      } else {
        result = 'Không thể chia cho 0';
      }
    }
  
    return result;
  }

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
