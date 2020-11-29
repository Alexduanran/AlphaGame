var nj = require('@aas395/numjs');
const random = require('random');

export const sigmoid = x => {return 1.0 / (1.0 + nj.exp(-x))};
export const tanh = x => {return nj.tanh(x)};
export const relu = x => {
    var arr = [];
    for (var i of x) {
        if (i >= 0)
            arr.push(i);
        else
            arr.push([0]);
    }
    return arr;
};
export const linear = x => x;

export class FeedForwardNetwork {
    constructor(layer_nodes, hidden_activation, output_activation, init_method='uniform', seed=null) {
        this.params = {};
        this.layer_nodes = layer_nodes;
        this.hidden_activation = hidden_activation;
        this.output_activation = output_activation;
        this.inputs = null;
        this.out = null;

        // Initialize weights and bias
        for (var l=1; l < this.layer_nodes.length; l++) {
            if (init_method == 'uniform') {
                var arrW = []
                for (var i=0; i < this.layer_nodes[l]; i++) {
                    var arr = []
                    for (var j=0; j < this.layer_nodes[l-1]; j++) {
                        arr.push(random.uniform(-1,1)());
                    }
                    arrW.push(arr);
                }
                var arrb = [];
                for (var i=0; i < this.layer_nodes[l]; i++) {
                    arrb.push([random.uniform(-1,1)()]);
                }
                this.params['W' + l.toString()] = arrW;
                this.params['b' + l.toString()] = arrb;
            } else {
                throw new Error('Implement more options, bro');
            }
            
            this.params['A' + l.toString()] = null;
        }
    }

    feed_forward = (X) => {
        var A_prev = X;
        const L = this.layer_nodes.length - 1;
        var W = null;
        var b = null;
        var Z = null;
        // Feed hidden layers
        for (var l=1; l<L; l++) {
            W = this.params['W' + l.toString()];
            b = this.params['b' + l.toString()];
            // console.log(W, A_prev);
            // console.log('dot', typeof nj.dot(W,A_prev), nj.dot(W, A_prev))
            // console.log('b', typeof nj.array(b), nj.array(b))
            Z = nj.dot(W, A_prev).add(nj.array(b));
            // console.log('Z', typeof Z, Z)
            A_prev = this.hidden_activation(Z.tolist());
            // console.log('A_prev', A_prev)
            this.params['A' + l.toString()] = A_prev;
        }

        W = this.params['W' + L.toString()];
        b = this.params['b' + L.toString()];
        Z = nj.dot(W, A_prev).add(nj.array(b));
        const out = this.hidden_activation(Z.tolist());
        this.params['A'+L.toString()] = out;
        for (var i=0; i<out.length; i++) {
            if (this.out === null)
                this.out = i;
            else {
                if (out[i][0] > this.out)
                    this.out = i
            }
        }
        // console.log('a', out)
        // console.log('out', this.out)
        return this.out;
    }
}

export const get_activation_by_name = name => {
    const activations = [['relu', relu],
                        ['sigmoid', sigmoid],
                        ['linear', linear],
                        ['tanh', tanh]
                        ]
    var func = [];
    for (var i=0; i<activations.length; i++) {
        if (activations[i][0] === name.toLowerCase())
            func.push(activations[i][1]);
    }
    console.assert(func.length == 1);
    return func[0];
}