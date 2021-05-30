import { IngredientService } from './../service/ingredient.service';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { fromEvent } from 'rxjs';
import { debounceTime, pluck, distinctUntilChanged, filter, map, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {

  @ViewChild('searchIngredient') searchIngredientsInput: ElementRef;
  alternateIngredients: any = []

  constructor(private ingredientService: IngredientService) { }

  ngOnInit() {
    this.ingredientService.getAlternateIngredients().subscribe( (alternateIngredients: any) => {
      // console.log('this.', alternateIngredients);
      this.alternateIngredients = alternateIngredients;
    })
  }
  
  // Search products
  ngAfterViewInit() {
    fromEvent(this.searchIngredientsInput.nativeElement, 'keyup')
      .pipe(
        debounceTime(300),
        pluck('target', 'value'),
        // distinctUntilChanged(),
        map( (value) => value),
        tap( () => {
          this.ingredientService.setAlternateIngredients([])
        }),
        filter((value: string) => value.length > 0),
        switchMap( (value: any) => this.ingredientService.fetchAlternateIngredients(value) )
      )
      .subscribe( async (res: any) => {
        // console.log(res.data[0]);
        const data = res.data[0];
        this.ingredientService.setAlternateIngredients([
          {
            name: data.alt_ingredient_1,
            imageSrc: data.alt_ingredient_1_image,
            imageAlt: 'alternate ingredient 1'
          },
          {
            name: data.alt_ingredient_2,
            imageSrc: data.alt_ingredient_2_image,
            imageAlt: 'alternate ingredient 2'
          },
          {
            name: data.alt_ingredient_3,
            imageSrc: data.alt_ingredient_3_image,
            imageAlt: 'alternate ingredient 3'
          },
        ])
      });
  }

}
