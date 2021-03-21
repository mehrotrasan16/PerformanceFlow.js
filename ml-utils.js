const Cookies = require('js-cookie');
var tfvis = require('@tensorflow/tfjs-vis');
var tf = require('@tensorflow/tfjs');
var normalization = require('./normalization.js');

// Some hyperparameters for model training.
const NUM_EPOCHS = 200;
const BATCH_SIZE = 40;
const LEARNING_RATE = 0.01;
var testaccs = [];


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
    // console.log("mydata Data");
    // console.log(mydata)
    const perfData = JSON.parse(Cookies.get('jsonData'));
    // console.log("json Cookie Data");
    // console.log(perfData)

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
        deviceRAM: entry.deviceRAM
    })).filter(entry => (entry.nodes != null && entry.resourceLoadingTime != null && entry.xmlHttpRequestLoadingTime != null && entry.JSmemoryUsed != null && entry.JStotalMemory != null && entry.totalDataDownloaded != null));
    return cleaned;
}

export async function run(){
    var data = await getData(); //await readIdb();
    const values = data.map(d => ({
        x: [d.resourceLoadingTime,d.xmlHttpRequestLoadingTime,d.JSmemoryUsed,d.JStotalMemory,d.connectionMaxSpeed, d.connectionType,d.totalDataDownloaded,d.device],
        y: d.nodes
    }));

    // Create the model
    const model =  createLinearRegressionModel(); //createNonLinearRegressionModel();
    // Convert the performanceAnalyzerData to a form we can use for training.
    const tensorData = convertToTensor(data);
    const {inputs, labels} = tensorData;
    const linsurface = { tab: 'Linear Reg Model'};//Date.now().toString() };
    // Train the model
    await trainModel(model, inputs, labels,linsurface);
    testModel(model, data, tensorData,linsurface);

    //Non Linear Neural Net with JK fold cross validation.
    const multiTensorData = convertAllToTensor(data);
    KFoldTrainTestModel(multiTensorData);
}

export function createDemoModel() {
    // Create a sequential model
    const model = tf.sequential();

    // Add a single input layer
    model.add(tf.layers.dense({inputShape: [8], units: 10, activation: 'tanh', useBias: true}));
    model.add(tf.layers.dense({inputShape: [10], units: 10, activation: 'tanh', useBias: true}));
    model.add(tf.layers.dense({inputShape: [10], units: 10, activation: 'tanh', useBias: true}));

    // Add an output layer
    model.add(tf.layers.dense({units: 1, useBias: true}));

    return model;
}



export function createModel() {
    // Create a sequential model
    const model = tf.sequential();

    // Add a single input layer
    model.add(tf.layers.dense({inputShape: [8], units: 50, activation: 'tanh', useBias: true}));
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
    // model.add(tf.layers.dense({inputShape: [1], units: 10, activation: 'relu', useBias: true})); //single input for graph

    // Add an output layer
    model.add(tf.layers.dense({units: 1, useBias: true}));

    return model;
}
export function createNonLinearRegressionModel() {
    // Create a sequential model
    const model = tf.sequential();

    // Add a single input layer
    model.add(tf.layers.dense({inputShape: [1], units: 10, activation: 'tanh', useBias: true})); //single input for graph
    model.add(tf.layers.dense({inputShape: [10], units: 10, activation: 'tanh', useBias: true}));
    model.add(tf.layers.dense({inputShape: [10], units: 10, activation: 'tanh', useBias: true}));

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
        tensors.rawTrainFeatures = tf.tensor2d(data.map(d => [d.resourceLoadingTime,d.xmlHttpRequestLoadingTime,d.JSmemoryUsed,d.JStotalMemory,d.connectionMaxSpeed, d.connectionType,d.totalDataDownloaded,d.deviceRAM]));
        tensors.rawTrainTarget = tf.tensor2d(data.map(d=> [d.nodes]));
        // tensors.rawTestFeatures = tf.tensor2d(bostonData.testFeatures);
        // tensors.testTarget = tf.tensor2d(bostonData.testTarget);
        // console.log(tensors.rawTrainFeatures.data());
        // console.log(tensors.rawTrainTarget.data());
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
        }
    });
}

