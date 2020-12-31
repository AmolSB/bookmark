import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ListService } from './list.service';
import {catchError, filter, map, tap} from 'rxjs/operators'
import { Observable, of } from 'rxjs';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, AfterViewInit {

  @ViewChild('newCollectionInput') newCollectionInputRef: ElementRef;
  @ViewChild('drawer') drawer;

  // collections$;
  // links$: Observable<any>;
  links = [];
  collections = [];
  currentCollection;
  queryParams: any;
  isActive = false;
  showAddNewCollectionInput = false;
  showPublicCollections = false;
  userInfo;
  currentlyEditingLink;
  editingLink = false;
  linkURL: FormControl = new FormControl('');
  linkDesc: FormControl = new FormControl('');

  constructor(private _listService: ListService,
    private _route: ActivatedRoute,
    private _router: Router,
    public authService: AuthService,
    private _snackBar: MatSnackBar) { }

  ngOnInit(): void {

    this._route.queryParams.subscribe(queryParams => {
      console.log(queryParams);
      let isPublicCollection = queryParams.publicCollections;
      if(isPublicCollection) {
        this.getCollections(true);
      } else {
        this.getCollections();
      }
      this.queryParams = queryParams;
    })
  }

  ngAfterViewInit() {
    if(localStorage.getItem('ID_TOKEN')) {
      this.userInfo = JSON.parse(localStorage.getItem('ID_TOKEN'));
    }
    console.log(this.userInfo)
  }

  getCollections(fetchPublicCollections=false) {
    this.collections = [];
    this.links = [];
    this._listService.getCollections(fetchPublicCollections).pipe(
      map((res: any) => res.data),
      map(collections => {
        collections.map(collection => {
          collection['isActive'] = false;
        })
        return collections;
      }),
      tap(collections => {
        if(this.queryParams.collection_id) {
          this.getLinksByCollectionID(`collection_id=${this.queryParams.collection_id}`)
        } else {
          if(collections.length) {
            this.getLinksByCollectionID(`collection_id=${collections[0].id}`)
          } else {
            this.links = [];
          }
        }
      }),
      tap(collections => {
        if(this.queryParams.collection_id) {
          this.currentCollection = collections.filter(c => c.id === this.queryParams.collection_id)[0]
        } else {
          this.currentCollection = collections[0];
        }
      }),
      catchError(err => {
        console.log('Errr!!!',err);
        this._snackBar.open(err.message, 'Unauthorized', {
          duration: 2000,
        })
        return of(undefined)
      }),
    ).subscribe(collections => {
      this.collections = collections;
      if(fetchPublicCollections) {
        this.showPublicCollections = true;
      } else {
        this.showPublicCollections = false;
      }
    });
  }

  getLinksByCollectionID(queryParams?) {
    this._listService.getLinks(queryParams).pipe(
      map((res: any) => res.data),
      map(links => {
        links.map(link => {
          link['logo'] = `https://www.google.com/s2/favicons?sz=128&domain_url=${link.url}`;
        })
        return links
      })
    ).subscribe(links => {
      this.links = links;
    })
  }

  openLink(link) {
    window.open(link.url, '_blank');

  }

  saveNewLink() {

    const payload = {
      url: this.linkURL.value,
      description: this.linkDesc.value,
    }

    const queryParams = `collection_id=${this.currentCollection.id}`;

    this._listService.saveNewLink(payload, queryParams).pipe(
      map((res: any) => res.data),
    ).subscribe(link => {
      link['logo'] = `https://www.google.com/s2/favicons?sz=128&domain_url=${link.url}`;
      this.links.unshift(link);
      this.drawer.toggle()
    });
  }

  addNewCollection(collectionName) {
    this.showAddNewCollectionInput = false;
    const payload = {
      name: collectionName
    }
    this._listService.addNewCollection(payload, this.showPublicCollections).pipe(
      map((res: any) => res.data)
    ).subscribe(collection => {
      if(!this.collections.length) {
        this.currentCollection = collection;
      }
      this.collections.push(collection)
    })
  }

  showAddCollectionInput() {
    this.showAddNewCollectionInput = true;
    // this.newCollectionInputRef.nativeElement.focus();
  }

  collectionClicked(collection) {
    this.currentCollection = collection
    // this._router.navigate([], {
    //   relativeTo: this._route,
    //   queryParams: {
    //     collection_id: collection.id
    //   },
    //   queryParamsHandling: 'merge',
    //   // preserve the existing query params in the route
    //   // skipLocationChange: true
    //   // do not trigger navigation
    // });

    this.getLinksByCollectionID(`collection_id=${collection.id}`);
  }

  fetchPublicCollections() {
    this.showPublicCollections = true;
    this.collections = [];
    this.links = [];
    this.getCollections(this.showPublicCollections);
  }

  fetchMyCollections() {
    this.showPublicCollections = false;
    this.getCollections(false);
  }

  deleteLink(link) {
    this._listService.deleteLink(link.id).subscribe(res => {
      console.log('deleted!', res)
      this.links = this.links.filter(l => l.id !== link.id);
    })
  }

  editLink(link) {
    this.currentlyEditingLink = link;
    this.editingLink = true;
    this.linkURL.setValue(link.url);
    this.linkDesc.setValue(link.description);
  }

  updateLink() {
    const payload = {
      id: this.currentlyEditingLink.id,
      url: this.linkURL.value,
      description: this.linkDesc.value,
    }

    this._listService.updateLink(payload).subscribe((res: any) => {
      console.log(res);
      this.links.map(link => {
        if(link.id === res.data.id) {
          link.url = res.data.url;
          link.description = res.data.description;
          link.name = res.data.name
        }
      })
      this.linkDesc.setValue('');
      this.linkURL.setValue('');
      this.currentlyEditingLink = undefined;
      this.editingLink = false;
      this.drawer.toggle();
    })
  }

}
