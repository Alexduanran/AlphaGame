var nj = require('@aas395/numjs');
const random = require('random');

export function elitism_selection(population, num_individuals) {
    var individuals = population.individuals.sort(a=>a.fitness).reverse();
    return individuals.slice(0, num_individuals);
}

export function roulette_wheel_selection(population, num_individuals) {
    var selection = [];
    var wheel = 0;
    for (var individual of population.individuals) {
        wheel += individual.fitness;
    }
    for (var i=0; i<num_individuals; i++) {
        const pick = random.float(0, wheel);
        var current = 0;
        for (var individual of population.individuals) {
            current += individual.fitness;
            if (current > pick) {
                selection.push(individual);
                break;
            }
        }
    }
    return selection;
}