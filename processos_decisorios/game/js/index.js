let isDarkMode = false;

const importFile = fileName => {
    const script = document.createElement('script');
    script.src = `js/components/${fileName}.js`;
    document.body.appendChild(script);
}

importFile('score');
importFile('table');
importFile('icon-selection');
importFile('config-form');
importFile('dark-mode');

document.body.onload = ()=> {
    isDarkMode = localStorage.getItem('page_mode_dark') === 'true';
    const container = document.querySelector('#config-container');
	if (container)
        container.style.maxHeight = window.getComputedStyle(container).height;
    darkModeVars();
}

function toggleConfig() {
    if (window.innerWidth > 900)
        return;
    const container = document.querySelector('#config-container');
    if (container)
        container.classList.toggle('zero-max-height');
}