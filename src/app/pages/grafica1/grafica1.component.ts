import { Component, OnInit } from '@angular/core';
import { ChartData } from 'chart.js';
import { MedicoService } from 'src/app/services/medico.service';



@Component({
  selector: 'app-grafica1',
  templateUrl: './grafica1.component.html',
  styles: [
  ]
})
export class Grafica1Component implements OnInit {
  public allEspecialidades: string[] = [];
  public especialidadesCount: string[] = [];
  public labelEspecialidades: string[] = []
  public objeWithEspeciaildades;
  
  public labels1: string[] = [ 'Pan', 'Refresco', 'Tacos' ];
  public data1: ChartData<'doughnut'> = {
    labels: this.labels1,
    datasets: [
      { data: [ 10, 15, 40 ] }
    ]
  };

  public dataEspecialidades: ChartData<'doughnut'>;

  constructor(
    private medicoService: MedicoService
  ){}

  ngOnInit(): void {
    this.medicoService.cargarMedicos().subscribe(resp => {
      this.allEspecialidades = resp.map((item)=>{
        return item.especialidad
      });
      this.objeWithEspeciaildades = this.contarRepeticiones(this.allEspecialidades);
      this.labelEspecialidades = Object.keys(this.objeWithEspeciaildades);
      this.dataEspecialidades = {
        labels: this.labelEspecialidades,
        datasets:[
          { data: Object.values(this.objeWithEspeciaildades)}
        ]
      }
    });
  }

  contarRepeticiones(strings: string[]): Record<string, number> {
    const frecuencia: Record<string, number> = {};
  
    for (const str of strings) {
      if (frecuencia[str]) {
        frecuencia[str]++;
      } else {
        frecuencia[str] = 1;
      }
    }
  
    return frecuencia;
  }
  
}
