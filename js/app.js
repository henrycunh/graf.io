var chart;

function addNode(){
    var en = $("#entry");
    var enV = en.val();
    var values = enV.split(" ");
    if(values.length == 2){
        if($.isNumeric(values[0]) && $.isNumeric(values[1])){
            en.val("");
            var node = {x:values[0], y:values[1]};
            $("#tabela-valores").append("<tr><td>" + node.x + "</td><td>" + node.y + "</td></tr>" );
            chart.data.datasets[0].data.push(node);
            chart.update();
        }
    } else {
        console.log("Not yet");
    }
    
    
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