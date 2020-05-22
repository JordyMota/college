function getPcMovement(machineInit, { pc, user }) {
	if (machineInit) {
		if (!pc.blocks.length)
			return randomIntFromInterval(1,tableInfo.length) - 1;
	}
	const priorities = tableInfo.map(item => item).sort((a,b)=>b.priority-a.priority);
	let currentPriority = 0;
	let currentPriorityIndex = priorities && tableInfo.indexOf(priorities[currentPriority]);
	let isEmpty = false
	let counts = 0;
	while(!isEmpty) {
		if (counts > (tableInfo.length * 2)) {
			break;
		}
		counts++;
		if(tableInfo[currentPriorityIndex] && !tableInfo[currentPriorityIndex].filled && !tableInfo[currentPriorityIndex].blocked) {
			isEmpty = true;
		} else {
			if (currentPriority > tableInfo.length) {
				currentPriority = 0;
			} else {
				currentPriority++;
				currentPriorityIndex = priorities && tableInfo.indexOf(priorities[currentPriority]);
			}
		}
	}
	return currentPriorityIndex;
}

function setPriority() {
	const directions = [
		{ direct: 'horizontal', sumX: 1, sumY: 0 },
		{ direct: 'vertical', sumX: 0, sumY: 1 },
		{ direct: 'diagonal', sumX: 1, sumY: 1 },
		{ direct: 'diagonalLeft', sumX: -1, sumY: 1 }
	];
	tableInfo.forEach(item => {
		if (item.blocked || item.filled)
			return;
		if(!gameRunning)
			return;
		directions.map(({ direct, sumX, sumY }) => {
			if(!gameRunning)
				return;
			const sumBackX = (sumX * -1);
			const sumBackY = (sumY * -1);
			const verifyUser = ()=> {
				let [possibilityFront] = usersInfo.pc.blocks.filter(block => (
					item.x + sumX === block.x && item.y + sumY === block.y
				));
				let [possibilityBack] = usersInfo.pc.blocks.filter(block => (
					item.x + sumBackX === block.x && item.y + sumBackY === block.y
				));
				if (possibilityFront && possibilityBack) {
					let [possFront] = usersInfo.pc.blocks.filter(block => (
						(item.x + sumX + sumX) === block.x && (item.y + sumY + sumY) === block.y
					));
					let [possBack] = usersInfo.pc.blocks.filter(block => (
						(item.x + sumBackX + sumBackX) === block.x && (item.y + sumBackY + sumBackY) === block.y
					));
					if (possFront || possBack) {
						item.priority += 1000;
						return;
					}
					if (usersInfo.pc.points === 1) {
						item.priority += 800;
					}
					item.priority += 35;
					return;
				}
				if (possibilityFront) {
					let [possibility] = usersInfo.pc.blocks.filter(block => (
						(item.x + sumX + sumX) === block.x && (item.y + sumY + sumY) === block.y
					));
					if (possibility) {
						let [poss] = usersInfo.pc.blocks.filter(block => (
							(item.x + sumX + sumX + sumX) === block.x && (item.y + sumY + sumY + sumY) === block.y
						));
						if (poss) {
							item.priority += 1000;
							return;
						}
						if (usersInfo.pc.points === 1) {
							item.priority += 800;
						}
						item.priority += 35;
						return;
					}
					let [emptyNext] = tableInfo.filter(block => (
						(item.x + sumBackX) === block.x && (item.y + sumBackY) === block.y && !block.blocked && !block.filled
					));
					if (emptyNext) {
						item.priority += 5;
						return;
					}
					item.priority += 3;
					return;
				}
				if (possibilityBack) {
					let [possibility] = usersInfo.pc.blocks.filter(block => (
						(item.x + sumBackX + sumBackX) === block.x && (item.y + sumBackY + sumBackY) === block.y
					));
					if (possibility) {
						let [poss] = usersInfo.pc.blocks.filter(block => (
							(item.x + sumBackX + sumBackX + sumBackX) === block.x && (item.y + sumBackY + sumBackY + sumBackY) === block.y
						));
						if (poss) {
							item.priority += 1000;
							return;
						}
						if (usersInfo.pc.points === 1) {
							item.priority += 800;
						}
						item.priority += 35;
						return;
					}
					let [emptyNext] = tableInfo.filter(block => (
						(item.x + sumX) === block.x && (item.y + sumY) === block.y && !block.blocked && !block.filled
					));
					if (emptyNext) {
						item.priority += 5;
						return;
					}
					item.priority += 3;
					return;
				}
			}
			const verifyEnemy = ()=> {
				let [possibilityFront] = usersInfo.user.blocks.filter(block => (
					item.x + sumX === block.x && item.y + sumY === block.y
				));
				let [possibilityBack] = usersInfo.user.blocks.filter(block => (
					item.x + sumBackX === block.x && item.y + sumBackY === block.y
				));
				if (possibilityFront && possibilityBack) {
					let [possFront] = usersInfo.user.blocks.filter(block => (
						(item.x + sumX + sumX) === block.x && (item.y + sumY + sumY) === block.y
					));
					let [possBack] = usersInfo.user.blocks.filter(block => (
						(item.x + sumBackX + sumBackX) === block.x && (item.y + sumBackY + sumBackY) === block.y
					));
					if (possFront || possBack) {
						item.priority += 200;
						return;
					}
					if (usersInfo.user.points === 1) {
						item.priority += 200;
					}
					item.priority += 2;
					return;
				}
				if (possibilityFront) {
					let [possibility] = usersInfo.user.blocks.filter(block => (
						(item.x + sumX + sumX) === block.x && (item.y + sumY + sumY) === block.y
					));
					if (possibility) {
						let [poss] = usersInfo.user.blocks.filter(block => (
							(item.x + sumX + sumX + sumX) === block.x && (item.y + sumY + sumY + sumY) === block.y
						));
						if (poss) {
							item.priority += 200;
							return;
						}
						if (usersInfo.user.points === 1) {
							item.priority += 200;
						}
						item.priority += 2;
						return;
					}
					let [emptyNext] = tableInfo.filter(block => (
						(item.x + sumBackX) === block.x && (item.y + sumBackY) === block.y && !block.blocked && !block.filled
					));
					if (emptyNext) {
						item.priority += 1;
						return;
					}
					item.priority += 0;
					return;
				}
				if (possibilityBack) {
					let [possibility] = usersInfo.user.blocks.filter(block => (
						(item.x + sumBackX + sumBackX) === block.x && (item.y + sumBackY + sumBackY) === block.y
					));
					if (possibility) {
						let [poss] = usersInfo.user.blocks.filter(block => (
							(item.x + sumBackX + sumBackX + sumBackX) === block.x && (item.y + sumBackY + sumBackY + sumBackY) === block.y
						));
						if (poss) {
							item.priority += 200;
							return;
						}
						if (usersInfo.user.points === 1) {
							item.priority += 200;
						}
						item.priority += 2;
						return;
					}
					let [emptyNext] = tableInfo.filter(block => (
						(item.x + sumX) === block.x && (item.y + sumY) === block.y && !block.blocked && !block.filled
					));
					if (emptyNext) {
						item.priority += 1;
						return;
					}
					item.priority += 0;
					return;
				}
			}
			verifyUser();
			verifyEnemy();
		});
	});
}