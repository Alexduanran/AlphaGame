const settings = {
    // Hidden layer activation is specific to hidden layers, i.e. all layers except the input and output
    'hidden_layer_activation':     'relu',     // Options are [relu, sigmoid, tanh, linear, leaky_relu]
    // Output layer activation is specific to the output layer 
    'output_layer_activation':     'sigmoid',  // Options are [relu, sigmoid, tanh, linear, leaky_relu]
    // Hidden network architecture describes the number of nodes in each hidden layer
    'hidden_network_architecture': [12, 20, 12],   // A list containing number of nodes in each hidden layer

    //### GA stuff ####

    //# Mutation ##

    // Mutation rate is the probability that a given gene in a chromosome will randomly mutate
    'mutation_rate':               0.05,       // Value must be between [0.00, 1.00)
    // If the mutation rate type is static, then the mutation rate will always be `mutation_rate`,
    // otherwise if it is decaying it will decrease as the number of generations increase
    'mutation_rate_type':          'static',   // Options are [static, decaying]
    // The probability that if a mutation occurs, it is gaussian
    'probability_gaussian':        1.0,        // Values must be between [0.00, 1.00]
    // The probability that if a mutation occurs, it is random uniform
    'probability_random_uniform':  0.0,        // Values must be between [0.00, 1.00]

    //# Crossover ##
    
    // eta related to SBX. Larger values create a distribution closer around the parents while smaller values venture further from them.
    // Only used if probability_SBX > 0.00
    'SBX_eta':                     100,
    // Probability that when crossover occurs, it is simulated binary crossover
    'probability_SBX':             1,
    // The type of SPBX to consider. If it is 'r' then it flattens a 2D array in row major ordering.
    // If SPBX_type is 'c' then it flattens a 2D array in column major ordering.
    'SPBX_type':                   'r',        // Options are 'r' for row or 'c' for column
    // Probability that when crossover occurs, it is single point binary crossover
    'probability_SPBX':            0,
    // Crossover selection type determines the way in which we select individuals for crossover
    'crossover_selection_type':    'roulette_wheel',

    //# Selection ##

    // Number of parents that will be used for reproducing
    'num_parents':                 50,
    // Number of offspring that will be created. Keep num_offspring >= num_parents
    'num_offspring':               100,
    // The selection type to use for the next generation.
    // If selection_type == 'plus':
    //     Then the top num_parents will be chosen from (num_offspring + num_parents)
    // If selection_type == 'comma':
    //     Then the top num_parents will be chosen from (num_offspring)
    // @NOTE: if the lifespan of the individual is 1, then it cannot be selected for the next generation
    // If enough indivduals are unable to be selected for the next generation, new random ones will take their place.
    // @NOTE: If selection_type == 'comma' then lifespan is ignored.
    //   This is equivalent to lifespan = 1 in this case since the parents never make it to the new generation.
    'selection_type':              'plus',     // Options are ['plus', 'comma']
}

export default settings;