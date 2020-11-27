var nj = require('numjs')

export function elitism_selection(population, num_individuals) {
    var individuals = population.individuals.sort(a=>a.fitness).reverse();
    return individuals.slice(0, num_individuals);
}

export function roulette_wheel_selection(population, num_individuals) {
    var selection = [];
    const wheel = population.individuals.reduce((a,b)=>{return a+b},0);
    for (var i=0; i<num_individuals; i++) {
        const pick = nj.random.uniform(0, wheel);
        var current = 0;
        for (var individual of population.individual) {
            current += individual.fitness;
            if (current > pick) {
                selection.push(individual);
                break;
            }
        }
    }
}