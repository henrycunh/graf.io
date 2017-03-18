var chart;
var inte = 0;
var dsInt = 1;
var gMax = 5;
var gMin = -5;

var colors = [
    "rgb(66, 134, 244)", "rgb(92, 65, 244)", "rgb(163, 65, 244)", "rgb(65, 244, 220)", "rgb(65, 244, 73)", "rgb(229, 244, 65)", "rgb(244, 65, 157)", "rgb(244, 65, 65)"
];

function alphaColor(color, opacity){
    color = color.replace("rgb", "rgba");
    color = color.replace(")", ", " + parseFloat(opacity / 100).toFixed(2) + ")");
    return color;
}

function getColor(){
  return colors.pop();
}

function criarDataset() {
    if(colors.length > 0){
        let color = getColor()
        var dataset =
            `<div class='ds' id='dsdiv-${dsInt}'>
                <h2 style='color: ${color}' id='name-${dsInt}'>Conjunto de Dados ${dsInt}</h2>
                <button class='sh'>V</button>
                <div class='ds-in'>
                    <input id='namein-${dsInt}' oninput='updateName(${dsInt})' placeholder='Nome do Conjunto de Dados' value='Conjunto de Dados ${dsInt}'>
                    <input oninput='addNode(${dsInt})' id='entry-${dsInt}' placeholder='(X Y)' class='entry'>
                    <table id='table-${dsInt}' class='tabela-valores'>
                      <tr>
                        <th>X</th>
                        <th>Y</th>
                        <th></th>
                      </tr>
                    </table>
                    <button onclick='removeDS(${dsInt})'>Remover</button>
                </div>
            </div>`

        $(".controls").append(dataset);
        $("h2#name-" + dsInt).next().click(function() {
            $(this).next().slideToggle(500);
        });
        var ds = {
            dsC: color,
            dsId: dsInt,
            label: "Conjunto de Dados " + dsInt,
            fill: true,
            backgroundColor: alphaColor(color, 30),
            borderColor: color,
            lineTension: 0.2,
            data:[]
        };
        chart.data.datasets.push(ds);
        chart.update();

        dsInt++;
    }
}

function getNodePos(id, ds){
    for(var i = 0; i < ds.length; i++){
        if(ds[i].id == id) return i;
    }
}

function getPos(int){
  for (var i = 0; i < chart.data.datasets.length; i++) {
    if(chart.data.datasets[i].dsId == int) return i;
  }
}

function updateName(int){
    var inp = $("#namein-"+int);
    var name = $("#name-"+int);
    chart.data.datasets[getPos(int)].label = inp.val();
    chart.update();
    name.html(inp.val());
}

function addNode(int){
    var en = $("#entry-"+int);
    var enV = en.val();
    var values = enV.split(" ");
    if(values.length == 3){
        if($.isNumeric(values[0]) && $.isNumeric(values[1])){
            en.val("");
            var node = {x:values[0], y:values[1], id: inte};
            $("#table-"+int).append("<tr id='"+int+"-" + inte + "'><td>" + node.x + "</td><td>" + node.y + "</td><td><button onclick='removeNode(" + inte + "," + int + ")'>X</button></td></tr>" );
            chart.data.datasets[getPos(int)].data.push(node);
            chart.update();
            inte++;
        }
    }
}

function removeDS(int){
    $("#dsdiv-"+int).remove()
    colors.push(chart.data.datasets[getPos(int)].dsC)
    chart.data.datasets.splice(getPos(int),1)
    chart.update()
}

function removeNode(id, int){
    $("#" + int + "-" + id).remove();
    var index = getNodePos(id, chart.data.datasets[getPos(int)].data);
    console.log(chart.data.datasets[getPos(int)].data);
    console.log(chart.data.datasets[getPos(int)].data[index]);
    console.log(index);
    chart.data.datasets[getPos(int)].data.splice(index,1);
    chart.update();
}

