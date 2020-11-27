var nj = require('numjs');
var randomNormal = require('random-normal');

export function gaussian_mutation(chromosome, prob_mutation, mu, sigma, scale) {
    /*
    Perform a gaussian mutation for each gene in an individual with probability, prob_mutation.

    If mu and sigma are defined then the gaussian distribution will be drawn from that,
    otherwise it will be drawn from N(0, 1) for the shape of the individual.
    */
   // Determine which genes will be mutated
   var mutation_array = nj.random.random(chromosome.shape) < prob_mutation;
   // If mu and sigma are defined, create gaussian distribution around each one
   var gaussian_mutation = null;
   if (mu && sigma) {
       gaussian_mutation = randomNormal({mean: mu, dev: sigma});
   } else {
       var arr = []
       for (var i=0; i<chromosome.shape; i++) {
           arr.push(randomNormal());
       }
       gaussian_mutation = nj.array(arr);
   }

   if (scale) {
       gaussian_mutation[mutation_array] *= scale;
   }

   chromosome[mutation_array] += gaussian_mutation[mutation_array]
}

// export function random_uniform_mutation(chromosome, prob_mutation, low, high) {
//     var mutation_array = nj.random.random(chromosome.shape) < prob_mutation;
//     if (low isinstanceof Array) {

//     }
// }