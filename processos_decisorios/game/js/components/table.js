var tableInfo = [];
var usersInfo = {
	user: {
		blocks: [],
		icon: ''
	},
	pc: {
		blocks: [],
		icon: ''
	}
};

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
	usersInfo = {
		user: {
			blocks: [],
			icon: ''
		},
		pc: {
			blocks: [],
			icon: ''
		}
	};
	handleTableData(sizeY,sizeX,blocks);
	usersInfo.user.icon = userIcon;
	usersInfo.pc.icon = getPcIcon(userIcon);
	handleTableRender(sizeX,userIcon);
	if(machineInit)
		handlePcMove();
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
	target.classList.add('table-cell-control--filled');
	if (logicalTarget.iconName)
		target.classList.remove(logicalTarget.iconName);
	target.classList.add(userIcon);
	logicalTarget.iconName = userIcon;
	usersInfo[user].blocks.push(logicalTarget);
	tableInfo[targetIndex].filled = true;
	tableInfo[targetIndex].filledId = user;
	if(user === 'user')
		setTimeout(()=> {
			handlePcMove();
		},400)
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