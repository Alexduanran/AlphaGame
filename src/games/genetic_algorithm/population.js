var nj = require('numjs');

function Population(individuals) {
    this.individuals = individuals;

    const num_individuals = () => {
        return this.individuals.length;
    }

    const num_individuals_ = () => {
        throw new Error('Cannot set the number of individuals. You must change Population.individuals instead');
    }

    const num_genes = () => {
        return this.individuals[0].chromosome.shape[1];
    }

    const num_genes_ = () => {
        throw new Error('Cannot set the number of genes. You must change Population.individuals instead');
    }

    const average_fitness = () => {
        return this.individuals.reduce((a,b) => {return a.fitness + b.fitness}, 0) / num_individuals();
    }

    const average_fitness_ = () => {
        throw new Error('Cannot set average fitness. This is a read-only property.');
    }

    const fittest_individual = () => {
        return Math.max.apply(Math, this.individuals.map(a=>a.fitness));
    }

    const fittest_individual_ = () => {
        throw new Error('Cannot set fittest individual. This is a read-only property');
    }

    const calculate_fitness = () => {
        for (var individual of this.individuals) {
            individual.calculate_fitness();
        }
    }

    const get_fitness_std = () => {
        return nj.std(nj.array(this.individuals.map(a=>a.fitness)));
    }
}

export default Population;