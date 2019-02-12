import { Component, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  @ViewChild('barCanvas') barCanvas;
   barChart: any;
  public objetivo: number;
  public solucion;
  public highest = -1;
  public highestNum = -1;
  public lowest = 100;
  public lowestNum = -1;
  public sols = [];
  public solsSolo = [];
  public objs = [];
  public calculando = true;

  constructor(){
    this.objetivo = 55;
    this.solucion = this.bfs(this.objetivo);
    for(let k = 0; k <= 100; k++){
      var sol = this.bfs(k);
      this.objs.push(k);
      this.solsSolo.push(sol.length);
      this.sols.push({obj: k, sol: sol.length});
      if(sol.length > this.highest){
        this.highest = sol.length;
        this.highestNum = k;
      }
      if(sol.length < this.lowest){
        this.lowest = sol.length;
        this.lowestNum = k;
      }
    }
    this.calculando = false;
  }

  ionViewDidLoad() {
  if(!this.calculando){
  this.barChart = new Chart(this.barCanvas.nativeElement, {

           type: 'line',
           data: {
                labels: this.objs,
                datasets: [{
                    label: "My First dataset",
                    backgroundColor: 'rgb(255, 99, 132)',
                    borderColor: 'rgb(255, 99, 132)',
                    data: this.sols,
                }]
            },
           options: {}

       });
       }
     }

bfs(objetivo){
  var t0 = performance.now();
  var initialState = {
  currentPos: 0,
  operacion: '123456789'
  };
  var closedStates = [];
  var openStates = [initialState];
  var finalStates = [];
  var calculando = true;

  while(calculando){
    //DFS
    // var currentState = openStates.pop();
    //BFS
    var currentState = openStates[openStates.length - 1];
    openStates.splice(openStates.length - 1, 1);
    if(currentState.operacion[currentState.currentPos - 1] != '9'){
      var newState = {
        currentPos: currentState.currentPos + 1,
        operacion: currentState.operacion
      }
      openStates.push(newState);
      if(this.calcular(newState.operacion) == objetivo && finalStates.filter(s => s.operacion === newState.operacion).length == 0){
        finalStates.push(newState)
      }
      if(currentState.operacion[currentState.currentPos] != '+' && currentState.operacion[currentState.currentPos] != '-'){
        var newState1 = {
          currentPos: currentState.currentPos + 2,
          operacion: this.accion(currentState, '+')
        }
        openStates.push(newState1);
        if(this.calcular(newState1.operacion) == objetivo && finalStates.filter(s => s.operacion === newState.operacion).length == 0){
          finalStates.push(newState1)
        }
        var newState2 = {
          currentPos: currentState.currentPos + 2,
          operacion: this.accion(currentState, '-')
        }
        openStates.push(newState2);
        if(this.calcular(newState2.operacion) == objetivo && finalStates.filter(s => s.operacion === newState.operacion).length == 0){
          finalStates.push(newState2)
        }
      }
    }
    closedStates.push(currentState);
    if(openStates.length == 0){
      calculando = false;
    }
  }
  console.log(finalStates);
  var t1 = performance.now();
  console.log("Tiempo transcurrido: " + (t1-t0) + " ms")
  return finalStates;
};

accion(s, a: string){
    return s.operacion.substring(0, s.currentPos) + a + s.operacion.substring(s.currentPos);
}

calcular(operacion: string){
  if(operacion[0] == '+') return -1;
  var total: number = 0;
  var sumas = operacion.split('+');
  for(var i = 0; i < sumas.length; i++){
    var restas = sumas[i].split('-');
    for(var j = 0; j < restas.length; j++){
      if(j == 0){
        total += Number(restas[j]);
      }else{
        total -= Number(restas[j]);
      }
    }
  }
  return total;
}

// appDiv.innerHTML += `<h1>Existen ` + solucion.length + ` soluciones</h1>`;
// for(let k = 0; k < solucion.length; k++){
//   appDiv.innerHTML += `<h3>` + solucion[k].operacion + ` = ` + objetivo + `</h3>`;
// }

}
