// Arrays para armazenar dados do modo Orçamento/Gastos
let expenses = []; 
let incomes = []; 

// --- FUNÇÕES DE NAVEGAÇÃO E UX ---

function switchMode(mode) {
    // Esconder ambos os modos e mostrar o modo selecionado
    document.getElementById('investmentMode').style.display = 'none';
    document.getElementById('budgetMode').style.display = 'none';

    if (mode === 'investment') {
        document.getElementById('investmentMode').style.display = 'block';
    } else {
        document.getElementById('budgetMode').style.display = 'block';
    }
}

// --- FUNÇÕES DE CONTROLE DE GASTOS (BUDGET MODE) ---

function addExpense() {
    let expenseValue = parseFloat(document.getElementById('expenseEntry').value);
    
    // Supondo que você adicionou IDs 'expenseEntry' e 'incomeEntry' no HTML
    if (isNaN(expenseValue) || expenseValue <= 0) {
        alert("Por favor, insira um valor válido para a despesa.");
        return;
    }

    expenses.push(expenseValue);
    updateExpenseList();
    document.getElementById('expenseEntry').value = ''; 
}

function addIncome() {
    let incomeValue = parseFloat(document.getElementById('incomeEntry').value);
    
    if (isNaN(incomeValue) || incomeValue <= 0) {
        alert("Por favor, insira um valor válido para a receita.");
        return;
    }

    incomes.push(incomeValue);
    updateIncomeList();
    document.getElementById('incomeEntry').value = ''; 
}

function updateExpenseList() {
    const expenseList = document.getElementById('expenseList');
    if (!expenseList) return; // Garante que o elemento existe
    expenseList.innerHTML = ''; 

    expenses.forEach((expense, index) => {
        const li = document.createElement('li');
        li.textContent = `Despesa ${index + 1}: R$ ${expense.toFixed(2)}`;
        expenseList.appendChild(li);
    });
}

function updateIncomeList() {
    const incomeList = document.getElementById('incomeList');
    if (!incomeList) return; // Garante que o elemento existe
    incomeList.innerHTML = ''; 

    incomes.forEach((income, index) => {
        const li = document.createElement('li');
        li.textContent = `Receita ${index + 1}: R$ ${income.toFixed(2)}`;
        incomeList.appendChild(li);
    });
}

function calculateBudget() {
    const totalIncome = incomes.reduce((acc, income) => acc + income, 0); 
    const totalExpense = expenses.reduce((acc, expense) => acc + expense, 0); 
    const balance = totalIncome - totalExpense; 

    // Reutiliza a função updateTable para exibir os resultados do orçamento
    updateTable(
        ['Renda Total', 'Despesas Totais', 'Saldo Final'], 
        [totalIncome, totalExpense, balance],
        'budgetDetails' // ID da tabela de detalhamento do orçamento
    );
}

// --- FUNÇÕES DE SIMULAÇÃO DE INVESTIMENTO (INVESTMENT MODE) ---

/**
 * Esta função deve ser chamada quando o usuário CLICA no botão de converter ou simular.
 * Assume que o campo de input tem o ID 'investmentPeriod'
 */
function convertYearsToMonths() {
    const yearsInput = document.getElementById('investmentPeriod');
    const years = parseFloat(yearsInput.value); 
    
    if (!isNaN(years) && years > 0) {
        const months = Math.round(years * 12); // Arredonda para o mês mais próximo
        // Não sobrescreve o campo. A simulação usa o valor em ANOS e converte internamente.
        // O Alerta/log serve apenas como feedback:
        console.log(`Período de ${years} anos = ${months} meses.`); 
        
        // Chamamos a simulação após a "conversão"
        simulateInvestment(); 
    } else {
        alert('Por favor, insira um valor válido para o período em anos.');
    }
}


