var nj = require('@aas395/numjs');
var random = require('random');

export function gaussian_mutation(chromosome, prob_mutation, scale=null, mu=null, sigma=null) {
    /*
    Perform a gaussian mutation for each gene in an individual with probability, prob_mutation.

    If mu and sigma are defined then the gaussian distribution will be drawn from that,
    otherwise it will be drawn from N(0, 1) for the shape of the individual.
    */
   // Determine which genes will be mutated
   var mutation_array = [];
   for (var i=0; i<chromosome.shape[0]; i++) {
        var arr = [];
        for (var j=0; j<chromosome.shape[1]; j++) 
            arr.push(random.float() < prob_mutation ? 1 : 0);
        mutation_array.push(arr);
   }
   // If mu and sigma are defined, create gaussian distribution around each one
   var gaussian_mutation = [];
   if (mu && sigma) {
       gaussian_mutation = random.normal(mu, sigma)();
   } else {
        for (var i=0; i<chromosome.shape[0]; i++) {
            var arr = [];
            for (var j=0; j<chromosome.shape[1]; j++) 
                arr.push(random.normal()());
            gaussian_mutation.push(arr);
        }
   }

   if (scale) {
       for (var i = 0; i<chromosome.shape[0]; i++) {
            for (var j=0; j<chromosome.shape[1]; j++) {
                if (mutation_array[i][j])
                    gaussian_mutation[i][j] *= scale;
            }
       }
   }
   // Update
   for (var i = 0; i<chromosome.shape[0]; i++) {
        for (var j=0; j<chromosome.shape[1]; j++) {
            if (mutation_array[i][j] === 1)
                chromosome.set(i, j, chromosome.get(i,j) + gaussian_mutation[i][j]);
        }
    } 
}

export function random_uniform_mutation(chromosome, prob_mutation, low, high) {
    // var mutation_array = nj.random.random(chromosome.shape) < prob_mutation;
    // if (low isinstanceof Array) {

    // }
}