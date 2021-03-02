const Cookies = require('js-cookie');
var tfvis = require('@tensorflow/tfjs-vis');
var tf = require('@tensorflow/tfjs');

export async function getData() {
    const perfData = JSON.parse(Cookies.get('jsonData'));
    // console.log(perfData)
    const cleaned = perfData.map(entry => ({
        nodes: entry.nodes,
        resourceLoadingTime: entry.resourceLoadingTime,
        xmlHttpRequestLoadingTime: entry.xmlHttpRequestLoadingTime,
    })).filter(entry => (entry.nodes != null && entry.resourceLoadingTime != null && entry.xmlHttpRequestLoadingTime != null));
    // console.log(cleaned);
    return cleaned;
}

export async function run(){
    const data = await getData();
    const values = data.map(d => ({
        x: d.resourceLoadingTime,
        y: d.nodes
    }));

    console.log(data);
    console.log(values);

    tfvis.render.scatterplot(
        {name: 'resourceLoadingTime vs Nodes'},
        {values},
        {
            xLabel:'resourceLoadingTime',
            yLabel:'nodes',
            height: 300
        }
    );

    // Create the model
    const model = createModel();
    tfvis.show.modelSummary({name: 'Model Summary'}, model);

    // Convert the performanceAnalyzerData to a form we can use for training.
    const tensorData = convertToTensor(data);
    const {inputs, labels} = tensorData;

    console.log("inputs");
    console.log(inputs.data());
    console.log("labels");
    console.log(labels.data());

    // Train the model
    await trainModel(model, inputs, labels);
    console.log('Done Training');

    testModel(model, data, tensorData);
}

export function createModel() {
    // Create a sequential model
    const model = tf.sequential();

    // Add a single input layer
    model.add(tf.layers.dense({inputShape: [1], units: 10, activation: 'relu', useBias: true}));
    model.add(tf.layers.dense({inputShape: [10], units: 30, activation: 'relu', useBias: true}));

    // Add an output layer
    model.add(tf.layers.dense({units: 1, useBias: true}));

    return model;
}

/**
 * Convert the input performanceAnalyzerData to tensors. also do the important best practices of _shuffling_ the performanceAnalyzerData and _normalizing_ the performanceAnalyzerData
 */
export function convertToTensor(data) {
// Wrapping these calculations in a tidy will dispose any
// intermediate tensors.
    return tf.tidy(() => {
        // Step 1. Shuffle the performanceAnalyzerData
        tf.util.shuffle(data);
        // Step 2. Convert performanceAnalyzerData to Tensor
        const inputs = data.map(d => d.resourceLoadingTime)
        const labels = data.map(d => d.nodes);

        const inputTensor = tf.tensor2d(inputs, [inputs.length, 1]);
        const labelTensor = tf.tensor2d(labels, [labels.length, 1]);

        //Step 3. Normalize the performanceAnalyzerData to the range 0 - 1 using min-max scaling
        const inputMax = inputTensor.max();
        const inputMin = inputTensor.min();
        const labelMax = labelTensor.max();
        const labelMin = labelTensor.min();

        const normalizedInputs = inputTensor.sub(inputMin).div(inputMax.sub(inputMin));
        const normalizedLabels = labelTensor.sub(labelMin).div(labelMax.sub(labelMin));

        return {
            inputs: normalizedInputs,  //inputTensor,
            labels: normalizedLabels, //labelTensor,
            // Return the min/max bounds so we can use them later.
            inputMax,
            inputMin,
            labelMax,
            labelMin,
        }
    });
}

export async function trainModel(model, inputs, labels) {
    // Prepare the model for training.
    model.compile({
        optimizer: tf.train.adam(0.0001),
        loss: tf.losses.meanSquaredError,
        metrics: ['mse'],
    });

    const batchSize = 2;
    const epochs = 30;

    return await model.fit(inputs, labels, {
        batchSize,
        epochs,
        shuffle: true,
        callbacks: tfvis.show.fitCallbacks(
            { name: 'Training Performance' },
            ['loss', 'mse'],
            { height: 200, callbacks: ['onEpochEnd'] }
        )
    });
}

export function testModel(model, inputData, normalizationData) {
    const {inputMax, inputMin, labelMin, labelMax} = normalizationData;
    const [xs, preds] = tf.tidy(() => {
        const xs = tf.linspace(0,2, 20);
        const preds = model.predict(xs.reshape([20, 1]));

        const unNormXs = xs
            .mul(inputMax.sub(inputMin))
            .add(inputMin);

        const unNormPreds = preds
            .mul(labelMax.sub(labelMin))
            .add(labelMin);

        // Un-normalize the performanceAnalyzerData
        return [unNormXs.dataSync(), unNormPreds.dataSync()];
    });

    const predictedPoints = Array.from(xs).map((val, i) => {
        return {x: val, y: preds[i]}
    });

    const originalPoints = inputData.map(d => ({
        x: d.resourceLoadingTime, y: d.nodes,
    }));

    tfvis.render.scatterplot(
        {name: 'Model Predictions vs Original Data'},
        {values: [originalPoints, predictedPoints], series: ['original', 'predicted']},
        {
            xLabel: 'resourceLoadingTime',
            yLabel: 'Nodes',
            height: 300
        }
    );
}


// util function to normalize a value between a given range.
function normalize(value, min, max) {
    if (min === undefined || max === undefined) {
        return value;
    }
    return (value - min) / (max - min);
}

const multiFeatureTransform = (data,xs,ys) =>{

    // Step 1. Shuffle the performanceAnalyzerData
    tf.util.shuffle(data);
    // Step 2. Convert performanceAnalyzerData to Tensor
    const resourceLoadingTimes = data.map(d => d.resourceLoadingTime)
    const XHRLoadingTimes = data.map(d => d.xmlHttpRequestLoadingTime)
    const labels = data.map(d => d.nodes);

    const inputTensor = tf.tensor2d(inputs, [inputs.length, 1]);
    const labelTensor = tf.tensor2d(labels, [labels.length, 1]);

    //Step 3. Normalize the performanceAnalyzerData to the range 0 - 1 using min-max scaling
    const inputMax = inputTensor.max();
    const inputMin = inputTensor.min();
    const labelMax = labelTensor.max();
    const labelMin = labelTensor.min();

    const normalizedInputs = inputTensor.sub(inputMin).div(inputMax.sub(inputMin));
    const normalizedLabels = labelTensor.sub(labelMin).div(labelMax.sub(labelMin));

    return {
        inputs: normalizedInputs,  //inputTensor,
        labels: normalizedLabels, //labelTensor,
        // Return the min/max bounds so we can use them later.
        inputMax,
        inputMin,
        labelMax,
        labelMin,
    }
    const values = [

    ]
}
