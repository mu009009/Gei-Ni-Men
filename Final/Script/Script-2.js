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
    console.log(data.length);
    console.log(data);
}

function AverageLoaded(err,data)
{
    console.log(data);

    m = data.length;
    console.log(m);

    yGroupMax = d3.max(data,function(d){
        return d.AverageViewers;
    });

    yStackMax = d3.max(data,function(d)
    {
        return d.AverageBudget+ d.AverageViewers
    });

    scaleX
        .domain(d3.range(m))
        .rangeRoundBands([0, width], .08);

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
    var layers = stack(d3.range(n).map(function() { return bumpLayer(m, .1); }));

    color = d3.scale.linear()
        .domain([0, n - 1])
        .range(["#aad", "#556"]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .tickSize(0)
        .tickPadding(6)
        .orient("bottom");

    var svg = d3.select("div.canvas").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var layer = svg.selectAll(".layer")
        .data(layer)
        .enter().append("g")
        .attr("class", "layer")
        .style("fill", function(d, i) { return color(i); });

    var rect = svg.selectAll("rect")
        .data(BudgetandViewers)
        .enter()
        .append("rect")
        .attr("x", function(d) {
            return d.TVSID;
        })
        .attr("y", d.AverageViewers)
        .attr("width", x.rangeBand())
        .attr("height", 0);

    rect.transition()
        .delay(function(d, i) { return i * 10; })
        .attr("y", function(d) { return y(d.AverageViewers + d.AverageBudget); })
        .attr("height", function(d) { return y(d.AverageViewers) - y(d.AverageViewers + d.AverageBudget); });

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    d3.selectAll("input").on("change", change);

    var timeout = setTimeout(function() {
        d3.select("input[value=\"grouped\"]").property("checked", true).each(change);
    }, 2000);

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

function change() {
    clearTimeout(timeout);
    if (this.value === "grouped") transitionGrouped();
    else transitionStacked();
}

function transitionGrouped() {
    y.domain([0, yGroupMax]);

    rect.transition()
        .duration(500)
        .delay(function(d, i) { return i * 10; })
        .attr("x", function(d, i, j) { return x(d.x) + x.rangeBand() / n * j; })
        .attr("width", x.rangeBand() / n)
        .transition()
        .attr("y", function(d) { return y(d.y); })
        .attr("height", function(d) { return height - y(d.y); });
}

function transitionStacked() {
    y.domain([0, yStackMax]);

    rect.transition()
        .duration(500)
        .delay(function(d, i) { return i * 10; })
        .attr("y", function(d) { return y(d.y0 + d.y); })
        .attr("height", function(d) { return y(d.y0) - y(d.y0 + d.y); })
        .transition()
        .attr("x", function(d) { return x(d.x); })
        .attr("width", x.rangeBand());
}

function bumpLayer(n, o) {

    function bump(a) {
        var x = 1 / (.1 + Math.random()),
            y = 2 * Math.random() - .5,
            z = 10 / (.1 + Math.random());
        for (var i = 0; i < n; i++) {
            var w = (i / n - y) * z;
            a[i] += x * Math.exp(-w * w);
        }
    }

    var a = [], i;
    for (i = 0; i < n; ++i) a[i] = o + o * Math.random();
    for (i = 0; i < 5; ++i) bump(a);
    return a.map(function(d, i) { return {x: i, y: Math.max(0, d)}; });
}