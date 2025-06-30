// Uso de Promises para simular pedidos de um restaurante

const readline = require('readline');

function prepararPedido(nome) {
  return new Promise((resolve, reject) => {
    const tempo = Math.random() * 3000 + 1000; // 1 a 4 segundos
    setTimeout(() => {
      if (Math.random() < 0.2) {
        reject(`Faltaram ingredientes para o pedido: ${nome}`);
      } else {
        resolve(`Pedido pronto: ${nome}`);
      }
    }, tempo);
  });
}

function menu() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('Escolha uma opção:\n1 - Executar pedidos predefinidos\n2 - Inserir pedidos manualmente\n> ', (opcao) => {
    if (opcao === '1') {
      executarPredefinidos();
      rl.close();
    } else if (opcao === '2') {
      rl.question('Deseja adicionar:\n1 - Um pedido\n2 - Vários pedidos\n> ', (subOpcao) => {
        if (subOpcao === '1') {
          rl.question('Digite o nome do pedido:\n> ', (nome) => {
            prepararPedido(nome.trim())
              .then(msg => console.log(msg))
              .catch(erro => console.error(erro))
              .finally(() => {
                console.log('Processo concluído');
                rl.close();
              });
          });
        } else if (subOpcao === '2') {
          rl.question('Digite os nomes dos pedidos separados por vírgula:\n> ', (input) => {
            const pedidos = input.split(',').map(p => p.trim()).filter(Boolean);
            if (pedidos.length === 0) {
              console.log('Nenhum pedido informado.');
              rl.close();
              return;
            }
            Promise.all(pedidos.map(prepararPedido))
              .then(resultados => {
                resultados.forEach(msg => console.log(msg));
                console.log('Todos os pedidos prontos!');
              })
              .catch(erro => console.error('Erro em algum pedido:', erro))
              .finally(() => rl.close());
          });
        } else {
          console.log('Opção inválida. Saindo.');
          rl.close();
        }
      });
    } else {
      console.log('Opção inválida. Saindo.');
      rl.close();
    }
  });
}

function executarPredefinidos() {
  // Um pedido
  prepararPedido("Pizza")
    .then(msg => console.log(msg))
    .catch(erro => console.error(erro))
    .finally(() => console.log("Processo concluído"));

  // Vários pedidos
  Promise.all([
    prepararPedido("Pizza"),
    prepararPedido("Hambúrguer"),
    prepararPedido("Salada")
  ])
    .then(resultados => {
      resultados.forEach(msg => console.log(msg));
      console.log("Todos os pedidos prontos!");
    })
    .catch(erro => console.error("Erro em algum pedido:", erro));
}

menu();
