'use strict';

const IMAGES = [
	
	//wheat
	'https://i.imgur.com/LvyAglT.jpg',
	//sparse wheat
	'https://i.imgur.com/4rag6k6.jpg'
];
	
const GRID_HEIGHT = 400;
const GRID_WIDTH = 400;
const GRID_CELL_SIZE = 80;
const GRID_EMPTY = [244,86,66];

const RESOURCES = {
	money: '💰',
	trees: '🌳'
}

const STATE = {
	resources: {
		money: 100,
		trees: 10
	},
	cashPerCrop: 10,
	investment: 0
}

class Wheat extends Item {
	init() {
		this.quantity = 3 
	}


	get cost(){
		return {
			money:20,
			trees:1
		}
	}

	get info() {
		return `This is some nice wheat ${this.quantity}`
	}
	get image(){
		if (this.quantity < 3) {
			return '4rag6k6.jpg'
		
		} else {
			return 'LvyAglT.jpg'
		}


		
	}

	onClick() {
		this.quantity -= 1;
		STATE.resources.money += Math.round(STATE.cashPerCrop * Math.random());
		if (this.quantity <=0){
			this.destroy();
			showMessage('You ran out of Wheat!')

			}
		}
}

var tractorBonus = new Bonus('Powerful Tractor',{
	money: 50
},function() {
	STATE.cashPerCrop += 5;
})

var investmentPortfolio = new Bonus('Investment Portfolio',{
	money: 100
},function() {
	STATE.investment = 0.1;
})

function init() {
	var wheat = new Wheat();
	GAME.grid.place(wheat, 0,0);

	var menu = new Menu('Farm Mall',[
			new Button('Buy Wheat - $20', tryBuy(Wheat)),
			new Button('Upgrade Tractor - $50',tryBuy(tractorBonus)),
			new Button('Open Roth IRA - $100', tryBuy(investmentPortfolio))

		])

		defineHarvester('trees', function(){
			return 1;

		}, 2000);

		defineHarvester('money', function(){
			return Math.round(STATE.investment * STATE.resources.money);
		}, 1000);

		defineHarvester('money', function(){
			return - (STATE.resources.money * 0.3)
		}, 60000);

		every(5000,function(){
			if(Math.random() <0.05){
				var frost = new Event('Early Frost', 'The Frost came early and messed up your crops. That sucks :(',
					[
						new Action('Defrost', function(){
							STATE.resources.money -= 10;
						}),
						new Action('Do Nothing', function(){
							STATE.cashPerCrop -= 5;
							schedule(10000, function(){
								STATE.cashPerCrop += 5;
								showMessage('Spring is here!')
							})
						})
					])
			}
		});

}

function main() {
	background(106,152,221);
}

