//Assignment 4
//Due Thursday April 9

var margin = {t:100,r:100,b:200,l:150},
    width = $('.canvas').width() - margin.l - margin.r,
    height = $('.canvas').height() - margin.t - margin.b,
    padding = 3;


//Set up SVG drawing elements -- already done
var svg = d3.select('.canvas')
    .append('svg')
    .attr('width', width + margin.l + margin.r)
    .attr('height', height + margin.t + margin.b)
    .append('g')
    .attr('transform','translate('+margin.l+','+margin.t+')');

//Create a mercator projection
/*var Geographic = d3.geo.mercator()
    .scale((width + 1) / 2 / Math.PI)
    .translate([width / 2, height / 2])
    .precision(.1);*/

/*var path = d3.geo.path()
    .projection(Geographic);

var graticule = d3.geo.graticule();

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);*/

/*svg.append("path")
    .datum(graticule)
    .attr("class", "graticule")
    .attr("d", path);

var scaleX = d3.scale.linear()
        .range([0,width]),
    scaleY = d3.scale.linear()
        .range([height,0]);*/

/*d3.json("/mbostock/raw/4090846/world-50m.json", function(error, world) {
    svg.insert("path", ".graticule")
        .datum(topojson.feature(world, world.objects.land))
        .attr("class", "land")
        .attr("d", path);

    svg.insert("path", ".graticule")
        .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
        .attr("class", "boundary")
        .attr("d", path);
});*/

    console.log("4");

    var force = d3.layout.force()
        .size([width,height])
        .charge(-5)
        .gravity(.05);

    var scaleSize = d3.scale.sqrt().range([5,100]);

    var projection = d3.geo.mercator()
        .translate([width / 2, height / 2])
        .scale(470);

  d3.csv('data/world.csv',parse,function(err,world){
      console.log(world);

      var extent = d3.extent(world, function(d){return d.pop});
      scaleSize
          .domain(extent);

     var nodesArray =  world.map(function(c){
         //console.log(c);

          var xy = projection(c.lngLat);
          return {
              x: xy[0],
              y: xy[1],
              x0: xy[0],
              y0: xy[1],
              r: scaleSize(c.pop),
              pop: c.pop,
              id: c.id,
              name: c.name
          }
      })

      var countries = svg.selectAll('.country')
          .data(nodesArray,function(d){return d.id;})
          .enter()
          .append('g')
          .attr('class','country');

      /*countries
          .attr('transform',function(d){
              var xy = projection(d.lngLat);
              return 'translate('+xy[0]+','+xy[1]+')';
          })*/

      countries
          .attr('transform',function(d){
              return 'translate('+ d.x+','+ d.y +')';
          });

      countries
          .append('circle')
          .attr('r',function(d){
              return scaleSize(d.pop);
          })

      countries
          .append('text')
          .text(function(d) {
              return d.name;
          })
          .style('fill','black')
          .style('font-size', function (d) {
              var valueSize = d.pop*0.000000001;
              return (valueSize.toString()+"px");
          })
          .style('text-anchor','middle')
          .style('font-size-adjust',5);

       force
          .nodes(nodesArray)
          .on('tick',onTick)
          .start();

      function onTick(e)
      {
          countries
              .each(gravity(e.alpha*.05))
              .each(collide(.8))
              .attr('transform',function(d){
                  return 'translate('+ (d.x - 180) + ','+ (d.y + 200) +')';
              });
      }

      function gravity(k){
          return function(d) {
              d.x += (d.x0 - d.x) * k;
              d.y += (d.y0 - d.y) * k;
          };
      }

      function collide(k){
          var q = d3.geom.quadtree(nodesArray);
          return function(node) {
              var nr = node.r + padding,
                  nx1 = node.x - nr,
                  nx2 = node.x + nr,
                  ny1 = node.y - nr,
                  ny2 = node.y + nr;
              q.visit(function(quad, x1, y1, x2, y2) {
                  if (quad.point && (quad.point !== node)) {
                      var x = node.x - quad.point.x,
                          y = node.y - quad.point.y,
                          l = x * x + y * y,
                          r = nr + quad.point.r;
                      if (l < r * r) {
                          l = ((l = Math.sqrt(l)) - r) / l * k;
                          node.x -= x *= l;
                          node.y -= y *= l;
                          quad.point.x += x;
                          quad.point.y += y;
                      }
                  }
                  return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
              });
          };
      }

  })






/*queue()
    .defer(d3.csv, 'data/world.csv', parse)
    .await(function(err, data){
        //create hierarchy out of data

        //console.log(data);

        var nest = d3.nest()
            .key(function(d){return d.continent;});

        var nestedData = nest.entries(data);

        var world = {
            key: "World",
            values: nestedData
        }

        //console.log(world);

        draw(world);

    });*/

/*function draw(world)
{
    console.log(world);

    /*svg.append('path')
        .attr('class','state')
        .datum(world)
        .attr('d',path);*/

    /*var worldpath = svg.insert("path", ".graticule")
        .datum(world.values)
        .attr("class", "land")
        .attr("d", path);

    console.log(worldpath);

    console.log(world.data);

    svg.selectAll('.nodes')
        .data(world.values)
        .enter()
        .append('circle')
        .attr('class','nodes')
        //.attr('d',path)
        .style('fill','red')
        .attr('cx',function(d){
            return scaleX(d.lngLat[0]);
        })
        .attr('cy',function(d){
            return scaleY(d.lngLat[1]);
        })
        .attr('r',function(d){
            return 5;
        });

    /*svg.insert("path", ".graticule")
        .datum(world)
        .attr("class", "boundary")
        .attr("d", path);*/
/*
}*/

//d3.select(self.frameElement).style("height", height + "px");


//Import data
function parse(d){
    if(+d.UNc_latitude && +d.UNc_longitude ){

        return {
            id: d.ISO3166A3,
            name: d.ISOen_name,
            lngLat:[+d.UNc_longitude, +d.UNc_latitude],
            continent: d.continent,
            pop: +d.population>0?+d.population:0
        }
    }

   /* return {
        key: d.ISO3166A3,
        name: d.ISOen_name,
        lngLat:[+d.UNc_longitude, +d.UNc_latitude],
        continent: d.continent,
        pop: +d.population>0?+d.population:0
    }*/
}
