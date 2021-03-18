
<div align="center">
  <img src="images/perfjs-crop.png"><br>
</div>

-----------------

## PerfFlow.js: a powerful javascript performance analysis module



## What is it?

**PerfFlow.js** is a javascript package that allows flexible, and expressive runtime speculation designed to make *your* data query-heavy applications more interactive! 
It has been developed targeting  the [SUSTAIN](http://urban-sustain.org) groups [Aperture](https://github.com/Project-Sustain/aperture-client) Project. 

## Main Features

- PerfFlow.js is fast. It is built on Tensorflow.js, and supports tensors out of the box. This means you can [convert Danfo data structure](https://danfo.jsdata.org/api-reference/dataframe/dataframe.tensor) to Tensors.
- Easy handling of [missing-data](https://danfo.jsdata.org/getting-started#missing-data) (represented as
  `NaN`) in floating point as well as non-floating point data
- Size mutability: columns can be [inserted/deleted](https://danfo.jsdata.org/api-reference/dataframe#combining-comparing-joining-merging) from DataFrame
- Automatic and explicit [alignment](https://danfo.jsdata.org/api-reference/dataframe#reindexing-selection-label-manipulation): objects can
  be explicitly aligned to a set of labels, or the user can simply
  ignore the labels and let `Series`, `DataFrame`, etc. automatically
  align the data for you in computations
- Powerful, flexible [groupby](https://danfo.jsdata.org/api-reference/groupby) functionality to perform
  split-apply-combine operations on data sets, for both aggregating
  and transforming data
- Make it easy to convert Arrays, JSONs, List or Objects, Tensors and
  differently-indexed data structures
  into DataFrame objects
- Intelligent label-based [slicing](https://danfo.jsdata.org/api-reference/dataframe/danfo.dataframe.loc), [fancy indexing](https://danfo.jsdata.org/api-reference/dataframe/danfo.dataframe.iloc), and [querying](https://danfo.jsdata.org/api-reference/dataframe/danfo.dataframe.query) of
  large data sets
- Intuitive [merging](https://danfo.jsdata.org/api-reference/general-functions/danfo.merge) and [joining](https://danfo.jsdata.org/api-reference/general-functions/danfo.concat) data
  sets
- Robust IO tools for loading data from [flat-files](https://danfo.jsdata.org/api-reference/input-output)
  (CSV, Json, Excel, Data package).
- Powerful, flexible and intutive API for [plotting](https://danfo.jsdata.org/api-reference/plotting) DataFrames and Series interactively.
- [Timeseries](https://danfo.jsdata.org/api-reference/series#accessors)-specific functionality: date range
  generation and date and time properties.
- Robust data preprocessing functions like [OneHotEncoders](https://danfo.jsdata.org/api-reference/general-functions/danfo.onehotencoder), [LabelEncoders](https://danfo.jsdata.org/api-reference/general-functions/danfo.labelencoder), and scalers like [StandardScaler](https://danfo.jsdata.org/api-reference/general-functions/danfo.standardscaler) and [MinMaxScaler](https://danfo.jsdata.org/api-reference/general-functions/danfo.minmaxscaler) are supported on DataFrame and Series



To use Danfo.js via script tags, copy and paste the CDN below to the body of your HTML file

```html
    <script src="https://cdn.jsdelivr.net/npm/danfojs@0.2.4/lib/bundle.min.js"></script> 
```

### Example Usage in the Browser

> See the example below in [Code Sandbox](https://codepen.io/risingodegua/pen/bGwPGMG)

```html

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdn.plot.ly/plotly-1.2.0.min.js"></script> 
    <script src="https://cdn.jsdelivr.net/npm/danfojs@0.2.4/lib/bundle.min.js"></script> 

    <title>Document</title>
</head>

<body>

    <div id="div1"></div>
    <div id="div2"></div>
    <div id="div3"></div>

    <script>

        dfd.read_csv("https://raw.githubusercontent.com/plotly/datasets/master/finance-charts-apple.csv")
            .then(df => {

                df['AAPL.Open'].plot("div1").box() //makes a box plot

                df.plot("div2").table() //display csv as table

                new_df = df.set_index({ key: "Date" }) //resets the index to Date column
                new_df.plot("div3").line({ columns: ["AAPL.Open", "AAPL.High"] })  //makes a timeseries plot

            }).catch(err => {
                console.log(err);
            })

    </script>
    
</body>

</html>
```

Output in Browser:

![](assets/browser-out.gif)

## How to install
Danfo.js is hosted on NPM, and can installed via package managers like npm and yarn

```sh
npm install danfojs-node
```

### Example usage in Nodejs

## Documentation
The official documentation can be found [here](https://danfo.jsdata.org)

## Discussion and Development
Documents leading to the structure, architecture and planning for this module can be found [here](Folder-with-ppt-docs))

## Contributing to PerfFlow
All contributions, bug reports, bug fixes, documentation improvements, enhancements, and ideas are welcome.

#### Licence [MIT](https://github.com/opensource9ja/danfojs/blob/master/LICENCE)

#### Created by [Sanket Mehrotra](https://github.com/mehrotrasan16)