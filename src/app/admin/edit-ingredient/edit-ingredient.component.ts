import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { fromEvent } from 'rxjs';
import { debounceTime, pluck, distinctUntilChanged, filter, map, switchMap, tap } from 'rxjs/operators';
import { IngredientService } from 'src/app/core/service/ingredient.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-ingredient',
  templateUrl: './edit-ingredient.component.html',
  styleUrls: ['./edit-ingredient.component.css']
})
export class EditIngredientComponent implements OnInit, AfterViewInit {
  
  @ViewChild('searchIngredient') searchIngredientsInput: ElementRef;
  ingredientsForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private ingredientService: IngredientService,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    
    this.ingredientsForm = this.formBuilder.group({
      ingredient: ['', Validators.required],
      ingredientName1: ['', Validators.required],
      file1: ['', Validators.required],
      fileSource1: ['../../../assets/default.png', Validators.required],
      ingredientName2: ['', Validators.required],
      file2: ['', Validators.required],
      fileSource2: ['../../../assets/default.png', Validators.required],
      ingredientName3: ['', Validators.required],
      file3: ['', Validators.required],
      fileSource3: ['../../../assets/default.png', Validators.required],
    });
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
        this.ingredientsForm.patchValue({
          ingredientName1: data.alt_ingredient_1,
          fileSource1: data.alt_ingredient_1_image,
          ingredientName2: data.alt_ingredient_2,
          fileSource2: data.alt_ingredient_2_image,
          ingredientName3: data.alt_ingredient_3,
          fileSource3: data.alt_ingredient_3_image,
        });
      });
  }

  get f() { return this.ingredientsForm.controls; }
     
  onFileChange(event, controlName) {
  
    let base64encodedimage: any = '';
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        base64encodedimage = reader.result;
        // console.log('Image', base64encodedimage);
        if(controlName == 'file1') {
          this.ingredientsForm.patchValue({
            fileSource1: base64encodedimage
          });
        } else if(controlName == 'file2') {
          this.ingredientsForm.patchValue({
            fileSource2: base64encodedimage
          });
        } else if(controlName == 'file3') {
          this.ingredientsForm.patchValue({
            fileSource3: base64encodedimage
          });
        }
      }

    }
  }

  submit(form) {
    // console.log(form.value)
    this.ingredientService.editAlternateIngredients(form.value).subscribe( (res: any) => {
      this.ingredientsForm.reset();

      this.ingredientsForm.patchValue({
        fileSource1: '../../../assets/default.png',
        fileSource2: '../../../assets/default.png',
        fileSource3: '../../../assets/default.png',
      });
      
      if(res.code == 200) {
        this.showSuccess(res.message);
      } else {
        this.showError(res.message);
      }
      // console.log('res');
    });
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
