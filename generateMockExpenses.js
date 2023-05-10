function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function randomPaymentMethod() {
    let methods = [
        'Cartão de crédito',
        'Débito direto',
        'Transferência',
        'MBWay',
        'Cheque',
        'Monetário'
    ];
    return methods[parseInt(Math.random() * methods.length)];
}

function generateExpenseData(qtd=10, priceLimit=10000) {
    let randomWords = require('random-words');
    let expenses = [];
    for (let i = 0; i < qtd; i++) {
        expenses.push(
            {
                id: i + 1,
                title: randomWords({
                    exactly: 1,
                    wordsPerString: Math.ceil(Math.random() * 2),
                    formatter: (word, index) => {
                        return index === 0 ? word.slice(0, 1).toUpperCase().concat(word.slice(1)) : word;
                    }
                })[0],
                entity: randomWords({
                    exactly: 1,
                    wordsPerString: Math.ceil(Math.random() * 2),
                    formatter: (word, index) => {
                        return index === 0 ? word.slice(0, 1).toUpperCase().concat(word.slice(1)) : word;
                    }
                })[0],
                price: parseFloat((Math.random() * priceLimit).toFixed(2)),
                dueDate: randomDate(new Date(2023, 0, 1),  new Date(2024, 0, 1)),
                paid: !!(parseInt(Math.round(Math.random() * 1))),
                paymentMethod: randomPaymentMethod()
            }
        );
    }
    return expenses.sort((ele) => ele.dueDate);
}

const data = JSON.stringify(generateExpenseData(5));
const file = 'expenses.json';
var fs = require('fs');
fs.writeFile(file, data, (error) => {
    if (error) {
        throw error;
    }
    console.log(`File '${file}' created.`);
});