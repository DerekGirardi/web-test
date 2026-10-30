# Clara Monteiro · Estética Avançada

Landing page institucional desenvolvida para profissional de estética, com design responsivo, estética *quiet luxury*, animações suaves e integração para agendamento direto via WhatsApp.

---

## 🚀 Como Iniciar o Servidor Local

Você pode iniciar o servidor de desenvolvimento estático através do terminal utilizando **Node.js/npx** ou **Python**:

### Opção 1: Usando `npx` (Recomendado)

Abra o terminal (PowerShell ou CMD) na pasta do projeto e execute:

```powershell
npx -y http-server -p 5500 -c-1
```

- `-p 5500`: define a porta como `5500`.
- `-c-1`: desativa cache no navegador para ver as alterações imediatamente.

Após executar, acesse no navegador:
👉 **[http://localhost:5500](http://localhost:5500)**

---

### Opção 2: Usando Python (Alternativa nativa)

Caso prefira usar o Python já instalado no sistema:

```powershell
python -m http.server 5500
```

---

## 🛑 Como Encerrar o Servidor

### 1. Encerramento Normal (no terminal em que o servidor está rodando)

Pressione o atalho no teclado:
```
Ctrl + C
```
Se for solicitado confirmar a finalização (`Deseja finalizar o arquivo em lotes (S/N)?`), digite `S` e pressione **Enter**.

---

### 2. Caso o processo continue rodando em segundo plano (PowerShell)

Se a janela do terminal foi fechada sem encerrar o processo e a porta `5500` continuar ocupada, execute no **PowerShell**:

```powershell
# 1. Localizar o ID do processo (PID) usando a porta 5500:
Get-NetTCPConnection -LocalPort 5500 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess

# 2. Encerrar o processo pelo PID (exemplo com PID 1234):
Stop-Process -Id <PID> -Force
```

Ou em linha única rápida:

```powershell
Stop-Process -Id (Get-NetTCPConnection -LocalPort 5500).OwningProcess -Force
```

---

## 📁 Estrutura de Arquivos

```text
web-test/
├── assets/
│   └── img/            # Fotografias e ativos visuais
├── css/
│   └── style.css       # Design system, tokens e estilos completos
├── js/
│   └── main.js         # Interações, slider, cálculo de datas e envio WhatsApp
├── index.html          # Estrutura HTML semântica
└── README.md           # Guia de inicialização e comandos
```

---

## 🌿 Tecnologias Utilizadas

- **HTML5** semântico com boas práticas de SEO e acessibilidade
- **CSS3 Vanilla** (Variáveis CSS, CSS Grid, Flexbox, Glassmorphism)
- **JavaScript Moderno (ES6+)** sem dependências externas
- **Google Fonts**: *Cormorant Garamond* e *Manrope*
