import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'Practica1';

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.crearScript("./../../../assets/js/jquery/jquery-3.2.1.min.js")
    this.crearScript("./../../../assets/js/popper.js")
    this.crearScript("./../../../assets/js/tilt.jquery.min.js")

  }

  crearScript(dir: string) {
    const body = document.body;
      const script = document.createElement('script');

      script.innerHTML = '';
      script.src = dir;
      script.async = false;
      //revisa el estado del script
      script.defer = true;

      body.appendChild(script);
    }
}
