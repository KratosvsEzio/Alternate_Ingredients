import { IngredientService } from './../service/ingredient.service';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { fromEvent } from 'rxjs';
import { debounceTime, pluck, distinctUntilChanged, filter, map, switchMap, tap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {

  @ViewChild('searchIngredient') searchIngredientsInput: ElementRef;
  alternateIngredients: any = []

  constructor(
    private ingredientService: IngredientService,
    private toastr: ToastrService
  ) { }

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
        debounceTime(600),
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

        if(!res.data) {
          this.showError(res.message);

        } else {
          console.log(res.data[0]);
          this.showSuccess(res.message);
  
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
        }
      })
      ;
  }

  // ---------------------------------------Success Toaster-------------------------------------------------------//
  showSuccess(message) {
    this.toastr.success(message, 'Success', {
      progressBar: true,
      progressAnimation: 'increasing'
    });
  }

  // ---------------------------------------Error Toaster---------------------------------------------------------//
  showError(message) {
    // console.log('message: ', message)
    this.toastr.error(message, 'Error', {
      progressBar: true,
      progressAnimation: 'increasing'
    });
  }

}
