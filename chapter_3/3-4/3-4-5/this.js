console.log(this);
console.log(this === module.exports);
console.log(this === exports);

function whatIsThis(){
    console.log('funtion', this === exports, this === global);
}

whatIsThis();