/**
* BlackfynnPanel is used for making calls to blackfynn to collect timeseries data and plot it using plotly
*/

require('.././node_modules/select2/dist/css/select2.min.css')
require('.././css/main.css')
require('.././css/util.css')
const UI = require('./ui.js')
const PlotManager = require('./plot_manager.js')
const CsvManager = require('./csv_manager.js')
var $ = require('jquery')
require('select2')

// Need to load select2 and blackfynnManger once the DOM is ready
$(document).ready(function () {

})


// BlackfynnManager(): Manages the HTTP requests to the backend, Tehsurfer/Physiome-Blackfynn-API 
//                     and drives the plot and ui modules.
function BlackfynnManager() {
  var ui = undefined
  var parentDiv = undefined
  var plot = undefined
  var csv = undefined
  var _this = this
  var loggedIn = false
  _this.baseURL = 'http://127.0.0.1:82/'

  // initialiseBlackfynnPanel: sets up ui and plot, needs DOM to be loaded
  this.initialiseBlackfynnPanel = function () {
    parentDiv = document.getElementById('blackfynn-panel')
    ui = new UI(parentDiv)
    plot = new PlotManager(parentDiv)
    csv = new CsvManager()
    

    _this.examplePlotSetup()
    parentDiv.querySelector('#select_channel').onchange = channelCall


  }

  this.examplePlotSetup = function(){
    channelNames = ['one', 'two', 'three']
    ui.createChannelDropdown(channelNames)
    data = [1,2,3,4]
    samplesPerSecond = 1
    plot.createChart(data, samplesPerSecond, data.length, channelNames[0])
  }

  var channelCall = function(){
    selectedChannel = $('#select_channel :selected').text()
    data = {
      'one': [1,2,3,4],
      'two': [2,2,3,4],
      'three': [3,2,3,4]
    }
    samplesPerSecond = 1

    plot.addDataSeriesToChart(data[selectedChannel], samplesPerSecond, selectedChannel)

  }

  var csvChannelCall = function(){
    selectedChannel = $('#select_channel :selected').text()
    plot.addDataSeriesToChart(csv.getColoumnByName(selectedChannel), csv.getSampleRate(), selectedChannel)
  }


  this.openCSV = function(url){

    csv.loadFile(url, ()=>{
      ui.createChannelDropdown(csv.getHeaders())
      plot.addDataSeriesToChart(csv.getColoumnByIndex(1), csv.getSampleRate(), 'gg')
      parentDiv.querySelector('#select_channel').onchange = csvChannelCall
    })
  }

  var initialiseObject = function(){
    $('.js-select2').each(function () {
      $(this).select2({
        minimumResultsForSearch: 20
      })
      $('.js-select2').each(function () {
        $(this).on('select2:close', function (e) {
          $('.js-show-service').slideUp()
          $('.js-show-service').slideDown()
        })
      })
    })
  
    _this.initialiseBlackfynnPanel()
    _this.updateSize()
    // _this.openCSV('https://blackfynnpythonlink.ml/data/F9NBX1.csv')
  }

  this.updateSize = function(){
    var blackfynn_panel = document.getElementById('blackfynn-panel')
    var dataset_div = document.getElementById('dataset_div')
    var chart_height = blackfynn_panel.clientHeight - dataset_div.offsetHeight

    plot.resizePlot(blackfynn_panel.clientWidth, chart_height)
  }
  initialiseObject()

}

exports.BlackfynnManager = BlackfynnManager