function simulateInvestment() {
    // 1. Coleta de Dados
    const initialValue = parseFloat(document.getElementById('initialValue').value);
    const monthlyContribution = parseFloat(document.getElementById('monthlyContribution').value);
    
    // Taxa anual (ex: 60%)
    const annualInterestRate = parseFloat(document.getElementById('interestRate').value); 
    const interestRateMonthly = annualInterestRate / 100 / 12; // Ex: 60/100/12 = 0.05
    
    // Pega o valor do campo (presumimos que é em ANOS para a conversão)
    const periodYears = parseFloat(document.getElementById('investmentPeriod').value);
    const periodMonths = Math.round(periodYears * 12); 
    
    const includeTaxAndInflation = document.getElementById('includeTaxAndInflation').checked;

    // 2. Validação
    if (isNaN(initialValue) || isNaN(monthlyContribution) || isNaN(annualInterestRate) || periodYears <= 0) {
        alert("Por favor, insira valores válidos em todos os campos.");
        return;
    }

    // 3. Simulação Pura (Juros Compostos)
    let totalInvested = initialValue + (monthlyContribution * periodMonths);
    let futureValue = initialValue;
    
    // Array para o gráfico (opcional)
    let monthlyData = [];

    for (let i = 0; i < periodMonths; i++) {
        // Crescimento = (Valor Atual * (1 + Juros Mensal)) + Aporte
        futureValue = futureValue * (1 + interestRateMonthly) + monthlyContribution;
        monthlyData.push(futureValue); // Armazena para o gráfico
    }

    let totalInterest = futureValue - totalInvested; // O lucro bruto

    // 4. Aplicação de Imposto e Inflação (Análise do Ganho Real)
    let finalValueLiquido = futureValue;
    let realReturn = totalInterest; // Começa como lucro bruto

    if (includeTaxAndInflation) {
        // A. Imposto de Renda (15% sobre o lucro, simplificado)
        const taxRate = 0.15; 
        const taxAmount = totalInterest * taxRate;
        finalValueLiquido = futureValue - taxAmount;
        
        // B. Correção pela Inflação (Taxa anual média de 3%)
        const annualInflationRate = 0.03; 
        const inflationFactor = Math.pow(1 + annualInflationRate, periodYears);
        
        // Valor que o investimento inicial e os aportes teriam que ter hoje
        // para manter o poder de compra.
        const totalInvestedCorrected = totalInvested * inflationFactor;
        
        // Ganho Real: O que sobrou após impostos e acima da correção da inflação
        realReturn = finalValueLiquido - totalInvestedCorrected;
    }
    
    // 5. Exibição dos Resultados
    updateTable(
        ['Valor Final Bruto', 'Total Investido (Principal + Aportes)', 'Juros Acumulados', 'Ganho Real (Liquido de Impostos/Inflação)'],
        [futureValue, totalInvested, totalInterest, realReturn],
        'investmentDetails' // ID da tabela de detalhamento do investimento
    );
    
    // Chamada opcional para desenhar o gráfico com 'monthlyData'
    // drawChart(monthlyData);
}

// --- FUNÇÃO AUXILIAR DE TABELA (REAPROVEITADA) ---

/**
 * Atualiza a tabela de detalhamento em qualquer modo.
 * @param {string[]} labels - Rótulos das linhas (ex: 'Renda Total').
 * @param {number[]} values - Valores correspondentes.
 * @param {string} tableId - O ID do elemento tbody que será atualizado (ex: 'investmentDetails').
 */
function updateTable(labels, values, tableId) {
    // Certifique-se de que a tabela ou tbody existe
    const tbody = document.querySelector(`#${tableId} tbody`) || document.querySelector('#details tbody');
    if (!tbody) {
        console.error(`Tabela com ID ${tableId} não encontrada.`);
        return;
    }
    
    tbody.innerHTML = ''; 

    labels.forEach((label, index) => {
        const row = document.createElement('tr');
        const cell1 = document.createElement('td');
        cell1.textContent = label;
        const cell2 = document.createElement('td');
        
        // Formata como moeda, mas trata o rótulo de período sem R$
        const value = values[index];
        if (typeof value === 'number') {
            cell2.textContent = `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            // Cor do saldo para o modo Orçamento
            if (label === 'Saldo Final' && value < 0) {
                cell2.style.color = 'red';
            } else if (label === 'Saldo Final') {
                cell2.style.color = 'green';
            }
        } else {
            cell2.textContent = value; // Para o label de período
        }

        row.appendChild(cell1);
        row.appendChild(cell2);
        tbody.appendChild(row);
    });
}