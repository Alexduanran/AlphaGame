// import * as tf from '@tensorflow/tfjs-node';

// global variable: array of performance
var performanceArray = [["episode", "score", "moves", "cumulative reward"]];

async function train(
    env, agent, params = {
    batch_size: 32, n_episodes: 50, max_moves: 500, last_episode: 0,
    exp_replay: true
    }) {
    // load parameters
    const batch_size = params["batch_size"];
    const n_episodes = params["n_episodes"];
    const max_moves = params["max_moves"];
    const last_episode = params["last_episode"];
    const exp_replay = params["exp_replay"];

    // main
    var done = 0;
    for (var e = 1; e <= n_episodes; e++) {
        // start a new episode
        var state = env.reset();
        var cum_reward = 0;

        for (var move = 1; move <= max_moves; move++) {
            // step forward
            const action = await agent.act(state);
            var [next_state, reward, done, score] = env.step(action);
            agent.remember(state, action, reward, next_state, done);
            // update state 
            state = next_state;
            cum_reward += reward;
            // conclude round
            if (exp_replay) {
                await agent.replay(batch_size);
            }
            if (done) {
                if (!(exp_replay)) await agent.replay(batch_size);
                break;
            }
        }

        // training process
        const processLog = "progress: {}/{}, score: {}, e: {}, moves: {}/{}";
        console.log(processLog.format(
            e, n_episodes, score, agent.epsilon, move, max_moves
        ));
        // save performance
        performanceArray.push([
            e + last_episode, score, move, cum_reward
        ]);
        // console.log(performanceArray);
        // save model
        if (e >= 20 && e % 1 == 0) {
            agent.save_model("model_{}".format(e));
        }
    }
    console.log("Training Ended.")
    return new Promise((resolve, reject) => {
        resolve(performanceArray);
    })
}