function criarFunc(){
  if(colors.length > 0){
    let color = getColor()
    let html =
    `<div class='ds' id='dsdiv-${dsInt}'>
        <h2 style='color: ${color}' id='name-${dsInt}'>Função ${dsInt}</h2>
        <button class='sh'>V</button>
        <div class='ds-in'>
            <input id='namein-${dsInt}' oninput='updateName(${dsInt})' placeholder='Nome da função' value='Função ${dsInt}'>
            <input oninput="changeFunc('func',${dsInt})" id='func-${dsInt}' placeholder='Função' value='sin(x)' class='entry'>
            <input oninput="changeFunc('min', ${dsInt})" placeholder='Valor Mínimo' value='-25' id='min-${dsInt}' class='funcEntry'>
            <input oninput="changeFunc('max', ${dsInt})" placeholder='Valor Máximo' value='25' id='max-${dsInt}' class='funcEntry'>
            <input oninput="changeFunc('step', ${dsInt})" placeholder='Variação' value='0.1' id='step-${dsInt}' class='funcEntry'>
            <button onclick='removeDS(${dsInt})'>Remover</button>
        </div>
    </div>`
    $(".controls").append(html);
    $("h2#name-" + dsInt).next().click(function() {
        $(this).next().slideToggle(500);
    });
    var ds = {
        funcMin: -25,
        funcMax: 25,
        funcStep: 0.1,
        func: 'cos(x)',
        dsC: color,
        dsId: dsInt,
        label: "Função " + dsInt,
        borderColor: color,
        fill: false,
        lineTension: 0.1,
        pointRadius: 0.1,
        data:[]
    };
    chart.data.datasets.push(ds);
    updateDS(dsInt)
    dsInt++
  }
}

function changeFunc(type, int){
  let ds = chart.data.datasets[getPos(int)]

  if(type == 'min')
    ds.funcMin = parseFloat($(`#min-${int}`).val());
  else if(type == 'max')
    ds.funcMax = parseFloat($(`#max-${int}`).val());
  else if(type == 'step')
    ds.funcStep = parseFloat($(`#step-${int}`).val());
  else if(type == 'func')
    ds.func = $(`#func-${int}`).val();

  chart.data.datasets[getPos(int)] = ds
  updateDS(int)
}


function updateDS(int){
  let data = chart.data.datasets[getPos(int)]
  let min = data.funcMin, max = data.funcMax, step = data.funcStep, func = data.func
  let newData = []
  if(step < 0.01) step = 0.01
  let code = math.parse(func).compile()
  for(let i = min; i <= max; i += step){
    let scope = {x: i}
    let current = code.eval(scope).toFixed(4)
    newData.push({x:i, y:current})
  }
  chart.data.datasets[getPos(int)].data = newData
  chart.update()
}



function saveImage(){
    var img = chart.toBase64Image();
    download(img, 'Grafico - graf.io.png', 'image/png');
}


function MouseWheelHandler(e)
{
    // cross-browser wheel delta
    var e = window.event || e; // old IE support
    var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));

    return false;
}

$(document).ready(function() {
    // Pegando elemento canvas
    var ctx = $("#chart");

    ctx.on('mousewheel', event => {
      if(event.deltaY > 0){
        chart.options.scales.xAxes[0].ticks.min += 0.5;
        chart.options.scales.yAxes[0].ticks.min += 0.5;
        chart.options.scales.xAxes[0].ticks.max -= 0.5;
        chart.options.scales.yAxes[0].ticks.max -= 0.5;
      } else {
        chart.options.scales.xAxes[0].ticks.min -= 0.5;
        chart.options.scales.yAxes[0].ticks.min -= 0.5;
        chart.options.scales.xAxes[0].ticks.max += 0.5;
        chart.options.scales.yAxes[0].ticks.max += 0.5;
      }
      chart.update()
    })
    var pressed = false;

    ctx.on('mousedown', e => {
      $(this).data('firstPoint', { x: e.pageX, y: e.pageY })
      pressed = true;
    }).on('mousemove', e => {
      if(pressed){
        let fP = $(this).data('firstPoint')
        let sP = { x: e.pageX, y: e.pageY }
        let d = {x: sP.x - fP.x, y: sP.y - fP.y}
        d.vert = (d.y < 0 ? "0.25" : "-0.25") // up down
        d.hori = (d.x < 0 ? "0.25" : "-0.25") // left right
        chart.options.scales.xAxes[0].ticks.min += parseFloat(d.hori);
        chart.options.scales.xAxes[0].ticks.max += parseFloat(d.hori);
        chart.options.scales.yAxes[0].ticks.min += parseFloat(d.vert);
        chart.options.scales.yAxes[0].ticks.max += parseFloat(d.vert);
        chart.update()//
      }
    }).on('mouseup', () => {
      pressed = false;
    })
    // Criando dados
    var data = {
        datasets: [

        ]
    };

    var options = {
        responsive: true,
        maintainAspectRatio: false,
        padding: 4,
        scales: {
            xAxes: [{
                type: 'linear',
                position: 'bottom',
                ticks:{
                min: gMin,
                max: gMax
                }
            }],
            yAxes: [{
              position: 'left',
              ticks:{
              min: gMin,
              max: gMax
              }
            }]
        }
    };

    // Criando gráfico
    chart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: options
    });


});
