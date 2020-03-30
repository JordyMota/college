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