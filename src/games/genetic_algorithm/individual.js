function Individual() {
    const calculate = () => {
        throw new Error('calculate_fitness function must be defined');
    }

    const fitness = () => {
        throw new Error('fitness property must be defined');
    }

    const fitness_ = () => {
        throw new Error('fitness property cannot be set. Use calculate_fitness instead');
    }

    const encode_chromosome = () => {
        throw new Error('encode_chromosome function must be defined');
    }

    const decode_chromosome = () => {
        throw new Error('decode_chromosome function must be defined');
    }

    const chromosome = () => {
        throw new Error('chromosome property must be defined');
    }

    const chromosome_ = (val) => {
        throw new Error('chromosome property cannot be set.');
    }
}

export default Individual;