// angular
import { Component, ChangeDetectionStrategy } from '@angular/core';

// libs
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

// app
import { RouterExtensions } from 'shared/core/services/index';
import { IAppState, getNames } from 'shared/ngrx/index';
import * as nameList from 'shared/sample/index';

declare var NSIndexPath;
declare var UITableViewScrollPosition;

@Component({
  selector: 'sd-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  public names$: Observable<any>;
  public newName: string = '';

  constructor(private store: Store<IAppState>, public routerext: RouterExtensions) {
    this.names$ = store.let(getNames);
  }

  /*
   * @param newname  any text as input.
   * @returns return false to prevent default form submit behavior to refresh the page.
   */
  public addName(): boolean {
    this.store.dispatch(new nameList.AddAction(this.newName));
    this.newName = '';
    return false;
  }

  public readAbout() {
    // Try this in the {N} app
    // {N} can use these animation options
    this.routerext.navigate(['/about'], {
      transition: {
        duration: 1000,
        name: 'slideTop',
      }
    });
  }
}
