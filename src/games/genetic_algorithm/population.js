var nj = require('@aas395/numjs');

class Population {
    constructor(individuals) {
        this.individuals = individuals;
    }

    num_individuals = () => {
        return this.individuals.length;
    }

    num_individuals_ = () => {
        throw new Error('Cannot set the number of individuals. You must change Population.individuals instead');
    }

    num_genes = () => {
        return this.individuals[0].chromosome.shape[1];
    }

    num_genes_ = () => {
        throw new Error('Cannot set the number of genes. You must change Population.individuals instead');
    }

    average_fitness = () => {
        var sum = 0;
        for (var individual of this.individuals)
            sum += individual.fitness;
        return sum / this.individuals.length;
    }

    average_fitness_ = () => {
        throw new Error('Cannot set average fitness. This is a read-only property.');
    }

    fittest_individual = () => {
        var best = 0;
        var indi = null;
        for (var individual of this.individuals) {
            if (individual.fitness > best) {
                best = individual.fitness;
                indi = individual;
            }
        }
        return indi;
    }

    fittest_individual_ = () => {
        throw new Error('Cannot set fittest individual. This is a read-only property');
    }

    calculate_fitness = () => {
        for (var individual of this.individuals) {
            individual.calculate_fitness();
        }
    }

    get_fitness_std = () => {
        return nj.std(nj.array(this.individuals.map(a=>a.fitness)));
    }
}

export default Population;