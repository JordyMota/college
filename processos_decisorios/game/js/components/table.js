var tableInfo = [];
var sizeTableInfo = {
	x: 0,
	y: 0,
	blocks: 0
}
var usersInfo = {
	user: {
		blocks: [],
		icon: '',
		doneCombos: [],
		points: 0
	},
	pc: {
		blocks: [],
		icon: '',
		doneCombos: [],
		points: 0
	}
};
var gameRunning = false;

const resetInfo = {
	html: '',
	blocks: ''
}

function generateTable({
	sizeX = 4,
	sizeY = 4,
	blockSquares = true,
	blockAmount = 2,
	blockRamdom = true,
	blockCords = {},
	machineInit = false,
	userIcon = 'close-svg'
}) {
	if(sizeX <=0 || sizeY <=0)
		return;
	const blocks = handleBlockItems(blockSquares,blockAmount,blockRamdom,blockCords,sizeY,sizeX);
	tableInfo = [];
	sizeTableInfo.x = sizeX;
	sizeTableInfo.y = sizeY;
	sizeTableInfo.blocks = blockAmount;
	gameRunning = true;
	usersInfo = {
		user: {
			blocks: [],
			icon: '',
			doneCombos: [],
			points: 0
		},
		pc: {
			blocks: [],
			icon: '',
			doneCombos: [],
			points: 0
		}
	};
	handleTableData(sizeY,sizeX,blocks);
	usersInfo.user.icon = userIcon;
	usersInfo.pc.icon = getPcIcon(userIcon);
	startScore(usersInfo.user.icon,usersInfo.pc.icon);
	handleTableRender(sizeX,userIcon);
	const tableContainer = document.querySelector('#table-generate');
	resetInfo.html = tableContainer.outerHTML;
	resetInfo.blocks = [...tableInfo];
	if(machineInit)
		handlePcMove();
}

function resetTable() {
	const tableContainer = document.querySelector('#table-generate');
	tableContainer.style.removeProperty('pointer-events');
	tableContainer.outerHTML = resetInfo.html;
	tableInfo = resetInfo.blocks.map(item => ({ ...item, filled: false, filled: null, iconName: '' }));
	usersInfo.user.blocks = [];
	usersInfo.user.doneCombos = [];
	usersInfo.user.points = 0;
	usersInfo.pc.blocks = [];
	usersInfo.pc.doneCombos = [];
	usersInfo.pc.points = 0;
	const lines = document.querySelectorAll('.line-point-check');
	gameRunning = true;
	lines.forEach(item => {
		item.outerHTML = '';
	});
	closeModalWin();
}

function handleTableData(sizeY,sizeX,blocks) {
	const tableSize = sizeX * sizeY;
	tableInfo = [...new Array(tableSize)].map( (item,index) => {
		const y = !((index+1) % sizeX) ? ((index+1) / sizeX) - 1 : parseInt((index+1) / sizeX);
		const x = index - (y * sizeX);
		return ({
			x,
			y,
			filled: false,
			blocked: (blocks && blocks.length) ? blocks.filter( blk => blk.x === x && blk.y === y).length : false,
			filledId: null,
			iconName: ''
		});
	});
}

function handleTableRender(sizeX,userIcon) {
	const tableContainer = document.querySelector('#table-generate');
	if(!tableContainer)
		return;
	const containerWidth = tableContainer.getBoundingClientRect().width;
	tableContainer.style.minWidth = containerWidth+'px';
	const cellWidth = containerWidth / sizeX;
	let cels = '';
	tableInfo.forEach( (item,index) => cels += `
		<div
			class="table-cell-control ${item.blocked ? 'table-cell-control--blocked' : ''}"
			data-cell="${index}-c"
			style="width: ${cellWidth}px; height: ${cellWidth}px;"
			onclick="handleCellClick(this,'${userIcon}','user')"
		></div>
	`);
	tableContainer.innerHTML = cels;
}

