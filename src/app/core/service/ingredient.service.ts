import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class IngredientService {

  alternateIngredients = new BehaviorSubject<any>([])

  private ingredientUrl = 'https://node.subthegrub.com/api/ingredient';

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
  ) { }

  getAlternateIngredients(): Observable<any> {
    return this.alternateIngredients.asObservable();
  }

  setAlternateIngredients(data: any) {
    this.alternateIngredients.next(data);
  }

  fetchAlternateIngredients(ingredient = '') {
    return this.http.get(this.ingredientUrl + '/' + ingredient);
  }

  addAlternateIngredients(form) {
    console.log('form data', form)
    return this.http.post<{status: boolean, message: string}>(this.ingredientUrl, form)
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
