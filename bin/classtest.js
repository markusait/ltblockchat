class Test {
  constructor(a){
    this.a = a
  }

  addFive() {
    return this.a += 5
  }
}

let number = new Test(10)
console.log(number.addFive());
