const transacaoForm = document.getElementById('transacaoForm');
const transacaoList = document.getElementById('transacaoList');
const saldoTotalel = document.getElementById('saldoTotal');

let transacoes = [];
let edicaoTransacao = null;

transacaoForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const descricao = document.getElementById('descricao').value.trim();
    const valor = parseFloat(document.getElementById('valor').value);
    const tipoTransacao = document.getElementById('tipoTransacao').value.trim();

    if (descricao && valor) {
        const transacao = {
            id: edicaoTransacao ? edicaoTransacao.id : Date.now(),
            descricao: descricao,
            valor: tipoTransacao === 'debito' ? valor : -valor
        }

        if (edicaoTransacao) {
            transacoes = transacoes.map((tran) => (tran.id === edicaoTransacao.id ? transacao : tran))
            edicaoTransacao = null;
            document.getElementById('submitBtn').textContent = "Adicionar";
        } else {
            transacoes.push(transacao);
        }

        atualizarTransacoes();
        calcularSaldoTotal(); 
        transacaoForm.reset();
    }
});

function atualizarTransacoes() {
    transacaoList.innerHTML = '';
    transacoes.forEach((transacao) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${transacao.descricao} - ${
                transacao.valor.toLocaleString('pt-br', {
                style: 'currency',
                currency: 'BRL'
            })}
            </span>
            <div class="icons">
                <button onclick="editarTransacao(${transacao.id})">Editar</button>
                <button onclick="deletarTransacao(${transacao.id})">Deletar</button>
            </div>
        `;
        transacaoList.appendChild(li);
    });
}

function editarTransacao(id) { 
    
    const transacao = transacoes.find((t) => t.id === id);

    document.getElementById('tipoTransacao').value = transacao.valor >= 0 ? 'debito' : 'despesa';
    document.getElementById('descricao').value = transacao.descricao;
    document.getElementById('valor').value = Math.abs(transacao.valor);

    edicaoTransacao = transacao;
    document.getElementById('submitBtn').textContent = 'Atualizar';
}

function deletarTransacao(id) { 
    transacoes = transacoes.filter((t) => t.id !== id);
    atualizarTransacoes();
    calcularSaldoTotal(); 
}

function calcularSaldoTotal() {
    const saldoTotal = transacoes.reduce((acc, transacao) => acc + transacao.valor, 0);
    saldoTotalel.textContent = saldoTotal.toLocaleString('pt-BR', {style: 'currency', currency: "BRL"});
}

window.editarTransacao = editarTransacao;
window.deletarTransacao = deletarTransacao;