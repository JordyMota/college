function startScore(user,pc) {
	const userLabel = document.querySelector('[user-score-label]');
	const pcLabel = document.querySelector('[pc-score-label]');
	const scoreTable = document.querySelector('[score-table-ref]');
	const scoreButton = document.querySelector('[button-reset-score]');
	userLabel.removeAttribute('class');
	userLabel.classList.add('score-table-label',user);
	pcLabel.removeAttribute('class');
	pcLabel.classList.add('score-table-label',pc);
	scoreTable.style.removeProperty('display');
	scoreButton.style.removeProperty('display');
}

function addPoint(user) {
	const userScore = document.querySelector(`[${user}-score-value]`);
	userScore.innerHTML = parseInt(userScore.innerHTML) + 1;
}

function resetScore() {
	const userScore = document.querySelector('[user-score-value]');
	const pcScore = document.querySelector('[pc-score-value]');
	userScore.innerHTML = '0';
	pcScore.innerHTML = '0';
}

function callModalWin(user,points,otherPoints) {
	const modalContent = `
		<div class="modal-win-backdrop" modal-backdrop-item>
			<div class="modal-win-content">
				<span class="modal-win-text">
					${
						user === 'pc' ? `
							Ops!<br/>Parece que eu ganhei dessa vez, por:<br/>
						` : `
							Parabéns!<br/>Parece que dessa vez você se saiu melhor, a pontuação foi:<br/>
						`
					}
					<strong>
						${points} x ${otherPoints}
					</strong>
				</span>
				<button class="button button--small" onclick="resetTable()">
                    Jogar Novamente
                </button>
			</div>
		</div>
	`;
	document.body.appendChild(document.createElement('newModal'));
	document.querySelector('newModal').outerHTML = modalContent;
	const modal = document.querySelector('[modal-backdrop-item]');
	if (!modal)
		return;
	modal.style.opacity = '1';
}

function closeModalWin() {
	const modal = document.querySelector('[modal-backdrop-item]');
	if (!modal)
		return;
	modal.style.opacity = '0';
	setTimeout(()=> {
		modal.outerHTML = '';
	},250);
}