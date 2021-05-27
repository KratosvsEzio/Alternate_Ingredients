import { IngredientService } from './../../core/service/ingredient.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-ingredients',
  templateUrl: './ingredients.component.html',
  styleUrls: ['./ingredients.component.css']
})
export class IngredientsComponent implements OnInit {

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
      fileSource1: ['', Validators.required],
      ingredientName2: ['', Validators.required],
      file2: ['', Validators.required],
      fileSource2: ['', Validators.required],
      ingredientName3: ['', Validators.required],
      file3: ['', Validators.required],
      fileSource3: ['', Validators.required],
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
    console.log(form.value)
    this.ingredientService.addAlternateIngredients(form.value).subscribe( (res: any) => {
      this.ingredientsForm.reset();
      if(res.code == 200) {
        this.showSuccess(res.message);
      } else {
        this.showError(res.message);
      }
      console.log('res');
    });;
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
    console.log('message: ', message)
    this.toastr.error(message, 'Error', {
      progressBar: true,
      progressAnimation: 'increasing'
    });
  }
}
