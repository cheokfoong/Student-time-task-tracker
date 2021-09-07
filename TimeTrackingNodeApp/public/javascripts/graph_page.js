function drawChart()
{
  // info from the database can be used here
  // let chartData = google.visualization.arrayToDataTable([
  //         ['Task', 'Hours per Day'],
  //         ['student1',     11],
  //         ['student2',      2.826],
  //         ['student3',  2],
  //         ['student4', 2],
  //         ['student5',    7]
  //       ]);

  let chartData = google.visualization.arrayToDataTable(JSON.parse(pieChartInfo))

  let options = {
          title: 'STUDENT CONTRIBUTION'
  };

  let chart = new google.visualization.PieChart(document.getElementById('pie_chart'));
  chart.draw(chartData, options);

}

google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);


