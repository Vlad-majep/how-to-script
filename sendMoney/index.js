require('dotenv').config();
const { Web3 } = require('web3');

const web3 = new Web3("https://rpc.ankr.com/eth_sepolia"); // подключение к рпс сети ( в моем случае сеполия тестнет )

const privateKey = process.env.PRIVATE_KEY; // Импорт приватного ключа из .env файла 

async function sendNative(toAddress, amount) { 
    try {
        const account = web3.eth.accounts.privateKeyToAccount(privateKey); // создания объекта акаунта из приватника для получения публичного ключа

        const balanceInWei = await web3.eth.getBalance(account.address); // получение баланса кошелька с которого будет отправка
        const amountWei = web3.utils.toWei(amount.toString(), 'ether'); // переобразование суммы из единиц Ether в Wei ( 0.1 ETH => 100000000000000000 WEI)
        const balanceInEther = web3.utils.fromWei(balanceInWei, 'ether'); // баланс в эфирах для логов

        if (balanceInWei < amountWei) { // Проверка хватает ли у нашего кошелька эфира для отправки 
            return console.log(`Не хватает денег для отправки у кошелька ${account.address}\n\nПытаешься отправить ${amount}\n\nА на балансе ${balanceInEther}`); 
        }

        const gasPrice = await web3.eth.getGasPrice(); // получение текущего газ прайса 

        const transaction = { // создание объекта транзакции
            from: account.address,
            to: toAddress,
            value: amountWei,
            gas: 21000,
            gasPrice,
        };

        const signedTransaction = await web3.eth.accounts.signTransaction(transaction, privateKey); // подпись транзакции с помощью приватного ключа
        const receipt = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction); // отправка подписанной транзакции в блокчейн

        console.log("https://sepolia.etherscan.io/tx/" + receipt.transactionHash); // вывод в терминал хеш транзакции в удобном виде ссылки ( если будете использовать другую сеть то нужно юзать другой сканер соотвественно)
    } catch (error) {
        console.log(error); // обработка ошибок
    }
}

//  Пример использования функции
sendNative("0x000000000000000000000000000000000000dead", 5);
