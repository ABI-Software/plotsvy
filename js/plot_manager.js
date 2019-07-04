// plot_manager.js, manages the plot and its data
const Plotly = require('plotly.js/dist/plotly-basic.min.js')

function PlotManager(parentDiv) {
  var chartDiv = parentDiv.querySelector('#chart_div')
  var _this = this
  _this.plot = undefined
  _this.subplots = false

  this.createChart = function (createChartData, samplesPerSecond, id) {
    if (_this.plot !== undefined) {
      Plotly.purge(chartDiv)
    }
    // _this.initialiseResizeListener(parentDiv)

    var times = []
    for (var i in createChartData) {
      times.push(i / samplesPerSecond)
    }

    var chartData = processData(createChartData, times, id)

    var chartOptions = {
      xaxis: {
        type: 'seconds',
        title: 'Seconds'
      },
      yaxis: {
        autorange: true,
        type: 'linear',
        title: 'mV'
      }
    }
    _this.plot = Plotly.react(chartDiv, chartData, chartOptions)
  }

  this.resetChart = function () {
    if (_this.plot !== undefined) {
      Plotly.purge(chartDiv)
      _this.plot = undefined
    }
  }

  this.clearChart = function () {
    if (_this.plot !== undefined) {
      Plotly.purge(chartDiv)
    }
  }

  this.addDataSeriesToChart = function (newSeries, samplesPerSecond, id) {

    if (_this.plot === undefined){
      _this.createChart(newSeries, samplesPerSecond, id)
      return
    }

    var times = []
    for (var i in newSeries) {
      times.push(i / samplesPerSecond)
    }
    var newData = processData(newSeries, times, id)
    Plotly.addTraces(chartDiv, newData)
  }

  var processData = function (unprocessedData, times, id) {
    var dataTrace = {
      type: 'scatter',
      name: id,
      mode: 'lines',
      x: times,
      y: unprocessedData,
      line: {
        color: '#' + (Math.random() * 0xFFFFFF << 0).toString(16)
      }
    }
    return [dataTrace]
  }

  var processDataMatrix = function (data) {
    var times = data.map( (row) => { return row[0]})
    var dataTraces = []
    for (var i in data[0]){
      if (i == 0){
        continue
      }
      else if (i == 1){
        var xlabel = 'x'
        var ylabel = 'y'
        var ydata = data.map( (row) => { return row[i]})
      }
      else{
        xlabel = 'x' + i
        ylabel = 'y' + i
        ydata = data.map( (row) => { return row[i]})
      }

      if (!_this.subplots){
        xlabel = 'x'
        ylabel = 'y'
      }
      
      ydata.pop(0)
      var dataTrace = {
        type: 'scatter',
        name: data[0][i],
        mode: 'lines',
        x: times,
        y: ydata,
        xaxis: xlabel,
        yaxis: ylabel,
        line: {
          color: '#' + (Math.random() * 0xFFFFFF << 0).toString(16)
        }
      }
      if (_this.subplots){
        dataTrace.showlegend = false
        dataTrace.title = data[0][i]
      }
      dataTraces.push(dataTrace)
    }
    return dataTraces
  }

  this.plotAll = function(data){
    dataTraces = processDataMatrix(data)
    if (!_this.subplots) {
      var layout = {
        title: 'Selected Channels Plot ',
        xaxis: {
          type: 'seconds',
          title: 'Seconds'
        },
        yaxis: {
          autorange: true,
          type: 'linear',
          title: 'mV'
        }
      }
    } else {
      var layout = {
        grid: {
          rows:  Math.ceil(dataTraces.length/2),
          columns: 2,
          pattern: 'independent'}
      }    
    }
    _this.plot = Plotly.react(chartDiv, dataTraces, layout) 
    
  }


  this.resizePlot = function( width, height ){
    if (_this.plot === undefined){
      _this.plot = Plotly.react(chartDiv)
    }
    Plotly.relayout(chartDiv, {
      width: width,
      height: height
    })
  }

  this.initialiseResizeListener = function (resizeObject) {
    resizeObject.addEventListener('resize', _ => {
      Plotly.relayout(chartDiv, {
        width: resizeObject.innerWidth,
        height: resizeObject.innerHeight
      })
    })
  }
}

module.exports = PlotManager
