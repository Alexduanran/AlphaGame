// import * as tf from '@tensorflow/tfjs-node';

// global variable: array of performance
var performanceArray = [["episode", "score", "moves", "cumulative reward"]];

export async function train(
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
            // uncomment to download trained models
            // agent.save_model("model_{}".format(e));
        }
    }
    console.log("Training Ended.")
    return new Promise((resolve, reject) => {
        resolve(performanceArray);
    })
}

// export async function test_DQN(env, agent, params=None) {

//     // fetch parameters
//     n_tests = load_params(params, "n_tests", 10)
//     max_moves = load_params(params, "max_games", 1000)
//     FPS = load_params(params, "FPS", 10)
//     verbose = load_params(params, "verbose", True)

//     // start testing
//     done = 0

//     // Save data for performance analysis
//     // each row is one instance: [reward, score, move]
//     performance = np.zeros((n_tests, 3))

//     for e in range(n_tests):

//         // Step 1: Initialization
//         state = env.reset()
//         cum_reward = 0

//         // Step 2: Simulate one trial of the game
//         for move in range(max_moves):
//             // action
//             action = agent.exploit(state)
//             // step forward
//             next_state, reward, done, score = env.step(action)
//             // conclude round
//             state = next_state
//             cum_reward += reward    // (this will always -100pt upon dead)
//             if (done) {
//                 break
//             }

//         // Step 3: Update performance
//         performance[e,:] = [cum_reward, score, move]

//     return performance
// }

export default train;