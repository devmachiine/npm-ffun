async (n) => {
    console.log('before external ff')
    console.log('ff is a : ' + ff)
    let multiply = await ff('./functions/multiply.js')
    console.log('post external ff')
    console.log('multiply is a : ' + multiply)
    let factorial = (n) => n <= 1 ? 1 : multiply(n, factorial(n - 1))
    return factorial(n)
}