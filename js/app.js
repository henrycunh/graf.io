var chart;
var inte = 0;
var dsInt = 1;

var colors = [
    "rgb(66, 134, 244)", "rgb(92, 65, 244)", "rgb(163, 65, 244)", "rgb(65, 244, 220)", "rgb(65, 244, 73)", "rgb(229, 244, 65)", "rgb(244, 65, 157)", "rgb(244, 65, 65)"
];

function criarDataset() {
    var dataset = 
        "<div class='ds'>"+
            "<h2 style='color: " + colors[dsInt] + "' id='name-" + dsInt + "'>Conjunto de Dados " + dsInt + "</h2>"+
            "<button class='sh'>V</button>"+
            "<div style='display:none' class='ds-in'>"+
                "<input oninput='updateName(" + dsInt + ")' placeholder='Nome do Conjunto de Dados value='Conjunto de Dados " + dsInt + "'>" +
                "<input oninput='addNode(" + dsInt + ")' placeholder='Entre com um ponto no gráfico (X Y)' class='entry'>"+
                "<table id='table-" + dsInt + "'><tr><th>X</th><th>Y</th><th></th></tr></table>"+
            "</div>"+
        "</div>";
    dsInt++;
    
    $(".controls").append(dataset);
    $(".sh").click(function() {
        $(this).next().slideToggle(500);
    });
    
    
}

function addNode(){
    var en = $("#entry");
    var enV = en.val();
    var values = enV.split(" ");
    if(values.length == 3){
        if($.isNumeric(values[0]) && $.isNumeric(values[1])){
            en.val("");
            var node = {x:values[0], y:values[1], id: inte};
            $("#tabela-valores").append("<tr id='" + inte + "'><td>" + node.x + "</td><td>" + node.y + "</td><td><button onclick='removeNode(" + inte + ")'>X</button></td></tr>" );
            chart.data.datasets[0].data.push(node);
            chart.update();
            inte++;
            
        }
    } 
}

function removeNode(id){
    
    $("#" + id).remove();
    var index = chart.data.datasets[0].data.find(function(node) {
                return node.id == id;
            });
    chart.data.datasets[0].data.splice(index,1);
    chart.update();
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