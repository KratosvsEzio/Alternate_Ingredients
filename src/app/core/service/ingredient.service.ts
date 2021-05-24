import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class IngredientService {

  alternateIngredients = new BehaviorSubject<any>([])

  private ingredientUrl = 'http://localhost:4000/api/ingredient';

  constructor(private http: HttpClient) { }

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
    return this.http.post<{status: boolean, message: string}>(this.ingredientUrl, form).subscribe( (res) => {
      console.log('res');
    });
  }
}
