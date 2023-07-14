import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Recipe } from 'src/app/models/recipe.model';
import { RecipeService } from 'src/app/services/recipe.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { map, Observable } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-recipe-card',
  templateUrl: './recipe-card.component.html',
  styleUrls: ['./recipe-card.component.scss']
})
export class RecipeCardComponent implements OnInit {
  @ViewChild('modalModify', {static: false}) modalModify: ElementRef;
  @ViewChild('modalDelete', {static: false}) modalDelete: ElementRef;
  @Input() pag: string;
  @Output() messaggio = new EventEmitter();

  percorsoDifficolta = "../../../../assets/images/difficolta-";
  cliccato = false;
  ricette: Recipe[] = [];
  page = 1;
  ricettePerPagina = 4;

  visibilita = true;

  ricetta: Recipe;

  //rowsPerPageOptions: number;
  //pagingNumber = 0;
  //first: number = 0;

  ricette$: Observable<Recipe[]>;
  totRicette: Recipe[] = [];
  totale: number;

  Editor: any = ClassicEditor;
  editorconfig = {
    toolbar: {
      items: [
          'bold',
          'italic',
          'link',
          'bulletedList',
          'numberedList',
          '|',
          'indent',
          'outdent',
          '|',
          'codeBlock',
          'insertTable',
          'undo',
          'redo',
      ]
  },
  image: {
      toolbar: [
          'imageStyle:full',
          'imageStyle:side',
          '|',
          'imageTextAlternative'
      ]
  },
  table: {
      contentToolbar: [
          'tableColumn',
          'tableRow',
          'mergeTableCells'
      ]
  },
  height: 300,
  }

  constructor(private recipeService: RecipeService, private modal: NgbModal, private messageService: MessageService, public auth: AuthService) {

  // this.form.setValue({'title': this.ricetta.title, 'description': ricetta.description, 'image': ricetta.image, 'difficulty': this.ricetta.difficulty }); }
  }

  form = new FormGroup({
    title: new FormControl(''),
    description: new FormControl(''),
    image: new FormControl(''),
    difficulty: new FormControl('')
  })

  ngOnInit(): void {
    // if(this.pag == 'home') {
    //   this.ricette$ = this.recipeService.getRecipes().pipe(
    //      map(res => res.filter(ricetteFiltrate => ricetteFiltrate.difficulty < 6 )),
    //      map(res => res.slice(0,4 )),
    //      map(res => this.totRicette = res)
    //   )
    // } else {
    //   this.ricette$ = this.recipeService.getRecipes().pipe(
    //     map(res => res.filter(ricetteFiltrate => ricetteFiltrate.difficulty < 6 )),
    //     map(res => this.totRicette = res )
    //   )
    // }
    console.log(this.visibilita);

    this.recipeService.getRecipes().subscribe({
      next: (res) => {
        this.ricette = res;
        if(this.pag == 'home'){
          this.ricette = this.ricette.sort((a,b) => b._id - a._id).reverse().slice(0,4);
          this.totRicette = this.ricette;
        } else {
          this.ricette = this.ricette.sort((a,b) => b._id - a._id).reverse();
          this.totRicette = this.ricette;
        }

      },
      error: (e) => {
        console.error(e)
      }
    })

    //this.pagine();
  }

  inviaTitolo(titolo: string){
    if(!this.cliccato){
      this.messaggio.emit(titolo);
      this.cliccato = true;
    } else {
      this.messaggio.emit('');
      this.cliccato = false;
    }
    // oppure con ternario
   // this.cliccato ? (this.messaggio.emit(''), this.cliccato = false) : (this.messaggio.emit(titolo), this.cliccato = true);
  }

    // pagine(){
    //   let tot;
    //   if(this.ricette){
    //     tot = this.ricette.length
    //   }

    //   this.page = 1;
    //   this.pagingNumber = 0;
    //   this.pagingNumber = Math.ceil(this.ricette.length / this.ricettePerPagina / 4);
    // }

    paginate(event) {
       event.page =event.page + 1;
      this.page = event.page;
  }

  cambiaVisibilita() {
    if(this.visibilita === true) {
      this.visibilita = false;
    } else {
      this.visibilita = true;
    }
    console.log(this.visibilita);
  }

  open(content: any, id: number) {
    this.modal.open(content, {ariaLabelledBy: 'modale modifica ricetta', size: 'lg', centered: true}).result.then((res) => {
    this.form.reset();
    this.messageService.add({severity: 'success', summary: 'Successo', detail: 'Ricetta modificata con successo', life: 2500});
    })
    .catch((res) => {
      console.log('annullamento modifica');
      this.form.reset();
    });
  }

  open2(content: any, id: number) {
    this.modal.open(content, {ariaLabelledBy: 'modale cancellazione ricetta', size: 'lg', centered: true}).result.then((res) => {
      this.recipeService.deleteRecipe(id.toString()).subscribe();
      this.recipeService.getRecipes().subscribe({
        next: (res) => {
          this.ricette = res;
          if(this.pag == 'home'){
            this.ricette = this.ricette.sort((a,b) => b._id - a._id).reverse().slice(0,4);
            this.totRicette = this.ricette;
          } else {
            this.ricette = this.ricette.sort((a,b) => b._id - a._id).reverse();
            this.totRicette = this.ricette;
          }
          this.messageService.add({severity: 'success', summary: 'Successo', detail: 'Ricetta eliminata con successo', life: 2500});
        },
        error: (e) => {
          console.error(e)
        }
      });
    })
    .catch((res) => {
      console.log('annullamento cancellazione ricetta');
    })
  }

  modificaRicetta(id: number) {
    this.recipeService.getRecipe(id.toString()).subscribe( (res) => { this.ricetta = res;});
    this.form.setValue({'title': this.ricetta.title, 'description': this.ricetta.description, 'image': this.ricetta.image, 'difficulty': this.ricetta.difficulty.toString()});
    const nuovaRicetta: Recipe = {
      _id: id,
      title: this.form.value.title,
      description: this.form.value.description,
      image: this.form.value.image,
      difficulty: Number(this.form.value.difficulty),
      published: true
    }
    this.recipeService.updateRecipe(id.toString(), nuovaRicetta).subscribe({
      next: (res) => {
        this.ricette.push(res);
        this.recipeService.getRecipes().subscribe({
          next: (res) => {
            this.ricette = res;
            if(this.pag == 'home'){
              this.ricette = this.ricette.sort((a,b) => b._id - a._id).reverse().slice(0,4);
              this.totRicette = this.ricette;
            } else {
              this.ricette = this.ricette.sort((a,b) => b._id - a._id).reverse();
              this.totRicette = this.ricette;
            }
          },
          error: (e) => {
            console.error(e)
          }
        });
      },
      error: (e) => {
        return e;
      }
    })
  }

}
