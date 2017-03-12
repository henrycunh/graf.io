var chart;
var inte = 0;
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
    } else {
        console.log("Not yet");
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

$(function() {
    // Pegando elemento canvas
    var ctx = $("#chart");
    // Criando dados
    var data = {  
        datasets: [
            {
                label: "Dataset 1",
                fill: true,
                lineTension: 0.2,
                backgroundColor: "rgba(75,192,192,0.4)",
                borderColor: "rgba(75,192,192,1)",
                data: [],
            }
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