export async function trainModel(model, inputs, labels, surface) {
    // Prepare the model for training.
    var learningrate = 0.0001
    var compileoptions = {
        optimizer: tf.train.adam(learningrate),
        loss: tf.losses.meanSquaredError,
        metrics: ['mse','mae'],
    }
    // console.log("Optimizer: " + compileoptions.optimizer.getClassName());
    // console.log("Learning Rate: " + learningrate);
    // console.log("Loss : " + compileoptions.loss.name);
    // console.log("Metrics: " + compileoptions.metrics);
    const headers = [
        'Optimizer',
        'Learning Rate',
        'Loss',
        'Metrics'
    ];

    const values = [
        [compileoptions.optimizer.getClassName(),learningrate,compileoptions.loss.name,compileoptions.metrics],
    ];

    // const surface = { name: 'Table', tab: 'Charts' };
    tfvis.render.table({name: 'Model Hyperparameters',tab: surface.tab}, { headers, values });

    model.compile(compileoptions);

    // const batchSize = 2;
    const epochs = 50;

    tfvis.show.modelSummary({name: 'Model Summary',tab: surface.tab}, model);
    return await model.fit(inputs, labels, {
        // batchSize,
        epochs,
        shuffle: true,
        callbacks: tfvis.show.fitCallbacks(
            {name: 'Training Performance',tab:surface.tab},
            ['loss', 'mse','mae'],
            { height: 200, callbacks: ['onEpochEnd'] }
        )
    });
}

export function testModel(model, inputData, normalizationData, surface) {
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
        {name: 'Model Predictions vs Original Data', tab: surface.tab},
        {values: [originalPoints, predictedPoints], series: ['original', 'predicted']},
        {
            xLabel: 'resourceLoadingTime',
            yLabel: 'Nodes',
            height: 300
        }
    );
}

export function KfoldtestModel(model, inputs, labels,surface) {
    const result = model.evaluate(
        inputs, labels); //third arg : {batchSize: BATCH_SIZE}
    // debugger
    // console.log(result.shape);
    const testMSE = result[1].dataSync();
    const testMAE = result[2].dataSync();
    testaccs.push([parseFloat(testMSE),parseFloat(testMAE)]);
    console.log("Test MSE, Test MAE")
    console.log(testMSE,testMAE);
    const headers = [
        'Test MSE',
        'Test MAE',
    ];

    const values = [
        [testMSE,testMAE],
    ];

    tfvis.render.table({name: 'Model Testing Results',tab: surface.tab}, { headers, values });

    return testMSE,testMAE;
}

export async function KFoldTrainTestModel(normalizedShuffledData) {
    console.log("KFoldTrainTestModel()")
    var {inputs, labels} = normalizedShuffledData ;
    var kgroups,klabels,eveninputs,evenlabels,num_splits;

    const factors = number => Array
        .from(Array(number + 1), (_, i) => i)
        .filter(i => number % i === 0)

    if(inputs.shape[0]%10 != 0){
        var evenindex = Math.floor(inputs.shape[0]/10)*10
        eveninputs = inputs.slice(0,evenindex);
        evenlabels = labels.slice(0,evenindex);
    }

    if(eveninputs != null){
        inputs = eveninputs;
        labels = evenlabels;
    }
    num_splits = 10//factors(inputs.shape[0]).indexOf(10) != -1 ? 10 : 8 ;

    console.log(inputs.shape[0]);
    console.log(num_splits)
    console.log(inputs.split(num_splits, 0));
    kgroups = inputs.split(num_splits, 0);
    klabels = labels.split(num_splits, 0);

    for(var index=0; index < num_splits; index++){
        //Create TFVis Surface Visor Tab
        //TFVis Surface to print in Slideout panel
        const surface = { tab: 'K fold Model #'+ index.toString()};//Date.now().toString() };
        const model = createDemoModel(); //createModel();
        var test = kgroups[index];
        var testlabels = klabels[index];
        var train = kgroups.slice();
        var trainlabels = klabels.slice();
        trainlabels.splice(index,1);
        train.splice(index,1);
        // console.log(index);
        // console.log("test");
        // console.log(test.shape);
        // console.log("train");
        // console.log(train.length);
        var combinedtrain = train[0];
        var combinedlabels = trainlabels[0]
        var axis = 0
        for(var t = 1; t < train.length;t++){
            combinedtrain = tf.concat([combinedtrain,train[t]],axis);
            combinedlabels = tf.concat([combinedlabels,trainlabels[t]],axis);
        }
        // console.log(combinedtrain.shape);
        // console.log(combinedlabels.shape);
        await trainModel(model,combinedtrain,combinedlabels,surface);
        // console.log('Done Training');
        KfoldtestModel(model, test, testlabels, surface);

        // console.log(t1,t2,t3);
        if(index === num_splits-1 ) {
            const [preds] = tf.tidy(() => {
                var randi = Math.floor(Math.random() * test.shape[0]);
                var xs = test.slice(randi-1,1);
                const preds = model.predict(xs);
                return preds.dataSync();
            });
            alert("Your System can Handle: " + Math.floor(preds.toString()) + " points");

            //Saving the model
            var d = new Date();
            var model_name = "model_" + d.getHours().toString() + d.getMinutes().toString() + d.getSeconds().toString() + index.toString();
            const saveResult = await model.save('downloads://' + model_name);
        }
    }
    console.log("K fold Test MSE Values.")
    console.log(testaccs);
}