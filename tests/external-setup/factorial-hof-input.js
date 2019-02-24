(n, multiply) => {
    let factorial = async n => n <= 1 ? 1 :
        await multiply(await factorial(n - 1), n)
    return await factorial(n)
}