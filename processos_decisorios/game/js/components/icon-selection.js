const icons = ['close-svg','circle-svg','adwords-svg','agreement-svg','alarm-svg','alcohol-svg','art-svg','award-svg','bars-svg','blocked-svg','book-svg','bookmark-svg','brightness-svg','broken-link-svg','buy-svg','car-svg','charging-svg','charity-svg','check-up-svg','coding-svg','crop-svg','customizable-svg','disabled-svg','download-svg','ebook-svg','ecologic-svg','edit-svg','energy-svg','female-svg','filter-svg','fingerprint-svg','fix-svg','folder-svg','food-svg','full-charge-svg','hand-svg','health-svg','healthy-svg','heart-svg','help-svg','idea-svg','image-svg','key-svg','loading-svg','locked-svg','low-charge-svg','magic-wand-svg','mailing-svg','male-svg','man-svg','map-svg','medal-svg','microphone-svg','miscellaneous-svg','move-svg','music-svg','news-svg','next-svg','notification-svg','pause-svg','pen-tip-svg','pets-svg','phone-svg','play-svg','power-svg','previous-svg','protected-svg','quality-svg','record-svg','recycle-svg','repair-svg','research-svg','researcher-svg','reuse-svg','savings-svg','scale-svg','schedule-svg','search-svg','settings-svg','shades-svg','share-svg','shirt-svg','shoe-svg','sleep-mode-svg','star-svg','statistics-svg','stop-svg','structure-svg','temperature-svg','thumb-up-svg','time-svg','touch-svg','transfer-svg','trash-svg','tree-svg','unlinked-svg','unlock-svg','upload-svg','video-svg','vip-svg','web-news-svg','woman-svg']
function getIconList(activeIcon='') {
    let displays = '';
    icons.forEach( item => {
        displays += `
            <span class="icon-holder ${item} ${(activeIcon && activeIcon === item) ? 'active-icon' : ''}"></span>
        `;
    });
    return displays;
}

function getActiveIcon({ classList: { value } }) {
    return value.replace('icon-holder','').replace('active-icon','').trim();

}

function displaySelectIcon({target}) {
    const { parentElement, nextElementSibling } = target;
    const activeIcon = getActiveIcon(nextElementSibling);
    const list = '<div class="select-container hide" id="svg-list-select">' + getIconList(activeIcon) + '</div>';
    document.body.appendChild(document.createElement('svgListItems'));
    document.querySelector('svgListItems').outerHTML = list;
    const currentList = document.querySelector('#svg-list-select');
    const iconRef = nextElementSibling.getBoundingClientRect();
    const containerRef = parentElement.getBoundingClientRect();
    currentList.style.bottom = (window.innerHeight - containerRef.top) + 'px';
    currentList.style.left = (iconRef.left + iconRef.width) + 'px';
    currentList.classList.remove('hide');
    [...currentList.children].forEach( item => {
        item.onclick = ({target}) => {
            handleCloseList(target,currentList,nextElementSibling)
        }
    });
}

function handleCloseList(target,currentList,elementHolder) {
    const currentIcon = getActiveIcon(elementHolder);
    const newIcon = getActiveIcon(target);
    elementHolder.classList.remove(currentIcon);
    elementHolder.classList.add(newIcon);
    currentList.outerHTML = '';
}