// var nj = require('numjs');

// export const sigmoid = x => {1.0 / (1.0 + nj.exp(-x))};
// export const tanh = x => {nj.tanh(x)};
// export const relu = x => {nj.max(0, x)};
// export const linear = x => x;

// export function FeedForwardNetwork(layer_nodes, hidden_activation, output_activation, init_method='uniform', seed=null) {
//     this.params = {};
//     this.layer_nodes = layer_nodes;
//     this.hidden_activation = hidden_activation;
//     this.output_activation = output_activation;
//     this.inputs = null;
//     this.out = null;

//     // Initialize weights and bias
//     for (var l=1; l < this.layer_nodes.length; l++) {
//         if (init_method == 'uniform') {
//             this.params['W' + l.toString()] = nj.random.uniform(-1, 1, (this.layer_nodes[l], this.layer_nodes[l-1]));
//             this.params['b' + l.toString()] = nj.random.uniform(-1, 1, (this.layer_nodes[l], 1));
//         } else {
//             throw new Error('Implement more options, bro');
//         }
        
//         this.params['A' + l.toString()] = null;
//     }

//     const feed_forward = (X) => {
//         var A_prev = X
//         const L = this.layer_nodes.length - 1
//         var W = null;
//         var b = null;
//         var Z = null;

//         // Feed hidden layers
//         for (var l=1; l<L; l++) {
//             W = this.params['W' + l.toString()];
//             b = this.params['b' + l.toString()];
//             Z = nj.dot(W, A_prev) + b;
//             A_prev = this.hidden_activation(Z);
//             this.params['A' + l.toString()] = A_prev;
//         }

//         W = this.params['W' + L.toString()];
//         b = this.params['b' + L.toString()];
//         Z = nj.dot(W, A_prev) + b;
//         const out = this.hidden_activation(Z);
//         this.params['A'+L.toString()] = out;
//         this.out = out.indexOf(Math.max(...out));
//         return this.out;
//     }
// }

// export const get_activation_by_name = name => {
//     const activations = [('relu', relu),
//                         ('sigmoid', sigmoid),
//                         ('linear', linear),
//                         ('tanh', tanh),
//                         ]
    
//     var func = activations.map(a=>{if (a[0].toLowerCase() === name.toLowerCase()) {return a;}});
//     console.assert(func.length == 1);
//     return func[0];
// }