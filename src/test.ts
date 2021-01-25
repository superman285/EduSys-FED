/*type str = string | number


function ak(a:number):str {
	if (a>1) {
		return 'sss'
	}else {
		return 123
	}
}

ak(2)

type akb = Record<number, any>

let akak:akb = {
	0: 12,
	[1]: 13
}*/

function init<T>(param:T):void{
	console.log(param)
}

console.log(init(2))
