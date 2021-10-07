const isDigit = (value: string): boolean => {
	return value !== "--" && /^\d+$/.test(value);
};

console.log("isDigit('--'): ", isDigit('--'));
console.log("isDigit('ab'): ", isDigit('ab'));
console.log("isDigit('c4'): ", isDigit('c4'));
console.log("isDigit('56'): ", isDigit('56'));
console.log("isDigit('789'): ", isDigit('789'));
console.log("isDigit('0'): ", isDigit('0'));
