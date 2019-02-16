(n) => {

    let path_multiply = 'multiply.js'

    console.log('before external ff')
    console.log('ff is a : ' + typeof ff)
    let multiply = await ff(path_multiply)
    console.log('post external ff')
    console.log('multiply is a : ' + multiply)

    async function factorial(n) {
        if (n <= 1) { return 1 }
        else {
            let factLessOne = await factorial(n - 1)
            let product = await multiply(n, factLessOne)
            return product
        }
    }

    let factorial2 = async (n) => n <= 1 ? 1 : await multiply(n, await factorial3(n - 1))

    let factorial3 = async (n) => await n <= 1 ? 1 : factorial3(n - 1).then(i => multiply(n, i))

    let factorial4 = async (n) => await n <= 1 ? 1 : factorial4(n - 1).then(i => ff(path_multiply, n, i))

    let factorial5 = async n => {
        let product = n
        while (n-- > 1)
            product = await ff(path_multiply, product, n)
        // product = await multiply(product, n)
        return product
    }

    return factorial5(n)
}