console.log('i am a test');
let index: number = 0;
let fruits: Array<string> = new Array<string>();
console.log(index);
while (index < 4) {
    let element: string = ('hello ' + index.toString()) as string;
    console.log(element);
    fruits.push(element);
    console.log(index);
    index++;
}
console.log('-------resulte--------')
console.log(fruits)