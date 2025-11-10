🚀 Guia para Clonar e Contribuir com o Projeto
🧭 1. Clonar o Repositório

Abra o VS Code e execute os comandos abaixo no terminal:

# Escolha uma pasta onde deseja salvar o projeto
cd caminho/para/sua/pasta

# Clone o repositório (substitua pelo link do seu projeto)
git clone https://github.com/usuario/nome-do-repositorio.git

# Entre na pasta do projeto
cd nome-do-repositorio

💻 2. Abrir o Projeto no VS Code
code .


Isso abrirá o projeto diretamente no Visual Studio Code.

🌿 3. Criar uma Nova Branch (opcional, mas recomendado)
# Cria e muda para uma nova branch
git checkout -b nome-da-branch


Exemplo: git checkout -b ajuste-readme

✏️ 4. Fazer Alterações no Código

Edite os arquivos necessários dentro do VS Code.
Após salvar as alterações, siga para o próximo passo.

📦 5. Adicionar as Alterações
git add .


O ponto (.) adiciona todos os arquivos modificados.

💬 6. Fazer o Commit
git commit -m "Descrição breve do que foi alterado"


Exemplo: git commit -m "Atualiza instruções do README e corrige layout"

☁️ 7. Enviar as Alterações para o GitHub

Se você criou uma nova branch:

git push -u origin nome-da-branch


Se estiver trabalhando diretamente na branch principal (main ou master):

git push origin main

🔁 8. Abrir um Pull Request (caso use branches)

Vá até o repositório no GitHub.

Clique em “Compare & Pull Request”.

Descreva o que foi alterado.

Clique em “Create Pull Request”.

⚙️ Resumo dos Principais Comandos
git clone <url-do-repo>
cd <nome-do-repo>
git checkout -b <nome-da-branch>
git add .
git commit -m "mensagem do commit"
git push -u origin <nome-da-branch>

💡 Dica Extra

Se for sua primeira vez usando Git no VS Code, configure seu nome e e-mail:

git config --global user.name "Seu Nome"
git config --global user.email "seuemail@exemplo.com"