function handleCellClick(target,userIcon,user) {
	const targetIndex = parseInt(target.getAttribute('data-cell').replace('-c',''));
	const logicalTarget = tableInfo[targetIndex];
	if(!logicalTarget || logicalTarget.blocked || logicalTarget.filled)
		return;
	const tableContainer = document.querySelector('#table-generate');
	if (tableContainer)
		tableContainer.style.pointerEvents = 'none';
	target.classList.add('table-cell-control--filled');
	if (logicalTarget.iconName)
		target.classList.remove(logicalTarget.iconName);
	target.classList.add(userIcon);
	logicalTarget.iconName = userIcon;
	logicalTarget.filled = true;
	logicalTarget.filledId = user;
	usersInfo[user].blocks.push(logicalTarget);
	usersInfo[user].blocks = usersInfo[user].blocks.sort((first,second) => (
		first.y < second.y ? -1 : (
			first.y > second.y ? 1 : (
				first.x < second.x ? -1 : (
					first.x > second.x ? 1 : 0
				)
			)
		)
	));
	tableInfo[targetIndex].filled = true;
	tableInfo[targetIndex].filledId = user;
	verifyLine(user,3);
	if(!gameRunning)
		return;
	if ( (usersInfo.user.blocks.length + usersInfo.pc.blocks.length) === (tableInfo.length - sizeTableInfo.blocks) ) {
		handleEndGame(user,true);
		return;
	}
	if(user === 'user') {
		setTimeout(()=> {
			if(!gameRunning)
				return;
			handlePcMove();
		},400);
		return;
	}
	if (tableContainer)
		tableContainer.style.removeProperty('pointer-events');
}

function getPcIcon(userIcon) {
	switch(userIcon) {
		case 'close-svg':
			return 'circle-svg';
		break;
		case 'circle-svg':
			return 'close-svg';
		break;
		default:
			const index = icons.findIndex( item => item === userIcon);
			let pcIndex = index;
			while(pcIndex === index) {
				pcIndex = randomIntFromInterval(1,102) - 1;
			}
			return icons[pcIndex];
	}
}

function handleBlockItems(blockSquares,blockAmount,blockRamdom,blockCords,sizeY,sizeX) {
	const blocks = [];
	if(!blockSquares || !blockAmount || blockAmount < 1)
		return blocks;
	if(blockRamdom) {
		for(let i=0; i<blockAmount; i++) {
			if(!blocks[i]) {
				blocks[i] = {
					x: randomIntFromInterval(1,sizeX) - 1,
					y: randomIntFromInterval(1,sizeY) - 1
				}
			}
			let verifyEqual = [...((new Array(blocks.length - 1)).fill(false))];
			let index = 0;
			while(!verifyEqual.every( item => item)) {
				verifyEqual[index] = !((blocks[i].x === blocks[index].x) && (blocks[i].y === blocks[index].y));
				index++;
				if(index === (blocks.length - 1)) {
					index = 0;
					if(!verifyEqual.every( item => item))
						blocks[i] = {
							x: randomIntFromInterval(1,sizeX) - 1,
							y: randomIntFromInterval(1,sizeY) - 1
						}
				}
			}
		}
		return blocks;
	}
	let cords = blockCords.split(',').map(item => {
		const [x,y] = item.split('x');
		if(!x || !y)
			return null;
		return { x: x-1, y: y-1 };
	});
	for(let i=0; i<blockAmount; i++) {
		if(cords[i])
			blocks[i] = {
				x: cords[i].x,
				y: cords[i].y
			}

	}
	return blocks;
}

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function handlePcMove() {
	if(tableInfo.every(item => item.filled || item.blocked))
		return;
	let verifyEqual = false;
	let index = 0;
	let ramdomItem = randomIntFromInterval(1,tableInfo.length) - 1;
	while(!verifyEqual) {
		if(!tableInfo[ramdomItem].filled && !tableInfo[ramdomItem].blocked) {
			handleCellClick(document.querySelector('[data-cell="'+ramdomItem+'-c"]'),usersInfo.pc.icon,'pc')
			verifyEqual = true;
		} else {
			index++;
			if(index === (tableInfo.length)) {
				index = 0;
				ramdomItem = randomIntFromInterval(1,tableInfo.length) - 1;
			}
		}
	}
}

