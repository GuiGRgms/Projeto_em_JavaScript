  
        // Sistema de Autenticação  
        const loginModal = document.getElementById('loginModal');  
        const loginBtn = document.getElementById('loginBtn');  
        const logoutBtn = document.getElementById('logoutBtn');  
        const userInfo = document.getElementById('userInfo');  
        const userAvatar = document.getElementById('userAvatar');  
        const userName = document.getElementById('userName');  
        const adminBadge = document.getElementById('adminBadge');  
        const adminPanelBtn = document.getElementById('adminPanelBtn');  
        const closeModal = document.getElementById('closeModal');  
        const authForm = document.getElementById('authForm');  
        const modalTitle = document.getElementById('modalTitle');  
        const switchAuth = document.getElementById('switchAuth');  
        const confirmPasswordGroup = document.getElementById('confirmPasswordGroup');  
        const submitAuth = document.getElementById('submitAuth');  
         
        // Navegação  
        const navHome = document.getElementById('navHome');  
        const navSubjects = document.getElementById('navSubjects');  
        const navStudy = document.getElementById('navStudy');  
        const subjectsSection = document.getElementById('subjects');  
        const studySession = document.getElementById('studySession');  
        const backToSubjects = document.getElementById('backToSubjects');  
         
        let isLoginMode = true;  
        let currentStudySubject = null;  
        let currentDifficultyLevel = 1;  
         
        // Verificar se há usuário logado  
        function checkAuth() {  
            const currentUser = localStorage.getItem('currentUser');  
            if (currentUser) {  
                const user = JSON.parse(currentUser);  
                userInfo.style.display = 'flex';  
                loginBtn.style.display = 'none';  
                userName.textContent = user.username;  
                userAvatar.textContent = user.username.charAt(0).toUpperCase();  
                 
                // Verificar se é admin  
                if (user.username === 'admin') {  
                    adminBadge.style.display = 'inline -block';  
                    adminPanelBtn.style.display = 'block';  
                    document.getElementById('adminPanel').style.display = 'block';  
                    loadAdminData();  
                } else {  
                    adminBadge.style.display = 'none';  
                    adminPanelBtn.style.display = 'none';  
                    document.getElementById('adminPanel').style.display = 'none';  
                } 
                 
                loadUserData(user.username);  
                showSubjects();  
            } else {  
                userInfo.style.display = 'none';  
                loginBtn.style.display = 'block';  
                adminBadge.style.display = 'none';  
                adminPanelBtn.style.display = 'none';  
                document.getElementById('adminPanel').style.display = 'none';  
                showHome();  
            } 
        } 
         
        // Navegação entre seções  
        function showHome() {  
            document.querySelector('.hero').style.display = 'block';  
            subjectsSection.style.display = 'none';  
            studySession.style.display = 'none';  
            navStudy.style.display = 'none';  
        } 
         
        function showSubjects() {  
            document.querySelector('.hero').style.display = 'none';  
            subjectsSection.style.display = 'block';  
            studySession.style.display = 'none';  
            navStudy.style.display = 'none';  
        } 
         
        function showStudySession(subject) {  
            document.querySelector('.hero').style.display = 'none';  
            subjectsSection.style.display = 'none';  
            studySession.style.display = 'block';  
            navStudy.style.display = 'block';  
             
            currentStudySubject = subject;  
            document.getElementById('subjectName').textContent = subject.name;  
             
            // Carregar conteúdo da matéria  
            loadStudyMaterial(subject);  
             
            // Iniciar temporizador automaticamente  
            startTimer();  
        } 
         
        navHome.addEventListener('click', (e) => {  
            e.preventDefault();  
            showHome();  
        }); 
         
        navSubjects.addEventListener('click', (e) => {  
            e.preventDefault();  
            showSubjects();  
        }); 
         
        navStudy.addEventListener('click', (e) => {  
            e.preventDefault();  
            if (currentStudySubject) {  
                showStudySession(currentStudySubject);  
            } 
        }); 
         
        backToSubjects.addEventListener('click', () => {  
            showSubjects();  
        }); 
         
        // Carregar dados do usuário  
        function loadUserData(username) {  
            const userData = localStorage.getItem(`userData_${username}`);  
            if (userData) {  
                const data = JSON.parse(userData);  
                 
                // Carregar matérias  
                if (data.subjects) {  
                    renderSubjects(data.subjects);  
                } 
                 
                // Carregar anotações  
                if (data.notes) {  
                    document.getElementById('notes -text').value = data.notes;  
                } 
                 
                // Carregar tarefas  
                if (data.todos) {  
                    renderTodos(data.todos);  
                } 
            } else {  
                // Inicializar dados do usuário  
                const initialData = {  
                    subjects: [],  
                    notes: '',  
                    todos: []  
                }; 
                localStorage.setItem(`userData_${username}`, JSON.stringify(initialData));  
                renderSubjects([]);  
                renderTodos([]);  
            } 
        } 
         
        // Salvar dados do usuário  
        function saveUserData() {  
            const currentUser = localStorage.getItem('currentUser');  
            if (currentUser) {  
                const user = JSON.parse(currentUser);  
                const userData = {  
                    subjects: getSubjects(),  
                    notes: document.getElementById('notes -text').value,  
                    todos: getTodos()  
                }; 
                localStorage.setItem(`userData_${user.username}`, JSON.stringify(userData));  
            } 
        } 
         
        // Event Listeners para autenticação  
        loginBtn.addEventListener('click', () => {  
            loginModal.style.display = 'flex';  
        }); 
         
        closeModal.addEventListener('click', () => {  
            loginModal.style.display = 'none';  
        }); 
         
        switchAuth.addEventListener('click', () => {  
            isLoginMode = !isLoginMode;  
            if (isLoginMode) {  
                modalTitle.textContent = 'Entrar no StudyHub';  
                submitAuth.textContent = 'Entrar';  
                switchAuth.textContent = 'Não tem uma conta? Cadastre -se'; 
                confirmPasswordGroup.style.display = 'none';  
            } else {  
                modalTitle.textContent = 'Criar Conta no StudyHub';  
                submitAuth.textContent = 'Cadastrar';  
                switchAuth.textContent = 'Já tem uma conta? Entre aqui';  
                confirmPasswordGroup.style.display = 'block';  
            } 
        }); 
         
        authForm.addEventListener('submit', (e) => {  
            e.preventDefault();  
            const username = document.getElementById('username').value;  
            const password = document.getElementById('password').value;  
             
            if (isLoginMode) {  
                // Login  
                const users = JSON.parse(localStorage.getItem('users') || '[]');  
                const user = users.find(u => u.username === username && u.password === 
password);  
                 
                if (user) {  
                    localStorage.setItem('currentUser', JSON.stringify(user));  
                    loginModal.style.display = 'none';  
                    checkAuth();  
                    alert(`Bem -vindo de volta, ${username}!`);  
                } else {  
                    alert('Usuário ou senha incorretos!');  
                } 
            } else {  
                // Cadastro  
                const confirmPassword = document.getElementById('confirmPassword').value;  
                 
                if (password !== confirmPassword) {  
                    alert('As senhas não coincidem!');  
                    return;  
                } 
                 
                const users = JSON.parse(localStorage.getItem('users') || '[]');  
                 
                if (users.find(u => u.username === username)) {  
                    alert('Este nome de usuário já está em uso!');  
                    return;  
                } 
                 
                const newUser = { username, password };  
                users.push(newUser);  
                localStorage.setItem('users', JSON.stringify(users));  
                localStorage.setItem('currentUser', JSON.stringify(newUser));  
                 
                loginModal.style.display = 'none';  
                checkAuth();  
                alert(`Conta criada com sucesso! Bem -vindo, ${username}!`);  
            } 
        }); 
         
        logoutBtn.addEventListener('click', () => {  
            saveUserData();  
            localStorage.removeItem('currentUser');  
            checkAuth();  
            alert('Você saiu da sua conta.');  
        }); 
         
        // Painel de Administração  
        function loadAdminData() {  
            // Carregar matérias do sistema  
            const systemSubjects = JSON.parse(localStorage.getItem('systemSubjects') || '[]');  
            renderAdminSubjects(systemSubjects);  
             
            // Carregar flashcards do sistema  
            const systemFlashcards = JSON.parse(localStorage.getItem('systemFlashcards') || 
'[]');  
            renderAdminFlashcards(systemFlashcards);  
             
            // Preencher select de matérias para flashcards  
            const flashcardSubjectSelect = document.getElementById('flashcardSubject');  
            flashcardSubjectSelect.innerHTML = '<option value="">Selecione uma 
matéria</option>';  
            systemSubjects.forEach(subject => {  
                const option = document.createElement('option');  
                option.value = subject.name;  
                option.textContent = subject.name;  
                flashcardSubjectSelect.appendChild(option);  
            }); 
        } 
         
        function renderAdminSubjects(subjects) {  
            const adminSubjectsList = document.getElementById('adminSubjectsList');  
            adminSubjectsList.innerHTML = '';  
             
            if (subjects.length === 0) {  
                adminSubjectsList.innerHTML = '<p>Nenhuma matéria cadastrada no 
sistema.</p>';  
                return;  
            } 
             
            subjects.forEach((subject, index) => {  
                const subjectItem = document.createElement('div');  
                subjectItem.className = 'flashcard -item';  
                subjectItem.innerHTML = `  
                    <h4><i class="${subject.icon || 'fas fa -book'}"></i> ${subject.name}</h4>  
                    <div class="flashcard -actions">  
                        <button class="btn delete -btn" data -index="${index}" 
onclick="deleteSystemSubject(${index})">Excluir</button>  
                    </div>  
                `; 
                adminSubjectsList.appendChild(subjectItem);  
            }); 
        } 
         
        function renderAdminFlashcards(flashcards) {  
            const adminFlashcardsList = document.getElementById('adminFlashcardsList');  
            adminFlashcardsList.innerHTML = '';  
             
            if (flashcards.length === 0) {  
                adminFlashcardsList.innerHTML = '<p>Nenhum conteúdo cadastrado no 
sistema.</p>';  
                return;  
            } 
             
            // Agrupar flashcards por matéria e tópico  
            const groupedFlashcards = {};  
            flashcards.forEach(flashcard => {  
                const key = `${flashcard.subject} -${flashcard.topic}`;  
                if (!groupedFlashcards[key]) {  
                    groupedFlashcards[key] = {  
                        subject: flashcard.subject,  
                        topic: flashcard.topic,  
                        flashcards: []  
                    }; 
                } 
                groupedFlashcards[key].flashcards.push(flashcard);  
            }); 
             
            Object.values(groupedFlashcards).forEach(group => {  
                const groupItem = document.createElement('div');  
                groupItem.className = 'flashcard -item';  
                groupItem.innerHTML = `  
                    <h4>${group.subject} - ${group.topic}</h4>  
                    <p><strong>${group.flashcards.length}</strong> flashcards</p>  
                    <div class="flashcard -actions">  
                        <button class="btn delete -btn" 
onclick="deleteSystemFlashcards('${group.subject}', '${group.topic}')">Excluir 
Tópico</button>  
                    </div>  
                `; 
                adminFlashcardsList.appendChild(groupItem);  
            }); 
        } 
         
        // Adicionar matéria ao sistema (admin)  
        document.getElementById('addAdminSubject').addEventListener('click', () => {  
            const subjectName = document.getElementById('adminSubjectName').value.trim();  
            const subjectIcon = document.getElementById('adminSubjectIcon').value.trim();  
             
            if (subjectName) {  
                const systemSubjects = JSON.parse(localStorage.getItem('systemSubjects') || '[]');  
                systemSubjects.push({  
                    name: subjectName,  
                    icon: subjectIcon || 'fas fa -book'  
                }); 
                localStorage.setItem('systemSubjects', JSON.stringify(systemSubjects));  
                renderAdminSubjects(systemSubjects);  
                 
                // Atualizar select de matérias para flashcards  
                const flashcardSubjectSelect = document.getElementById('flashcardSubject');  
                const option = document.createElement('option');  
                option.value = subjectName;  
                option.textContent = subjectName;  
                flashcardSubjectSelect.appendChild(option);  
                 
                document.getElementById('adminSubjectName').value = '';  
                document.getElementById('adminSubjectIcon').value = '';  
                alert('Matéria adicionada ao sistema com sucesso!');  
            } 
        }); 
         
        // Adicionar flashcard ao sistema (admin)  
        document.getElementById('addFlashcard').addEventListener('click', () => {  
            const subject = document.getElementById('flashcardSubject').value;  
            const topic = document.getElementById('flashcardTopic').value.trim();  
            const front = document.getElementById('flashcardFront').value.trim();  
            const back = document.getElementById('flashcardBack').value.trim();  
             
            if (subject && topic && front && back) {  
                const systemFlashcards = JSON.parse(localStorage.getItem('systemFlashcards') || 
'[]');  
                systemFlashcards.push({ subject, topic, front, back });  
                localStorage.setItem('systemFlashcards', JSON.stringify(systemFlashcards));  
                renderAdminFlashcards(systemFlashcards);  
                 
                document.getElementById('flashcardTopic').value = '';  
                document.getElementById('flashcardFront').value = '';  
                document.getElementById('flashcardBack').value = '';  
                alert('Conteúdo adicionado ao sistema com sucesso!');  
            } else {  
                alert('Preencha todos os campos para adicionar conteúdo!');  
            } 
        }); 
         
        // Funções globais para exclusão (precisam estar no escopo global)  
        window.deleteSystemSubject = function(index) {  
            const systemSubjects = JSON.parse(localStorage.getItem('systemSubjects') || '[]');  
            const subjectName = systemSubjects[index].name;  
            systemSubjects.splice(index, 1);  
            localStorage.setItem('systemSubjects', JSON.stringify(systemSubjects));  
            renderAdminSubjects(systemSubjects);  
             
            // Remover flashcards dessa matéria  
            const systemFlashcards = JSON.parse(localStorage.getItem('systemFlashcards') || 
'[]');  
            const updatedFlashcards = systemFlashcards.filter(f => f.subject !== subjectName);  
            localStorage.setItem('systemFlashcards', JSON.stringify(updatedFlashcards));  
            renderAdminFlashcards(updatedFlashcards);  
             
            // Atualizar select de matérias para flashcards  
            const flashcardSubjectSelect = document.getElementById('flashcardSubject');  
            flashcardSubjectSelect.innerHTML = '<option value="">Selecione uma 
matéria</option>';  
            systemSubjects.forEach(subject => {  
                const option = document.createElement('option');  
                option.value = subject.name;  
                option.textContent = subject.name;  
                flashcardSubjectSelect.appendChild(option);  
            }); 
             
            alert('Matéria removida do sistema!');  
        }; 
         
        window.deleteSystemFlashcards = function(subject, topic) {  
            const systemFlashcards = JSON.parse(localStorage.getItem('systemFlashcards') || 
'[]');  
            const updatedFlashcards = systemFlashcards.filter(f => !(f.subject === subject && 
f.topic === topic));  
            localStorage.setItem('systemFlashcards', JSON.stringify(updatedFlashcards));  
            renderAdminFlashcards(updatedFlashcards);  
            alert('Conteúdo removido do sistema!');  
        }; 
         
        // Abas do painel admin  
        document.querySelectorAll('.admin -tab').forEach(tab => {  
            tab.addEventListener('click', function() {  
                // Remover classe active de todas as abas  
                document.querySelectorAll('.admin -tab').forEach(t => {  
                    t.classList.remove('active');  
                }); 
                 
                // Adicionar classe active à aba clicada  
                this.classList.add('active');  
                 
                // Esconder todos os conteúdos  
                document.querySelectorAll('.admin -content').forEach(content => {  
                    content.classList.remove('active');  
                }); 
                 
                // Mostrar conteúdo correspondente  
                const tabId = this.getAttribute('data -tab');  
                document.getElementById(`admin -${tabId}`).classList.add('active');  
            }); 
        }); 
         
        // Sistema de Matérias  
        const subjectsGrid = document.getElementById('subjectsGrid');  
        const addSubjectBtn = document.getElementById('addSubjectBtn');  
        const newSubjectInput = document.getElementById('newSubject');  
         
        function getSubjects() {  
            const currentUser = localStorage.getItem('currentUser');  
            if (currentUser) {  
                const user = JSON.parse(currentUser);  
                const userData = 
JSON.parse(localStorage.getItem(`userData_${user.username}`) || '{}');  
                return userData.subjects || [];  
            } 
            return [];  
        } 
         
        function renderSubjects(subjects) {  
            subjectsGrid.innerHTML = '';  
             
            // Adicionar matérias do sistema  
            const systemSubjects = JSON.parse(localStorage.getItem('systemSubjects') || '[]');  
             
            // Se não houver matérias no sistema, adicionar as padrão  
            if (systemSubjects.length === 0) {  
                const defaultSubjects = [  
                    { name: "Português", icon: "fas fa -language" },  
                    { name: "Matemática", icon: "fas fa -calculator" },  
                    { name: "Banco de Dados", icon: "fas fa -database" },  
                    { name: "Java", icon: "fab fa -java" },  
                    { name: "Python", icon: "fab fa -python" }  
                ]; 
                localStorage.setItem('systemSubjects', JSON.stringify(defaultSubjects));  
                systemSubjects.push(...defaultSubjects);  
            } 
             
            systemSubjects.forEach(subject => {  
                const subjectCard = document.createElement('div');  
                subjectCard.className = 'subject -card';  
                 
                // Verificar se o usuário já tem progresso nesta matéria  
                const userSubject = subjects.find(s => s.name === subject.name) || {  
                    name: subject.name,  
                    progress: 0  
                }; 
                 
                const progressPercent = userSubject.progress || 0;  
                 
                subjectCard.innerHTML = `  
                    <h3><i class="${subject.icon || 'fas fa -book'}"></i> ${subject.name}</h3>  
                    <div class="subject -progress">  
                        <div class="progress -bar">  
                            <div class="progress -fill" style="width: ${progressPercent}%"></div>  
                        </div>  
                        <div class="progress -text">${progressPercent}% concluído</div>  
                    </div>  
                    <button class="continue -btn" data -
subject='${JSON.stringify(subject)}'>Estudar</button>  
                `; 
                 
                subjectsGrid.appendChild(subjectCard);  
            }); 
             
            // Adicionar matérias pessoais do usuário  
            subjects.forEach(subject => {  
                // Verificar se já não foi adicionada (como matéria do sistema)  
                if (!systemSubjects.find(s => s.name === subject.name)) {  
                    const subjectCard = document.createElement('div');  
                    subjectCard.className = 'subject -card';  
                     
                    const progressPercent = subject.progress || 0;  
                     
                    subjectCard.innerHTML = `  
                        <h3><i class="fas fa -book"></i> ${subject.name}</h3>  
                        <div class="subject -progress">  
                            <div class="progress -bar">  
                                <div class="progress -fill" style="width: ${progressPercent}%"></div>  
                            </div>  
                            <div class="progress -text">${progressPercent}% concluído</div>  
                        </div>  
                        <button class="continue -btn" data -
subject='${JSON.stringify(subject)}'>Estudar</button>  
                    `; 
                     
                    subjectsGrid.appendChild(subjectCard);  
                } 
            }); 
             
            // Adicionar event listeners aos botões  
            document.querySelectorAll('.continue -btn').forEach(btn => {  
                btn.addEventListener('click', function() {  
                    const subject = JSON.parse(this.getAttribute('data -subject'));  
                    showStudySession(subject);  
                }); 
            }); 
        } 
         
        function saveSubjects(subjects) {  
            const currentUser = localStorage.getItem('currentUser');  
            if (currentUser) {  
                const user = JSON.parse(currentUser);  
                const userData = 
JSON.parse(localStorage.getItem(`userData_${user.username}`) || '{}');  
                userData.subjects = subjects;  
                localStorage.setItem(`userData_${user.username}`, JSON.stringify(userData));  
            } 
        } 
         
        addSubjectBtn.addEventListener('click', () => {  
            const subjectName = newSubjectInput.value.trim();  
            if (subjectName) {  
                const subjects = getSubjects();  
                subjects.push({  
                    name: subjectName,  
                    progress: 0  
                }); 
                saveSubjects(subjects);  
                renderSubjects(subjects);  
                newSubjectInput.value = '';  
            } 
        }); 
         
        // Carregar material de estudo  
        function loadStudyMaterial(subject) {  
            const materialContent = document.getElementById('studyMaterial');  
             
            if (subject.name === "Java") {  
                loadJavaContent(materialContent);  
            } else {  
                materialContent.innerHTML = `  
                    <h3>Conteúdo de ${subject.name}</h3>  
                    <p>Conteúdo em desenvolvimento para esta matéria.</p>  
                `; 
            } 
        } 
         
        // Conteúdo de Java  
        function loadJavaContent(container) {  
            container.innerHTML = `  
                <h2><i class="fab fa -java"></i> Java - Conceitos Fundamentais</h2>  
                 
                <div class="java -topic">  
                    <h3><i class="fas fa -play-circle"></i> Introdução ao Java</h3>  
                    <p>Java é uma linguagem de programação orientada a objetos, desenvolvida 
pela Sun Microsystems (atualmente Oracle) em 1995. É uma das linguagens mais 
populares do mundo, utilizada em bilhões de dispositivos.</p>  
                     
                    <div class="code -example">  
                        <span class="code -keyword">public class</span> <span class="code -
class">HelloWorld</span> {<br>  
                        &nbsp;&nbsp;&nbsp;&nbsp;<span class="code -keyword">public static 
void</span> main(String[] args) {<br>  
                        
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;System.out.println(<span 
class="code -string">"Hello, World!"</span>);<br>  
                        &nbsp;&nbsp;&nbsp;&nbsp;}<br>  
                        } 
                    </div>  
                </div>  
                 
                <div class="java -topic">  
                    <h3><i class="fas fa -cube"></i> Variáveis e Tipos de Dados</h3>  
                    <p>Java é uma linguagem fortemente tipada, o que significa que todas as 
variáveis devem ser declaradas com um tipo específico antes de serem usadas.</p>  
                     
                    <div class="code -example">  
                        <span class="code -comment">// Tipos primitivos</span><br>  
                        <span class="code -keyword">int</span> idade = 25;<br>  
                        <span class="code -keyword">double</span> altura = 1.75;<br>  
                        <span class="code -keyword">char</span> letra = 'A';<br>  
                        <span class="code -keyword">boolean</span> ativo = <span class="code -
keyword">true</span>;<br><br>  
                         
                        <span class="code -comment">// Tipos de referência</span><br>  
                        String nome = <span class="code -string">"João"</span>;<br>  
                        <span class="code -keyword">int</span>[] numeros = {1, 2, 3, 4, 5};  
                    </div>  
                </div>  
                 
                <div class="java -topic">  
                    <h3><i class="fas fa -sitemap"></i> Estruturas de Controle</h3>  
                    <p>As estruturas de controle permitem que você controle o fluxo de execução 
do seu programa.</p>  
                     
                    <div class="code -example">  
                        <span class="code -comment">// Estrutura if -else</span><br>  
                        <span class="code -keyword">if</span> (idade >= 18) {<br>  
                        &nbsp;&nbsp;&nbsp;&nbsp;System.out.println(<span class="code -
string">"Maior de idade"</span>);<br>  
                        } <span class="code -keyword">else</span> {<br>  
                        &nbsp;&nbsp;&nbsp;&nbsp;System.out.println(<span class="code -
string">"Menor de idade"</span>);<br>  
                        }<br><br>  
                         
                        <span class="code -comment">// Loop for</span><br>  
                        <span class="code -keyword">for</span> (<span class="code -
keyword">int</span> i = 0; i < 5; i++) {<br>  
                        &nbsp;&nbsp;&nbsp;&nbsp;System.out.println(<span class="code -
string">"Número: "</span> + i);<br>  
                        } 
                    </div>  
                </div>  
                 
                <div class="difficulty -levels">  
                    <h3>Nível de Dificuldade:</h3>  
                    <button class="level -btn level-1 active" data -level="1">1 - Iniciante</button>  
                    <button class="level -btn level-2" data-level="2">2 - Básico</button>  
                    <button class="level -btn level-3" data-level="3">3 - Intermediário</button>  
                    <button class="level -btn level-4" data-level="4">4 - Avançado</button>  
                    <button class="level -btn level-5" data-level="5">5 - Expert</button>  
                </div>  
                 
                <div class="question -section" id="questionSection">  
                    <!-- As perguntas serão carregadas aqui baseadas no nível selecionado --> 
                </div>  
            `; 
             
            // Adicionar event listeners aos botões de nível  
            document.querySelectorAll('.level -btn').forEach(btn => {  
                btn.addEventListener('click', function() {  
                    // Remover classe active de todos os botões  
                    document.querySelectorAll('.level -btn').forEach(b => {  
                        b.classList.remove('active');  
                    }); 
                     
                    // Adicionar classe active ao botão clicado  
                    this.classList.add('active');  
                     
                    // Atualizar nível atual  
                    currentDifficultyLevel = parseInt(this.getAttribute('data -level'));  
                     
                    // Carregar pergunta do nível selecionado  
                    loadJavaQuestion(currentDifficultyLevel);  
                }); 
            }); 
             
            // Carregar primeira pergunta  
            loadJavaQuestion(1);  
        } 
         
        // Carregar pergunta de Java baseada no nível  
        function loadJavaQuestion(level) {  
            const questionSection = document.getElementById('questionSection');  
            let questionHTML = '';  
             
            switch(level) {  
                case 1:  
                    questionHTML = `  
                        <div class="question">  
                            <h4>Nível 1 - Pergunta Simples</h4>  
                            <p>Qual é a saída do seguinte código Java?</p>  
                            <div class="code -example">  
                                System.out.println(5 + 3 * 2);  
                            </div>  
                            <input type="text" class="answer -input" placeholder="Sua resposta...">  
                            <button class="btn" onclick="checkAnswer(1, '11')">Verificar 
Resposta</button>  
                            <div class="feedback" id="feedback1"></div>  
                        </div>  
                    `; 
                    break;  
                     
                case 2:  
                    questionHTML = `  
                        <div class="question">  
                            <h4>Nível 2 - Conceitos Básicos</h4>  
                            <p>Qual das seguintes opções declara corretamente um array de inteiros 
em Java?</p>  
                            <div class="code -example">  
                                A) int array = {1, 2, 3};<br>  
                                B) int[] array = {1, 2, 3};<br>  
                                C) array int = [1, 2, 3];<br>  
                                D) int array[] = new [1, 2, 3];  
                            </div>  
                            <input type="text" class="answer -input" placeholder="Digite A, B, C ou D">  
                            <button class="btn" onclick="checkAnswer(2, 'B')">Verificar 
Resposta</button>  
                            <div class="feedback" id="feedback2"></div>  
                        </div>  
                    `; 
                    break;  
                     
                case 3:  
                    questionHTML = `  
                        <div class="question">  
                            <h4>Nível 3 - Problema Intermediário</h4>  
                            <p>Complete o método para calcular o fatorial de um número:</p>  
                            <div class="code -example">  
                                public static int fatorial(int n) {<br>  
                                &nbsp;&nbsp;&nbsp;&nbsp;// Seu código aqui<br>  
                                } 
                            </div>  
                            <textarea class="code -input" placeholder="Escreva sua 
solução..."></textarea>  
                            <button class="btn" onclick="checkCodeAnswer(3)">Verificar 
Código</button>  
                            <div class="feedback" id="feedback3"></div>  
                        </div>  
                    `; 
                    break;  
                     
                case 4:  
                    questionHTML = `  
                        <div class="question">  
                            <h4>Nível 4 - Problema Avançado</h4>  
                            <p>Crie um método que recebe um array de inteiros e retorna o segundo 
maior valor.</p>  
                            <div class="code -example">  
                                public static int segundoMaior(int[] numeros) {<br>  
                                &nbsp;&nbsp;&nbsp;&nbsp;// Seu código aqui<br>  
                                } 
                            </div>  
                            <textarea class="code -input" placeholder="Escreva sua 
solução..."></textarea>  
                            <button class="btn" onclick="checkCodeAnswer(4)">Verificar 
Código</button>  
                            <div class="feedback" id="feedback4"></div>  
                        </div>  
                    `; 
                    break;  
                     
                case 5:  
                    questionHTML = `  
                        <div class="question">  
                            <h4>Nível 5 - Desafio Expert</h4>  
                            <p>Implemente uma classe 'ContaBancaria' com os métodos depositar, 
sacar e getSaldo. A classe deve lançar uma exceção personalizada se o saldo for 
insuficiente para saque.</p>  
                            <textarea class="code -input" placeholder="Escreva sua solução 
completa..." style="height: 200px;"></textarea>  
                            <button class="btn" onclick="checkCodeAnswer(5)">Verificar 
Código</button>  
                            <div class="feedback" id="feedback5"></div>  
                        </div>  
                    `; 
                    break;  
            } 
             
            questionSection.innerHTML = questionHTML;  
        } 
         
        // Verificar resposta para perguntas de texto  
        window.checkAnswer = function(level, correctAnswer) {  
            const input = document.querySelector('.answer -input');  
            const feedback = document.getElementById(`feedback${level}`);  
            const userAnswer = input.value.trim();  
             
            if (userAnswer.toUpperCase() === correctAnswer.toUpperCase()) {  
                feedback.textContent = "Correto! Parabéns!";  
                feedback.className = "feedback correct";  
                feedback.style.display = "block";  
                 
                // Atualizar progresso  
                updateProgress(5);  
            } else {  
                feedback.textContent = "Resposta incorreta. Tente novamente!";  
                feedback.className = "feedback incorrect";  
                feedback.style.display = "block";  
            } 
        }; 
         
        // Verificar resposta para perguntas de código  
        window.checkCodeAnswer = function(level) {  
            const input = document.querySelector('.code -input');  
            const feedback = document.getElementById(`feedback${level}`);  
            const userCode = input.value.trim();  
             
            // Verificações básicas para cada nível  
            let isCorrect = false;  
            let message = "";  
             
            switch(level) {  
                case 3:  
                    // Verificar se é uma implementação de fatorial  
                    if (userCode.includes("if") && (userCode.includes("n <= 1") || 
userCode.includes("n == 0") || userCode.includes("n == 1")) &&  
                        (userCode.includes("return 1") || userCode.includes("return n")) && 
userCode.includes("return n * fatorial")) {  
                        isCorrect = true;  
                        message = "Correto! Implementação do fatorial válida.";  
                    } else {  
                        message = "Código incorreto. Verifique a lógica do fatorial (deve ser recursivo 
ou iterativo).";  
                    } 
                    break;  
                     
                case 4:  
                    // Verificar se encontra o segundo maior  
                    if (userCode.includes("int maior") && userCode.includes("int segundo") &&  
                        (userCode.includes("for") || userCode.includes("Arrays.sort"))) {  
                        isCorrect = true;  
                        message = "Correto! Implementação válida para encontrar o segundo maior 
valor.";  
                    } else {  
                        message = "Código incorreto. Você precisa encontrar o segundo maior valor no 
array.";  
                    } 
                    break;  
                     
                case 5:  
                    // Verificar estrutura básica da classe ContaBancaria  
                    if (userCode.includes("class ContaBancaria") && userCode.includes("private 
double saldo") &&  
                        userCode.includes("depositar") && userCode.includes("sacar") && 
userCode.includes("getSaldo") &&  
                        (userCode.includes("extends Exception") || userCode.includes("throw new"))) {  
                        isCorrect = true;  
                        message = "Correto! Implementação da classe ContaBancaria válida com 
tratamento de exceções.";  
                    } else {  
                        message = "Código incompleto. Certifique -se de implementar a classe com 
todos os métodos solicitados e tratamento de exceções.";  
                    } 
                    break;  
            } 
             
            if (isCorrect) {  
                feedback.textContent = message;  
                feedback.className = "feedback correct";  
                feedback.style.display = "block";  
                 
                // Atualizar progresso com mais pontos para níveis mais altos  
                updateProgress(level * 2);  
            } else {  
                feedback.textContent = message;  
                feedback.className = "feedback incorrect";  
                feedback.style.display = "block";  
            } 
        }; 
         
        // Atualizar progresso do usuário  
        function updateProgress(points) {  
            const subjects = getSubjects();  
            const subjectIndex = subjects.findIndex(s => s.name === 
currentStudySubject.name);  
             
            if (subjectIndex !== -1) { 
                subjects[subjectIndex].progress = Math.min(100, (subjects[subjectIndex].progress 
|| 0) + points);  
                saveSubjects(subjects);  
                renderSubjects(subjects);  
            } 
        } 
         
        // Pomodoro Timer functionality  
        const timerDisplay = document.getElementById('timer');  
        const startTimerBtn = document.getElementById('start -timer');  
        const pauseTimerBtn = document.getElementById('pause -timer');  
        const resetTimerBtn = document.getElementById('reset -timer');  
         
        let timerInterval;  
        let timerRunning = false;  
        let timerMinutes = 25;  
        let timerSeconds = 0;  
         
        function updateTimerDisplay() {  
            timerDisplay.textContent = `${timerMinutes.toString().padStart(2, 
'0')}:${timerSeconds.toString().padStart(2, '0')}`;  
        } 
         
        function startTimer() {  
            if (!timerRunning) {  
                timerRunning = true;  
                timerInterval = setInterval(() => {  
                    if (timerSeconds === 0) {  
                        if (timerMinutes === 0) {  
                            // Timer completed  
                            clearInterval(timerInterval);  
                            timerRunning = false;  
                            alert('Tempo esgotado! Hora de fazer uma pausa.');  
                            // Reiniciar para pausa de 5 minutos  
                            timerMinutes = 5;  
                            timerSeconds = 0;  
                            updateTimerDisplay();  
                            startTimer();  
                            return;  
                        } 
                        timerMinutes --; 
                        timerSeconds = 59;  
                    } else {  
                        timerSeconds --; 
                    } 
                    updateTimerDisplay();  
                }, 1000);  
            } 
        } 
         
        function pauseTimer() {  
            clearInterval(timerInterval);  
            timerRunning = false;  
        } 
         
        function resetTimer() {  
            clearInterval(timerInterval);  
            timerRunning = false;  
            timerMinutes = 25;  
            timerSeconds = 0;  
            updateTimerDisplay();  
        } 
         
        startTimerBtn.addEventListener('click', startTimer);  
        pauseTimerBtn.addEventListener('click', pauseTimer);  
        resetTimerBtn.addEventListener('click', resetTimer);  
         
        // Initialize timer display  
        updateTimerDisplay();  
         
        // To-Do List functionality  
        const todoInput = document.getElementById('todo -input');  
        const addTodoBtn = document.getElementById('add -todo');  
        const todoList = document.getElementById('todo -list');  
         
        function getTodos() {  
            const currentUser = localStorage.getItem('currentUser');  
            if (currentUser) {  
                const user = JSON.parse(currentUser);  
                const userData = 
JSON.parse(localStorage.getItem(`userData_${user.username}`) || '{}');  
                return userData.todos || [];  
            } 
            return [];  
        } 
         
        function renderTodos(todos) {  
            todoList.innerHTML = '';  
             
            todos.forEach((todo, index) => {  
                const li = document.createElement('li');  
                li.className = `todo -item ${todo.completed ? 'completed' : ''}`;  
                 
                const span = document.createElement('span');  
                span.textContent = todo.text;  
                 
                const deleteBtn = document.createElement('button');  
                deleteBtn.className = 'delete -btn';  
                deleteBtn.textContent = 'Excluir';  
                 
                li.appendChild(span);  
                li.appendChild(deleteBtn);  
                todoList.appendChild(li);  
                 
                // Add event listeners  
                span.addEventListener('click', () => {  
                    todos[index].completed = !todos[index].completed;  
                    saveTodos(todos);  
                    renderTodos(todos);  
                }); 
                 
                deleteBtn.addEventListener('click', () => {  
                    todos.splice(index, 1);  
                    saveTodos(todos);  
                    renderTodos(todos);  
                }); 
            }); 
        } 
         
        function saveTodos(todos) {  
            const currentUser = localStorage.getItem('currentUser');  
            if (currentUser) {  
                const user = JSON.parse(currentUser);  
                const userData = 
JSON.parse(localStorage.getItem(`userData_${user.username}`) || '{}');  
                userData.todos = todos;  
                localStorage.setItem(`userData_${user.username}`, JSON.stringify(userData));  
            } 
        } 
         
        function addTodoItem() {  
            const text = todoInput.value.trim();  
            if (text) {  
                const todos = getTodos();  
                todos.push({  
                    text: text,  
                    completed: false  
                }); 
                saveTodos(todos);  
                renderTodos(todos);  
                todoInput.value = '';  
            } 
        } 
         
        addTodoBtn.addEventListener('click', addTodoItem);  
         
        todoInput.addEventListener('keypress', (e) => {  
            if (e.key === 'Enter') {  
                addTodoItem();  
            } 
        }); 
         
        // Notes functionality  
        const notesText = document.getElementById('notes -text');  
        const saveNotesBtn = document.getElementById('save -notes');  
         
        saveNotesBtn.addEventListener('click', () => {  
            saveUserData();  
            alert('Anotações salvas com sucesso!');  
        }); 
         
        // Auto-save quando o usuário digita  
        notesText.addEventListener('input', () => {  
            // Salvar automaticamente após 2 segundos sem digitar  
            clearTimeout(window.notesSaveTimeout);  
            window.notesSaveTimeout = setTimeout(saveUserData, 2000);  
        }); 
         
        // Inicializar a aplicação  
        checkAuth();  
         
        // Verificar se existe conta de admin e inicializar matérias padrão  
        window.addEventListener('load', function() {  
            const users = JSON.parse(localStorage.getItem('users') || '[]');  
            if (!users.find(u => u.username === 'admin')) {  
                users.push({ username: 'admin', password: 'admin123' });  
                localStorage.setItem('users', JSON.stringify(users));  
                 
                // Adicionar matérias padrão  
                const defaultSubjects = [  
                    { name: "Português", icon: "fas fa -language" },  
                    { name: "Matemática", icon: "fas fa -calculator" },  
                    { name: "Banco de Dados", icon: "fas fa -database" },  
                    { name: "Java", icon: "fab fa -java" },  
                    { name: "Python", icon: "fab fa -python" }  
                ]; 
                localStorage.setItem('systemSubjects', JSON.stringify(defaultSubjects));  
            } 
             
            // Forçar renderização das matérias  
            renderSubjects(getSubjects());  
        }); 
         
        // Salvar dados quando a página for fechada  
        window.addEventListener('beforeunload', saveUserData);  
    