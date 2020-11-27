var nj = require('numjs')

export function simulated_binary_crossover(parent1, parent2, eta) {
    /*
    This crossover is specific to floating-point representation.
    Simulate behavior of one-point crossover for binary representations.

    For large values of eta there is a higher probability that offspring will be created near the parents.
    For small values of eta, offspring will be more distant from parents
    */
    var rand = nj.random.random(parent1.shape);
    var gamma = nj.empty(parent1.shape);
    gamma[rand <= 0.5] = (2 * rand[rand <= 0.5]) ** (1.0 / (eta + 1));
    gamma[rand > 0.5] = (1.0 / (2.0 * (1.0 - rand[rand > 0.5]))) ** (1.0 / (eta + 1));

    // Calculate Child 1 chromosome (Eq. 9.9)
    var chromosome1 = 0.5 * ((1 + gamma)*parent1 + (1 - gamma)*parent2);
    // Calculate Child 2 chromosome (Eq. 9.10)
    var chromosome2 = 0.5 * ((1 - gamma)*parent1 + (1 + gamma)*parent2);

    return chromosome1, chromosome2;
}

// export function uniform_binary_crossover(parent1, parent2) {
//     var offspring1 = [...parent1];
//     var offspring2 = [...parent2];

//     var mask = nj.random.uniform(0, 1, size=offspring1.shape);
//     offspring1[mask > 0.5] = parent2[mask > 0.5];
//     offspring2[mask > 0.5] = parent1[mask > 0.5];

//     return offspring1, offspring2;
// }

// export function single_point_binary_crossover(parent1, parent2, major='r') {
//     var offspring1 = [...parent1];
//     var offspring2 = [...parent2];

//     var rows, cols = parent2.shape;
//     var row = Math.floor(Math.random() * (rows + 1)) + minimum;
//     var col = Math.floor(Math.random() * (cols + 1)) + minimum;
// }