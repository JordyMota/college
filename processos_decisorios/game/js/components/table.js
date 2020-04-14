var tableInfo = [];

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
	handleTableData(sizeY,sizeX);
	handleTableRender(sizeX,userIcon);
}

function handleTableData(sizeY,sizeX) {
	const tableSize = sizeX * sizeY;
	tableInfo = [...new Array(tableSize)].map( (item,index) => {
		const y = !((index+1) % sizeX) ? ((index+1) / sizeX) - 1 : parseInt((index+1) / sizeX);
		const x = index - (y * sizeX);
		return ({
			x,
			y,
			filled: false,
			blocked: false,
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
			onclick="handleCellClick(this,'${userIcon}')"
		></div>
	`);
	tableContainer.innerHTML = cels;
}

function handleCellClick(target,userIcon) {
	const logicalTarget = tableInfo[parseInt(target.getAttribute('data-cell').replace('-c',''))];
	if(!logicalTarget || logicalTarget.blocked || logicalTarget.filled)
		return;
	target.classList.add('table-cell-control--filled');
	if (logicalTarget.iconName)
		target.classList.remove(logicalTarget.iconName);
	target.classList.add(userIcon);
	logicalTarget.iconName = userIcon;
}