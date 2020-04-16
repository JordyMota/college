function cleanTextOnlyNumbers(value) {
    return value.replace(/[^\d]+/g,'');
}

function insertFormatString(value,index,newString) {
    if (value && value[index]) {
		const formatValue = { firstHalf: '', secondHalf: '' };
		formatValue.firstHalf = value.slice(0,index);
		formatValue.secondHalf = value.slice(index,value.length);
		return formatValue.firstHalf + newString + formatValue.secondHalf;
	}
	return value;
}

function infiniteMask(initialValue, increment, string, value, setValue) {
    let newValue = value;
    while(initialValue < newValue.length) {
        const newString = insertFormatString(newValue,initialValue,string);
        setValue(newString);
        newValue = newString;
        initialValue += increment;
    }
}

function maskTableFormat(value) {
	value = cleanTextOnlyNumbers(value);
    value = insertFormatString(value,1,'x');
	return value;
}

function maskTableRow(value) {
    value = cleanTextOnlyNumbers(value);
    const setValue = newValue => {
        value = newValue;
    }
    infiniteMask(1, 3,'x',value,setValue);
    infiniteMask(3, 4,',',value,setValue);
	return value;
}

function initGame() {
    const sizeInput = document.getElementById('value');
    const blockSquare = document.getElementById('block-squares');
    const blockSquareAmounts = document.getElementById('block-square-amounts');
    const blockSquaresRandom = document.getElementById('block-squares-random');
    const blockSquarePos = document.getElementById('block-square-amounts-random');
    const machineInit = document.getElementById('machine-init');
    const selectionIconHolder = document.getElementById('selection-icon-holder');
    const tableOptions = {};
    if (sizeInput && sizeInput.value) {
        const [sizeX,sizeY] = sizeInput.value.split('x');
        if(sizeX && sizeY && !isNaN(sizeX) && !isNaN(sizeY)) {
            tableOptions.sizeX = sizeX;
            tableOptions.sizeY = sizeY;
        }
    }
    if(blockSquare)
        tableOptions.blockSquares = blockSquare.checked;
    if(!!tableOptions.blockSquares && blockSquareAmounts && blockSquareAmounts.value && !isNaN(blockSquareAmounts.value))
        tableOptions.blockAmount = parseInt(blockSquareAmounts.value);
    if(!!tableOptions.blockSquares && blockSquaresRandom)
        tableOptions.blockRamdom = blockSquaresRandom.checked;
    if(!!tableOptions.blockSquares && !tableOptions.blockRamdom && blockSquarePos)
        tableOptions.blockCords = blockSquarePos.value;
    if(machineInit)
        tableOptions.machineInit = machineInit.checked;
    if(selectionIconHolder)
        tableOptions.userIcon = getActiveIcon(selectionIconHolder);
    generateTable(tableOptions);
}