
function darkModeVars() {
    document.querySelector('[dark-mode-vars]').outerHTML = `
        <style dark-mode-vars>
            :root {
                --main-color: ${!isDarkMode ? '#fff' : '#333'};
                --second-color: ${!isDarkMode ? '#333' : '#fff'};
                --second-active-color: ${!isDarkMode ? '#fff' : 'red'};
                --active-color: ${!isDarkMode ? '#2ad95a' : 'red'};
            }
        </style>
    `;
    document.body.classList[isDarkMode ? 'add' : 'remove']('dark-mode');
    document.querySelector('#page-title').innerHTML = isDarkMode ? 'Vamos jogar um jogo?' : 'Jogo da velha do barril';
    document.querySelector('title').innerHTML = isDarkMode ? 'Jogos Mortais' : 'Jogo da velha';
}

function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    localStorage.setItem('page_mode_dark',isDarkMode);
    darkModeVars();
}