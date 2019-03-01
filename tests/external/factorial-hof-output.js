() => n => [...Array(n).keys()].map(i => i + 1).reduce((i,j) => i * j)

// also valid:

// () => {
//     let factorial = n => n <= 1 ? 1 : factorial(n - 1) * n
//     return factorial
// }
