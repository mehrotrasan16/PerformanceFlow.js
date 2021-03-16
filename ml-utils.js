const Cookies = require('js-cookie');
var tfvis = require('@tensorflow/tfjs-vis');
var tf = require('@tensorflow/tfjs');
var normalization = require('./normalization.js');

// Some hyperparameters for model training.
const NUM_EPOCHS = 200;
const BATCH_SIZE = 40;
const LEARNING_RATE = 0.01;



export async function readIdb(){

    var request = window.indexedDB.open("PerfDB", 1);
    return new Promise( function(resolve, reject) {
        request.onsuccess = function(event) {
            console.log('(WOR.NS) Within request.onsuccess');
            var db = event.target.result;
            console.log("(WOR.NS) db= ", db);

            var rTrans = db.transaction("dom_measurements","readonly").objectStore("dom_measurements");

            let request = rTrans.getAll();

            request.onsuccess = function() {
                if (request.result !== undefined) {
                    console.log("All Measurements:", request.result); // array of books with price=10
                    resolve(request.result)
                } else {
                    console.log("No measurements taken yet.");
                }
            };


        };
        request.onerror = function(event) {
            reject("Hi, DB Open Failure.  Please Try again", event);
        };
    })


}

export async function getData() {
    const mydata = JSON.parse(Cookies.get('mydata'));
    console.log("mydata Data");
    console.log(mydata)
    const perfData = JSON.parse(Cookies.get('jsonData'));
    console.log("json Cookie Data");
    console.log(perfData)

    var dbData = await readIdb();
    const cleaned = dbData.map(entry => ({
        nodes: entry.nodes,
        resourceLoadingTime: entry.resourceLoadingTime,
        xmlHttpRequestLoadingTime: entry.xmlHttpRequestLoadingTime,
        JSmemoryUsed: entry.JSmemoryUsed,
        JStotalMemory: entry.JStotalMemory,
        connectionMaxSpeed : entry.connectionMaxSpeed,
        connectionType: entry.connectionType,
        totalDataDownloaded : entry.totalDataDownloaded,
    })).filter(entry => (entry.nodes != null && entry.resourceLoadingTime != null && entry.xmlHttpRequestLoadingTime != null && entry.JSmemoryUsed != null && entry.JStotalMemory != null && entry.totalDataDownloaded != null));
    return cleaned;
}

export async function run(){
    var data = await getData(); //await readIdb();
    const values = data.map(d => ({
        x: [d.resourceLoadingTime,d.xmlHttpRequestLoadingTime,d.JSmemoryUsed,d.JStotalMemory,d.connectionMaxSpeed, d.connectionType,d.totalDataDownloaded],
        y: d.nodes
    }));

    // Create the model
    const model = createModel(); //createLinearRegressionModel();
    tfvis.show.modelSummary({name: 'Model Summary'}, model);

    // Convert the performanceAnalyzerData to a form we can use for training.
    // const tensorData = convertToTensor(data);
    const multiTensorData = convertAllToTensor(data);
    const {inputs, labels} = multiTensorData ;//tensorData;

    // console.log("inputs");
    // console.log(inputs.data());
    // console.log("labels");
    // console.log(labels.data());

    // Train the model
    await trainModel(model, inputs, labels);
    console.log('Done Training');

    // testModel(model, data, multiTensorData); //tensorData
    KFoldTrainTestModel(model,inputs,labels,multiTensorData);

    //Saving the model
    var d = new Date();
    var model_name = "multi-reg-model_" + d.getHours().toString() + d.getMinutes().toString() + d.getSeconds().toString() ;
    const saveResult = await model.save('downloads://'+model_name);
}

export function createModel() {
    // Create a sequential model
    const model = tf.sequential();

    // Add a single input layer
    model.add(tf.layers.dense({inputShape: [7], units: 50, activation: 'tanh', useBias: true}));
    model.add(tf.layers.dense({inputShape: [50], units: 50, activation: 'tanh', useBias: true}));
    model.add(tf.layers.dense({inputShape: [50], units: 10, activation: 'tanh', useBias: true}));

    // Add an output layer
    model.add(tf.layers.dense({units: 1, useBias: true}));

    return model;
}

