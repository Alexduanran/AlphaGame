import * as tf from '@tensorflow/tfjs';
import * as util from "./util";

class Deque extends Array {
    constructor(maxlen) {
        super();
        this.maxlen = maxlen;
    }

    pushDeque(item) {
        if (this.length >= this.maxlen) this.shift();
        this.push(item);
    }
}

export class Agent {
    constructor(params) {
        // mandatory
        this.state_size = params["state_size"];
        this.action_size = params["action_size"];
        // default
        this.gamma = 0.95;
        this.epsilon = 1.0;
        this.epsilon_decay = 0.995;
        this.epsilon_min = 0.01;
        this.learning_rate = 0.00025;

        // load from params
        for (var key in params) {
            if (key == "gamma") this.gamma = params[key];
            if (key == "epsilon") this.epsilon = params[key];
            if (key == "epsilon_decay") this.epsilon_decay = params[key];
            if (key == "epsilon_min") this.epsilon_min = params[key];
            if (key == "learning_rate") this.learning_rate = params[key];
        }

        // initialize
        this.model = this.build_model();

        const maxlen = 2000;
        this.memory = new Deque(maxlen);
    }

    /*
    Note:
    - the format of inputs is an (inputShape, N) matrix
      N: number of batches/data
    - for a 1D input, specify it as a tenser2d and its shape
      e.g. var input = tf.tensor2d([1,2,3,4],[1,4])
      shape [1,4]: 1 is the number of instances; 4 is the shape of input
    */
    build_model() {
        const model = tf.sequential();
        model.add(tf.layers.dense({
            units: 128, inputShape: [this.state_size], activation: "relu"
        }));
        model.add(tf.layers.dense({
            units: 128, activation: "relu"
        }));
        model.add(tf.layers.dense({
            units: 128, activation: "relu"
        }));
        model.add(tf.layers.dense({
            units: this.action_size, action: "linear"
        }));
        model.compile({
            optimizer: tf.train.adam({learningRate: this.learning_rate}),
            loss: 'meanSquaredError'
        });
        return model;
    }

    remember(state, action, reward, next_state, done){
        this.memory.pushDeque([state, action, reward, next_state, done]);
    }

    async act(state) {
        // state: tenser2d of size [1,state_size]
        if (Math.random() <= this.epsilon) {
            var action = util.getRandInt(0, this.action_size);
        } else {
            var action = await this.exploit(state);
        }
        return new Promise((resolve, reject) => {
            resolve(action);
        });
    }

    async exploit(state) {
        const pred = await this.model.predict(state).reshape([this.action_size]);
        const action = await pred.argMax().data();

        return new Promise((resolve, reject) => {
            // action is an array of size 1 -- [act]
            resolve(action[0]);
        });
    }

    async replay(batch_size=32) {
        if (this.memory.length < batch_size) {
            return Promise.resolve();
        }

        // sample mini-batch
        const mini_batch = util.random_sample(this.memory, batch_size);

        for (var i = 0; i < mini_batch.length; i++) {
            // test purpose
            if (i % 100 == 0) console.log(i);

            var [state, action, reward, next_state, done] = mini_batch[i];
            // compute target
            var target = reward;
            if (!(done)) {
                const future_value = await this.model.predict(next_state).reshape([this.action_size]);
                target = reward + this.gamma * future_value.max().dataSync()[0];
            }
            var target_state = await this.model.predict(state).reshape([this.action_size]);
            await target_state.data().then(data => data[action] = target);
            // train
            await this.model.fit(state, target_state.reshape([1,this.action_size]), {"epochs": 1});
        }
        // decrease epsilon
        if (this.epsilon > this.epsilon_min) {
            this.epsilon *= this.epsilon_decay;
        }
        return new Promise((resolve, reject) => {
            resolve();
        });
    }

    async save_model(fname) {
        await this.model.save("downloads://" + fname);
    }

    async load_model(fname) {
        this.model = await tf.loadLayersModel("localstorage://" + fname);
    }



}
