/**
 * Created by Administrator on 2015/4/7.
 */

var margin = {top:100,left:100,bottom:100,right:100},
    width = $('.canvas').width()-margin.left-margin.right,
    height = $('.canvas').height()-margin.top-margin.bottom;

/*var margin = {top: 40, right: 10, bottom: 40, left: 10},
    width = 1910 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;*/

d3.csv('data/Data_Budget_Viewers.csv',parse,dataLoaded);
d3.csv('data/Data_TVShow_Average.csv',parseAverage,AverageLoaded);

var n = 2, m = 0;

var scaleX = d3.scale.linear();
var scaleY = d3.scale.linear();
var color = d3.scale.linear();

var yGroupMax = 0;
var yStackMax = 0;

function dataLoaded(err,data)
{
    draw(data);
}

function AverageLoaded(err,data)
{
    console.log(data);

    m = data.length;
    console.log(m);

    yGroupMax = d3.max(data,function(d){
        return d.AverageViewers;
    });

    scaleX
        .domain(d3.range(m))

    scaleY
        .domain([0,yGroupMax])
        .range([height,0]);

    console.log(yGroupMax);
    console.log(yStackMax);

    Averagedraw(data);
}

function Averagedraw(data)
{
    var BudgetandViewers = data;

    var svg = d3.select("div.canvas").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .selectAll("rect")
        .data(BudgetandViewers)
        .enter();


    var rect1 = svg
        .append("rect")
        .attr("class", "rect")
        .attr("x",function(d)
        {
            var widthNum = d.TVSID/m;
            widthNum = widthNum*width;
            return widthNum;
        })
        .attr("y",0)
        .attr("width",5)
        .attr("height",function(d) {
            var barHeight = d.AverageBudget * 25;
            return barHeight + "px";
        })
        .style('fill',"teal")

    var rect2 = svg
        .append("rect")
        .attr("class", "rect")
        .attr("x",function(d)
        {
            var widthNum = d.TVSID/m;
            widthNum = widthNum*width;
            return widthNum+5;
        })
        .attr("y",0)
        .attr("width",5)
        .attr("height",function(d) {
            var barHeight = d.AverageViewers * 25;
            return barHeight + "px";
        })
        .style('fill',"red")

    console.log(rect2);
}

function draw(data)
{
    console.log(data.length);
    console.log(data);
}

function parse(d){

    var newRow = {};

    newRow.name = d.Name;
    newRow.viewers = +d.USViewers;
    newRow.budget = +d.Budget;
    newRow.Year = +d.year;
    newRow.Month = +d.month;
    newRow.Day = +d.day;
    newRow.Datetime = d.Date;
    newRow.SID = +d.TVSiteID;
    newRow.ID = +d.SiteID;
    newRow.TypeNUM = +d.TypeNumber;
    newRow.TypeNo1 = d.Type1;
    newRow.TypeNo2 = d.Type2;
    newRowTypeNo3 = d.Type3;

    return newRow;
}

function parseAverage(d)
{
    var newAverageRow = {};

    newAverageRow.TVname = d.Name;
    newAverageRow.AverageViewers = +d.Viewers;
    newAverageRow.AverageBudget = +d.Budget;
    newAverageRow.TVSID = +d.TVSiteID;

    return newAverageRow;
}