export function createLinearRegressionModel() {
    // Create a sequential model
    const model = tf.sequential();

    // Add a single input layer
    model.add(tf.layers.dense({inputShape: [1], units: 10, activation: 'relu', useBias: true}));

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
        const inputs = data.map(d => [d.resourceLoadingTime])
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

const tensors = {};
export function convertAllToTensor(data) {
// Wrapping these calculations in a tidy will dispose any
// intermediate tensors.
    return tf.tidy(() => {
        // Step 1. Shuffle the performanceAnalyzerData
        tf.util.shuffle(data);
        // Step 2. Convert performanceAnalyzerData to Tensor
        tensors.rawTrainFeatures = tf.tensor2d(data.map(d => [d.resourceLoadingTime,d.xmlHttpRequestLoadingTime,d.JSmemoryUsed,d.JStotalMemory,d.connectionMaxSpeed, d.connectionType,d.totalDataDownloaded]));
        tensors.rawTrainTarget = tf.tensor2d(data.map(d=> [d.nodes]));
        // tensors.rawTestFeatures = tf.tensor2d(bostonData.testFeatures);
        // tensors.testTarget = tf.tensor2d(bostonData.testTarget);
        console.log(tensors.rawTrainFeatures.data());
        console.log(tensors.rawTrainTarget.data());
        // Step 3. Determine mean and standard deviation of data.
        let {dataMean, dataStd} =
            normalization.determineMeanAndStddev(tensors.rawTrainFeatures);

        const labelMax = tensors.rawTrainTarget.max();
        const labelMin = tensors.rawTrainTarget.min();

        //Step 4.1 Normalize Target values
        const normalizedLabels = tensors.rawTrainTarget.sub(labelMin).div(labelMax.sub(labelMin));

        // Step 4.2 Normalize Tensor features
        tensors.trainFeatures = normalization.normalizeTensor(
            tensors.rawTrainFeatures, dataMean, dataStd);

        return {
            inputs: tensors.trainFeatures,  //inputTensor,
            labels: normalizedLabels, //labelTensor,
            // labelMax,
            // labelMin,
        }
    });
}

export async function trainModel(model, inputs, labels) {
    // Prepare the model for training.
    var learningrate = 0.0001
    var compileoptions = {
        optimizer: tf.train.adam(learningrate),
        loss: tf.losses.meanSquaredError,
        metrics: ['mse'],
    }
    console.log("Optimizer: " + compileoptions.optimizer.getClassName());
    console.log("Learning Rate: " + learningrate);
    console.log("Loss : " + compileoptions.loss.name);
    console.log("Metrics: " + compileoptions.metrics);

    model.compile(compileoptions);

    // const batchSize = 2;
    const epochs = 50;

    return await model.fit(inputs, labels, {
        // batchSize,
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
        const xs = tf.linspace(0,2, 7);
        const preds = model.predict(xs.reshape([7, 1]));

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

export function KFoldTrainTestModel(model, inputs, labels, normalizedShuffledData) {
    console.log("KFoldTrainTestModel()")
    // console.log(model);
    // console.log(inputs);
    // console.log(labels);
    console.log(normalizedShuffledData.inputs.data().length);
    console.log(normalizedShuffledData.inputs.data().length/10);
    var kgroups = [];
    for(i = 0; i < normalizedShuffledData.data().length/10;i++){
        kgroups[i] = [];
        console.log(i)
    }




    // const [xs, preds] = tf.tidy(() => {
    //     const xs = tf.linspace(0,2, 25);
    //     const preds = model.predict(xs.reshape([25, 1]));
    //
    //     const unNormXs = xs
    //         .mul(inputMax.sub(inputMin))
    //         .add(inputMin);
    //
    //     const unNormPreds = preds
    //         .mul(labelMax.sub(labelMin))
    //         .add(labelMin);
    //
    //     // Un-normalize the performanceAnalyzerData
    //     return [unNormXs.dataSync(), unNormPreds.dataSync()];
    // });
    //
    // const predictedPoints = Array.from(xs).map((val, i) => {
    //     return {x: val, y: preds[i]}
    // });
    //
    // const originalPoints = inputData.map(d => ({
    //     x: d.resourceLoadingTime, y: d.nodes,
    // }));
    //
    // tfvis.render.scatterplot(
    //     {name: 'Model Predictions vs Original Data'},
    //     {values: [originalPoints, predictedPoints], series: ['original', 'predicted']},
    //     {
    //         xLabel: 'resourceLoadingTime',
    //         yLabel: 'Nodes',
    //         height: 300
    //     }
    // );
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
