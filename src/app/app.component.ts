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
    this.crearScript("assets/js/jquery-3.4.1.min.js");
    this.crearScript("https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js");
    this.crearScript("assets/js/bootstrap.js");
    this.crearScript("https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/owl.carousel.min.js");
    this.crearScript("https://unpkg.com/isotope-layout@3.0.4/dist/isotope.pkgd.min.js");
    this.crearScript("https://cdnjs.cloudflare.com/ajax/libs/jquery-nice-select/1.1.0/js/jquery.nice-select.min.js");
    this.crearScript("assets/js/custom.js");
    this.crearScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyCh39n5U-4IoWpsVGUHWdqB6puEkhRLdmI&callback=myMap");
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