function verifyLine(user,amount=3) {
	const skeletonPos = { left: null, up: null, right: null, bottom: null, rightTop: null, rightBottom: null, leftTop: null, leftBottom: null };
	let userBlocks = usersInfo[user].blocks.map( item => ({ ...item, ...skeletonPos }));
	usersInfo[user].blocks.map( item => {
		if(!gameRunning)
			return;
		[
			{ direct: 'horizontal', sumX: 1, sumY: 0 },
			{ direct: 'vertical', sumX: 0, sumY: 1 },
			{ direct: 'diagonal', sumX: 1, sumY: 1 }
		].map(dir => {
			if(!gameRunning)
				return;
			let = verify = {
				first: null,
				last: null,
				amount: 1,
				direct: null
			}
			const verifyItem = (currentBlock, sumX, sumY) => {
				let [validItem] = usersInfo[user].blocks.filter(block => (
					currentBlock.x + sumX === block.x && currentBlock.y + sumY === block.y
				));
				if(!validItem)
					return;
				verify.amount++;
				if (verify.amount === 2)
					verify.first = currentBlock;
				if (verify.amount === amount) {
					verify.last = validItem;
				}
				if (verify.amount === (amount+1)) {
					usersInfo[user].points = 2;
					handleEndGame(user);
					return;
				}
				verifyItem(validItem, sumX, sumY);
			}
			verify.direct = dir.direct;
			verifyItem(item,dir.sumX,dir.sumY);
			if (verify.amount === amount && usersInfo[user].doneCombos.every(check => (check.first.x !== verify.first.x || check.first.y !== verify.first.y || check.last.x !== verify.last.x || check.last.y !== verify.last.y))) {
				handlePoint(user,verify);
			}
		});
	});
}

function handlePoint(user,verify) {
	usersInfo[user].doneCombos.push(verify);
	usersInfo[user].points++;
	const tableContainer = document.querySelector('#table-generate');
	if(!!tableContainer) {
		const defaultWidth = tableContainer.querySelector('[data-cell]').getBoundingClientRect().width;
		const start = {
			left: (verify.first.x * defaultWidth) + ((defaultWidth - 4) / 2),
			bottom: ((sizeTableInfo.y - verify.first.y - 1) * defaultWidth) + ((defaultWidth - 4) / 2)
		}
		const end = {
			left: (verify.last.x * defaultWidth) + ((defaultWidth - 4) / 2),
			bottom: ((sizeTableInfo.y - verify.last.y - 1) * defaultWidth) + ((defaultWidth - 4) / 2)
		}
		let line = document.createElement('div');
		line.setAttribute('class', 'line-point-check');
		tableContainer.appendChild(line);
		calculateLine(start,end,line);
	}
	if (usersInfo[user].points === 2) {
		handleEndGame(user);
		return;
	}

}

function handleEndGame(player,draw=false) {
	const tableContainer = document.querySelector('#table-generate');
	gameRunning = false;
	let currentWinner = player;
	if (draw) {
		currentWinner = usersInfo.pc.points > usersInfo.user.points ? 'pc' : (usersInfo.pc.points < usersInfo.user.points ? 'user' : null);
		if (!currentWinner) {
			callModalWin();
			return;
		}
	}
	tableContainer.style.pointerEvents = 'none';
	setTimeout(()=> {
		callModalWin(currentWinner, currentWinner === 'pc' ? usersInfo.pc.points : usersInfo.user.points, currentWinner === 'pc' ? usersInfo.user.points : usersInfo.pc.points);
	},300);
	addPoint(currentWinner);
}

//Função do repósitorio ChartGen de JordyMota no GitHub
function calculateLine(dotA, dotB, line) {
	const lineASize = dotB.bottom - dotA.bottom;
	const lineBSize = dotB.left - dotA.left;
	const lineWidth =  Math.sqrt(Math.pow(lineASize, 2) + Math.pow(lineBSize, 2));
	let angle = (Math.atan2(lineASize,lineBSize)) * 180 / Math.PI;
	const alignLineCenter = parseInt(5/2);
	angle *= (-1);
	line.style.bottom = (dotA.bottom+alignLineCenter)+'px';
	line.style.left = (dotA.left+alignLineCenter)+'px';
	line.style.transform = 'rotate('+(angle)+'deg)';
	setTimeout(()=> {
		line.style.width = lineWidth+'px';
	},300)
}