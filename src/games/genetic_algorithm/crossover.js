var nj = require('@aas395/numjs');
const random = require('random');

export function simulated_binary_crossover(parent1, parent2, eta) {
    /*
    This crossover is specific to floating-point representation.
    Simulate behavior of one-point crossover for binary representations.

    For large values of eta there is a higher probability that offspring will be created near the parents.
    For small values of eta, offspring will be more distant from parents
    */
    var rand = nj.random(nj.array(parent1).shape);
    var gamma = nj.zeros(nj.array(parent1).shape);
    for (var i=0; i<gamma.shape[0]; i++) {
        for (var j=0; j<gamma.shape[1]; j++) {
            if (rand.get(i,j) <= 0.5) {
                gamma.set(i, j, ((2 * rand.get(i,j)) ** (1.0 / (eta + 1))));
            }
            else {
                gamma.set(i, j, ((1.0 / (2.0 * (1.0 - rand.get(i,j)))) ** (1.0 / (eta + 1))));
            }
        }
    }
    // Calculate Child 1 chromosome (Eq. 9.9)
    var chromosome1 = (((gamma.add(1)).multiply(parent1)).add(nj.ones(gamma.shape).subtract(gamma)).multiply(parent2)).multiply(0.5);
    // Calculate Child 2 chromosome (Eq. 9.10)
    var chromosome2 = (((nj.ones(gamma.shape).subtract(gamma)).multiply(parent1)).add((gamma.add(1)).multiply(parent2)).multiply(0.5));

    return [chromosome1, chromosome2];
}

export function uniform_binary_crossover(parent1, parent2) {
    var offspring1 = nj.copy(parent1);
    var offspring2 = nj.copy(parent2);

    var mask = [];
    for (var i=0; i<offspring1.shape; i++)
        mask.push(random.uniform(0, 1));
    offspring1[mask > 0.5] = parent2[mask > 0.5];
    offspring2[mask > 0.5] = parent1[mask > 0.5];

    return [offspring1, offspring2];
}

export function single_point_binary_crossover(parent1, parent2, major='r') {
    var offspring1 = nj.copy(parent1);
    var offspring2 = nj.copy(parent2);

    // var rows, cols = parent2.shape;
    // const row = random.int(0, rows);
    // const col = random.int(0, cols);

    // if (major.toLowerCase() === 'r') {
    //     off
    // }
    return [offspring1, offspring2];
}