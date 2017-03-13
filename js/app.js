var chart;
var inte = 0;
var dsInt = 1;

var colors = [
    "rgb(66, 134, 244)", "rgb(92, 65, 244)", "rgb(163, 65, 244)", "rgb(65, 244, 220)", "rgb(65, 244, 73)", "rgb(229, 244, 65)", "rgb(244, 65, 157)", "rgb(244, 65, 65)"
];

function alphaColor(color, opacity){
    color = color.replace("rgb", "rgba");
    color = color.replace(")", ", " + parseFloat(opacity / 100).toFixed(2) + ")");
    return color;
}

function criarDataset() {
    if(dsInt <= 8){
        var dataset = 
            "<div class='ds' id='dsdiv-" + dsInt + "'>"+
                "<h2 style='color: " + colors[dsInt] + "' id='name-" + dsInt + "'>Conjunto de Dados " + dsInt + "</h2>"+
                "<button class='sh'>V</button>"+
                "<div style='display:none' class='ds-in'>"+
                    "<input id='namein-" + dsInt + "' oninput='updateName(" + dsInt + ")' placeholder='Nome do Conjunto de Dados' value='Conjunto de Dados " + dsInt + "'>" +
                    "<input oninput='addNode(" + dsInt + ")' id='entry-" + dsInt + "' placeholder='(X Y)' class='entry'>"+
                    "<table id='table-" + dsInt + "' class='tabela-valores'><tr><th>X</th><th>Y</th><th></th></tr></table>"+
                    "<button onclick='removeDS(" + dsInt + ")'>Remover</button>"
                "</div>"+
            "</div>";

        $(".controls").append(dataset);
        $("h2#name-" + dsInt).next().click(function() {
            $(this).next().slideToggle(500);
        });
        var ds = {
            dsId: dsInt,
            label: "Conjunto de Dados " + dsInt,
            fill: true,
            backgroundColor: alphaColor(colors[dsInt-1], 30),
            borderColor: colors[dsInt-1],
            lineTension: 0.2,
            data:[]
        };
        chart.data.datasets.push(ds);
        chart.update();

        dsInt++;
    }
}

function getPos(int){
    return chart.data.datasets.find(function(ds) { 
        return ds.dsId = int;
    }).dsId - 1;
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
    $("#dsdiv-"+int).remove();
    chart.data.datasets.splice(getPos(int),1);
    chart.update();
}

function removeNode(id, int){
    $("#" + int + "-" + id).remove();
    var index = chart.data.datasets[getPos(int)].data.find(function(node) {
                return node.id == id;
            });
    chart.data.datasets[getPos(int)].data.splice(index,1);
    chart.update();
}

function saveImage(){
    var img = chart.toBase64Image();
    download(img, 'Grafico - graf.io.png', 'image/png');
}

$(document).ready(function() {
    // Pegando elemento canvas
    var ctx = $("#chart");
    // Criando dados
    var data = {  
        datasets: [
            
        ]
    };
    
    var options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            xAxes: [{
                type: 'linear',
                position: 'bottom'
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