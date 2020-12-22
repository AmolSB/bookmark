import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ListService } from './list.service';
import {map, tap} from 'rxjs/operators'
import { Observable } from 'rxjs';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

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
  isPublicCollection = false;

  constructor(private _listService: ListService, private _route: ActivatedRoute, private _router: Router) { }

  ngOnInit(): void {

    this._route.queryParams.subscribe(queryParams => {
      this.queryParams = queryParams;
    })

    this._listService.getCollections().pipe(
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
          this.getLinksByCollectionID(`collection_id=${collections[0].id}`)
        }
      }),
      tap(collections => {
        if(this.queryParams.collection_id) {
          this.currentCollection = collections.filter(c => c.id === this.queryParams.collection_id)[0]
        } else {
          this.currentCollection = collections[0];
        }
      })
    ).subscribe(collections => {
      this.collections = collections;
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

  saveNewLink(linkURL, linkDescription) {
    console.log(linkURL);
    console.log(linkDescription)

    const payload = {
      url: linkURL,
      description: linkDescription,
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
    this._listService.addNewCollection(payload).pipe(
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
    this._router.navigate([], {
      relativeTo: this._route,
      queryParams: {
        collection_id: collection.id
      },
      queryParamsHandling: 'merge',
      // preserve the existing query params in the route
      // skipLocationChange: true
      // do not trigger navigation
    });

    this.getLinksByCollectionID(`collection_id=${collection.id}`);
  }

}
