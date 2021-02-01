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

function init<T>(param: T): void {
  console.log(param)
}

console.log(init(2))

function get<T extends object, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}

const obj = { a: 1, b: 2 }
console.log(get<typeof obj, keyof typeof obj>(obj, 'b'))
